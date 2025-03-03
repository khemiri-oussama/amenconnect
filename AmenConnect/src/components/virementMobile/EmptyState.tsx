import type React from "react"
import { IonIcon } from "@ionic/react"
import { alertCircleOutline } from "ionicons/icons"

interface EmptyStateProps {
  message: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="empty-state">
      <IonIcon icon={alertCircleOutline} />
      <p>{message}</p>
      <p className="empty-state-subtitle">Utilisez les options de virement pour créer de nouveaux virements.</p>
    </div>
  )
}

export default EmptyState

