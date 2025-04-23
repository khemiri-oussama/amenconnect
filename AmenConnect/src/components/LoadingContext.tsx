"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

interface LoadingContextType {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()

  const startLoading = () => setIsLoading(true)
  const stopLoading = () => setIsLoading(false)

  // Automatically start loading on route changes
  useEffect(() => {
    startLoading()

    // Simulate loading completion
    const timer = setTimeout(() => {
      stopLoading()
    }, 800)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>{children}</LoadingContext.Provider>
}
