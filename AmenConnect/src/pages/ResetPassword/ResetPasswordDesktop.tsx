import type React from "react";
import { IonContent, IonPage, IonInput, IonButton, IonText, IonLabel, IonImg } from "@ionic/react";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import "./ResetPasswordDesktop.css";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const history = useHistory();
  const location = useLocation();

  // Extract token from query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!token) {
      setErrorMessage("Token manquant.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/password/reset-password", { token, newPassword });
      setSuccessMessage(response.data.message || "Votre mot de passe a été réinitialisé avec succès.");
    } catch (error: any) {
      console.error("Reset Password Error:", error);
      setErrorMessage(error.response?.data?.message || "Erreur inattendue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding reset-password-container" fullscreen>
        <div className="content-wrapper-reset">
          <div className="reset-password-box">
            <div className="logo-container-reset-desktop">
              <IonImg src="../amen_logo.png" alt="Logo" className="logo-reset-desktop" />
            </div>
            <div className="form-container-reset">
              <h1 className="title-reset-desktop">Réinitialiser le mot de passe</h1>
              <p className="subtitle-reset">Entrez votre nouveau mot de passe</p>

              <form onSubmit={handleResetPassword} className="reset-password-form">
                <div className="input-group-reset">
                  <IonLabel className="input-label-reset">Nouveau mot de passe</IonLabel>
                  <IonInput
                    type="password"
                    value={newPassword}
                    onIonChange={(e) => setNewPassword(e.detail.value!)}
                    className="custom-input-reset"
                    required
                  />
                </div>

                <div className="input-group-reset">
                  <IonLabel className="input-label-reset">Confirmer le mot de passe</IonLabel>
                  <IonInput
                    type="password"
                    value={confirmPassword}
                    onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                    className="custom-input-reset"
                    required
                  />
                </div>

                {errorMessage && (
                  <IonText color="danger" className="error-message-reset">
                    {errorMessage}
                  </IonText>
                )}

                {successMessage && (
                  <IonText color="success" className="success-message-reset">
                    {successMessage}
                  </IonText>
                )}

                <IonButton expand="block" type="submit" className="reset-password-button" disabled={isLoading}>
                  {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
                </IonButton>

                <IonText className="back-to-login-reset" onClick={() => history.push("/login")}>
                  <a style={{ cursor: "pointer" }}>Retour à la connexion</a>
                </IonText>
              </form>
            </div>
          </div>
        </div>
        <div className="blurry-div-reset"></div>
      </IonContent>
    </IonPage>
  );
}
