import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonToggle,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonModal,
  IonInput,
} from "@ionic/react";
import {
  lockClosedOutline,
  fingerPrintOutline,
  notificationsOutline,
  eyeOutline,
  eyeOffOutline,
  saveOutline,
} from "ionicons/icons";
import "./SecuritySettingsMobile.css";
import NavMobile from "../../../../components/NavMobile";

const SecuritySettingsMobile: React.FC = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    biometricLogin: false,
    loginNotifications: true,
    hideBalance: false,
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleToggle = (setting: keyof typeof securitySettings) => {
    setSecuritySettings((prevState) => ({ ...prevState, [setting]: !prevState[setting] }));
  };

  const handlePasswordChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSavePassword = () => {
    
    setIsChangingPassword(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle>Paramètres de sécurité</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="security-settings-content">
        <IonList className="security-settings-list">
          <IonItem>
            <IonIcon icon={lockClosedOutline} slot="start" />
            <IonLabel>Authentification à deux facteurs</IonLabel>
            <IonToggle checked={securitySettings.twoFactor} onIonChange={() => handleToggle("twoFactor")} />
          </IonItem>
          <IonItem>
            <IonIcon icon={fingerPrintOutline} slot="start" />
            <IonLabel>Connexion biométrique</IonLabel>
            <IonToggle checked={securitySettings.biometricLogin} onIonChange={() => handleToggle("biometricLogin")} />
          </IonItem>
          <IonItem>
            <IonIcon icon={notificationsOutline} slot="start" />
            <IonLabel>Notifications de connexion</IonLabel>
            <IonToggle checked={securitySettings.loginNotifications} onIonChange={() => handleToggle("loginNotifications")} />
          </IonItem>
          <IonItem>
            <IonIcon icon={securitySettings.hideBalance ? eyeOffOutline : eyeOutline} slot="start" />
            <IonLabel>Masquer le solde</IonLabel>
            <IonToggle checked={securitySettings.hideBalance} onIonChange={() => handleToggle("hideBalance")} />
          </IonItem>
        </IonList>

        <div className="change-password-container">
          <IonButton expand="block" onClick={() => setIsChangingPassword(true)}>
            Changer le mot de passe
          </IonButton>
        </div>

        <IonModal isOpen={isChangingPassword} onDidDismiss={() => setIsChangingPassword(false)}>
          <IonContent className="change-password-modal">
            <h2>Changer le mot de passe</h2>
            <IonList>
              <IonItem>
                <IonLabel position="floating">Mot de passe actuel</IonLabel>
                <IonInput
                  type="password"
                  value={passwordForm.currentPassword}
                  onIonInput={(e) => handlePasswordChange("currentPassword", e.detail.value || "")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Nouveau mot de passe</IonLabel>
                <IonInput
                  type="password"
                  value={passwordForm.newPassword}
                  onIonInput={(e) => handlePasswordChange("newPassword", e.detail.value || "")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Confirmer le nouveau mot de passe</IonLabel>
                <IonInput
                  type="password"
                  value={passwordForm.confirmPassword}
                  onIonInput={(e) => handlePasswordChange("confirmPassword", e.detail.value || "")}
                />
              </IonItem>
            </IonList>
            <IonButton expand="block" onClick={handleSavePassword}>
              <IonIcon icon={saveOutline} slot="start" />
              Enregistrer le nouveau mot de passe
            </IonButton>
            <IonButton expand="block" fill="clear" onClick={() => setIsChangingPassword(false)}>
              Annuler
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
      <NavMobile currentPage="security-settings" />
    </IonPage>
  );
};

export default SecuritySettingsMobile;
