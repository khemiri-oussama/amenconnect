"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { IonContent, IonPage, IonImg, IonIcon, IonButton, IonText, useIonRouter, IonInput } from "@ionic/react"
import { arrowBack } from "ionicons/icons"
import { useAuth } from "../../context/AuthContext"
import useOtp from "../../hooks/useOtp"
import Keyboard from "react-simple-keyboard"
import "react-simple-keyboard/build/css/index.css"
import "./otp.css"

const OtpKiosk: React.FC = () => {
  const ionRouter = useIonRouter()
  const { pendingUser, isAuthenticated, setIsAuthenticated } = useAuth()
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null)

  // Redirect to login if there's no pending user and the user is not authenticated.
  useEffect(() => {
    if (!pendingUser && !isAuthenticated) {
      ionRouter.push("/login")
    }
  }, [pendingUser, isAuthenticated, ionRouter])

  // Reset inactivity timer (session timeout)
  const INACTIVITY_TIMEOUT = 60000 // 60 seconds
  const resetTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current)
    }
    inactivityTimer.current = setTimeout(() => {
      ionRouter.push("/login")
    }, INACTIVITY_TIMEOUT)
  }

  // On successful OTP verification, set the user as authenticated and redirect.
  const onSuccess = () => {
    setIsAuthenticated(true)
    window.location.href = "/accueil"
  }

  // Use the custom OTP hook.
  const {
    otp,
    setOtp,
    inputRefs,
    errorMessage,
    isLoading,
    countdown,
    canResend,
    handleOtpChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    handleResend,
  } = useOtp({ email: pendingUser?.email || "", onSuccess })

  const handleBack = () => {
    ionRouter.push("/login")
  }

  // Reset inactivity timer on user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      resetTimer()
    }
    document.addEventListener("touchstart", handleUserInteraction)
    document.addEventListener("click", handleUserInteraction)
    resetTimer()
    return () => {
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("click", handleUserInteraction)
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    }
  }, [ionRouter])

  // Handle OTP keyboard key press for numeric keyboard only.
  const handleOtpKeyboardKeyPress = (button: string) => {
    if (button === "{bksp}") {
      setOtp((prev: string) => prev.slice(0, -1))
    } else if (button === "{enter}") {
      // If 6 digits have been entered, trigger submission.
      if (otp.length === 6) {
        // Create a synthetic event to pass to handleSubmit.
        const event = new Event("submit", { bubbles: true, cancelable: true })
        handleSubmit(event as any)
      }
    } else {
      // Append numeric digit if less than 6 characters.
      if (otp.length < 6) {
        setOtp((prev: string) => prev + button)
      }
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="otpkiosk-container">
          <div className="otpkiosk-bg-circle-1"></div>
          <div className="otpkiosk-bg-circle-2"></div>
          <div className="otpkiosk-bg-blob"></div>

          <svg className="background-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 983 1920" fill="none">
            <path
              d="M0 0H645.236C723.098 0 770.28 85.9638 728.469 151.647C697.151 200.847 715.114 266.33 767.152 292.664L793.096 305.793C854.316 336.773 866.865 418.795 817.709 466.662L691.328 589.731C677.652 603.048 659.319 610.5 640.231 610.5C577.253 610.5 543.641 684.721 585.184 732.054L641.155 795.826C676.082 835.621 671.964 896.237 631.974 930.943L582.069 974.254C522.93 1025.58 568.96 1122.18 646.076 1108.59C700.297 1099.03 746.811 1147.67 734.833 1201.41L727.617 1233.79C715.109 1289.9 752.705 1344.88 809.534 1353.59L836.788 1357.76C862.867 1361.76 886.31 1375.9 902.011 1397.1L964.656 1481.7C1003.87 1534.65 970.947 1610.18 905.469 1617.5C862.212 1622.34 829.5 1658.92 829.5 1702.44V1717.72C829.5 1756.01 800.102 1787.88 761.94 1790.96L696.194 1796.27C667.843 1798.56 652.928 1831 669.644 1854.01C685.614 1876 672.771 1907.1 645.942 1911.41L597.738 1919.16C594.251 1919.72 590.726 1920 587.195 1920H462.5H200.5H0V0Z"
              fill="#47CE65"
              stroke="#47CE65"
            />
          </svg>

          <div className="otpkiosk-content">
            <div className="otpkiosk-back-button" onClick={handleBack}>
              <IonIcon icon={arrowBack} />
              <span>Retour</span>
            </div>
            <div className="otpkiosk-logo">
              <IonImg src="favicon.png" alt="Amen Bank Logo" className="otpkiosk-img" />
            </div>
            <h1 className="otpkiosk-title">Vérification OTP</h1>
            <p className="otpkiosk-subtitle">Veuillez saisir le code OTP envoyé à votre email</p>
            <form className="otpkiosk-form" onSubmit={handleSubmit}>
              <div className="otpkiosk-input-group">
                <div className="otpkiosk-inputs">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <IonInput
                      key={index}
                      type="text"
                      maxlength={1}
                      value={otp[index] || ""}
                      onIonInput={(e) => handleOtpChange(index, e.detail.value || "")}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      ref={(el) => {
                        if (inputRefs.current) {
                          inputRefs.current[index] = el
                        }
                      }}
                      className="otpkiosk-input"
                      inputMode="numeric"
                    />
                  ))}
                </div>
              </div>
              {errorMessage && (
                <IonText color="danger" className="error-message">
                  {errorMessage}
                </IonText>
              )}
              <div className="otpkiosk-resend">
                {countdown > 0 ? (
                  <p>Renvoyer le code dans {countdown} secondes</p>
                ) : (
                  <IonButton fill="clear" onClick={handleResend} disabled={isLoading || !canResend}>
                    Renvoyer le code OTP
                  </IonButton>
                )}
              </div>
              <button type="submit" className="otpkiosk-btn" disabled={isLoading}>
                {isLoading ? "Vérification..." : "Confirmer"}
              </button>
            </form>
            <p className="otpkiosk-message">La réussite est à portée de clic.</p>
          </div>
          {/* Render numeric virtual keyboard */}
          <div
            className="virtual-keyboard-container"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Keyboard
              layout={{
                default: [
                  "1 2 3",
                  "4 5 6",
                  "7 8 9",
                  "0 {bksp} {enter}"
                ]
              }}
              layoutName="default"
              onKeyPress={handleOtpKeyboardKeyPress}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default OtpKiosk
