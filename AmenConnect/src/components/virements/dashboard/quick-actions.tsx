"use client"

import type React from "react"
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon } from "@ionic/react"
import { arrowForward, repeatOutline, cloudUploadOutline, calendarOutline } from "ionicons/icons"
import { motion } from "framer-motion"

interface QuickActionsProps {
  onNewTransfer: () => void
  onRecurringTransfer: () => void
  onCsvImport: () => void
  onScheduledTransfers: () => void
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onNewTransfer,
  onRecurringTransfer,
  onCsvImport,
  onScheduledTransfers,
}) => {
  return (
    <IonCard className="quick-actions">
      <IonCardHeader>
        <IonCardTitle>Actions Rapides</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div className="actions-grid">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IonButton fill="clear" className="action-button" onClick={onNewTransfer}>
              <IonIcon icon={arrowForward} slot="start" />
              Nouveau Virement
            </IonButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IonButton fill="clear" className="action-button" onClick={onRecurringTransfer}>
              <IonIcon icon={repeatOutline} slot="start" />
              Virement Permanent
            </IonButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IonButton fill="clear" className="action-button" onClick={onCsvImport}>
              <IonIcon icon={cloudUploadOutline} slot="start" />
              Import CSV
            </IonButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IonButton fill="clear" className="action-button" onClick={onScheduledTransfers}>
              <IonIcon icon={calendarOutline} slot="start" />
              Virements Programmés
            </IonButton>
          </motion.div>
        </div>
      </IonCardContent>
    </IonCard>
  )
}

export default QuickActions

