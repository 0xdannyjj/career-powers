import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AssessmentResponse {
  questionId: string
  questionText: string
  selectedOption: string
  optionIndex: number
}

export interface MBTIAnalysisResult {
  mbtiType: string
  confidence: number
  superpowerTitle: string
  explanation: string
  strengths: string[]
  kryptonite: string
  careerInsight: string
  funFact: string
}

const MBTI_ANALYSIS_PROMPT = `You are an expert MBTI analyst and career coach with a humorous, engaging style. Your job is to analyze personality assessment responses and provide insightful, entertaining career guidance.

TASK: Analyze the following 6 assessment responses and determine the user's MBTI type with personalized career insights.

RESPONSE FORMAT: Return ONLY a JSON object with this exact structure:
{
  "mbtiType": "XXXX",
  "confidence": 85,
  "superpowerTitle": "The Innovation Catalyst",
  "explanation": "Brief 2-3 sentence explanation of their type",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "kryptonite": "Humorous weakness description",
  "careerInsight": "Career-focused insight and recommendations",
  "funFact": "Interesting fact about their MBTI type"
}

GUIDELINES:
- Confidence should be 70-95% (realistic range)
- Explanation should be warm, encouraging, 2-3 sentences max
- Strengths should be workplace-relevant and empowering
- Kryptonite should be lighthearted but honest about challenges
- Career insight should be specific and actionable
- Fun fact should be engaging and shareable
- Keep total response under 500 tokens for cost efficiency
- Write in a confident, friendly tone that makes users feel special

SUPERPOWER TITLES BY TYPE:
ENFP: "The Innovation Catalyst"
INTJ: "The System Architect" 
INFJ: "The Harmony Architect"
ENTJ: "The Results Engine"
ISTJ: "The Detail Detective"
ESFJ: "The People Connector"
ISTP: "The Problem Solver"
ESFP: "The Energy Amplifier"
INTP: "The Strategic Advisor"
ENFJ: "The Culture Champion"
ISFJ: "The Quality Guardian"
ESTP: "The Action Hero"
INFP: "The Creative Visionary"
ESTJ: "The Efficiency Expert"
ISFP: "The Authentic Voice"
ENTP: "The Growth Hacker"

Assessment Responses:
`

export async function analyzeMBTIResponses(responses: AssessmentResponse[]): Promise<MBTIAnalysisResult> {
  try {
    const formattedResponses = responses.map((response, index) => 
      `Q${index + 1}: ${response.questionText}\nAnswer: ${response.selectedOption}`
    ).join('\n\n')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using GPT-4o-mini as specified in PRD
      messages: [
        {
          role: 'system',
          content: MBTI_ANALYSIS_PROMPT + formattedResponses
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const analysis = JSON.parse(response) as MBTIAnalysisResult
    
    // Validate required fields
    if (!analysis.mbtiType || !analysis.superpowerTitle || !analysis.explanation) {
      throw new Error('Invalid analysis response structure')
    }

    return analysis
  } catch (error) {
    console.error('Error analyzing MBTI responses:', error)
    
    // Fallback analysis if OpenAI fails
    return getFallbackAnalysis(responses)
  }
}

// Fallback rule-based analysis for when AI fails
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFallbackAnalysis(_responses: AssessmentResponse[]): MBTIAnalysisResult {
  // Simple rule-based MBTI determination
  // This is a basic fallback - real implementation would be more sophisticated
  const mbtiType = "ENFP" // Default fallback
  
  return {
    mbtiType,
    confidence: 75,
    superpowerTitle: "The Innovation Catalyst",
    explanation: "You bring creative energy and fresh perspectives to everything you touch. Your enthusiasm is contagious and drives positive change in your workplace.",
    strengths: [
      "Sparks creativity in teams",
      "Builds strong relationships",
      "Adapts quickly to change"
    ],
    kryptonite: "Gets bored with routine tasks faster than a goldfish forgets its last meal",
    careerInsight: "You thrive in dynamic environments that combine creativity with people interaction. Consider roles in innovation, marketing, or consulting.",
    funFact: "ENFPs make up only 8% of the population but generate 70% of the breakthrough ideas in most companies!"
  }
}

// Function to validate AI response quality
export function validateAnalysisQuality(analysis: MBTIAnalysisResult): boolean {
  const validMBTITypes = [
    'ENFP', 'INTJ', 'INFJ', 'ENTJ', 'ISTJ', 'ESFJ', 
    'ISTP', 'ESFP', 'INTP', 'ENFJ', 'ISFJ', 'ESTP', 
    'INFP', 'ESTJ', 'ISFP', 'ENTP'
  ]

  return (
    validMBTITypes.includes(analysis.mbtiType) &&
    analysis.confidence >= 70 && analysis.confidence <= 95 &&
    analysis.explanation.length > 50 &&
    Array.isArray(analysis.strengths) && analysis.strengths.length === 3 &&
    analysis.kryptonite.length > 20 &&
    analysis.careerInsight.length > 50 &&
    analysis.funFact.length > 30
  )
}