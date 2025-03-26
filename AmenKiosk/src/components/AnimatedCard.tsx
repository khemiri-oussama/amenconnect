import React, { useEffect, useState } from "react"

interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [delay])
  
  return (
    <div className={`kiosk-animated-card ${isVisible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  )
}

export default AnimatedCard
