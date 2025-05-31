"use client"

import type React from "react"
import { Suspense, useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import LoadingProgressBar from "./LoadingProgressBar"

interface PageTransitionProps {
  children: React.ReactNode
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation()
  const [isNavigating, setIsNavigating] = useState(false)
  const [prevLocation, setPrevLocation] = useState(location.pathname)

  useEffect(() => {
    if (location.pathname !== prevLocation) {
      setIsNavigating(true)
      setPrevLocation(location.pathname)
    }
  }, [location, prevLocation])

  const handleLoaded = () => {
    setIsNavigating(false)
  }

  return (
    <>
      {/* Always show the progress bar during navigation */}
      {isNavigating && <LoadingProgressBar />}

      {/* Wrap the children in Suspense */}
      <Suspense fallback={<></>} onLoadComplete={handleLoaded}>
        {children}
      </Suspense>
    </>
  )
}

export default PageTransition
