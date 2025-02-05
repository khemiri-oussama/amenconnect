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
  const history = useHistory();
  const inputRefs = useRef<(HTMLIonInputElement | null)[]>(Array(6).fill(null));

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input field
      if (value.length === 1 && index < 5) {
        inputRefs.current[index + 1]?.setFocus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      // Move focus to the previous input when Backspace is pressed and the current input is empty
      setTimeout(() => {
        inputRefs.current[index - 1]?.setFocus();
      }, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    history.push("/accueil");
    console.log("OTP:", otpCode);
  };

  useEffect(() => {
    // Focus on the first input when the component is mounted
    inputRefs.current[0]?.setFocus();
  }, []);

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
                          type="tel" // Using type="tel" for numeric input
                          inputmode="numeric"
                          pattern="[0-9]*"
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
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default OtpMobile;
