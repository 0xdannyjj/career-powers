'use client'

import { motion } from 'framer-motion'
import { Zap, Download } from 'lucide-react'
import { MBTIAnalysisResult } from '@/lib/openai'

interface SuperpowerCardProps {
  analysisResult: MBTIAnalysisResult
}

const SUPERPOWER_GRADIENTS: Record<string, string> = {
  'ENFP': 'from-orange-400 to-pink-400',
  'INTJ': 'from-indigo-500 to-purple-600', 
  'INFJ': 'from-teal-400 to-blue-500',
  'ENTJ': 'from-red-500 to-orange-500',
  'ISTJ': 'from-blue-600 to-indigo-600',
  'ESFJ': 'from-pink-400 to-rose-400',
  'ISTP': 'from-gray-600 to-gray-700',
  'ESFP': 'from-yellow-400 to-orange-400',
  'INTP': 'from-purple-500 to-indigo-600',
  'ENFJ': 'from-green-500 to-teal-500',
  'ISFJ': 'from-blue-400 to-cyan-400',
  'ESTP': 'from-red-400 to-pink-500',
  'INFP': 'from-purple-400 to-pink-400',
  'ESTJ': 'from-blue-700 to-indigo-700',
  'ISFP': 'from-green-400 to-blue-400',
  'ENTP': 'from-yellow-500 to-red-500'
}

export default function SuperpowerCard({ analysisResult }: SuperpowerCardProps) {
  const gradient = SUPERPOWER_GRADIENTS[analysisResult.mbtiType] || 'from-blue-500 to-purple-500'

  const handleDownload = async () => {
    // This would generate a downloadable image of the card
    // For now, we'll just trigger a download of a placeholder
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) return
      
      // Set canvas size for social media (1080x1080)
      canvas.width = 1080
      canvas.height = 1080
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#3B82F6') // blue-500
      gradient.addColorStop(1, '#8B5CF6') // purple-500
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add text (simplified version)
      ctx.fillStyle = 'white'
      ctx.font = 'bold 72px Inter, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(analysisResult.superpowerTitle, canvas.width / 2, 400)
      
      ctx.font = '36px Inter, system-ui, sans-serif'
      ctx.fillText(analysisResult.mbtiType, canvas.width / 2, 500)
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return
        
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `my-career-superpower-${analysisResult.mbtiType}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 'image/png')
      
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="relative"
    >
      {/* Main Card */}
      <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 bg-white/5 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div className="text-white/80 text-sm font-medium uppercase tracking-wide mb-2">
              Your Career Superpower
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
              {analysisResult.superpowerTitle}
            </h2>
            <div className="text-xl font-semibold text-white/90 mb-4">
              {analysisResult.mbtiType}
            </div>
            <p className="text-lg text-white/90 leading-relaxed">
              {analysisResult.explanation}
            </p>
          </div>

          {/* Confidence Score */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="text-white/90 font-medium">
                {analysisResult.confidence}% AI Confidence
              </span>
            </div>
          </div>

          {/* CareerPowers Branding */}
          <div className="text-center">
            <div className="text-white/60 text-sm">
              Powered by CareerPowers AI
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <motion.button
        onClick={handleDownload}
        className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Download className="w-5 h-5 text-white" />
      </motion.button>

      {/* Floating Elements */}
      <div className="absolute -inset-4 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}