import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export interface EmailSubscribeRequest {
  email: string
  source?: string
  mbti_type?: string
  superpower?: string
  assessment_id?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailSubscribeRequest = await request.json()
    
    // Validate email
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Get client IP for analytics
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1'

    // Insert or update email subscriber (using public client for now)
    let { data: subscriber, error: subscriberError } = await supabase
      .from('email_subscribers')
      .upsert({
        email: body.email,
        assessment_id: body.assessment_id || null,
        source: body.source || 'direct',
        status: 'active',
        metadata: {
          mbti_type: body.mbti_type,
          superpower: body.superpower,
          ip_address: clientIP,
          subscribed_via: 'api'
        }
      }, {
        onConflict: 'email'
      })
      .select('id')
      .single()

    if (subscriberError) {
      console.error('Database error details:', subscriberError)
      
      // More detailed error handling
      if (subscriberError.code === 'PGRST116') {
        console.error('Row Level Security may be blocking the insert')
      }
      
      // Try a simpler insert without upsert
      const { data: simpleInsert, error: simpleError } = await supabase
        .from('email_subscribers')
        .insert({
          email: body.email,
          source: body.source || 'direct'
        })
        .select('id')
        .single()
      
      if (simpleError) {
        console.error('Simple insert also failed:', simpleError)
        return NextResponse.json(
          { error: 'Failed to save email. Please try again.' },
          { status: 500 }
        )
      }
      
      // Use simple insert result if upsert failed
      subscriber = simpleInsert
    }

    // Track analytics event
    await supabase
      .from('analytics_events')
      .insert({
        assessment_id: body.assessment_id || null,
        event_type: 'email_subscribed',
        event_data: {
          email: body.email,
          source: body.source,
          mbti_type: body.mbti_type,
          superpower: body.superpower
        },
        ip_address: clientIP,
        user_agent: request.headers.get('user-agent')
      })

    // Email sending bypassed - storing email subscription without sending
    console.log(`📧 Email bypassed: Would send welcome email to ${body.email} for ${body.mbti_type} - ${body.superpower}`)
    
    // TODO: When ready to enable emails, uncomment the following:
    // try {
    //   await sendWelcomeEmail(body.email, body.mbti_type, body.superpower)
    // } catch (emailError) {
    //   console.error('Welcome email failed:', emailError)
    // }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to updates',
      subscriber_id: subscriber?.id
    })

  } catch (error) {
    console.error('Email subscription error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process subscription',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Email service integration is currently bypassed
// When ready to enable emails, implement sendWelcomeEmail function here

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