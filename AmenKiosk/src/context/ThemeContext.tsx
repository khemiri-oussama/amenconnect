"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type ThemeMode = "light" | "dark"

// Define the theme structure
export interface ThemeColors {
  primary: string
  primaryDark: string
  primaryLight: string
  primaryText: string
  secondary: string
  secondaryDark: string
  secondaryLight: string
  accent: string
  accentDark: string
  accentLight: string
  background: string
  surface: string
  border: string
  textMuted: string
  success: string
  warning: string
  danger: string
}

export interface ThemeFonts {
  family: string
  weights: number[]
}

export interface ThemeRadii {
  sm: string
  md: string
  lg: string
  xl: string
  full: string
}

export interface ThemeSettings {
  colors: ThemeColors
  fonts: ThemeFonts
  radii: ThemeRadii
}

interface ThemeContextType {
  theme: ThemeMode
  toggleTheme: () => void
  isDark: boolean
  isLight: boolean
  themeSettings: ThemeSettings
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void
  saveTheme: (name: string) => boolean
  loadTheme: (name: string) => boolean
  exportThemeCSS: () => string
  availableThemes: string[]
}

// Default theme settings
const defaultThemeSettings: ThemeSettings = {
  colors: {
    primary: "#121660",
    primaryDark: "#0a0d3b",
    primaryLight: "#4749ce",
    primaryText: "#121660",
    secondary: "#47ce65",
    secondaryDark: "#339e47",
    secondaryLight: "#6fe389",
    accent: "#ffcc00",
    accentDark: "#e6b800",
    accentLight: "#ffd633",
    background: "#ffffff",
    surface: "#f8f8f8",
    border: "#e0e0e0",
    textMuted: "rgba(18, 22, 96, 0.7)",
    success: "#2fdf75",
    warning: "#ffd534",
    danger: "#ff4961",
  },
  fonts: {
    family: "Outfit, sans-serif",
    weights: [400, 600, 700],
  },
  radii: {
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    full: "9999px",
  },
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  isDark: false,
  isLight: true,
  themeSettings: defaultThemeSettings,
  updateThemeSettings: () => {},
  saveTheme: () => false,
  loadTheme: () => false,
  exportThemeCSS: () => "",
  availableThemes: ["default"],
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>("light")
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultThemeSettings)
  const [availableThemes, setAvailableThemes] = useState<string[]>(["default"])

  // Initialize theme from localStorage if available
  useEffect(() => {
    const savedTheme = localStorage.getItem("kiosk-theme") as ThemeMode | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
    }

    // Load saved theme settings if available
    try {
      const savedThemeSettings = localStorage.getItem("kiosk-theme-settings")
      if (savedThemeSettings) {
        setThemeSettings(JSON.parse(savedThemeSettings))
      }

      // Load available themes
      const themesStr = localStorage.getItem("kiosk-themes") || "{}"
      const themes = JSON.parse(themesStr)
      if (Object.keys(themes).length > 0) {
        setAvailableThemes(Object.keys(themes))
      }
    } catch (error) {
      console.error("Failed to load theme settings:", error)
    }
  }, [])

  // Apply theme class to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark-theme")
    } else {
      document.documentElement.classList.remove("dark-theme")
    }
    localStorage.setItem("kiosk-theme", theme)
  }, [theme])

  // Apply theme settings to CSS variables
  useEffect(() => {
    applyThemeSettings()
    // Save theme settings to localStorage
    localStorage.setItem("kiosk-theme-settings", JSON.stringify(themeSettings))
  }, [themeSettings])

  const applyThemeSettings = () => {
    const root = document.documentElement

    // Apply colors
    root.style.setProperty("--kiosk-primary", themeSettings.colors.primary)
    root.style.setProperty("--kiosk-primary-dark", themeSettings.colors.primaryDark)
    root.style.setProperty("--kiosk-primary-light", themeSettings.colors.primaryLight)
    root.style.setProperty("--kiosk-primary-text", themeSettings.colors.primaryText)

    root.style.setProperty("--kiosk-secondary", themeSettings.colors.secondary)
    root.style.setProperty("--kiosk-secondary-dark", themeSettings.colors.secondaryDark)
    root.style.setProperty("--kiosk-secondary-light", themeSettings.colors.secondaryLight)

    root.style.setProperty("--kiosk-accent", themeSettings.colors.accent)
    root.style.setProperty("--kiosk-accent-dark", themeSettings.colors.accentDark)
    root.style.setProperty("--kiosk-accent-light", themeSettings.colors.accentLight)

    root.style.setProperty("--kiosk-background", themeSettings.colors.background)
    root.style.setProperty("--kiosk-surface", themeSettings.colors.surface)
    root.style.setProperty("--kiosk-border", themeSettings.colors.border)
    root.style.setProperty("--kiosk-text-muted", themeSettings.colors.textMuted)

    root.style.setProperty("--kiosk-success", themeSettings.colors.success)
    root.style.setProperty("--kiosk-warning", themeSettings.colors.warning)
    root.style.setProperty("--kiosk-danger", themeSettings.colors.danger)

    // Apply font settings
    root.style.setProperty("--kiosk-font-family", themeSettings.fonts.family)

    // Apply border radius
    root.style.setProperty("--kiosk-radius-sm", themeSettings.radii.sm)
    root.style.setProperty("--kiosk-radius-md", themeSettings.radii.md)
    root.style.setProperty("--kiosk-radius-lg", themeSettings.radii.lg)
    root.style.setProperty("--kiosk-radius-xl", themeSettings.radii.xl)
    root.style.setProperty("--kiosk-radius-full", themeSettings.radii.full)

    // Update Ionic variables
    root.style.setProperty("--ion-color-primary", themeSettings.colors.secondary)
    root.style.setProperty("--ion-color-primary-shade", themeSettings.colors.secondaryDark)
    root.style.setProperty("--ion-color-primary-tint", themeSettings.colors.secondaryLight)

    root.style.setProperty("--ion-color-secondary", themeSettings.colors.accent)
    root.style.setProperty("--ion-color-secondary-shade", themeSettings.colors.accentDark)
    root.style.setProperty("--ion-color-secondary-tint", themeSettings.colors.accentLight)

    root.style.setProperty("--ion-color-success", themeSettings.colors.success)
    root.style.setProperty("--ion-color-warning", themeSettings.colors.warning)
    root.style.setProperty("--ion-color-danger", themeSettings.colors.danger)
  }

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  const updateThemeSettings = (settings: Partial<ThemeSettings>) => {
    setThemeSettings((prevSettings) => ({
      ...prevSettings,
      ...settings,
      colors: {
        ...prevSettings.colors,
        ...(settings.colors || {}),
      },
      fonts: {
        ...prevSettings.fonts,
        ...(settings.fonts || {}),
      },
      radii: {
        ...prevSettings.radii,
        ...(settings.radii || {}),
      },
    }))
  }

  const saveTheme = (name: string): boolean => {
    try {
      const themesStr = localStorage.getItem("kiosk-themes") || "{}"
      const themes = JSON.parse(themesStr)

      // Save current theme settings with the given name
      themes[name] = {
        ...themeSettings,
        name,
      }

      localStorage.setItem("kiosk-themes", JSON.stringify(themes))
      localStorage.setItem("kiosk-current-theme", name)

      // Update available themes
      setAvailableThemes(Object.keys(themes))

      return true
    } catch (error) {
      console.error("Failed to save theme:", error)
      return false
    }
  }

  const loadTheme = (name: string): boolean => {
    try {
      const themesStr = localStorage.getItem("kiosk-themes") || "{}"
      const themes = JSON.parse(themesStr)

      if (themes[name]) {
        setThemeSettings(themes[name])
        localStorage.setItem("kiosk-current-theme", name)
        return true
      }
      return false
    } catch (error) {
      console.error("Failed to load theme:", error)
      return false
    }
  }

  const exportThemeCSS = (): string => {
    return `/* Kiosk Theme: ${localStorage.getItem("kiosk-current-theme") || "Custom"} */
:root {
  /* Primary colors */
  --kiosk-primary: ${themeSettings.colors.primary};
  --kiosk-primary-dark: ${themeSettings.colors.primaryDark};
  --kiosk-primary-light: ${themeSettings.colors.primaryLight};
  --kiosk-primary-text: ${themeSettings.colors.primaryText};

  /* Secondary colors */
  --kiosk-secondary: ${themeSettings.colors.secondary};
  --kiosk-secondary-dark: ${themeSettings.colors.secondaryDark};
  --kiosk-secondary-light: ${themeSettings.colors.secondaryLight};

  /* Accent colors */
  --kiosk-accent: ${themeSettings.colors.accent};
  --kiosk-accent-dark: ${themeSettings.colors.accentDark};
  --kiosk-accent-light: ${themeSettings.colors.accentLight};

  /* Neutral colors */
  --kiosk-background: ${themeSettings.colors.background};
  --kiosk-surface: ${themeSettings.colors.surface};
  --kiosk-border: ${themeSettings.colors.border};
  --kiosk-text-muted: ${themeSettings.colors.textMuted};

  /* Status colors */
  --kiosk-success: ${themeSettings.colors.success};
  --kiosk-warning: ${themeSettings.colors.warning};
  --kiosk-danger: ${themeSettings.colors.danger};

  /* Border radius */
  --kiosk-radius-sm: ${themeSettings.radii.sm};
  --kiosk-radius-md: ${themeSettings.radii.md};
  --kiosk-radius-lg: ${themeSettings.radii.lg};
  --kiosk-radius-xl: ${themeSettings.radii.xl};
  --kiosk-radius-full: ${themeSettings.radii.full};

  /* Font settings */
  --kiosk-font-family: ${themeSettings.fonts.family};

  /* Ionic color overrides */
  --ion-color-primary: var(--kiosk-secondary);
  --ion-color-primary-shade: var(--kiosk-secondary-dark);
  --ion-color-primary-tint: var(--kiosk-secondary-light);

  --ion-color-secondary: var(--kiosk-accent);
  --ion-color-secondary-shade: var(--kiosk-accent-dark);
  --ion-color-secondary-tint: var(--kiosk-accent-light);

  --ion-color-success: var(--kiosk-success);
  --ion-color-warning: var(--kiosk-warning);
  --ion-color-danger: var(--kiosk-danger);
}

/* Dark mode variables */
.dark-theme {
  --kiosk-primary: ${adjustColor(themeSettings.colors.primary, 10)};
  --kiosk-primary-dark: ${adjustColor(themeSettings.colors.primaryDark, 10)};
  --kiosk-primary-light: ${adjustColor(themeSettings.colors.primaryLight, 10)};
  
  --kiosk-secondary: ${adjustColor(themeSettings.colors.secondary, -10)};
  --kiosk-secondary-dark: ${adjustColor(themeSettings.colors.secondaryDark, -10)};
  --kiosk-secondary-light: ${adjustColor(themeSettings.colors.secondaryLight, -10)};
  
  --kiosk-accent: ${adjustColor(themeSettings.colors.accent, 10)};
  --kiosk-accent-dark: ${adjustColor(themeSettings.colors.accentDark, 10)};
  --kiosk-accent-light: ${adjustColor(themeSettings.colors.accentLight, 10)};
  
  --kiosk-background: #121212;
  --kiosk-surface: #1e1e1e;
  --kiosk-border: #333333;
  --kiosk-text-muted: rgba(255, 255, 255, 0.7);
  --kiosk-primary-text: #ffffff;

  --ion-background-color: var(--kiosk-background);
  --ion-text-color: var(--kiosk-primary-text);
}
`
  }

  // Helper function to adjust color brightness
  function adjustColor(color: string, percent: number): string {
    // Convert hex to RGB
    const r = Number.parseInt(color.slice(1, 3), 16)
    const g = Number.parseInt(color.slice(3, 5), 16)
    const b = Number.parseInt(color.slice(5, 7), 16)

    // Adjust brightness
    const adjustValue = (value: number) => {
      const adjusted = value + value * (percent / 100)
      return Math.min(255, Math.max(0, Math.round(adjusted)))
    }

    // Convert back to hex
    return `#${adjustValue(r).toString(16).padStart(2, "0")}${adjustValue(g).toString(16).padStart(2, "0")}${adjustValue(b).toString(16).padStart(2, "0")}`
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
    themeSettings,
    updateThemeSettings,
    saveTheme,
    loadTheme,
    exportThemeCSS,
    availableThemes,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

