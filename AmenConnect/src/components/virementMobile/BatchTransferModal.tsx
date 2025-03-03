"use client"

import type React from "react"
import { useState } from "react"
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react"
import { closeOutline, trashOutline, addOutline } from "ionicons/icons"

interface BatchTransferModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (transfer: any) => void
  myAccounts: any[]
  beneficiaries: any[]
}

const BatchTransferModal: React.FC<BatchTransferModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  myAccounts,
  beneficiaries,
}) => {
  const [batchTransfer, setBatchTransfer] = useState({
    fromAccount: "",
    transferDate: new Date().toISOString(),
    beneficiaries: [{ beneficiary: "", amount: "", reference: "" }],
  })

  const addBeneficiary = () => {
    setBatchTransfer({
      ...batchTransfer,
      beneficiaries: [...batchTransfer.beneficiaries, { beneficiary: "", amount: "", reference: "" }],
    })
  }

  const removeBeneficiary = (index: number) => {
    const newBeneficiaries = [...batchTransfer.beneficiaries]
    newBeneficiaries.splice(index, 1)
    setBatchTransfer({
      ...batchTransfer,
      beneficiaries: newBeneficiaries,
    })
  }

  const updateBeneficiary = (index: number, field: string, value: string) => {
    const newBeneficiaries = [...batchTransfer.beneficiaries]
    newBeneficiaries[index] = {
      ...newBeneficiaries[index],
      [field]: value,
    }
    setBatchTransfer({
      ...batchTransfer,
      beneficiaries: newBeneficiaries,
    })
  }

  const calculateBatchTotal = () => {
    return batchTransfer.beneficiaries.reduce((sum, b) => {
      return sum + (Number.parseFloat(b.amount) || 0)
    }, 0)
  }

  const handleSubmit = () => {
    onSubmit(batchTransfer)
    setBatchTransfer({
      fromAccount: "",
      transferDate: new Date().toISOString(),
      beneficiaries: [{ beneficiary: "", amount: "", reference: "" }],
    })
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
          <IonTitle>Virement Groupé</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Compte à débiter</IonLabel>
            <IonSelect
              value={batchTransfer.fromAccount}
              onIonChange={(e) => setBatchTransfer({ ...batchTransfer, fromAccount: e.detail.value })}
              placeholder="Sélectionnez un compte"
            >
              {myAccounts.map((account) => (
                <IonSelectOption key={account.id} value={account.id}>
                  {account.label} - {account.balance.toLocaleString("fr-FR")}€
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Date d'exécution</IonLabel>
            <IonDatetime
              displayFormat="DD/MM/YYYY"
              min={new Date().toISOString()}
              value={batchTransfer.transferDate}
              onIonChange={(e) =>
                setBatchTransfer({ ...batchTransfer, transferDate: e.detail.value || new Date().toISOString() })
              }
            />
          </IonItem>

          <IonItem lines="none">
            <IonLabel>
              <h2>Bénéficiaires</h2>
              <p>Total: {calculateBatchTotal().toLocaleString("fr-FR")}€</p>
            </IonLabel>
          </IonItem>
        </IonList>

        {batchTransfer.beneficiaries.map((benef, index) => (
          <IonCard key={index} className="beneficiary-card">
            <IonCardHeader>
              <IonCardTitle className="beneficiary-title">
                <span>Bénéficiaire {index + 1}</span>
                {batchTransfer.beneficiaries.length > 1 && (
                  <IonButton fill="clear" size="small" color="danger" onClick={() => removeBeneficiary(index)}>
                    <IonIcon slot="icon-only" icon={trashOutline} />
                  </IonButton>
                )}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel position="stacked">Bénéficiaire</IonLabel>
                  <IonSelect
                    value={benef.beneficiary}
                    onIonChange={(e) => updateBeneficiary(index, "beneficiary", e.detail.value)}
                    placeholder="Sélectionnez un bénéficiaire"
                  >
                    {beneficiaries.map((b) => (
                      <IonSelectOption key={b.id} value={b.id}>
                        {b.name} - {b.iban}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Montant (€)</IonLabel>
                  <IonInput
                    type="number"
                    value={benef.amount}
                    onIonChange={(e) => updateBeneficiary(index, "amount", e.detail.value || "")}
                    placeholder="0.00"
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Référence (optionnel)</IonLabel>
                  <IonInput
                    value={benef.reference}
                    onIonChange={(e) => updateBeneficiary(index, "reference", e.detail.value || "")}
                    placeholder="Ex: Facture #123"
                  />
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        ))}

        <div className="ion-padding">
          <IonButton expand="block" fill="outline" onClick={addBeneficiary}>
            <IonIcon slot="start" icon={addOutline} />
            Ajouter un bénéficiaire
          </IonButton>

          <IonButton expand="block" className="ion-margin-top" onClick={handleSubmit}>
            Valider les virements
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  )
}

export default BatchTransferModal

