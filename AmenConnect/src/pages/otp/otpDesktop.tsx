import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonText,
  IonLabel,
  IonImg
} from '@ionic/react';
import { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import './otpDesktop.css';

export default function OtpPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLIonInputElement | null)[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  // Get the user data (email) passed from the login page
  const user = history.location.state?.user;

  useEffect(() => {
    if (!user) {
      history.push("/login"); // Redirect to login if no user data is available
    }
  }, [user, history]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const otpCode = otp.join('');
      // Send OTP code and email to the backend for verification
      const response = await axios.post('/api/auth/verify-otp', { email: user.email, otp: otpCode });

      if (response.data.message === 'OTP verified successfully!') {
        console.log("OTP verified successfully!", response.data);
        localStorage.setItem('token', response.data.token); // Store the token if required
        history.push('/accueil'); // Redirect to the homepage after successful OTP verification
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred during OTP verification.");
      }
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
              <IonImg src="../amen_logo.png" alt="Logo" className="logo-otp-desktop" />
            </div>
            <div className="form-container">
              <h1 className="title">Bienvenu</h1>
              <p className="subtitle">Veuillez saisir le code OTP envoyé à votre email</p>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <IonLabel className="input-label">OTP</IonLabel>
                  <div className="otp-inputs">
                    {otp.map((_, index) => (
                      <IonInput
                        key={index}
                        type="text"
                        maxlength={1}
                        value={otp[index]}
                        onIonInput={(e) => handleOtpChange(index, e.detail.value!)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="otp-input"
                        ref={(ref) => inputRefs.current[index] = ref}
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
