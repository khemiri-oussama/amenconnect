// otp/otpMobile.tsx
import React, { useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonText,
  IonLabel,
  IonImg,
  IonRippleEffect,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import useOtp from "../../hooks/useOtp";
import "./otpMobile.css";

const OtpMobile: React.FC = () => {
  const history = useHistory();
  const { pendingUser, setIsAuthenticated } = useAuth();

  useEffect(() => {
    if (!pendingUser) history.replace("/login");
  }, [pendingUser, history]);

  const onSuccess = () => {
    setIsAuthenticated(true);
    window.location.href = "/accueil";
  };

  const {
    otp,
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
  } = useOtp({ email: pendingUser!.email, onSuccess });

  return (
    <IonPage>
      <IonContent className="otp-mobile-container" fullscreen>
        <IonGrid className="otp-mobile-grid">
          <IonRow>
            <IonCol size="12" className="otp-mobile-logo-col">
              <IonImg src="../amen_logo.png" alt="Logo" className="otp-mobile-logo" />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12" className="otp-mobile-form-col">
              <h1 className="otp-mobile-title">Vérification OTP</h1>
              <p className="otp-mobile-subtitle">
                Veuillez saisir le code OTP envoyé à votre téléphone
              </p>

              <form onSubmit={handleSubmit} className="otp-mobile-form">
                <div className="otp-mobile-input-group">
                  <IonLabel className="otp-mobile-input-label">Code OTP</IonLabel>
                  <div className="otp-mobile-input-wrapper">
                    <div className="otp-mobile-inputs">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <IonInput
                          key={index}
                          type="tel"
                          inputmode="numeric"
                          pattern="[0-9]*"
                          maxlength={1}
                          value={otp[index] || ""}
                          onIonInput={(e) => handleOtpChange(index, e.detail.value!)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          ref={(el) => (inputRefs.current[index] = el)}
                          className="otp-mobile-input"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <IonText color="danger" className="error-message">
                    {errorMessage}
                  </IonText>
                )}

                <div className="otp-mobile-resend">
                  {countdown > 0 ? (
                    <p>Renvoyer le code dans {countdown} secondes</p>
                  ) : (
                    <IonButton
                      fill="clear"
                      onClick={handleResend}
                      disabled={isLoading || !canResend}
                    >
                      Renvoyer le code OTP
                    </IonButton>
                  )}
                </div>

                <IonButton
                  expand="block"
                  type="submit"
                  className="otp-mobile-button ion-activatable"
                  disabled={isLoading}
                >
                  {isLoading ? "Vérification..." : "Confirmer"}
                  <IonRippleEffect />
                </IonButton>
              </form>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default OtpMobile;
