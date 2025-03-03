import type React from "react"
import { IonIcon, IonButton } from "@ionic/react"
import { repeatOutline, createOutline, trashOutline } from "ionicons/icons"
import type { ScheduledTransfer } from "../types/transfer"

interface ScheduledTransferItemProps {
  transfer: ScheduledTransfer
  onEdit: (id: string) => void
  onCancel: (id: string) => void
}

const ScheduledTransferItem: React.FC<ScheduledTransferItemProps> = ({ transfer, onEdit, onCancel }) => {
  return (
    <div className="scheduled-transfer-item">
      <div className="transfer-icon">
        <IonIcon icon={repeatOutline} />
        <div className="frequency-badge">{transfer.frequency}</div>
      </div>

      <div className="transfer-details">
        <h4>{transfer.beneficiaryName}</h4>
        <div className="transfer-info">
          <span>{transfer.amount.toFixed(2)} DT</span>
          <span className="separator">•</span>
          <span>Prochaine date: {new Date(transfer.nextDate).toLocaleDateString()}</span>
          {transfer.endDate && (
            <>
              <span className="separator">•</span>
              <span>Fin: {new Date(transfer.endDate).toLocaleDateString()}</span>
            </>
          )}
        </div>
        <div className="transfer-reason">{transfer.reason}</div>
      </div>

      <div className="transfer-actions">
        <IonButton fill="clear" size="small" onClick={() => onEdit(transfer.id)}>
          <IonIcon icon={createOutline} />
        </IonButton>
        <IonButton fill="clear" size="small" color="danger" onClick={() => onCancel(transfer.id)}>
          <IonIcon icon={trashOutline} />
        </IonButton>
      </div>
    </div>
  )
}

export default ScheduledTransferItem

