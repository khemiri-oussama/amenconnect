"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonRange,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonToggle,
} from "@ionic/react"
import {
  colorPaletteOutline,
  textOutline,
  gridOutline,
  saveOutline,
  chevronBackOutline,
  eyeOutline,
  downloadOutline,
  refreshOutline,
} from "ionicons/icons"

interface ColorPickerProps {
  color: string
  label: string
  onChange: (value: string) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, label, onChange }) => {
  return (
    <IonItem>
      <IonLabel>{label}</IonLabel>
      <div
        slot="end"
        style={{
          backgroundColor: color,
          width: "36px",
          height: "36px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          marginRight: "10px",
        }}
        onClick={() => {
          document.getElementById(`color-${label.replace(/\s+/g, "-").toLowerCase()}`)?.click()
        }}
      />
      <input
        type="color"
        id={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
        value={color}
        onChange={(e) => onChange(e.target.value)}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </IonItem>
  )
}

const ThemeCustomizerPage: React.FC = () => {
  // Initial theme state based on your variables.css
  const [themeSettings, setThemeSettings] = useState({
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
    shadows: {
      sm: "0 2px 8px rgba(18, 22, 96, 0.1)",
      md: "0 4px 12px rgba(18, 22, 96, 0.15)",
      lg: "0 8px 24px rgba(18, 22, 96, 0.2)",
    },
    fontSizes: {
      xs: "0.875rem",
      sm: "1rem",
      md: "1.25rem",
      lg: "1.5rem",
      xl: "1.75rem",
      "2xl": "2rem",
      "3xl": "2.5rem",
      "4xl": "3rem",
    },
  })

  const [activeSegment, setActiveSegment] = useState("colors")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light")
  const [showPreview, setShowPreview] = useState(false)
  const [themeNameInput, setThemeNameInput] = useState("")
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [availableThemes, setAvailableThemes] = useState<string[]>(["default"])
  const [isDark, setIsDark] = useState(false)

  // Load saved themes on component mount
  useEffect(() => {
    try {
      const themesStr = localStorage.getItem("kiosk-themes") || "{}"
      const themes = JSON.parse(themesStr)
      if (Object.keys(themes).length > 0) {
        setAvailableThemes(Object.keys(themes))
      }

      // Check if there's a current theme
      const currentTheme = localStorage.getItem("kiosk-current-theme")
      if (currentTheme && themes[currentTheme]) {
        setThemeSettings(themes[currentTheme])
        setThemeNameInput(currentTheme)
      }

      // Check dark mode preference
      const darkMode = localStorage.getItem("kiosk-theme") === "dark"
      setIsDark(darkMode)
      setPreviewMode(darkMode ? "dark" : "light")
    } catch (error) {
      console.error("Failed to load themes:", error)
    }
  }, [])

  // Apply theme settings to CSS variables
  const applyThemeSettings = () => {
    const root = document.documentElement

    // Apply colors
    Object.entries(themeSettings.colors).forEach(([key, value]) => {
      root.style.setProperty(`--kiosk-${kebabCase(key)}`, value)
    })

    // Apply font settings
    root.style.setProperty("--kiosk-font-family", themeSettings.fonts.family)

    // Apply border radius
    Object.entries(themeSettings.radii).forEach(([key, value]) => {
      root.style.setProperty(`--kiosk-radius-${key}`, value)
    })

    // Apply shadows
    Object.entries(themeSettings.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--kiosk-shadow-${key}`, value)
    })

    // Apply font sizes
    Object.entries(themeSettings.fontSizes).forEach(([key, value]) => {
      root.style.setProperty(`--kiosk-font-size-${key}`, value)
    })

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

  // Helper function to convert camelCase to kebab-case
  const kebabCase = (str: string) => {
    return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
  }

  // Handle color change
  const handleColorChange = (colorName: string, value: string) => {
    setThemeSettings((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorName]: value,
      },
    }))
  }

  // Handle font change
  const handleFontChange = (fontName: string) => {
    setThemeSettings((prev) => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        family: `${fontName}, sans-serif`,
      },
    }))

    // Dynamically load the font if it's not already loaded
    const link = document.createElement("link")
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(" ", "+")}&display=swap`
    link.rel = "stylesheet"
    document.head.appendChild(link)
  }

  // Handle font weight toggle
  const handleFontWeightToggle = (weight: number, checked: boolean) => {
    const newWeights = checked
      ? [...themeSettings.fonts.weights, weight].sort((a, b) => a - b)
      : themeSettings.fonts.weights.filter((w) => w !== weight)

    setThemeSettings((prev) => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        weights: newWeights,
      },
    }))
  }

  // Handle border radius change
  const handleBorderRadiusChange = (size: keyof typeof themeSettings.radii, value: number) => {
    setThemeSettings((prev) => ({
      ...prev,
      radii: {
        ...prev.radii,
        [size]: `${value}px`,
      },
    }))
  }

  // Handle font size change
  const handleFontSizeChange = (size: keyof typeof themeSettings.fontSizes, value: number) => {
    setThemeSettings((prev) => ({
      ...prev,
      fontSizes: {
        ...prev.fontSizes,
        [size]: `${value}rem`,
      },
    }))
  }

  // Save theme to localStorage
  const handleSaveTheme = () => {
    try {
      if (showNameDialog) {
        if (!themeNameInput.trim()) {
          showToastMessage("Please enter a theme name")
          return
        }
        setShowNameDialog(false)
      }

      const themeName = themeNameInput || "default"
      const themesStr = localStorage.getItem("kiosk-themes") || "{}"
      const themes = JSON.parse(themesStr)

      // Save current theme settings with the given name
      themes[themeName] = themeSettings

      localStorage.setItem("kiosk-themes", JSON.stringify(themes))
      localStorage.setItem("kiosk-current-theme", themeName)

      // Update available themes
      setAvailableThemes(Object.keys(themes))

      showToastMessage(`Theme "${themeName}" saved successfully`)

      // Apply the theme
      applyThemeSettings()
    } catch (error) {
      console.error("Failed to save theme:", error)
      showToastMessage("Failed to save theme")
    }
  }

  // Load theme from localStorage
  const handleThemeSelect = (e: CustomEvent) => {
    const themeName = e.detail.value
    try {
      const themesStr = localStorage.getItem("kiosk-themes") || "{}"
      const themes = JSON.parse(themesStr)

      if (themes[themeName]) {
        setThemeSettings(themes[themeName])
        setThemeNameInput(themeName)
        localStorage.setItem("kiosk-current-theme", themeName)
        showToastMessage(`Loaded theme: ${themeName}`)

        // Apply the theme
        applyThemeSettings()
      } else {
        showToastMessage("Failed to load theme")
      }
    } catch (error) {
      console.error("Failed to load theme:", error)
      showToastMessage("Failed to load theme")
    }
  }

  // Export theme as CSS
  const handleExportTheme = () => {
    try {
      // Generate CSS content
      const cssContent = generateThemeCSS()

      // Create a Blob with the CSS content
      const blob = new Blob([cssContent], { type: "text/css" })

      // Create a download link and trigger it
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${themeNameInput || "theme"}.css`
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      showToastMessage(`Theme exported as ${themeNameInput || "theme"}.css`)
    } catch (error) {
      console.error("Failed to export theme:", error)
      showToastMessage("Failed to export theme")
    }
  }

  // Generate theme CSS
  const generateThemeCSS = () => {
    return `:root {
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

  /* Shadows */
  --kiosk-shadow-sm: ${themeSettings.shadows.sm};
  --kiosk-shadow-md: ${themeSettings.shadows.md};
  --kiosk-shadow-lg: ${themeSettings.shadows.lg};

  /* Animations */
  --kiosk-transition-fast: 0.2s ease;
  --kiosk-transition-normal: 0.3s ease;
  --kiosk-transition-slow: 0.5s ease;

  /* Border radius */
  --kiosk-radius-sm: ${themeSettings.radii.sm};
  --kiosk-radius-md: ${themeSettings.radii.md};
  --kiosk-radius-lg: ${themeSettings.radii.lg};
  --kiosk-radius-xl: ${themeSettings.radii.xl};
  --kiosk-radius-full: ${themeSettings.radii.full};

  /* Viewport dimensions for responsive design */
  --viewport-height: 100vh;
  --viewport-width: 100vw;

  /* Font settings */
  --kiosk-font-family: ${themeSettings.fonts.family};
  --kiosk-font-weight-normal: ${themeSettings.fonts.weights.includes(400) ? 400 : themeSettings.fonts.weights[0]};
  --kiosk-font-weight-semibold: ${themeSettings.fonts.weights.includes(600) ? 600 : themeSettings.fonts.weights[1] || themeSettings.fonts.weights[0]};
  --kiosk-font-weight-bold: ${themeSettings.fonts.weights.includes(700) ? 700 : themeSettings.fonts.weights[themeSettings.fonts.weights.length - 1]};

  /* Font sizes */
  --kiosk-font-size-xs: ${themeSettings.fontSizes.xs};
  --kiosk-font-size-sm: ${themeSettings.fontSizes.sm};
  --kiosk-font-size-md: ${themeSettings.fontSizes.md};
  --kiosk-font-size-lg: ${themeSettings.fontSizes.lg};
  --kiosk-font-size-xl: ${themeSettings.fontSizes.xl};
  --kiosk-font-size-2xl: ${themeSettings.fontSizes["2xl"]};
  --kiosk-font-size-3xl: ${themeSettings.fontSizes["3xl"]};
  --kiosk-font-size-4xl: ${themeSettings.fontSizes["4xl"]};

  /* Ionic color overrides */
  --ion-color-primary: var(--kiosk-secondary);
  --ion-color-primary-rgb: 71, 206, 101;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255, 255, 255;
  --ion-color-primary-shade: var(--kiosk-secondary-dark);
  --ion-color-primary-tint: var(--kiosk-secondary-light);

  --ion-color-secondary: var(--kiosk-accent);
  --ion-color-secondary-rgb: 255, 204, 0;
  --ion-color-secondary-contrast: var(--kiosk-primary);
  --ion-color-secondary-contrast-rgb: 18, 22, 96;
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

  --kiosk-shadow-md: 0 4px 15px rgba(0, 0, 0, 0.2);
  --kiosk-shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.4);

  --ion-background-color: var(--kiosk-background);
  --ion-text-color: var(--kiosk-primary-text);

  /* Dark mode Ionic color overrides */
  --ion-color-primary: var(--kiosk-secondary);
  --ion-color-primary-shade: var(--kiosk-secondary-dark);
  --ion-color-primary-tint: var(--kiosk-secondary-light);

  --ion-color-secondary: var(--kiosk-accent);
  --ion-color-secondary-shade: var(--kiosk-accent-dark);
  --ion-color-secondary-tint: var(--kiosk-accent-light);
}`
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

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    setPreviewMode(newDarkMode ? "dark" : "light")

    if (newDarkMode) {
      document.documentElement.classList.add("dark-theme")
    } else {
      document.documentElement.classList.remove("dark-theme")
    }

    localStorage.setItem("kiosk-theme", newDarkMode ? "dark" : "light")
  }

  // Show toast message
  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
  }

  // Reset to default theme
  const resetToDefault = () => {
    setThemeSettings({
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
      shadows: {
        sm: "0 2px 8px rgba(18, 22, 96, 0.1)",
        md: "0 4px 12px rgba(18, 22, 96, 0.15)",
        lg: "0 8px 24px rgba(18, 22, 96, 0.2)",
      },
      fontSizes: {
        xs: "0.875rem",
        sm: "1rem",
        md: "1.25rem",
        lg: "1.5rem",
        xl: "1.75rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        "4xl": "3rem",
      },
    })
    showToastMessage("Reset to default theme")
  }

  // Font options
  const fontOptions = ["Outfit", "Inter", "Roboto", "Open Sans", "Montserrat", "Lato", "Poppins", "Raleway"]

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin" icon={chevronBackOutline} />
          </IonButtons>
          <IonTitle>Theme Customization</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={toggleDarkMode}>{isDark ? "Light Mode" : "Dark Mode"}</IonButton>
            <IonButton onClick={() => setShowPreview(!showPreview)}>
              <IonIcon slot="icon-only" icon={eyeOutline} />
            </IonButton>
            <IonButton onClick={handleSaveTheme}>
              <IonIcon slot="icon-only" icon={saveOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={activeSegment} onIonChange={(e) => setActiveSegment(e.detail.value as string)}>
            <IonSegmentButton value="colors">
              <IonIcon icon={colorPaletteOutline} />
              <IonLabel>Colors</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="typography">
              <IonIcon icon={textOutline} />
              <IonLabel>Typography</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="layout">
              <IonIcon icon={gridOutline} />
              <IonLabel>Layout</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6" style={{ display: showPreview ? "none" : "block" }}>
              {activeSegment === "colors" && (
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Color Palette</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList>
                      <IonItem lines="full">
                        <IonLabel>
                          <h2>Primary Colors</h2>
                        </IonLabel>
                      </IonItem>
                      <ColorPicker
                        color={themeSettings.colors.primary}
                        label="Primary"
                        onChange={(color) => handleColorChange("primary", color)}
                      />
                      <ColorPicker
                        color={themeSettings.colors.primaryDark}
                        label="Primary Dark"
                        onChange={(color) => handleColorChange("primaryDark", color)}
                      />
                      <ColorPicker
                        color={themeSettings.colors.primaryLight}
                        label="Primary Light"
                        onChange={(color) => handleColorChange("primaryLight", color)}
                      />
                      <ColorPicker
                        color={themeSettings.colors.primaryText}
                        label="Primary Text"
                        onChange={(color) => handleColorChange("primaryText", color)}
                      />

                      <IonItem lines="full">
                        <IonLabel>
                          <h2>Secondary Colors</h2>
                        </IonLabel>
                      </IonItem>
                      <ColorPicker
                        color={themeSettings.colors.secondary}
                        label="Secondary"
                        onChange={(color) => handleColorChange("secondary", color)}
                      />
                      <ColorPicker
                        color={themeSettings.colors.secondaryDark}
                        label="Secondary Dark"
                        onChange={(color) => handleColorChange("secondaryDark", color)}
                      />
                      <ColorPicker
                        color={themeSettings.colors.secondaryLight}
                        label="Secondary Light"
                        onChange={(color) => handleColorChange("secondaryLight", color)}
                      />

                      <IonItem lines="full">
                        <IonLabel>
                          <h2>Accent Colors</h2>
                        </IonLabel>
                      </IonItem>
                      <ColorPicker
                        color={themeSettings.colors.accent}
                        label="Accent"
                        onChange={(color) => handleColorChange("accent", color)}
                      />
                      <ColorPicker
                        color={themeSettings.colors.accentDark}
                        label="Accent Dark"
                        onChange={(color) => handleColorChange("accentDark", color)}
                      />
                      <ColorPicker
                        color={themeSettings.colors.accentLight}
                        label="Accent Light"
                        onChange={(color) => handleColorChange("accentLight", color)}
                      />

                      <IonItem lines="full">
                        <IonLabel>
                          <h2>Neutral Colors</h2>
                        </IonLabel>
                      </IonItem>
                      <ColorPicker
                        color={themeSettings.colors.background}
                        label="Background"
                        onChange={(color) => handleColorChange("background", color)}
                      />
                      <ColorPicker
                        color={themeSettings.colors.surface}
                        label="Surface"
                        onChange={(color) => handleColorChange("surface", color)}
                      />
                      <ColorPicker
                        color={themeSettings.colors.border}
                        label="Border"
                        onChange={(color) => handleColorChange("border", color)}
                      />

                      <IonItem lines="full">
                        <IonLabel>
                          <h2>Status Colors</h2>
                        </IonLabel>
                      </IonItem>
                      <ColorPicker
                        color={themeSettings.colors.success}
                        label="Success"
                        onChange={(color) => handleColorChange("success", color)}
                      />
                      <ColorPicker
                        color={themeSettings.colors.warning}
                        label="Warning"
                        onChange={(color) => handleColorChange("warning", color)}
                      />
                      <ColorPicker
                        color={themeSettings.colors.danger}
                        label="Danger"
                        onChange={(color) => handleColorChange("danger", color)}
                      />
                    </IonList>
                  </IonCardContent>
                </IonCard>
              )}

              {activeSegment === "typography" && (
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Typography</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList>
                      <IonItem>
                        <IonLabel>Primary Font</IonLabel>
                        <IonSelect
                          value={themeSettings.fonts.family.split(",")[0].trim()}
                          onIonChange={(e) => handleFontChange(e.detail.value)}
                          interface="popover"
                        >
                          {fontOptions.map((font) => (
                            <IonSelectOption key={font} value={font} style={{ fontFamily: font }}>
                              {font}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>

                      <IonItem lines="none">
                        <IonLabel>Font Weights</IonLabel>
                      </IonItem>

                      {[400, 500, 600, 700, 800].map((weight) => (
                        <IonItem key={weight}>
                          <IonLabel>{weight}</IonLabel>
                          <IonToggle
                            slot="end"
                            checked={themeSettings.fonts.weights.includes(weight)}
                            onIonChange={(e) => handleFontWeightToggle(weight, e.detail.checked)}
                          />
                        </IonItem>
                      ))}

                      <IonItem lines="full">
                        <IonLabel>
                          <h2>Font Sizes</h2>
                        </IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel>Extra Small (xs)</IonLabel>
                        <IonRange
                          min={0.5}
                          max={1.5}
                          step={0.05}
                          value={Number.parseFloat(themeSettings.fontSizes.xs)}
                          onIonChange={(e) => handleFontSizeChange("xs", e.detail.value as number)}
                        />
                        <IonLabel slot="end">{themeSettings.fontSizes.xs}</IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel>Small (sm)</IonLabel>
                        <IonRange
                          min={0.75}
                          max={1.75}
                          step={0.05}
                          value={Number.parseFloat(themeSettings.fontSizes.sm)}
                          onIonChange={(e) => handleFontSizeChange("sm", e.detail.value as number)}
                        />
                        <IonLabel slot="end">{themeSettings.fontSizes.sm}</IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel>Medium (md)</IonLabel>
                        <IonRange
                          min={1}
                          max={2}
                          step={0.05}
                          value={Number.parseFloat(themeSettings.fontSizes.md)}
                          onIonChange={(e) => handleFontSizeChange("md", e.detail.value as number)}
                        />
                        <IonLabel slot="end">{themeSettings.fontSizes.md}</IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel>Large (lg)</IonLabel>
                        <IonRange
                          min={1.25}
                          max={2.5}
                          step={0.05}
                          value={Number.parseFloat(themeSettings.fontSizes.lg)}
                          onIonChange={(e) => handleFontSizeChange("lg", e.detail.value as number)}
                        />
                        <IonLabel slot="end">{themeSettings.fontSizes.lg}</IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel>Extra Large (xl)</IonLabel>
                        <IonRange
                          min={1.5}
                          max={3}
                          step={0.05}
                          value={Number.parseFloat(themeSettings.fontSizes.xl)}
                          onIonChange={(e) => handleFontSizeChange("xl", e.detail.value as number)}
                        />
                        <IonLabel slot="end">{themeSettings.fontSizes.xl}</IonLabel>
                      </IonItem>
                    </IonList>
                  </IonCardContent>
                </IonCard>
              )}

              {activeSegment === "layout" && (
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Layout Settings</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList>
                      <IonItem lines="full">
                        <IonLabel>
                          <h2>Border Radius</h2>
                        </IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel>Small (sm)</IonLabel>
                        <IonRange
                          min={0}
                          max={16}
                          step={1}
                          value={Number.parseInt(themeSettings.radii.sm)}
                          onIonChange={(e) => handleBorderRadiusChange("sm", e.detail.value as number)}
                        />
                        <IonLabel slot="end">{themeSettings.radii.sm}</IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel>Medium (md)</IonLabel>
                        <IonRange
                          min={0}
                          max={24}
                          step={1}
                          value={Number.parseInt(themeSettings.radii.md)}
                          onIonChange={(e) => handleBorderRadiusChange("md", e.detail.value as number)}
                        />
                        <IonLabel slot="end">{themeSettings.radii.md}</IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel>Large (lg)</IonLabel>
                        <IonRange
                          min={0}
                          max={32}
                          step={1}
                          value={Number.parseInt(themeSettings.radii.lg)}
                          onIonChange={(e) => handleBorderRadiusChange("lg", e.detail.value as number)}
                        />
                        <IonLabel slot="end">{themeSettings.radii.lg}</IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel>Extra Large (xl)</IonLabel>
                        <IonRange
                          min={0}
                          max={40}
                          step={1}
                          value={Number.parseInt(themeSettings.radii.xl)}
                          onIonChange={(e) => handleBorderRadiusChange("xl", e.detail.value as number)}
                        />
                        <IonLabel slot="end">{themeSettings.radii.xl}</IonLabel>
                      </IonItem>
                    </IonList>
                  </IonCardContent>
                </IonCard>
              )}
            </IonCol>

            <IonCol size="12" sizeMd={showPreview ? "12" : "6"}>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Theme Preview</IonCardTitle>
                  <IonItem lines="none">
                    <IonLabel>Dark Mode</IonLabel>
                    <IonToggle
                      slot="end"
                      checked={previewMode === "dark"}
                      onIonChange={(e) => setPreviewMode(e.detail.checked ? "dark" : "light")}
                    />
                  </IonItem>
                </IonCardHeader>
                <IonCardContent>
                  <div
                    className={`preview-container ${previewMode === "dark" ? "dark-theme" : ""}`}
                    style={{
                      fontFamily: themeSettings.fonts.family,
                      backgroundColor: previewMode === "dark" ? "#121212" : themeSettings.colors.background,
                      color: previewMode === "dark" ? "#FFFFFF" : themeSettings.colors.primaryText,
                      borderRadius: themeSettings.radii.md,
                      padding: "1.5rem",
                      border: "1px solid #ccc",
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: themeSettings.fonts.family,
                        fontWeight: themeSettings.fonts.weights.includes(700) ? 700 : 400,
                        marginBottom: "0.5rem",
                        fontSize: themeSettings.fontSizes["2xl"],
                      }}
                    >
                      Theme Preview
                    </h2>

                    <p
                      style={{
                        fontFamily: themeSettings.fonts.family,
                        fontWeight: themeSettings.fonts.weights.includes(400) ? 400 : themeSettings.fonts.weights[0],
                        marginBottom: "1.5rem",
                        fontSize: themeSettings.fontSizes.md,
                      }}
                    >
                      This is how your theme will look across the application.
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                      <div
                        style={{
                          backgroundColor: themeSettings.colors.primary,
                          width: "60px",
                          height: "60px",
                          borderRadius: themeSettings.radii.sm,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      >
                        Primary
                      </div>
                      <div
                        style={{
                          backgroundColor: themeSettings.colors.secondary,
                          width: "60px",
                          height: "60px",
                          borderRadius: themeSettings.radii.sm,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#000",
                          fontSize: "12px",
                        }}
                      >
                        Secondary
                      </div>
                      <div
                        style={{
                          backgroundColor: themeSettings.colors.accent,
                          width: "60px",
                          height: "60px",
                          borderRadius: themeSettings.radii.sm,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#000",
                          fontSize: "12px",
                        }}
                      >
                        Accent
                      </div>
                      <div
                        style={{
                          backgroundColor: themeSettings.colors.success,
                          width: "60px",
                          height: "60px",
                          borderRadius: themeSettings.radii.sm,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#000",
                          fontSize: "12px",
                        }}
                      >
                        Success
                      </div>
                      <div
                        style={{
                          backgroundColor: themeSettings.colors.danger,
                          width: "60px",
                          height: "60px",
                          borderRadius: themeSettings.radii.sm,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      >
                        Danger
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <button
                        style={{
                          backgroundColor: themeSettings.colors.primary,
                          color: "#FFFFFF",
                          borderRadius: themeSettings.radii.md,
                          padding: "0.5rem 1rem",
                          border: "none",
                          fontFamily: themeSettings.fonts.family,
                          fontWeight: 600,
                          margin: "4px",
                        }}
                      >
                        Primary Button
                      </button>

                      <button
                        style={{
                          backgroundColor: themeSettings.colors.secondary,
                          color: "#000000",
                          borderRadius: themeSettings.radii.md,
                          padding: "0.5rem 1rem",
                          border: "none",
                          fontFamily: themeSettings.fonts.family,
                          fontWeight: 600,
                          margin: "4px",
                        }}
                      >
                        Secondary Button
                      </button>
                    </div>

                    <div
                      style={{
                        backgroundColor: themeSettings.colors.surface,
                        borderRadius: themeSettings.radii.lg,
                        padding: "1rem",
                        marginTop: "16px",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: themeSettings.fonts.family,
                          fontWeight: themeSettings.fonts.weights.includes(600) ? 600 : 400,
                          fontSize: themeSettings.fontSizes.lg,
                        }}
                      >
                        Card Example
                      </h3>
                      <p
                        style={{
                          fontFamily: themeSettings.fonts.family,
                          fontWeight: 400,
                          fontSize: themeSettings.fontSizes.sm,
                        }}
                      >
                        This shows how cards will appear with your selected theme.
                      </p>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Theme Management */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Theme Management</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="12" sizeMd="6">
                  <IonItem>
                    <IonLabel>Theme Name</IonLabel>
                    <IonInput
                      value={themeNameInput}
                      onIonChange={(e) => setThemeNameInput(e.detail.value || "")}
                      placeholder="Enter theme name"
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel>Load Theme</IonLabel>
                    <IonSelect interface="popover" placeholder="Select a theme" onIonChange={handleThemeSelect}>
                      {availableThemes.map((name) => (
                        <IonSelectOption key={name} value={name}>
                          {name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </IonCol>
                <IonCol size="12" sizeMd="6">
                  <IonButton expand="block" onClick={handleSaveTheme}>
                    <IonIcon slot="start" icon={saveOutline} />
                    Save Theme
                  </IonButton>
                  <IonButton expand="block" onClick={handleExportTheme} className="ion-margin-top">
                    <IonIcon slot="start" icon={downloadOutline} />
                    Export Theme CSS
                  </IonButton>
                  <IonButton expand="block" onClick={resetToDefault} className="ion-margin-top" color="medium">
                    <IonIcon slot="start" icon={refreshOutline} />
                    Reset to Default
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Toast Message */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  )
}

export default ThemeCustomizerPage

