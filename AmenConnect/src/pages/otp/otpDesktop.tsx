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
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import './otpDesktop.css';

interface User {
  email: string;
}

export default function OtpPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLIonInputElement | null)[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);  // 👈 Stocke l'utilisateur ici
  const history = useHistory();
  const location = useLocation<{ user?: User }>();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
  
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (location.state?.user) {
      setUser(location.state.user);
      localStorage.setItem("user", JSON.stringify(location.state.user));
    } else {
      history.replace("/login"); // Redirect to login instead of accueil
    }
  }, [location.state, history]);
  

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d{6}$/.test(value)) {
      const newOtp = value.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.setFocus();
    } else if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1]?.setFocus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.setFocus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData("Text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.setFocus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
  
    try {
      const otpCode = otp.join('');
      const response = await axios.post('/api/auth/verify-otp', { 
        email: user!.email, 
        otp: otpCode 
      });
  
      if (response.data.message === 'OTP verified successfully!') {
        console.log("✅ OTP validé ! Redirection en cours...");
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAuthenticated', "true");  // Save auth state
        setIsAuthenticated(true);
        history.replace('/accueil'); // Ensure this is correctly called
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
      }
      
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setErrorMessage(error.response?.data?.message || "An error occurred during OTP verification.");
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