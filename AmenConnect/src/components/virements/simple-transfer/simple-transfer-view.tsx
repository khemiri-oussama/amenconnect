import type React from "react"
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
} from "@ionic/react"
import { arrowForward, calendarOutline } from "ionicons/icons"
import type { Beneficiary } from "./../types/beneficiary"
import type { Account } from "./../types/accounts"

export interface SimpleTransferViewProps {
  activeTab: string
  onTabChange: (tab: string) => void
  beneficiaries: Beneficiary[]
  transfer: {
    beneficiaryId: string
    accountFrom: string
    amount: string
    reason: string
    date: string
    frequency: string
    endDate: string
  }
  accounts: Account[]
  onTransferChange: (field: string, value: string) => void
  onSubmit: () => void
  onSchedule: () => void
  onCancel: () => void
}

const SimpleTransferView: React.FC<SimpleTransferViewProps> = ({
  activeTab,
  onTabChange,
  beneficiaries,
  transfer,
  accounts,
  onTransferChange,
  onSubmit,
  onSchedule,
  onCancel,
}) => {
  return (
    <div className="transfer-container">
      <IonCard className="transfer-card">
        <IonCardHeader>
          <IonCardTitle>Virement Simple</IonCardTitle>
          <IonCardSubtitle>Transfert rapide entre vos comptes ou vers un bénéficiaire</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="transfer-tabs">
            <IonChip color={activeTab === "quick" ? "primary" : "medium"} onClick={() => onTabChange("quick")}>
              <IonIcon icon={arrowForward} />
              Virement Rapide
            </IonChip>
            <IonChip color={activeTab === "scheduled" ? "primary" : "medium"} onClick={() => onTabChange("scheduled")}>
              <IonIcon icon={calendarOutline} />
              Virement Programmé
            </IonChip>
          </div>

          <div className="transfer-form-container">
            <form
              className="transfer-form"
              onSubmit={(e) => {
                e.preventDefault()
                if (activeTab === "scheduled") {
                  onSchedule()
                } else {
                  onSubmit()
                }
              }}
            >
              <IonItem>
                <IonLabel position="floating">Compte source</IonLabel>
                <IonSelect
                  value={transfer.accountFrom}
                  onIonChange={(e) => onTransferChange("accountFrom", e.detail.value)}
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
                  value={transfer.beneficiaryId}
                  onIonChange={(e) => onTransferChange("beneficiaryId", e.detail.value)}
                >
                  {beneficiaries.map((ben) => (
                    <IonSelectOption key={ben.id} value={ben.id}>
                      {ben.name} - {ben.accountNumber}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Montant (DT)</IonLabel>
                <IonInput
                  type="number"
                  placeholder="0.00"
                  value={transfer.amount}
                  onIonChange={(e) => onTransferChange("amount", e.detail.value)}
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Motif du virement</IonLabel>
                <IonInput
                  type="text"
                  placeholder="Ex: Paiement facture"
                  value={transfer.reason}
                  onIonChange={(e) => onTransferChange("reason", e.detail.value)}
                />
              </IonItem>

              {activeTab === "scheduled" && (
                <>
                  <IonItem>
                    <IonLabel position="floating">Date d'exécution</IonLabel>
                    <IonInput
                      type="date"
                      value={transfer.date.substring(0, 10)}
                      onIonChange={(e) => onTransferChange("date", e.detail.value)}
                      min={new Date().toISOString().substring(0, 10)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Fréquence</IonLabel>
                    <IonSelect
                      value={transfer.frequency}
                      onIonChange={(e) => onTransferChange("frequency", e.detail.value)}
                    >
                      <IonSelectOption value="unique">Unique</IonSelectOption>
                      <IonSelectOption value="mensuel">Mensuel</IonSelectOption>
                      {/* Add other frequencies as needed */}
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Date de fin</IonLabel>
                    <IonInput
                      type="date"
                      value={transfer.endDate}
                      onIonChange={(e) => onTransferChange("endDate", e.detail.value)}
                      min={new Date().toISOString().substring(0, 10)}
                    />
                  </IonItem>
                </>
              )}

              <div className="transfer-actions">
                <IonButton type="button" fill="outline" onClick={onCancel}>
                  Annuler
                </IonButton>
                <IonButton type="submit" expand="block">
                  {activeTab === "scheduled" ? "Planifier le Virement" : "Effectuer le Virement"}
                  <IonIcon slot="end" icon={arrowForward} />
                </IonButton>
              </div>
            </form>
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  )
}

export default SimpleTransferView

