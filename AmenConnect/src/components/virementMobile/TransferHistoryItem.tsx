import type React from "react"
import { IonIcon, IonButton } from "@ionic/react"
import { calendarOutline, trashOutline } from "ionicons/icons"
import type { ScheduledTransfer } from "../types/transfers"

interface TransferHistoryItemProps {
  transfer: ScheduledTransfer
  onDelete?: () => void
}

const TransferHistoryItem: React.FC<TransferHistoryItemProps> = ({ transfer, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR")
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending"
      case "processing":
        return "status-processing"
      case "completed":
        return "status-completed"
      case "failed":
        return "status-failed"
      default:
        return ""
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "processing":
        return "En cours"
      case "completed":
        return "Effectué"
      case "failed":
        return "Échoué"
      default:
        return ""
    }
  }

  return (
    <div className="transfer-history-item">
      <div className="transfer-history-header">
        <h3>{transfer.beneficiaryName}</h3>
        <span className={`status-badge ${getStatusBadgeClass(transfer.status)}`}>{getStatusText(transfer.status)}</span>
      </div>
      <p className="transfer-amount">{transfer.amount.toLocaleString("fr-FR")}€</p>
      <p className="transfer-date">
        <IonIcon icon={calendarOutline} />
        {formatDate(transfer.nextDate)}
      </p>
      {transfer.reference && <p className="transfer-reference">{transfer.reference}</p>}
      {onDelete && (
        <div className="transfer-actions">
          <IonButton fill="clear" size="small" color="danger" onClick={onDelete}>
            <IonIcon slot="icon-only" icon={trashOutline} />
          </IonButton>
        </div>
      )}
    </div>
  )
}

export default TransferHistoryItem

