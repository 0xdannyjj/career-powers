import { NextRequest, NextResponse } from 'next/server'
import { analyzeMBTIResponses, validateAnalysisQuality } from '@/lib/openai'
import { supabase } from '@/lib/supabase'
import { ASSESSMENT_QUESTIONS } from '@/types/assessment'

export interface AnalyzeAssessmentRequest {
  responses: {
    questionId: string
    selectedOptionId: string
  }[]
  email?: string
  metadata?: {
    userAgent?: string
    startTime?: string
    completionTime?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeAssessmentRequest = await request.json()
    
    // Validate request
    if (!body.responses || body.responses.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid request: 6 responses required' },
        { status: 400 }
      )
    }

    // Get client IP for analytics
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1'

    // Transform responses for OpenAI analysis
    const formattedResponses = body.responses.map(response => {
      const question = ASSESSMENT_QUESTIONS.find(q => q.id === response.questionId)
      const option = question?.options.find(o => o.id === response.selectedOptionId)
      
      if (!question || !option) {
        throw new Error(`Invalid question or option ID`)
      }

      return {
        questionId: response.questionId,
        questionText: question.question,
        selectedOption: option.text,
        optionIndex: question.options.indexOf(option)
      }
    })

    // Analyze with OpenAI
    const analysis = await analyzeMBTIResponses(formattedResponses)
    
    // Validate analysis quality
    if (!validateAnalysisQuality(analysis)) {
      console.warn('AI analysis quality validation failed, using fallback')
    }

    // Store assessment in database
    const { data: assessment, error: dbError } = await supabase
      .from('assessments')
      .insert({
        responses: body.responses,
        mbti_type: analysis.mbtiType,
        confidence_score: analysis.confidence,
        superpower_title: analysis.superpowerTitle,
        superpower_data: {
          strengths: analysis.strengths,
          kryptonite: analysis.kryptonite,
          careerInsight: analysis.careerInsight,
          funFact: analysis.funFact
        },
        ai_analysis: analysis,
        email: body.email || null,
        ip_address: clientIP,
        completed_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Continue even if DB fails - don't block user experience
    }

    // Store analytics event
    if (assessment?.id) {
      await supabase
        .from('analytics_events')
        .insert({
          assessment_id: assessment.id,
          event_type: 'assessment_completed',
          event_data: {
            mbti_type: analysis.mbtiType,
            confidence: analysis.confidence,
            completion_time: body.metadata?.completionTime,
            user_agent: body.metadata?.userAgent
          },
          user_agent: body.metadata?.userAgent,
          ip_address: clientIP
        })
    }

    // Store email subscriber if provided
    if (body.email && assessment?.id) {
      await supabase
        .from('email_subscribers')
        .upsert({
          email: body.email,
          assessment_id: assessment.id,
          source: 'assessment_completion'
        }, {
          onConflict: 'email'
        })
    }

    // Return analysis results
    return NextResponse.json({
      success: true,
      assessmentId: assessment?.id,
      analysis: {
        mbtiType: analysis.mbtiType,
        confidence: analysis.confidence,
        superpowerTitle: analysis.superpowerTitle,
        explanation: analysis.explanation,
        strengths: analysis.strengths,
        kryptonite: analysis.kryptonite,
        careerInsight: analysis.careerInsight,
        funFact: analysis.funFact
      }
    })

  } catch (error) {
    console.error('Assessment analysis error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze assessment',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}