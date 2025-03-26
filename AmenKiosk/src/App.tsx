"use client"

import type React from "react"
import { Redirect, Route } from "react-router-dom"
import { IonApp, IonRouterOutlet, setupIonicReact, IonSpinner } from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import { Suspense, lazy, useEffect, useState } from "react"
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


// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"))
const ModeInvite = lazy(() => import("./pages/mode-invite"))
const Login = lazy(() => import("./pages/login"))
const AccountCreation = lazy(() => import("./pages/account-creation"))
const AdminPanel = lazy(() => import("./pages/admin/admin-panel"))

// Loading component
const LoadingFallback: React.FC = () => (
  <div className="kiosk-loading-container">
    <div className="kiosk-loading-content">
      <IonSpinner name="circles" className="kiosk-spinner" />
      <p>Chargement en cours...</p>
    </div>
  </div>
)

setupIonicReact({
  mode: "md", // Use material design mode for all platforms
  hardwareBackButton: false, // Disable hardware back button
})

// Update the App component with better error handling:
const App: React.FC = () => {
  const [isAppReady, setIsAppReady] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    try {
      // Simulate splash screen timeout
      const timer = setTimeout(() => {
        setIsAppReady(true)

        // Initialize button sounds after app is loaded
        try {
          preloadSounds()
          enableButtonSounds()
        } catch (error) {
          console.error("Error initializing sounds:", error)
        }
      }, 1000)

      return () => clearTimeout(timer)
    } catch (error) {
      console.error("Error in App initialization:", error)
      setHasError(true)
    }
  }, [])

  if (hasError) {
    return (
      <div className="kiosk-error-container">
        <div className="kiosk-error-content">
          <h2>Une erreur est survenue</h2>
          <p>Impossible de charger l'application. Veuillez rafraîchir la page.</p>
          <button onClick={() => window.location.reload()}>Rafraîchir</button>
        </div>
      </div>
    )
  }

  if (!isAppReady) {
    return <LoadingFallback />
  }

  return (
    <ThemeProvider>
      <OrientationProvider>
        <IonApp className="kiosk-app">
          <IonReactRouter>
            <Suspense fallback={<LoadingFallback />}>
              <IonRouterOutlet>
                <Route exact path="/home">
                  <Home />
                </Route>
                <Route exact path="/mode-invite">
                  <ModeInvite />
                </Route>
                <Route exact path="/login">
                  <Login />
                </Route>
                <Route exact path="/account-creation">
                  <AccountCreation />
                </Route>
                <Route exact path="/admin">
                  <AdminPanel />
                </Route>
                <Route exact path="/">
                  <Redirect to="/home" />
                </Route>
              </IonRouterOutlet>
            </Suspense>
          </IonReactRouter>
        </IonApp>
      </OrientationProvider>
    </ThemeProvider>
  )
}

export default App

