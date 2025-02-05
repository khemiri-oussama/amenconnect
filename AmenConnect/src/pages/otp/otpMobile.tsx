import type React from "react"
import { useState, useRef } from "react"
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonText,
  IonLabel,
  IonImg,
  IonIcon,
  IonRippleEffect,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import { lockClosedOutline } from "ionicons/icons"
import "./otpMobile.css"

const otpMobile: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const inputRefs = useRef<HTMLIonInputElement[]>(Array(6).fill(null)) // Updated line
  const history = useHistory()

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      if (value && index < 5) {
        inputRefs.current[index + 1]?.setFocus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.setFocus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("OTP submitted:", otp.join(""))
    history.push("/accueil")
    // Add your OTP verification logic here
  }

  return (
    <IonPage>
      <IonContent className="otp-mobile-container" fullscreen>
        <div className="otp-mobile-content">
          <div className="otp-mobile-logo-container">
            <IonImg src="../amen_logo.png" alt="Logo" className="otp-mobile-logo" />
          </div>
          <div className="otp-mobile-form-container">
            <h1 className="otp-mobile-title">Vérification OTP</h1>
            <p className="otp-mobile-subtitle">Veuillez saisir le code OTP envoyé à votre téléphone</p>

            <form onSubmit={handleSubmit} className="otp-mobile-form">
              <div className="otp-mobile-input-group">
                <IonLabel className="otp-mobile-input-label">Code OTP</IonLabel>
                <div className="otp-mobile-input-wrapper">
                  <IonIcon icon={lockClosedOutline} className="otp-mobile-input-icon" />
                  <div className="otp-mobile-inputs">
                    {[...Array(6)].map((_, index) => (
                      <IonInput
                        key={index}
                        type="text"
                        maxlength={1}
                        value={otp[index]}
                        onIonChange={(e) => handleOtpChange(index, e.detail.value!)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        ref={(el) => (inputRefs.current[index] = el)}
                        className="otp-mobile-input"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <IonText className="otp-mobile-resend">
                <a href="#">N'avez-vous pas reçu le code OTP ?</a>
              </IonText>

              <IonButton expand="block" type="submit" className="otp-mobile-button ion-activatable">
                Confirmer
                <IonRippleEffect />
              </IonButton>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default otpMobile

