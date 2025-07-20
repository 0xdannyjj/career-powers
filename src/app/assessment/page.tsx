'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAssessmentStore } from '@/store/assessment'
import { ASSESSMENT_QUESTIONS } from '@/types/assessment'
import AssessmentCard from '@/components/assessment/AssessmentCard'
import ProgressBar from '@/components/assessment/ProgressBar'
import AnalysisLoader from '@/components/assessment/AnalysisLoader'

export default function AssessmentPage() {
  const router = useRouter()
  const {
    currentQuestionIndex,
    responses,
    isComplete,
    isAnalyzing,
    analysisResult,
    startAssessment,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    submitForAnalysis,
    getCurrentQuestion,
    getProgress,
    canGoNext,
    canGoPrevious
  } = useAssessmentStore()

  const [isStarted, setIsStarted] = useState(false)
  const currentQuestion = getCurrentQuestion()
  const progress = getProgress()
  const canNext = canGoNext()
  const canPrev = canGoPrevious()

  // Check if current question is answered
  const isCurrentQuestionAnswered = currentQuestion ? 
    responses.some(r => r.questionId === currentQuestion.id) : false

  // Check if all questions are answered
  const allQuestionsAnswered = responses.length === ASSESSMENT_QUESTIONS.length

  useEffect(() => {
    if (!isStarted) {
      startAssessment()
      setIsStarted(true)
    }
  }, [startAssessment, isStarted])

  useEffect(() => {
    // If analysis is complete, redirect to results
    if (isComplete && analysisResult) {
      router.push('/results')
    }
  }, [isComplete, analysisResult, router])

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    answerQuestion(questionId, optionId)
    
    // Auto-advance to next question after a brief delay
    setTimeout(() => {
      if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
        nextQuestion()
      }
    }, 500)
  }

  const handleSubmit = async () => {
    if (!allQuestionsAnswered) return
    
    try {
      await submitForAnalysis()
    } catch (error) {
      console.error('Failed to submit assessment:', error)
      // Handle error (show toast, etc.)
    }
  }

  const handleBack = () => {
    if (canPrev) {
      previousQuestion()
    } else {
      router.push('/')
    }
  }

  if (isAnalyzing) {
    return <AnalysisLoader />
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">
                {canPrev ? 'Previous' : 'Back to Home'}
              </span>
            </button>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">
                Question {currentQuestionIndex + 1} of {ASSESSMENT_QUESTIONS.length}
              </div>
              <ProgressBar progress={progress} />
            </div>
            
            <div className="w-20" /> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AssessmentCard
                question={currentQuestion}
                selectedOptionId={responses.find(r => r.questionId === currentQuestion.id)?.selectedOptionId}
                onAnswerSelect={handleAnswerSelect}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex-shrink-0 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={previousQuestion}
              disabled={!canPrev}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Previous</span>
            </button>

            {/* Center Info */}
            <div className="text-center">
              {isCurrentQuestionAnswered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-green-600 text-sm font-medium"
                >
                  <Check className="w-4 h-4" />
                  <span>Answer recorded</span>
                </motion.div>
              )}
            </div>

            {/* Right Button */}
            {allQuestionsAnswered ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                <Brain className="w-4 h-4" />
                <span>Analyze Results</span>
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={!canNext}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed hover:text-gray-900 transition-colors"
              >
                <span className="text-sm font-medium">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}