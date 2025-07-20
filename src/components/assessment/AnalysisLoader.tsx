'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles, Zap } from 'lucide-react'

export default function AnalysisLoader() {
  const steps = [
    "Analyzing your responses...",
    "Identifying personality patterns...",
    "Generating your superpower...",
    "Crafting personalized insights..."
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Brain Icon */}
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-8 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Brain className="w-12 h-12 text-white" />
        </motion.div>

        {/* Main Title */}
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          AI is analyzing your responses
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Our advanced AI is crafting personalized insights just for you
        </motion.p>

        {/* Animated Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              className="flex items-center gap-3 text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.3 }}
            >
              <motion.div
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              >
                {index === 0 && <Brain className="w-4 h-4 text-white" />}
                {index === 1 && <Sparkles className="w-4 h-4 text-white" />}
                {index === 2 && <Zap className="w-4 h-4 text-white" />}
                {index === 3 && <Sparkles className="w-4 h-4 text-white" />}
              </motion.div>
              
              <span className="text-gray-700 font-medium">
                {step}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Time Estimate */}
        <motion.div
          className="mt-8 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          This usually takes 5-10 seconds
        </motion.div>
      </div>
    </div>
  )
}