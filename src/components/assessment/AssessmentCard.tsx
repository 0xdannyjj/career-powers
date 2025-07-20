'use client'

import { motion } from 'framer-motion'
import { AssessmentQuestion } from '@/types/assessment'
import { CheckCircle } from 'lucide-react'

interface AssessmentCardProps {
  question: AssessmentQuestion
  selectedOptionId?: string
  onAnswerSelect: (questionId: string, optionId: string) => void
}

export default function AssessmentCard({ 
  question, 
  selectedOptionId, 
  onAnswerSelect 
}: AssessmentCardProps) {
  return (
    <motion.div 
      className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Scenario Visual */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          {/* Placeholder for illustration - would be replaced with actual images */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-bold">
              {question.id.slice(-1).toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* Scenario Context */}
        <div className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">
          {question.category.charAt(0).toUpperCase() + question.category.slice(1)} Style
        </div>
        
        <div className="text-gray-600 text-base mb-4 italic">
          {question.scenario}
        </div>
      </div>

      {/* Main Question */}
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
          {question.question}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id
          
          return (
            <motion.button
              key={option.id}
              onClick={() => onAnswerSelect(question.id, option.id)}
              className={`
                w-full p-4 rounded-2xl text-left transition-all duration-200 border-2
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start gap-3">
                {/* Option Letter */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5
                  ${isSelected 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-300 text-gray-700'
                  }
                `}>
                  {String.fromCharCode(65 + index)}
                </div>
                
                {/* Option Text */}
                <div className="flex-1">
                  <span className={`
                    text-base leading-relaxed
                    ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}
                  `}>
                    {option.text}
                  </span>
                </div>
                
                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <CheckCircle className="w-6 h-6 text-blue-500" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Bottom Hint */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Choose the option that feels most natural to you
        </p>
      </div>
    </motion.div>
  )
}