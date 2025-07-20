import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ASSESSMENT_QUESTIONS, AssessmentQuestion, UserResponse } from '@/types/assessment'

export interface AssessmentState {
  // Current state
  currentQuestionIndex: number
  responses: UserResponse[]
  isComplete: boolean
  isAnalyzing: boolean
  
  // Results
  analysisResult: AnalysisResult | null
  assessmentId: string | null
  
  // User data
  email: string | null
  startTime: Date | null
  
  // Actions
  startAssessment: () => void
  answerQuestion: (questionId: string, selectedOptionId: string) => void
  nextQuestion: () => void
  previousQuestion: () => void
  submitForAnalysis: (email?: string) => Promise<void>
  resetAssessment: () => void
  setEmail: (email: string) => void
  
  // Getters
  getCurrentQuestion: () => AssessmentQuestion | null
  getProgress: () => number
  canGoNext: () => boolean
  canGoPrevious: () => boolean
}

export interface AnalysisResult {
  mbtiType: string
  confidence: number
  superpowerTitle: string
  explanation: string
  strengths: string[]
  kryptonite: string
  careerInsight: string
  funFact: string
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentQuestionIndex: 0,
      responses: [],
      isComplete: false,
      isAnalyzing: false,
      analysisResult: null,
      assessmentId: null,
      email: null,
      startTime: null,

      // Actions
      startAssessment: () => {
        set({
          currentQuestionIndex: 0,
          responses: [],
          isComplete: false,
          isAnalyzing: false,
          analysisResult: null,
          assessmentId: null,
          startTime: new Date()
        })
      },

      answerQuestion: (questionId: string, selectedOptionId: string) => {
        const { responses } = get()
        
        // Remove any existing response for this question
        const filteredResponses = responses.filter(r => r.questionId !== questionId)
        
        // Add new response
        const newResponse: UserResponse = {
          questionId,
          selectedOptionId,
          timestamp: new Date()
        }
        
        set({
          responses: [...filteredResponses, newResponse]
        })
      },

      nextQuestion: () => {
        const { currentQuestionIndex } = get()
        const nextIndex = Math.min(currentQuestionIndex + 1, ASSESSMENT_QUESTIONS.length - 1)
        
        set({ currentQuestionIndex: nextIndex })
      },

      previousQuestion: () => {
        const { currentQuestionIndex } = get()
        const prevIndex = Math.max(currentQuestionIndex - 1, 0)
        
        set({ currentQuestionIndex: prevIndex })
      },

      submitForAnalysis: async (email?: string) => {
        const { responses, startTime } = get()
        
        if (responses.length !== 6) {
          throw new Error('All questions must be answered before submission')
        }

        set({ isAnalyzing: true })

        try {
          const response = await fetch('/api/assessment/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              responses: responses.map(r => ({
                questionId: r.questionId,
                selectedOptionId: r.selectedOptionId
              })),
              email,
              metadata: {
                userAgent: navigator.userAgent,
                startTime: startTime?.toISOString(),
                completionTime: new Date().toISOString()
              }
            })
          })

          if (!response.ok) {
            throw new Error('Failed to analyze assessment')
          }

          const result = await response.json()
          
          set({
            analysisResult: result.analysis,
            assessmentId: result.assessmentId,
            isComplete: true,
            isAnalyzing: false,
            email: email || null
          })

        } catch (error) {
          console.error('Analysis submission error:', error)
          set({ isAnalyzing: false })
          throw error
        }
      },

      resetAssessment: () => {
        set({
          currentQuestionIndex: 0,
          responses: [],
          isComplete: false,
          isAnalyzing: false,
          analysisResult: null,
          assessmentId: null,
          email: null,
          startTime: null
        })
      },

      setEmail: (email: string) => {
        set({ email })
      },

      // Getters
      getCurrentQuestion: () => {
        const { currentQuestionIndex } = get()
        return ASSESSMENT_QUESTIONS[currentQuestionIndex] || null
      },

      getProgress: () => {
        const { responses } = get()
        return (responses.length / ASSESSMENT_QUESTIONS.length) * 100
      },

      canGoNext: () => {
        const { currentQuestionIndex, responses } = get()
        const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex]
        const hasAnswered = responses.some(r => r.questionId === currentQuestion?.id)
        
        return hasAnswered && currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1
      },

      canGoPrevious: () => {
        const { currentQuestionIndex } = get()
        return currentQuestionIndex > 0
      }
    }),
    {
      name: 'assessment-state',
      partialize: (state) => ({
        // Only persist essential data, not temporary UI state
        responses: state.responses,
        currentQuestionIndex: state.currentQuestionIndex,
        isComplete: state.isComplete,
        analysisResult: state.analysisResult,
        assessmentId: state.assessmentId,
        email: state.email,
        startTime: state.startTime
      })
    }
  )
)

// Utility hooks for common patterns
export const useCurrentQuestion = () => useAssessmentStore(state => state.getCurrentQuestion())
export const useProgress = () => useAssessmentStore(state => state.getProgress())
export const useCanNavigate = () => useAssessmentStore(state => ({
  canGoNext: state.canGoNext(),
  canGoPrevious: state.canGoPrevious()
}))

// Analytics helpers
export const trackAssessmentEvent = async (eventType: string, data: Record<string, string | number | boolean | null>) => {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        event_data: data,
        timestamp: new Date().toISOString()
      })
    })
  } catch (error) {
    console.warn('Analytics tracking failed:', error)
  }
}