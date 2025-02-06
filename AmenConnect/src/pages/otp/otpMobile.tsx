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
import { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./otpMobile.css";

const OtpMobile: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLIonInputElement | null)[]>([]);
  const history = useHistory();

  useEffect(() => {
    // Focus the first input when the page loads
    if (inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0]?.setFocus(), 100);
    }
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Allow only one digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input field if a digit is entered
    if (value && index < 5) {
      setTimeout(() => inputRefs.current[index + 1]?.setFocus(), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      setTimeout(() => inputRefs.current[index - 1]?.setFocus(), 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    console.log("OTP:", otpCode);
    history.push("/accueil");
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
                      {[...Array(6)].map((_, index) => (
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

                <IonText className="otp-mobile-resend">
                  <a href="#">N'avez-vous pas reçu le code OTP ?</a>
                </IonText>

                <IonButton expand="block" type="submit" className="otp-mobile-button ion-activatable">
                  Confirmer
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
