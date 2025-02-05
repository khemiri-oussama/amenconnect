import {
    IonContent,
    IonPage,
    IonInput,
    IonButton,
    IonText,
    IonLabel,
    IonImg
  } from '@ionic/react';
  import { useState, useRef } from 'react';
  import { useHistory } from 'react-router-dom';
  
  import './otp.css';
  
  export default function LoginPage() {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const inputRefs = useRef<(HTMLIonInputElement | null)[]>([]);
    const history = useHistory();
  
    const handleOtpChange = (index: number, value: string) => {
      if (value.length <= 1 && /^[0-9]*$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        
        if (value && index < 5) {
          inputRefs.current[index + 1]?.setFocus();
        }
      }
    };
  
    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.setFocus();
      }
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('OTP submitted:', otp.join(''));
      history.push("/accueil");
      // Add your OTP verification logic here
    };
  
    return (
      <IonPage>
        <IonContent className="ion-padding login-container" fullscreen>
          <div className="content-wrapper">
            <div className="login-box">
              <div className="logo-container">
                <IonImg src="../amen_logo.png" alt="Logo" className="logo" />
              </div>
              <div className="form-container">
                <h1 className="title">Bienvenu</h1>
                <p className="subtitle">
                  Veuillez saisir les détails de votre compte
                </p>
  
                <form onSubmit={handleSubmit} className="login-form">
                  <div className="input-group">
                    <IonLabel className="input-label">OTP</IonLabel>
                    <div className="otp-inputs">
                      {[...Array(6)].map((_, index) => (
                        <IonInput
                          key={index}
                          type="text"
                          maxlength={1}
                          className="otp-input"
                        />
                      ))}
                    </div>
                  </div>
  
                  <p className="resend-text">
                    N'avez-vous pas reçu le code OTP ?
                  </p>
  
                  <IonButton 
                    expand="block" 
                    type="submit"
                    className="login-button"
                  >
                    Confirmer
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
  
  