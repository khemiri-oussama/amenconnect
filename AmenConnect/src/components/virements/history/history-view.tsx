"use client"

import type React from "react"
import { useState } from "react"
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
} from "@ionic/react"
import HistoryItem from "./history-item"
import type { Transfer } from "../types/transfer"

interface HistoryViewProps {
  transferHistory: Transfer[]
}

const HistoryView: React.FC<HistoryViewProps> = ({ transferHistory }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredHistory = transferHistory.filter((transfer) => {
    const matchesSearch =
      transfer.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.reason.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="history-container">
      <IonCard className="history-card">
        <IonCardHeader>
          <IonCardTitle>Historique des Virements</IonCardTitle>
          <div className="history-filters">
            <IonSearchbar
              placeholder="Rechercher un virement"
              className="history-search"
              value={searchTerm}
              onIonChange={(e) => setSearchTerm(e.detail.value || "")}
            ></IonSearchbar>
            <IonSelect
              placeholder="Filtrer par statut"
              className="status-filter"
              value={statusFilter}
              onIonChange={(e) => setStatusFilter(e.detail.value)}
            >
              <IonSelectOption value="all">Tous les statuts</IonSelectOption>
              <IonSelectOption value="completed">Complétés</IonSelectOption>
              <IonSelectOption value="pending">En attente</IonSelectOption>
              <IonSelectOption value="failed">Échoués</IonSelectOption>
            </IonSelect>
          </div>
        </IonCardHeader>
        <IonCardContent>
          <div className="history-list">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((transfer) => <HistoryItem key={transfer.id} transfer={transfer} />)
            ) : (
              <div className="empty-state">
                <p>Aucun virement ne correspond à votre recherche</p>
              </div>
            )}
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  )
}

export default HistoryView

