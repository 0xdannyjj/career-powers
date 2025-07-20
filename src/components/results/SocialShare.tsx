'use client'

import { motion } from 'framer-motion'
import { Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { MBTIAnalysisResult } from '@/lib/openai'

interface SocialShareProps {
  result: MBTIAnalysisResult
  isVisible: boolean
}

export default function SocialShare({ result, isVisible }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareText = `I just discovered my career superpower: ${result.superpowerTitle}! ${result.explanation} Find yours at CareerPowers.com`
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const socialPlatforms = [
    {
      name: 'LinkedIn',
      icon: '💼',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'Facebook',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-800 hover:bg-blue-900'
    }
  ]

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    // Track sharing event
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'result_shared',
        event_data: { 
          platform: platform.name.toLowerCase(),
          mbti_type: result.mbtiType,
          superpower: result.superpowerTitle
        }
      })
    }).catch(console.warn)

    // Open share window
    window.open(platform.url, '_blank', 'width=600,height=400')
  }

  if (!isVisible) return null

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Share Your Superpower
              </h3>
            </div>
            <p className="text-gray-600">
              Help others discover their career superpowers too!
            </p>
          </div>

          {/* Social Platform Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {socialPlatforms.map((platform) => (
              <motion.button
                key={platform.name}
                onClick={() => handleShare(platform)}
                className={`flex items-center gap-2 ${platform.color} text-white px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{platform.icon}</span>
                <span>Share on {platform.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Copy Link */}
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <div className="flex-1 bg-gray-50 rounded-xl px-4 py-2 text-sm text-gray-600 truncate">
              {shareUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                copied 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Viral Incentive */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>
              🎁 <strong>Bonus:</strong> Friends who take the assessment through your link 
              help unlock advanced team insights for you!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}