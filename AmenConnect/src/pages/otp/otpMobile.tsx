// otp/otpMobile.tsx
import React, { useRef, useState, useEffect, useCallback } from "react";
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
import axios from "axios";
import { useAuth } from "../../AuthContext";
import "./otpMobile.css";

const OtpMobile: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const inputRefs = useRef<(HTMLIonInputElement | null)[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(90);
  const [canResend, setCanResend] = useState(false);
  const history = useHistory();
  const { pendingUser, setIsAuthenticated } = useAuth();

  useEffect(() => {
    if (!pendingUser) history.replace("/login");
  }, [pendingUser, history]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d{6}$/.test(value)) {
      setOtp(value);
      inputRefs.current[5]?.setFocus();
    } else if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = otp.slice(0, index) + value + otp.slice(index + 1);
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1]?.setFocus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.setFocus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData("Text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData);
      inputRefs.current[5]?.setFocus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "/api/auth/verify-otp",
        { email: pendingUser!.email, otp },
        { withCredentials: true }
      );

      if (response.data.message === "OTP verified successfully!") {
        setIsAuthenticated(true);
        history.replace("/accueil");
      } else {
        setErrorMessage("OTP invalide. Veuillez réessayer.");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Une erreur s'est produite lors de la vérification.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      await axios.post(
        "/api/auth/resend-otp",
        { email: pendingUser!.email },
        { withCredentials: true }
      );
      setCountdown(90);
      setCanResend(false);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Erreur lors de l'envoi de l'OTP.");
    } finally {
      setIsLoading(false);
    }
  }, [pendingUser]);

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
              <p className="otp-mobile-subtitle">Veuillez saisir le code OTP envoyé à votre téléphone</p>

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