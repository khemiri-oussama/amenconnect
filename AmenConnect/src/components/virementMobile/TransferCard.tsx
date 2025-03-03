import type React from "react"
import { IonCard, IonCardContent, IonIcon, IonButton } from "@ionic/react"
import { calendarOutline, timeOutline, trashOutline } from "ionicons/icons"
import type { ScheduledTransfer } from "../types/transfers"

interface TransferCardProps {
  transfer: ScheduledTransfer
  onDelete: () => void
}

const TransferCard: React.FC<TransferCardProps> = ({ transfer, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR")
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case "once":
        return "Unique"
      case "weekly":
        return "Hebdomadaire"
      case "monthly":
        return "Mensuel"
      case "quarterly":
        return "Trimestriel"
      case "yearly":
        return "Annuel"
      default:
        return ""
    }
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
    <IonCard className="scheduled-transfer-card">
      <IonCardContent>
        <div className="transfer-header">
          <h3>{transfer.beneficiaryName}</h3>
          <div className="transfer-actions">
            <IonButton fill="clear" size="small" color="danger" onClick={onDelete}>
              <IonIcon slot="icon-only" icon={trashOutline} />
            </IonButton>
          </div>
        </div>

        <p className="transfer-iban">{transfer.toAccount}</p>

        <div className="transfer-details">
          <div>
            <p className="label">Montant</p>
            <p className="value">{transfer.amount.toLocaleString("fr-FR")}€</p>
          </div>
          <div>
            <p className="label">Fréquence</p>
            <p className="value">{getFrequencyText(transfer.frequency)}</p>
          </div>
        </div>

        <div className="transfer-details">
          <div className="transfer-date">
            <IonIcon icon={calendarOutline} />
            <span>{formatDate(transfer.nextDate)}</span>
          </div>

          <span className={`status-badge ${getStatusBadgeClass(transfer.status)}`}>
            {getStatusText(transfer.status)}
          </span>
        </div>

        {transfer.reference && <p className="transfer-reference">Référence: {transfer.reference}</p>}

        {transfer.frequency !== "once" && (
          <div className="recurring-details">
            {transfer.remainingOccurrences && (
              <div className="recurring-item">
                <IonIcon icon={timeOutline} />
                <span>
                  {transfer.remainingOccurrences} exécution{transfer.remainingOccurrences > 1 ? "s" : ""} restante
                  {transfer.remainingOccurrences > 1 ? "s" : ""}
                </span>
              </div>
            )}

            {transfer.endDate && (
              <div className="recurring-item">
                <IonIcon icon={calendarOutline} />
                <span>Jusqu'au {formatDate(transfer.endDate)}</span>
              </div>
            )}
          </div>
        )}
      </IonCardContent>
    </IonCard>
  )
}

export default TransferCard

