import type React from "react"
import { Redirect, Route } from "react-router-dom"
import { IonApp, IonRouterOutlet, setupIonicReact, IonSpinner } from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import { Suspense, lazy } from "react"
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

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css"

/* Theme variables */
import "./theme/variables.css"

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"))
const ModeInvite = lazy(() => import("./pages/mode-invite"))
const Login = lazy(() => import("./pages/login"))
const AccountCreation = lazy(() => import("./pages/account-creation"))

// Loading component
const LoadingFallback = () => (
  <div className="loading-container">
    <IonSpinner name="crescent" />
    <p>Chargement...</p>
  </div>
)

setupIonicReact()

const App: React.FC = () => (
  <IonApp>
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
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </Suspense>
    </IonReactRouter>
  </IonApp>
)

export default App

