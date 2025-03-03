import type React from "react"
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonButton } from "@ionic/react"
import { calendarOutline, addCircleOutline } from "ionicons/icons"
import ScheduledTransferItem from "./scheduled-transfer-item"
import type { ScheduledTransfer } from "../types/transfer"

interface ScheduledTransfersViewProps {
  scheduledTransfers: ScheduledTransfer[]
  onNewScheduled: () => void
  onEditScheduled: (id: string) => void
  onCancelScheduled: (id: string) => void
}

const ScheduledTransfersView: React.FC<ScheduledTransfersViewProps> = ({
  scheduledTransfers,
  onNewScheduled,
  onEditScheduled,
  onCancelScheduled,
}) => {
  return (
    <div className="transfer-container">
      <IonCard className="transfer-card">
        <IonCardHeader>
          <IonCardTitle>Virements Programmés</IonCardTitle>
          <IonCardSubtitle>Gérez vos virements récurrents et programmés</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          {scheduledTransfers.length > 0 ? (
            <div className="scheduled-transfers-list">
              {scheduledTransfers.map((transfer) => (
                <ScheduledTransferItem
                  key={transfer.id}
                  transfer={transfer}
                  onEdit={onEditScheduled}
                  onCancel={onCancelScheduled}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <IonIcon icon={calendarOutline} className="empty-icon" />
              <h4>Aucun virement programmé</h4>
              <p>Vous n'avez pas encore programmé de virements récurrents</p>
              <IonButton onClick={onNewScheduled}>
                <IonIcon icon={addCircleOutline} slot="start" />
                Programmer un virement
              </IonButton>
            </div>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  )
}

export default ScheduledTransfersView

