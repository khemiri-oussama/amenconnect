//pages/Client/virement/beneficiary-transfer.tsx
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
import { personOutline, cardOutline, cashOutline, documentTextOutline, calendarOutline } from "ionicons/icons"
import { useHistory } from "react-router-dom"
import NavMobile from "../../../components/NavMobile"
import "./transfer-pages.css"

const BeneficiaryTransfer: React.FC = () => {
  const history = useHistory()
  const [amount, setAmount] = useState<string>("")
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>("")
  const [transferReason, setTransferReason] = useState<string>("")
  const [transferDate, setTransferDate] = useState<string>("")

  // Mock data
  const accounts = [
    { id: "1", name: "Compte Courant", balance: "12,450.30 MAD" },
    { id: "2", name: "Compte Épargne", balance: "33,280.75 MAD" },
  ]

  const beneficiaries = [
    { id: "1", name: "Sarah Martin", bank: "Banque Populaire" },
    { id: "2", name: "Mohammed Ali", bank: "CIH Bank" },
    { id: "3", name: "Jean Dupont", bank: "Société Générale" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle transfer logic here
    console.log({
      selectedAccount,
      selectedBeneficiary,
      amount,
      transferReason,
      transferDate,
    })

    history.push("/virement")
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border transparent-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/virements" text="" />
          </IonButtons>
          <IonTitle>Virement Bénéficiaire</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding dark-theme" style={{ "--padding-bottom": "100px" }}>
        <div className="transfer-form-container">
          <h1 className="form-title">Virement vers un bénéficiaire</h1>
          <p className="form-subtitle">Effectuez un virement rapide et sécurisé vers un de vos bénéficiaires</p>

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
                    placeholder="Sélectionner un compte"
                    value={selectedAccount}
                    onIonChange={(e) => setSelectedAccount(e.detail.value)}
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
                <IonIcon icon={personOutline} />
              </div>
              <h2 className="section-title">Bénéficiaire</h2>

              <IonList className="custom-list">
                <IonItem className="custom-item" lines="none">
                  <IonSelect
                    interface="action-sheet"
                    placeholder="Sélectionner un bénéficiaire"
                    value={selectedBeneficiary}
                    onIonChange={(e) => setSelectedBeneficiary(e.detail.value)}
                    className="beneficiary-select"
                  >
                    {beneficiaries.map((beneficiary) => (
                      <IonSelectOption key={beneficiary.id} value={beneficiary.id}>
                        <div className="beneficiary-option">
                          <span>{beneficiary.name}</span>
                          <span className="beneficiary-bank">{beneficiary.bank}</span>
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

          
            <div className="submit-button-container">
              <IonButton
                expand="block"
                onClick={handleSubmit}
                className="submit-button"
                disabled={!amount || !selectedAccount || !selectedBeneficiary}
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

export default BeneficiaryTransfer

