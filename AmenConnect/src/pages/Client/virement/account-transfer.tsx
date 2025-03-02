import type React from "react"
import { useState } from "react"
import {
  IonContent,
  IonPage,
  IonIcon,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonList,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonText,
} from "@ionic/react"
import { swapHorizontalOutline, cardOutline, cashOutline, documentTextOutline, calendarOutline } from "ionicons/icons"
import { useHistory } from "react-router-dom"
import NavMobile from "../../../components/NavMobile"
import "./transfer-pages.css"
import axios from "axios" 
import Compte from "../Compte/Compte"
const AccountTransfer: React.FC = () => {
  const history = useHistory()
  const [amount, setAmount] = useState<string>("")
  const [sourceAccount, setSourceAccount] = useState<string>("")
  const [targetAccount, setTargetAccount] = useState<string>("")
  const [transferReason, setTransferReason] = useState<string>("")
  const [transferDate, setTransferDate] = useState<string>("")

  // Mock data
  const accounts = [
    { id: "1", name: "Compte Courant", balance: "12,450.30 MAD" },
    { id: "2", name: "Compte Épargne", balance: "33,280.75 MAD" },
    { id: "3", name: "Compte Investissement", balance: "5,620.00 MAD" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!amount || !sourceAccount || !targetAccount) {
      alert("Veuillez remplir tous les champs requis.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3000/api/virements", {
        userId: "fdsfds,", // Replace with actual logged-in user ID
        sourceAccount,
        destinationAccount: targetAccount,
        amount: parseFloat(amount),
        currency: "TND", // Default currency
        transferType: "internal", // Assuming internal transfer
        reason: transferReason,
        transferDate: transferDate || new Date().toISOString(),
      });
  
      console.log("Virement successful:", response.data);
      alert("Virement effectué avec succès!");
  
      // Redirect user after success
      history.push("/virements");
    } catch (error) {
      console.error("Virement failed:", error);
      alert("Échec du virement. Veuillez réessayer.");
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border transparent-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/virements" text="" />
          </IonButtons>
          <IonTitle>Virement Entre Comptes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding dark-theme" style={{ "--padding-bottom": "100px" }}>
        <div className="transfer-form-container">
          <h1 className="form-title">Virement entre comptes</h1>
          <p className="form-subtitle">Transférez de l'argent entre vos comptes en quelques clics</p>

          <form onSubmit={handleSubmit} className="transfer-form">
            <div className="form-section">
              <div className="section-icon">
                <IonIcon icon={cardOutline} />
              </div>
              <h2 className="section-title">Compte à débiter</h2>

              <IonList className="custom-list">
                <IonItem className="custom-item" lines="none">
                  <IonSelect
                    interface="action-sheet"
                    placeholder="Sélectionner un compte source"
                    value={sourceAccount}
                    onIonChange={(e) => setSourceAccount(e.detail.value)}
                    className="account-select"
                  >
                    {accounts.map((account) => (
                      <IonSelectOption key={account.id} value={account.id}>
                        <div className="account-option">
                          <span>{account.name}</span>
                          <span className="account-balance">{account.balance}</span>
                        </div>
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonList>
            </div>

            <div className="form-section">
              <div className="section-icon">
                <IonIcon icon={swapHorizontalOutline} />
              </div>
              <h2 className="section-title">Compte à créditer</h2>

              <IonList className="custom-list">
                <IonItem className="custom-item" lines="none">
                  <IonSelect
                    interface="action-sheet"
                    placeholder="Sélectionner un compte destinataire"
                    value={targetAccount}
                    onIonChange={(e) => setTargetAccount(e.detail.value)}
                    className="account-select"
                    disabled={!sourceAccount}
                  >
                    {accounts
                      .filter((account) => account.id !== sourceAccount)
                      .map((account) => (
                        <IonSelectOption key={account.id} value={account.id}>
                          <div className="account-option">
                            <span>{account.name}</span>
                            <span className="account-balance">{account.balance}</span>
                          </div>
                        </IonSelectOption>
                      ))}
                  </IonSelect>
                </IonItem>
              </IonList>
            </div>

            <div className="form-section">
              <div className="section-icon">
                <IonIcon icon={cashOutline} />
              </div>
              <h2 className="section-title">Montant</h2>

              <IonList className="custom-list">
                <IonItem className="custom-item" lines="none">
                  <IonInput
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onIonChange={(e) => setAmount(e.detail.value!)}
                    className="amount-input"
                  />
                  <IonText className="currency">MAD</IonText>
                </IonItem>
              </IonList>
            </div>

            <div className="form-section">
              <div className="section-icon">
                <IonIcon icon={documentTextOutline} />
              </div>
              <h2 className="section-title">Motif</h2>

              <IonList className="custom-list">
                <IonItem className="custom-item" lines="none">
                  <IonInput
                    placeholder="Motif du virement"
                    value={transferReason}
                    onIonChange={(e) => setTransferReason(e.detail.value!)}
                    className="reason-input"
                  />
                </IonItem>
              </IonList>
            </div>

            <div className="form-section">
              <div className="section-icon">
                <IonIcon icon={calendarOutline} />
              </div>
              <h2 className="section-title">Date d'exécution</h2>

              <IonList className="custom-list">
                <IonItem className="custom-item" lines="none">
                  <IonInput
                    type="date"
                    value={transferDate}
                    onIonChange={(e) => setTransferDate(e.detail.value!)}
                    className="date-input"
                  />
                </IonItem>
              </IonList>
            </div>
            <div className="submit-button-container">
              <IonButton
                expand="block"
                onClick={handleSubmit}
                className="submit-button"
                disabled={!amount || !sourceAccount || !targetAccount}
              >
                Confirmer le virement
              </IonButton>
            </div>
          </form>
        </div>
      </IonContent>

      <NavMobile currentPage="virements" />
    </IonPage>
  )
}

const IonTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="ion-title">{children}</div>
}

export default AccountTransfer

