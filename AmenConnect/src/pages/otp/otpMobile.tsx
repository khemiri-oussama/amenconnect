// otp/otpMobile.tsx
import React, { useRef, useState, useEffect } from "react";
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
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLIonInputElement | null)[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const { pendingUser, setIsAuthenticated } = useAuth();

  useEffect(() => {
    // If there is no pending user from the context, redirect to login.
    if (!pendingUser) {
      history.replace("/login");
    }
  }, [pendingUser, history]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      setTimeout(() => inputRefs.current[index + 1]?.setFocus(), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      setTimeout(() => inputRefs.current[index - 1]?.setFocus(), 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    try {
      const otpCode = otp.join("");
      const response = await axios.post("/api/auth/verify-otp", {
        email: pendingUser!.email,
        otp: otpCode,
      });

      if (response.data.message === "OTP verified successfully!") {
        // Optionally, store token securely (e.g., in an HttpOnly cookie) on the server side.
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
                      {otp.map((_, index) => (
                        <IonInput
                          key={index}
                          type="tel"
                          inputmode="numeric"
                          pattern="[0-9]*"
                          maxlength={1}
                          value={otp[index]}
                          onIonInput={(e) => handleOtpChange(index, e.detail.value!)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
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

                <IonText className="otp-mobile-resend">
                  <a href="#">N'avez-vous pas reçu le code OTP ?</a>
                </IonText>

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
