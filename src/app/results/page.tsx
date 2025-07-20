'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Share2, 
  Mail, 
  RefreshCw, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAssessmentStore } from '@/store/assessment'
import SuperpowerCard from '@/components/results/SuperpowerCard'
import EmailCapture from '@/components/results/EmailCapture'
import SocialShare from '@/components/results/SocialShare'

export default function ResultsPage() {
  const router = useRouter()
  const { analysisResult, resetAssessment, email, setEmail } = useAssessmentStore()
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  useEffect(() => {
    // Redirect if no results available
    if (!analysisResult) {
      router.push('/')
      return
    }

    // Show email capture if no email provided
    if (!email) {
      setTimeout(() => setShowEmailCapture(true), 3000) // Show after 3 seconds
    }
  }, [analysisResult, email, router])

  const handleRetakeAssessment = () => {
    resetAssessment()
    router.push('/assessment')
  }

  const handleShare = async () => {
    setIsSharing(true)
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `My Career Superpower: ${analysisResult?.superpowerTitle}`,
          text: analysisResult?.explanation,
          url: window.location.href
        })
      } else {
        // Fallback to copy to clipboard
        await navigator.clipboard.writeText(
          `I just discovered my career superpower: ${analysisResult?.superpowerTitle}! ${analysisResult?.explanation} Find yours at ${window.location.origin}`
        )
        // Show toast or success message
      }
    } catch (error) {
      console.warn('Sharing failed:', error)
    } finally {
      setIsSharing(false)
    }
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="pt-8 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <span className="text-purple-600 font-semibold">Your Results Are Ready!</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Meet Your Career Superpower
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Based on AI analysis of your responses, here&rsquo;s your unique professional superpower
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Results */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            
            {/* Superpower Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SuperpowerCard analysisResult={analysisResult} />
            </motion.div>

            {/* Detailed Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Strengths */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Your Superpowers</h3>
                </div>
                <ul className="space-y-3">
                  {analysisResult.strengths.map((strength, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{strength}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Challenge Area */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Your Kryptonite</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {analysisResult.kryptonite}
                </p>
              </div>

              {/* Career Insight */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Career Insights</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {analysisResult.careerInsight}
                </p>
              </div>

              {/* Fun Fact */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Fun Fact</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {analysisResult.funFact}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Love your results?
              </h3>
              <p className="text-gray-600">
                Share your superpower with others or get your detailed report
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {isSharing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                Share Results
              </button>

              <button
                onClick={() => setShowEmailCapture(true)}
                className="flex items-center gap-2 bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                <Mail className="w-4 h-4" />
                Get Full Report
              </button>

              <button
                onClick={handleRetakeAssessment}
                className="flex items-center gap-2 text-gray-600 border-2 border-gray-300 px-6 py-3 rounded-full font-semibold hover:border-gray-400 hover:text-gray-700 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Retake Assessment
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Social Share Section */}
      <SocialShare 
        result={analysisResult}
        isVisible={!showEmailCapture}
      />

      {/* Email Capture Modal */}
      <EmailCapture
        isOpen={showEmailCapture}
        onClose={() => setShowEmailCapture(false)}
        result={analysisResult}
        onEmailSubmitted={(email) => {
          setEmail(email)
          setShowEmailCapture(false)
        }}
      />
    </div>
  )
}