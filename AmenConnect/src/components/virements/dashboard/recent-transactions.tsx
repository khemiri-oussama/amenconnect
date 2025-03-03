"use client"

import type React from "react"
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonAvatar,
} from "@ionic/react"
import { chevronForward, checkmarkCircleOutline, timeOutline, warningOutline } from "ionicons/icons"
import { motion } from "framer-motion"
import type { Transfer } from "../types/transfer"

interface RecentTransactionsProps {
  transactions: Transfer[]
  onViewAllClick: () => void
  onSearch?: (searchTerm: string) => void
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, onViewAllClick, onSearch }) => {
  return (
    <IonCard className="recent-transactions">
      <IonCardHeader>
        <IonCardTitle>Transactions Récentes</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonSearchbar
          placeholder="Rechercher une transaction"
          className="transaction-search"
          onIonChange={(e) => onSearch && onSearch(e.detail.value || "")}
        ></IonSearchbar>
        <div className="transaction-list">
          {transactions.slice(0, 5).map((transaction, index) => (
            <motion.div
              key={transaction.id}
              className="transaction-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <IonAvatar>
                <img src={`https://i.pravatar.cc/100?img=${index + 1}`} alt="Avatar" />
              </IonAvatar>
              <div className="transaction-details">
                <h4>Virement à {transaction.beneficiaryName}</h4>
                <span>{transaction.accountFrom}</span>
                <span className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</span>
              </div>
              <div className={`transaction-amount outgoing`}>-{transaction.amount.toFixed(2)} DT</div>
              <div className={`transaction-status status-${transaction.status}`}>
                {transaction.status === "completed" && <IonIcon icon={checkmarkCircleOutline} color="success" />}
                {transaction.status === "pending" && <IonIcon icon={timeOutline} color="warning" />}
                {transaction.status === "failed" && <IonIcon icon={warningOutline} color="danger" />}
              </div>
            </motion.div>
          ))}
        </div>
        <IonButton expand="block" fill="clear" className="view-all-button" onClick={onViewAllClick}>
          Voir Tout l'Historique
          <IonIcon slot="end" icon={chevronForward} />
        </IonButton>
      </IonCardContent>
    </IonCard>
  )
}

export default RecentTransactions

