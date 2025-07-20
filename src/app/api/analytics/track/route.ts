import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export interface AnalyticsEventRequest {
  event_type: string
  event_data: Record<string, string | number | boolean | null>
  assessment_id?: string
  timestamp?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyticsEventRequest = await request.json()
    
    // Validate required fields
    if (!body.event_type) {
      return NextResponse.json(
        { error: 'event_type is required' },
        { status: 400 }
      )
    }

    // Get client information
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1'
    const userAgent = request.headers.get('user-agent')

    // Insert analytics event
    const { error: analyticsError } = await supabase
      .from('analytics_events')
      .insert({
        assessment_id: body.assessment_id || null,
        event_type: body.event_type,
        event_data: body.event_data || {},
        ip_address: clientIP,
        user_agent: userAgent,
        created_at: body.timestamp || new Date().toISOString()
      })

    if (analyticsError) {
      console.error('Analytics tracking error:', analyticsError)
      // Don't fail completely for analytics - just log and continue
      return NextResponse.json(
        { success: false, error: 'Failed to track event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process analytics event',
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