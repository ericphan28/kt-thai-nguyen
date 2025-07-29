"use client"

import { useEffect, useState } from "react"

interface CountdownProgressProps {
  isActive: boolean
  duration: number
  onComplete: () => void
  label: string
}

export function CountdownProgress({ isActive, duration, onComplete, label }: CountdownProgressProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration)
      setProgress(100)
      return
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          onComplete()
          return 0
        }
        return prev - 100
      })
      
      setProgress(() => {
        const newProgress = Math.max(0, (timeLeft - 100) / duration * 100)
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isActive, duration, onComplete, timeLeft])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{label}</h3>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-600">
          Chuyển hướng sau {Math.ceil(timeLeft / 1000)} giây...
        </p>
      </div>
    </div>
  )
}
