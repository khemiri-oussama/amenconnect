import type React from "react"
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
  IonIcon,
} from "@ionic/react"
import { arrowForward } from "ionicons/icons"
import type { Beneficiary } from "./../types/beneficiary"
import type { Account } from "./../types/accounts"

export interface QuickTransferFormProps {
  beneficiaries: Beneficiary[]
  selectedBeneficiaryId: string
  amount: string
  reason: string
  onBeneficiaryChange: (value: string) => void
  onAmountChange: (value: string) => void
  onReasonChange: (value: string) => void
  onSubmit: () => void
  accounts: Account[]
  selectedAccountId: string
  onAccountChange: (value: string) => void
}

const QuickTransferForm: React.FC<QuickTransferFormProps> = ({
  beneficiaries,
  selectedBeneficiaryId,
  amount,
  reason,
  onBeneficiaryChange,
  onAmountChange,
  onReasonChange,
  onSubmit,
  accounts,
  selectedAccountId,
  onAccountChange,
}) => {
  return (
    <IonCard className="quick-transfer">
      <IonCardHeader>
        <IonCardTitle>Virement Rapide</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <form
          className="quick-transfer-form"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
          <IonItem>
            <IonLabel position="floating">Compte source</IonLabel>
            <IonSelect
              interface="popover"
              value={selectedAccountId}
              onIonChange={(e) => onAccountChange(e.detail.value)}
            >
              {accounts.map((account) => (
                <IonSelectOption key={account.id} value={account.value}>
                  {account.label} ({account.balance.toLocaleString("fr-FR")} DT)
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Bénéficiaire</IonLabel>
            <IonSelect
              interface="popover"
              value={selectedBeneficiaryId}
              onIonChange={(e) => onBeneficiaryChange(e.detail.value)}
            >
              {beneficiaries.map((ben) => (
                <IonSelectOption key={ben.id} value={ben.id}>
                  {ben.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Montant (DT)</IonLabel>
            <IonInput
              type="number"
              placeholder="0.00"
              value={amount}
              onIonChange={(e) => onAmountChange(e.detail.value || "")}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Motif du virement</IonLabel>
            <IonInput
              type="text"
              placeholder="Ex: Paiement facture"
              value={reason}
              onIonChange={(e) => onReasonChange(e.detail.value || "")}
            />
          </IonItem>

          <IonButton expand="block" className="transfer-button" type="submit">
            Effectuer le Virement
            <IonIcon icon={arrowForward} slot="end" />
          </IonButton>
        </form>
      </IonCardContent>
    </IonCard>
  )
}

export default QuickTransferForm

