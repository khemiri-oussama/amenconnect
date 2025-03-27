"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { IonButton, IonContent, IonPage } from "@ionic/react"

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  private handleRetry = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = "/home"
  }

  public render() {
    if (this.state.hasError) {
      return (
        <IonPage>
          <IonContent className="ion-padding">
            <div className="error-container">
              <h1>Oops, quelque chose s'est mal passé</h1>
              <p>Nous sommes désolés pour ce désagrément.</p>
              <div className="error-actions">
                <IonButton onClick={this.handleRetry}>Réessayer</IonButton>
                <IonButton onClick={this.handleGoHome}>Retour à l'accueil</IonButton>
              </div>
            </div>
          </IonContent>
        </IonPage>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

