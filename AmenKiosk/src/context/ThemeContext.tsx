"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the theme structure
export interface KioskTheme {
  primaryBlue: string
  primaryBlueDark: string
  primaryBlueLight: string
  primaryGreen: string
  primaryGreenDark: string
  primaryGreenLight: string
  primaryYellow: string
  primaryYellowDark: string
  primaryYellowLight: string
  backgroundColor: string
  backgroundGradient: string
  logoUrl: string
}

// Default theme values
const defaultTheme: KioskTheme = {
  primaryBlue: "#181e92",
  primaryBlueDark: "#131778",
  primaryBlueLight: "rgba(24, 30, 146, 0.1)",
  primaryGreen: "#47ce65",
  primaryGreenDark: "#3bb954",
  primaryGreenLight: "rgba(71, 206, 101, 0.1)",
  primaryYellow: "#ffcc00",
  primaryYellowDark: "#e6b800",
  primaryYellowLight: "rgba(255, 204, 0, 0.1)",
  backgroundColor: "#0c3b67",
  backgroundGradient: "linear-gradient(135deg, #0c3b67 0%, #025091 100%)",
  logoUrl: "amen_logo.png",
}

// Theme context type
interface ThemeContextType {
  theme: KioskTheme
  updateTheme: (newTheme: Partial<KioskTheme>) => void
  resetTheme: () => void
  applyTheme: () => void
}

// Create the context
const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  updateTheme: () => {},
  resetTheme: () => {},
  applyTheme: () => {},
})

// Storage key for theme in localStorage
const THEME_STORAGE_KEY = "amen_bank_kiosk_theme"

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<KioskTheme>(defaultTheme)

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme)
        setTheme({ ...defaultTheme, ...parsedTheme })
        applyThemeToDOM({ ...defaultTheme, ...parsedTheme })
      } catch (error) {
        console.error("Failed to parse saved theme:", error)
      }
    } else {
      applyThemeToDOM(defaultTheme)
    }
  }, [])

  // Apply theme to DOM by updating CSS variables
  const applyThemeToDOM = (themeToApply: KioskTheme) => {
    const root = document.documentElement

    // Apply colors
    root.style.setProperty("--primary-blue", themeToApply.primaryBlue)
    root.style.setProperty("--primary-blue-dark", themeToApply.primaryBlueDark)
    root.style.setProperty("--primary-blue-light", themeToApply.primaryBlueLight)
    root.style.setProperty("--primary-green", themeToApply.primaryGreen)
    root.style.setProperty("--primary-green-dark", themeToApply.primaryGreenDark)
    root.style.setProperty("--primary-green-light", themeToApply.primaryGreenLight)
    root.style.setProperty("--primary-yellow", themeToApply.primaryYellow)
    root.style.setProperty("--primary-yellow-dark", themeToApply.primaryYellowDark)
    root.style.setProperty("--primary-yellow-light", themeToApply.primaryYellowLight)

    // Apply background
    const kioskBackgrounds = document.querySelectorAll(".kiosk-background")
    kioskBackgrounds.forEach((bg: Element) => {
      if (bg instanceof HTMLElement) {
        bg.style.background = themeToApply.backgroundGradient
      }
    })
  }

  // Update theme with new values
  const updateTheme = (newTheme: Partial<KioskTheme>) => {
    const updatedTheme = { ...theme, ...newTheme }
    setTheme(updatedTheme)
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(updatedTheme))
  }

  // Reset theme to defaults
  const resetTheme = () => {
    setTheme(defaultTheme)
    localStorage.removeItem(THEME_STORAGE_KEY)
    applyThemeToDOM(defaultTheme)
  }

  // Apply current theme
  const applyTheme = () => {
    applyThemeToDOM(theme)
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme, applyTheme }}>{children}</ThemeContext.Provider>
  )
}

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext)

