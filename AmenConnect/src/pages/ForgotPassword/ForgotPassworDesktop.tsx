import type React from "react"
import { IonContent, IonPage, IonInput, IonButton, IonText, IonLabel, IonImg } from "@ionic/react"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"
import "./ForgotPasswordDesktop.css"

export default function ForgotPasswordPage() {
  const [cin, setCin] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const history = useHistory()

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    setIsLoading(true)

    // CIN validation
    if (!cin.trim() || cin.length !== 8 || !/^\d+$/.test(cin)) {
      setErrorMessage("Veuillez saisir un numéro CIN valide à 8 chiffres.")
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post("/api/password/forgot-password", { cin })
      setSuccessMessage(
        response.data.message || "Un e-mail de réinitialisation a été envoyé à l'adresse associée à ce CIN.",
      )
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Erreur inattendue.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <IonPage>
      <IonContent className="ion-padding forgot-password-container" fullscreen>
        <div className="content-wrapper-forgot">
          <div className="forgot-password-box">
            <div className="logo-container-forgot-desktop">
              <IonImg src="../amen_logo.png" alt="Logo" className="logo-forgot-desktop" />
            </div>
            <div className="form-container-forgot">
              <h1 className="title-forgot-desktop">Mot de passe oublié</h1>
              <p className="subtitle-forgot">Entrez votre numéro CIN pour réinitialiser votre mot de passe</p>

              <form onSubmit={handleForgotPassword} className="forgot-password-form">
                <div className="input-group-forgot">
                  <IonLabel className="input-label-forgot">Numéro CIN</IonLabel>
                  <IonInput
                    type="text"
                    value={cin}
                    onIonChange={(e) => setCin(e.detail.value!)}
                    className="custom-input-forgot"
                    maxlength={8}
                    minlength={8}
                    required
                  />
                </div>

                {errorMessage && (
                  <IonText color="danger" className="error-message-forgot">
                    {errorMessage}
                  </IonText>
                )}

                {successMessage && (
                  <IonText color="success" className="success-message-forgot">
                    {successMessage}
                  </IonText>
                )}

                <IonButton expand="block" type="submit" className="forgot-password-button" disabled={isLoading}>
                  {isLoading ? "Envoi en cours..." : "Réinitialiser le mot de passe"}
                </IonButton>

                <IonText className="back-to-login" onClick={() => history.push("/login")}>
                  <a style={{cursor: "pointer"}}>Retour à la connexion</a>
                </IonText>
              </form>
            </div>
          </div>
        </div>
        <div className="blurry-div-forgot"></div>
      </IonContent>
    </IonPage>
  )
}

