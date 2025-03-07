// AdminLogin.tsx (frontend component)
"use client"

import type React from "react"
import { IonContent, IonPage, IonInput, IonButton, IonText, IonLabel, IonImg, IonIcon } from "@ionic/react"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import { useAdminLogin } from "../../hooks/useAdminLogin" // admin hook
import { lockClosed, mail } from "ionicons/icons"
import "./AdminLogin.css"

export default function AdminLogin() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const { isLoading, errorMessage, login } = useAdminLogin()
  const history = useHistory()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <IonPage>
      <IonContent className="admin-login-container" fullscreen>
        <div className="admin-layout">
          <div className="admin-sidebar">
            <div className="admin-logo-container">
              <IonImg src="../amen_logo.png" alt="Logo" className="admin-logo" />
            </div>
            <div className="admin-sidebar-content">
              <h2 className="admin-sidebar-title">Administration</h2>
              <p className="admin-sidebar-text">Accédez au panneau d'administration pour gérer votre plateforme</p>
            </div>
          </div>

          <div className="admin-form-section">
            <div className="admin-form-container">
              <h1 className="admin-title">Espace Administrateur</h1>
              <p className="admin-subtitle">Connectez-vous pour accéder au tableau de bord</p>

              <form onSubmit={handleLogin} className="admin-login-form">
                <div className="admin-input-group">
                  <IonLabel className="admin-input-label">Identifiant Admin</IonLabel>
                  <div className="admin-input-wrapper">
                    <IonIcon icon={mail} className="admin-input-icon" />
                    <IonInput
                      type="email"
                      value={email}
                      onIonChange={(e) => setEmail(e.detail.value!)}
                      className="admin-input"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="admin-input-group">
                  <IonLabel className="admin-input-label">Mot De Passe</IonLabel>
                  <div className="admin-input-wrapper">
                    <IonIcon icon={lockClosed} className="admin-input-icon" />
                    <IonInput
                      type="password"
                      value={password}
                      onIonChange={(e) => setPassword(e.detail.value!)}
                      className="admin-input"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {errorMessage && (
                  <IonText color="danger" className="admin-error-message">
                    {errorMessage}
                  </IonText>
                )}

                <div className="admin-actions">
                  <IonText className="admin-forgot-password" onClick={() => history.push("/admin/forgotPassword")}>
                    <a style={{ cursor: "pointer" }}>Mot De Passe oublié ?</a>
                  </IonText>

                  <IonButton expand="block" type="submit" className="admin-login-button" disabled={isLoading}>
                    {isLoading ? "Chargement..." : "Connexion Admin"}
                  </IonButton>
                </div>

                <div className="admin-back-link">
                  <a onClick={() => history.push("/login")} style={{ cursor: "pointer" }}>
                    Retour à l'espace utilisateur
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}
