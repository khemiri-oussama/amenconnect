import React, { createContext, useContext, useEffect, useState } from "react"

type Orientation = "landscape" | "portrait"

interface OrientationContextType {
  orientation: Orientation
  isLandscape: boolean
  isPortrait: boolean
}

const OrientationContext = createContext<OrientationContextType>({
  orientation: "landscape",
  isLandscape: true,
  isPortrait: false,
})

export const useOrientation = () => useContext(OrientationContext)

export const OrientationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orientation, setOrientation] = useState<Orientation>(
    window.innerWidth > window.innerHeight ? "landscape" : "portrait"
  )

  useEffect(() => {
    const updateOrientation = () => {
      const newOrientation: Orientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait"
      setOrientation(newOrientation)
    }

    // Initial check
    updateOrientation()

    // Set up event listener
    window.addEventListener("resize", updateOrientation)

    // Clean up
    return () => {
      window.removeEventListener("resize", updateOrientation)
    }
  }, [])

  const value = {
    orientation,
    isLandscape: orientation === "landscape",
    isPortrait: orientation === "portrait",
  }

  return <OrientationContext.Provider value={value}>{children}</OrientationContext.Provider>
}
