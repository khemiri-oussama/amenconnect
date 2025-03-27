"use client"

import type React from "react"
import { Redirect, Route } from "react-router-dom"
import { IonApp, IonRouterOutlet, setupIonicReact, IonSpinner } from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import { Suspense, lazy, useEffect } from "react"
import "./theme/global.css"

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css"

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css"
import "@ionic/react/css/float-elements.css"
import "@ionic/react/css/text-alignment.css"
import "@ionic/react/css/text-transformation.css"
import "@ionic/react/css/flex-utils.css"
import "@ionic/react/css/display.css"

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */
import "@ionic/react/css/palettes/dark.system.css"

/* Theme variables */
import "./theme/variables.css"

// Context providers
import { OrientationProvider } from "./context/OrientationContext"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"

// Lazy load components for better performance with improved error handling
const Home = lazy(() =>
  import("./pages/Home").catch((err) => {
    console.error("Failed to load Home component:", err)
    return { default: () => <div>An error occurred while loading the Home component.</div> }
  }),
)

const ModeInvite = lazy(() =>
  import("./pages/modeinvite/mode-invite").catch((err) => {
    console.error("Failed to load ModeInvite component:", err);
    return { default: () => <div>An error occurred while loading ModeInvite.</div> };
  }),
)

const Login = lazy(() =>
  import("./pages/login/login").catch((err) => {
    console.error("Failed to load Login component:", err)
    return { default: () => <div>An error occurred while loading the Login component.</div> }
  }),
)

const AccountCreation = lazy(() =>
  import("./pages/AccountCreationForm").catch((err) => {
    console.error("Failed to load AccountCreation component:", err)
    return { default: () => <div>An error occurred while loading the AccountCreation component.</div> }
  }),
)

const ForgotPassword = lazy(() =>
  import("./pages/login/ForgotPassword/ForgotPassword").catch((err) => {
    console.error("Failed to load ForgotPassword component:", err)
    return { default: require("./components/ErrorBoundary").default }
  }),
)

const Otp = lazy(() =>
  import("./pages/otp/otp").catch((err) => {
    console.error("Failed to load Otp component:", err)
    return { default: require("./components/ErrorBoundary").default }
  }),
)

// Enhanced loading component with animation
const LoadingFallback: React.FC = () => (
  <div className="kiosk-loading-container">
    <div className="kiosk-loading-content animate-fade-in">
      <IonSpinner name="circles" className="kiosk-spinner" />
      <p className="loading-text">Chargement en cours...</p>
    </div>
  </div>
)

setupIonicReact({
  mode: "md", // Use material design mode for all platforms
  hardwareBackButton: false, // Disable hardware back button
  animated: true, // Enable animations
})

// App component with better error handling and performance optimizations
const App: React.FC = () => {
  // Handle orientation changes and viewport dimensions
  useEffect(() => {
    const handleResize = () => {
      // Set CSS variables for viewport dimensions
      document.documentElement.style.setProperty("--viewport-height", `${window.innerHeight}px`)
      document.documentElement.style.setProperty("--viewport-width", `${window.innerWidth}px`)

      // Set orientation class for conditional styling
      const isLandscape = window.innerWidth > window.innerHeight
      document.documentElement.classList.toggle("landscape", isLandscape)
      document.documentElement.classList.toggle("portrait", !isLandscape)
    }

    // Set initial values
    handleResize()

    // Update on resize with debounce for better performance
    let resizeTimer: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(handleResize, 100)
    }

    window.addEventListener("resize", debouncedResize)

    // Handle orientation change specifically for mobile devices
    window.addEventListener("orientationchange", handleResize)

    return () => {
      window.removeEventListener("resize", debouncedResize)
      window.removeEventListener("orientationchange", handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return (
    <ThemeProvider>
      <OrientationProvider>
        <AuthProvider>
          <IonApp className="kiosk-app">
            <IonReactRouter>
              <Suspense fallback={<LoadingFallback />}>
                <IonRouterOutlet>
                  <Route exact path="/home">
                    <Home />
                  </Route>
                  <Route exact path="/modeinvite">
                    <ModeInvite />
                  </Route>
                  <Route exact path="/login">
                    <Login />
                  </Route>
                  <Route exact path="/account-creation">
                    <AccountCreation onBack={() => window.history.back()} />
                  </Route>
                  <Route exact path="/otp">
                    <Otp />
                  </Route>
                  <Route exact path="/forgot-password">
                    <ForgotPassword onBack={() => window.history.back()} />
                  </Route>
                  <Route exact path="/">
                    <Redirect to="/home" />
                  </Route>
                  {/* Add a catch-all route for 404 handling */}
                  <Route>
                    <Redirect to="/home" />
                  </Route>
                </IonRouterOutlet>
              </Suspense>
            </IonReactRouter>
          </IonApp>
        </AuthProvider>
      </OrientationProvider>
    </ThemeProvider>
  )
}

export default App

