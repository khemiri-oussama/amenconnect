import type React from "react"
import { IonButton, IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput } from "@ionic/react"
import { addCircleOutline, closeCircleOutline, checkmarkCircleOutline } from "ionicons/icons"
import type { Beneficiary } from "../types/beneficiary"

interface BatchTransfer {
  beneficiaryId: string
  amount: string
  reason: string
}

interface ManualBatchProps {
  batchTransfers: BatchTransfer[]
  beneficiaries: Beneficiary[]
  onAddRow: () => void
  onRemoveRow: (index: number) => void
  onUpdateRow: (index: number, field: string, value: string) => void
  onSubmit: () => void
}

const ManualBatch: React.FC<ManualBatchProps> = ({
  batchTransfers,
  beneficiaries,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
  onSubmit,
}) => {
  return (
    <div className="manual-batch-container">
      <div className="batch-transfers-list">
        {batchTransfers.map((transfer, index) => (
          <div className="batch-transfer-item" key={index}>
            <div className="batch-transfer-header">
              <h4>Bénéficiaire #{index + 1}</h4>
              {index > 0 && (
                <IonButton fill="clear" color="danger" size="small" onClick={() => onRemoveRow(index)}>
                  <IonIcon icon={closeCircleOutline} />
                </IonButton>
              )}
            </div>
            <div className="batch-transfer-form">
              <IonItem>
                <IonLabel position="floating">Bénéficiaire</IonLabel>
                <IonSelect
                  value={transfer.beneficiaryId}
                  onIonChange={(e) => onUpdateRow(index, "beneficiaryId", e.detail.value)}
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
                  value={transfer.amount}
                  onIonChange={(e) => onUpdateRow(index, "amount", e.detail.value || "")}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Motif du virement</IonLabel>
                <IonInput
                  type="text"
                  placeholder="Ex: Paiement facture"
                  value={transfer.reason}
                  onIonChange={(e) => onUpdateRow(index, "reason", e.detail.value || "")}
                />
              </IonItem>
            </div>
          </div>
        ))}
      </div>

      <div className="batch-actions">
        <IonButton fill="outline" onClick={onAddRow}>
          <IonIcon icon={addCircleOutline} slot="start" />
          Ajouter un bénéficiaire
        </IonButton>

        <IonButton expand="block" onClick={onSubmit} disabled={batchTransfers.length === 0}>
          Confirmer les virements
          <IonIcon slot="end" icon={checkmarkCircleOutline} />
        </IonButton>
      </div>
    </div>
  )
}

export default ManualBatch

