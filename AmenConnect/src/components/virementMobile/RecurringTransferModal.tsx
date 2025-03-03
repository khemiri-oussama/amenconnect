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
} from "@ionic/react"
import { closeOutline } from "ionicons/icons"

interface RecurringTransferModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (transfer: any) => void
  myAccounts: any[]
  beneficiaries: any[]
}

const RecurringTransferModal: React.FC<RecurringTransferModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  myAccounts,
  beneficiaries,
}) => {
  const [recurringTransfer, setRecurringTransfer] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    reference: "",
    frequency: "monthly",
    startDate: new Date().toISOString(),
    endType: "noEnd",
    occurrences: "12",
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
  })

  const handleSubmit = () => {
    onSubmit(recurringTransfer)
    setRecurringTransfer({
      fromAccount: "",
      toAccount: "",
      amount: "",
      reference: "",
      frequency: "monthly",
      startDate: new Date().toISOString(),
      endType: "noEnd",
      occurrences: "12",
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
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
          <IonTitle>Virement Récurrent</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Compte à débiter</IonLabel>
            <IonSelect
              value={recurringTransfer.fromAccount}
              onIonChange={(e) => setRecurringTransfer({ ...recurringTransfer, fromAccount: e.detail.value })}
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
            <IonLabel position="stacked">Bénéficiaire</IonLabel>
            <IonSelect
              value={recurringTransfer.toAccount}
              onIonChange={(e) => setRecurringTransfer({ ...recurringTransfer, toAccount: e.detail.value })}
              placeholder="Sélectionnez un bénéficiaire"
            >
              {beneficiaries.map((benef) => (
                <IonSelectOption key={benef.id} value={benef.id}>
                  {benef.name} - {benef.iban}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Montant (€)</IonLabel>
            <IonInput
              type="number"
              value={recurringTransfer.amount}
              onIonChange={(e) => setRecurringTransfer({ ...recurringTransfer, amount: e.detail.value || "" })}
              placeholder="0.00"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Référence (optionnel)</IonLabel>
            <IonInput
              value={recurringTransfer.reference}
              onIonChange={(e) => setRecurringTransfer({ ...recurringTransfer, reference: e.detail.value || "" })}
              placeholder="Ex: Loyer"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Fréquence</IonLabel>
            <IonSelect
              value={recurringTransfer.frequency}
              onIonChange={(e) => setRecurringTransfer({ ...recurringTransfer, frequency: e.detail.value })}
            >
              <IonSelectOption value="weekly">Hebdomadaire</IonSelectOption>
              <IonSelectOption value="monthly">Mensuelle</IonSelectOption>
              <IonSelectOption value="quarterly">Trimestrielle</IonSelectOption>
              <IonSelectOption value="yearly">Annuelle</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Date de début</IonLabel>
            <IonDatetime
              displayFormat="DD/MM/YYYY"
              min={new Date().toISOString()}
              value={recurringTransfer.startDate}
              onIonChange={(e) =>
                setRecurringTransfer({ ...recurringTransfer, startDate: e.detail.value || new Date().toISOString() })
              }
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Fin du virement récurrent</IonLabel>
            <IonSelect
              value={recurringTransfer.endType}
              onIonChange={(e) => setRecurringTransfer({ ...recurringTransfer, endType: e.detail.value })}
            >
              <IonSelectOption value="occurrences">Après un nombre d'occurrences</IonSelectOption>
              <IonSelectOption value="endDate">À une date spécifique</IonSelectOption>
              <IonSelectOption value="noEnd">Sans date de fin</IonSelectOption>
            </IonSelect>
          </IonItem>

          {recurringTransfer.endType === "occurrences" && (
            <IonItem>
              <IonLabel position="stacked">Nombre d'occurrences</IonLabel>
              <IonInput
                type="number"
                min="1"
                value={recurringTransfer.occurrences}
                onIonChange={(e) => setRecurringTransfer({ ...recurringTransfer, occurrences: e.detail.value || "12" })}
              />
            </IonItem>
          )}

          {recurringTransfer.endType === "endDate" && (
            <IonItem>
              <IonLabel position="stacked">Date de fin</IonLabel>
              <IonDatetime
                displayFormat="DD/MM/YYYY"
                min={new Date().toISOString()}
                value={recurringTransfer.endDate}
                onIonChange={(e) =>
                  setRecurringTransfer({
                    ...recurringTransfer,
                    endDate:
                      e.detail.value || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                  })
                }
              />
            </IonItem>
          )}
        </IonList>

        <div className="ion-padding">
          <IonButton expand="block" onClick={handleSubmit}>
            Programmer le virement récurrent
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  )
}

export default RecurringTransferModal

