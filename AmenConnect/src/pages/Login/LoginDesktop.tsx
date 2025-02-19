// Login/loginDesktop.tsx
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonText,
  IonLabel,
  IonImg,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin"; // import the hook
import "./LoginDesktop.css";

export default function LoginDesktop() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { isLoading, errorMessage, login } = useLogin();
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding login-container" fullscreen>
        <div className="content-wrapper">
          <div className="login-box">
            <div className="logo-container-accueil-desktop">
              <IonImg
                src="../amen_logo.png"
                alt="Logo"
                className="logo-accueil-desktop"
              />
            </div>
            <div className="form-container">
              <h1 className="title-accueil-desktop">Bienvenu</h1>
              <p className="subtitle">
                Veuillez saisir les détails de votre compte
              </p>

              <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                  <IonLabel className="input-label">Identifiant</IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    className="custom-input"
                    required
                  />
                </div>

                <div className="input-group">
                  <IonLabel className="input-label">Mot De Passe</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    className="custom-input"
                    required
                  />
                </div>

                {errorMessage && (
                  <IonText color="danger" className="error-message">
                    {errorMessage}
                  </IonText>
                )}

                <IonText
                  className="forgot-password"
                  onClick={() => history.push("/forgotPassword")}
                >
                  <a style={{ cursor: "pointer" }}>Mot De Passe oublier ?</a>
                </IonText>

                <IonButton
                  expand="block"
                  type="submit"
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Chargement..." : "Se Connecter"}
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
