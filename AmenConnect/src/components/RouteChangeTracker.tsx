"use client"

import type React from "react"

import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// This is a more advanced version that can be used to track route changes
// and trigger the progress bar programmatically
interface RouteChangeTrackerProps {
  onRouteChangeStart: () => void
  onRouteChangeComplete: () => void
}

const RouteChangeTracker: React.FC<RouteChangeTrackerProps> = ({ onRouteChangeStart, onRouteChangeComplete }) => {
  const location = useLocation()

  useEffect(() => {
    // This will be called when the route changes
    onRouteChangeStart()

    // Simulate a delay to show the progress bar
    // In a real app, this would be handled by the actual component loading time
    const timer = setTimeout(() => {
      onRouteChangeComplete()
    }, 500) // Adjust this time as needed

    return () => clearTimeout(timer)
  }, [location.pathname, onRouteChangeStart, onRouteChangeComplete])

  return null
}

export default RouteChangeTracker
