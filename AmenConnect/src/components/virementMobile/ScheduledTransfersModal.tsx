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
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
} from "@ionic/react"
import { closeOutline } from "ionicons/icons"
import TransferCard from "./TransferCard"
import EmptyState from "./EmptyState"
import type { ScheduledTransfer } from "../types/transfers"

interface ScheduledTransfersModalProps {
  isOpen: boolean
  onClose: () => void
  transfers: ScheduledTransfer[]
  onDelete: (transfer: ScheduledTransfer) => void
}

const ScheduledTransfersModal: React.FC<ScheduledTransfersModalProps> = ({ isOpen, onClose, transfers, onDelete }) => {
  const [activeView, setActiveView] = useState<string>("all")

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Virements Programmés</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSegment onIonChange={(e) => setActiveView(e.detail.value || "all")}>
          <IonSegmentButton value="all">
            <IonLabel>Tous</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="recurring">
            <IonLabel>Récurrents</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="one-time">
            <IonLabel>Ponctuels</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <div className="transfers-list ion-margin-top">
          {transfers
            .filter((t) => {
              if (activeView === "all") return true
              if (activeView === "recurring") return t.frequency !== "once"
              if (activeView === "one-time") return t.frequency === "once"
              return true
            })
            .map((transfer) => (
              <TransferCard key={transfer.id} transfer={transfer} onDelete={() => onDelete(transfer)} />
            ))}

          {transfers.filter((t) => {
            if (activeView === "all") return true
            if (activeView === "recurring") return t.frequency !== "once"
            if (activeView === "one-time") return t.frequency === "once"
            return true
          }).length === 0 && <EmptyState message="Aucun virement programmé" />}
        </div>
      </IonContent>
    </IonModal>
  )
}

export default ScheduledTransfersModal

