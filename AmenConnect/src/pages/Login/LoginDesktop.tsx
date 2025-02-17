import { IonContent, IonPage, IonInput, IonButton, IonText, IonLabel, IonImg } from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useAuth, User } from "../../AuthContext"; // Import the useAuth hook
import "./LoginDesktop.css";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setPendingUser } = useAuth();
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const user: User = response.data.user;

      if (!user) throw new Error("Aucune donnée utilisateur reçue.");

      sessionStorage.setItem("user", JSON.stringify(user)); // Use sessionStorage
      setPendingUser(user);

      history.replace("/otp");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Erreur inattendue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding login-container" fullscreen>
        <div className="content-wrapper">
          <div className="login-box">
            <div className="logo-container-accueil-desktop">
              <IonImg src="../amen_logo.png" alt="Logo" className="logo-accueil-desktop" />
            </div>
            <div className="form-container">
              <h1 className="title-accueil-desktop">Bienvenu</h1>
              <p className="subtitle">Veuillez saisir les détails de votre compte</p>

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

                <IonText className="forgot-password">
                  <a href="/forgot-password">Mot De Passe oublier ?</a>
                </IonText>

                <IonButton expand="block" type="submit" className="login-button" disabled={isLoading}>
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
