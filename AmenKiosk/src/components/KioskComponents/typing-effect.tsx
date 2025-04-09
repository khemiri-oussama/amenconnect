"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface TypingEffectProps {
  text: string
  speed?: number
  onComplete?: () => void
  className?: string
}

export const TypingEffect: React.FC<TypingEffectProps> = ({ text, speed = 30, onComplete, className = "" }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("")
    setCurrentIndex(0)
    setIsComplete(false)
  }, [text])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        // Add next character
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)

        // Add random variation to typing speed for realism
        const randomVariation = Math.random() * 50 - 25 // -25 to +25ms variation
        speed = Math.max(10, speed + randomVariation)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [currentIndex, text, speed, isComplete, onComplete])

  // Split by newlines and render paragraphs
  const paragraphs = displayedText.split("\n").map((line, i) => (
    <p key={i} className="kiosk-message-paragraph">
      {line || " "}
    </p>
  ))

  return <div className={className}>{paragraphs}</div>
}
