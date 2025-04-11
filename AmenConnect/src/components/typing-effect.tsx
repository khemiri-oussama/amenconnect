"use client"
import type React from "react"
import { useState, useEffect } from "react"

interface TypingEffectProps {
  text: string
  speed?: number
  onComplete?: () => void
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, speed = 30, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [currentIndex, text, speed, isComplete, onComplete])

  // Reset when text changes
  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
    setIsComplete(false)
  }, [text])

  return <>{displayedText}</>
}

export default TypingEffect
