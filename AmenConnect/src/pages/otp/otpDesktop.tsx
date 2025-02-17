import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonText,
  IonLabel,
  IonImg,
} from "@ionic/react";
import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useAuth, User } from "../../AuthContext";
import "./otpDesktop.css";

export default function OtpPage() {
  const [otp, setOtp] = useState<string>(""); // Store OTP as a string instead of an array
  const inputRefs = useRef<(HTMLIonInputElement | null)[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const { pendingUser, setIsAuthenticated } = useAuth();

  useEffect(() => {
    if (!pendingUser) history.replace("/login");
  }, [pendingUser, history]);

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d{6}$/.test(value)) {
      setOtp(value); // Directly set OTP as a string
      inputRefs.current[5]?.setFocus();
    } else if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = otp.slice(0, index) + value + otp.slice(index + 1);
      setOtp(newOtp); // Update OTP as a string
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
      setOtp(pastedData); // Update OTP as a string
      inputRefs.current[5]?.setFocus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/verify-otp", {
        email: pendingUser!.email,
        otp,
      });

      sessionStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);

      history.replace("/accueil");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Erreur OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding login-container" fullscreen>
        <div className="content-wrapper">
          <div className="login-box">
            <div className="logo-container-otp-desktop">
              <IonImg
                src="../amen_logo.png"
                alt="Logo"
                className="logo-otp-desktop"
              />
            </div>
            <div className="form-container">
              <h1 className="title">Bienvenu</h1>
              <p className="subtitle">
                Veuillez saisir le code OTP envoyé à votre email
              </p>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <IonLabel className="input-label">OTP</IonLabel>
                  <div className="otp-inputs">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <IonInput
                        key={index}
                        type="text"
                        maxlength={1}
                        value={otp[index] || ""} // Ensure the correct value
                        onIonInput={(e) =>
                          handleOtpChange(index, e.detail.value || "")
                        }
                        onPaste={index === 0 ? handlePaste : undefined}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="otp-input"
                        ref={(ref) => (inputRefs.current[index] = ref)}
                      />
                    ))}
                  </div>
                </div>

                {errorMessage && (
                  <IonText color="danger" className="error-message">
                    {errorMessage}
                  </IonText>
                )}

                <p className="resend-text">
                  N'avez-vous pas reçu le code OTP ?
                </p>

                <IonButton
                  expand="block"
                  type="submit"
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Vérification..." : "Confirmer"}
                </IonButton>
              </form>
            </div>
          </div>
        </div>
        <div className="blurry-div"></div>
      </IonContent>
    </IonPage>
  );
}
