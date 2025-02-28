import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonText,
  IonLabel,
  IonImg,
} from "@ionic/react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import useOtp from "../../hooks/useOtp";
import "./otpDesktop.css";

export default function OtpPage() {
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
                        value={otp[index] || ""}
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

                {countdown > 0 ? (
                  <p className="resend-text">
                    Renvoyer le code dans {countdown} secondes
                  </p>
                ) : (
                  <IonButton
                    expand="block"
                    onClick={handleResend}
                    className="resend-button"
                    disabled={isLoading}
                  >
                    Renvoyer le code OTP
                  </IonButton>
                )}

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
