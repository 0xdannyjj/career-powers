import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const hasApiKey = !!process.env.OPENAI_API_KEY
    const apiKeyPrefix = process.env.OPENAI_API_KEY?.substring(0, 10) + '...'
    
    console.log('🔍 Debug - OpenAI API Key check:', { hasApiKey, apiKeyPrefix })

    if (!hasApiKey) {
      return NextResponse.json({
        success: false,
        error: 'OpenAI API key is not configured',
        details: {
          hasApiKey: false,
          environment: process.env.NODE_ENV
        }
      }, { status: 500 })
    }

    // Test a simple OpenAI API call
    console.log('🧪 Testing OpenAI API connection...')
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond with a simple JSON object containing only: {"status": "working", "message": "API connection successful"}'
        }
      ],
      max_tokens: 50,
      temperature: 0.1,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0]?.message?.content
    
    console.log('✅ OpenAI API test successful:', response)

    return NextResponse.json({
      success: true,
      message: 'OpenAI API is working correctly',
      details: {
        hasApiKey: true,
        apiKeyPrefix,
        model: 'gpt-4o-mini',
        response: response ? JSON.parse(response) : null,
        usage: completion.usage,
        environment: process.env.NODE_ENV
      }
    })

  } catch (error) {
    console.error('❌ OpenAI Debug Error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'OpenAI API test failed',
      details: {
        hasApiKey: !!process.env.OPENAI_API_KEY,
        apiKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 10) + '...',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        environment: process.env.NODE_ENV
      }
    }, { status: 500 })
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}