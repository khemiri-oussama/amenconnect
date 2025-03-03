"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonDatetime,
  IonIcon,
} from "@ionic/react"
import { closeOutline } from "ionicons/icons"
import "./SimpleTransferModal.css" // Add this import for custom styles

interface SimpleTransferModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (transfer: any) => void
  myAccounts: any[]
  beneficiaries: any[]
}

const SimpleTransferModal: React.FC<SimpleTransferModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  myAccounts,
  beneficiaries,
}) => {
  const [simpleTransfer, setSimpleTransfer] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    reference: "",
    transferDate: new Date().toISOString(),
  })

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSimpleTransfer({
        fromAccount: "",
        toAccount: "",
        amount: "",
        reference: "",
        transferDate: new Date().toISOString(),
      })
    }
  }, [isOpen])

  const handleSubmit = () => {
    onSubmit(simpleTransfer)
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Virement Simple</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Compte à débiter</IonLabel>
            <IonSelect
              value={simpleTransfer.fromAccount}
              onIonChange={(e) =>
                setSimpleTransfer({
                  ...simpleTransfer,
                  fromAccount: e.detail.value,
                })
              }
              placeholder="Sélectionnez un compte"
              className="custom-select"
              interface="popover"
            >
              {myAccounts.map((account) => (
                <IonSelectOption key={account.id} value={account.id}>
                  {account.label} - {account.balance.toLocaleString("fr-FR")} TND
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Bénéficiaire</IonLabel>
            <IonSelect
              value={simpleTransfer.toAccount}
              onIonChange={(e) =>
                setSimpleTransfer({
                  ...simpleTransfer,
                  toAccount: e.detail.value,
                })
              }
              placeholder="Sélectionnez un bénéficiaire"
              className="custom-select"
              interface="popover"
            >
              {beneficiaries.map((benef) => (
                <IonSelectOption key={benef.id} value={benef.id}>
                  {benef.name} - {benef.iban}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Montant (TND)</IonLabel>
            <IonInput
              type="number"
              value={simpleTransfer.amount}
              onIonChange={(e) =>
                setSimpleTransfer({
                  ...simpleTransfer,
                  amount: e.detail.value || "",
                })
              }
              placeholder="0.00"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Référence (optionnel)</IonLabel>
            <IonInput
              value={simpleTransfer.reference}
              onIonChange={(e) =>
                setSimpleTransfer({
                  ...simpleTransfer,
                  reference: e.detail.value || "",
                })
              }
              placeholder="Ex: Remboursement dîner"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Date d'exécution</IonLabel>
            <IonDatetime
              displayFormat="DD/MM/YYYY"
              min={new Date().toISOString()}
              value={simpleTransfer.transferDate}
              onIonChange={(e) =>
                setSimpleTransfer({
                  ...simpleTransfer,
                  transferDate: e.detail.value || new Date().toISOString(),
                })
              }
              className="custom-datetime"
              presentation="date"
            />
          </IonItem>
        </IonList>

        <div className="ion-padding">
          <IonButton expand="block" onClick={handleSubmit}>
            Valider le virement
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  )
}

export default SimpleTransferModal

