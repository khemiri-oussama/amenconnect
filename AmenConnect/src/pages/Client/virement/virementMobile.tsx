"use client"

import type React from "react"
import { useState } from "react"
import {
  IonContent,
  IonPage,
  IonIcon,
  IonSearchbar,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonAlert,
} from "@ionic/react"
import type { SegmentCustomEvent } from "@ionic/react"
import { cashOutline, peopleOutline, repeatOutline, calendarOutline } from "ionicons/icons"
import { useHistory } from "react-router-dom"
import "./virementMobile.css"
import NavMobile from "../../../components/NavMobile"
import SimpleTransferModal from "../../../components/virementMobile/SimpleTransferModal"
import BatchTransferModal from "../../../components/virementMobile/BatchTransferModal"
import RecurringTransferModal from "../../../components/virementMobile/RecurringTransferModal"
import ScheduledTransfersModal from "../../../components/virementMobile/ScheduledTransfersModal"
import TransferHistoryItem from "../../../components/virementMobile/TransferHistoryItem"
import EmptyState from "../../../components/virementMobile/EmptyState"
import Toast from "../../../components/virementMobile/Toast"

// Types
import type { ScheduledTransfer } from "../../../components/virementMobile/types/transfer"
type TransferFrequency = "once" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly"

// Données simulées
const myAccounts = [
  { id: "account1", label: "Compte Courant", iban: "FR76 1234 5678 9012 3456 7890 123", balance: 2500.75 },
  { id: "account2", label: "Compte Épargne", iban: "FR76 9876 5432 1098 7654 3210 987", balance: 15000.5 },
]

const beneficiaries = [
  { id: "benef1", name: "Jean Dupont", iban: "FR76 1111 2222 3333 4444 5555 666" },
  { id: "benef2", name: "Marie Martin", iban: "FR76 6666 7777 8888 9999 0000 111" },
  { id: "benef3", name: "Entreprise ABC", iban: "FR76 2222 3333 4444 5555 6666 777" },
]

const initialScheduledTransfers: ScheduledTransfer[] = [
  {
    id: "transfer1",
    fromAccount: "Compte Courant - FR76 1234 5678 9012 3456 7890 123",
    toAccount: "FR76 1111 2222 3333 4444 5555 666",
    beneficiaryName: "Jean Dupont",
    amount: 750,
    reference: "Loyer Avril",
    status: "pending",
    nextDate: "2025-04-01",
    frequency: "once",
  },
  {
    id: "transfer2",
    fromAccount: "Compte Courant - FR76 1234 5678 9012 3456 7890 123",
    toAccount: "FR76 6666 7777 8888 9999 0000 111",
    beneficiaryName: "Marie Martin",
    amount: 50,
    reference: "Abonnement",
    status: "pending",
    nextDate: "2025-04-15",
    frequency: "monthly",
    remainingOccurrences: 11,
  },
  {
    id: "transfer3",
    fromAccount: "Compte Épargne - FR76 9876 5432 1098 7654 3210 987",
    toAccount: "FR76 2222 3333 4444 5555 6666 777",
    beneficiaryName: "Entreprise ABC",
    amount: 1200,
    reference: "Facture #A12345",
    status: "pending",
    nextDate: "2025-04-10",
    frequency: "quarterly",
    endDate: "2026-04-10",
  },
]

const VirementsMobile: React.FC = () => {
  const history = useHistory()
  const [selectedSegment, setSelectedSegment] = useState<string>("historique")
  const [showSimpleTransferModal, setShowSimpleTransferModal] = useState(false)
  const [showBatchTransferModal, setShowBatchTransferModal] = useState(false)
  const [showRecurringTransferModal, setShowRecurringTransferModal] = useState(false)
  const [showScheduledTransfersModal, setShowScheduledTransfersModal] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [selectedTransfer, setSelectedTransfer] = useState<ScheduledTransfer | null>(null)
  const [transfers, setTransfers] = useState<ScheduledTransfer[]>(initialScheduledTransfers)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const handleSegmentChange = (event: SegmentCustomEvent) => {
    setSelectedSegment(String(event.detail.value ?? "historique"))
  }

  const displayToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const submitSimpleTransfer = (transfer: any) => {
    const newTransfer: ScheduledTransfer = {
      id: `transfer${Date.now()}`,
      fromAccount:
        myAccounts.find((a) => a.id === transfer.fromAccount)?.label +
          " - " +
          myAccounts.find((a) => a.id === transfer.fromAccount)?.iban || "",
      toAccount: beneficiaries.find((b) => b.id === transfer.toAccount)?.iban || "",
      beneficiaryName: beneficiaries.find((b) => b.id === transfer.toAccount)?.name || "",
      amount: Number.parseFloat(transfer.amount),
      reference: transfer.reference,
      status: "pending",
      nextDate: new Date(transfer.transferDate).toISOString().split("T")[0],
      frequency: "once",
    }

    setTransfers([...transfers, newTransfer])
    setShowSimpleTransferModal(false)
    displayToast("Virement programmé avec succès")
  }

  const submitBatchTransfer = (batchTransfer: any) => {
    const newTransfers = batchTransfer.beneficiaries.map((b: any) => ({
      id: `transfer${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fromAccount:
        myAccounts.find((a) => a.id === batchTransfer.fromAccount)?.label +
          " - " +
          myAccounts.find((a) => a.id === batchTransfer.fromAccount)?.iban || "",
      toAccount: beneficiaries.find((benef) => benef.id === b.beneficiary)?.iban || "",
      beneficiaryName: beneficiaries.find((benef) => benef.id === b.beneficiary)?.name || "",
      amount: Number.parseFloat(b.amount),
      reference: b.reference,
      status: "pending",
      nextDate: new Date(batchTransfer.transferDate).toISOString().split("T")[0],
      frequency: "once" as TransferFrequency,
    }))

    setTransfers([...transfers, ...newTransfers])
    setShowBatchTransferModal(false)
    displayToast(`${newTransfers.length} virements programmés avec succès`)
  }

  const submitRecurringTransfer = (recurringTransfer: any) => {
    const newTransfer: ScheduledTransfer = {
      id: `transfer${Date.now()}`,
      fromAccount:
        myAccounts.find((a) => a.id === recurringTransfer.fromAccount)?.label +
          " - " +
          myAccounts.find((a) => a.id === recurringTransfer.fromAccount)?.iban || "",
      toAccount: beneficiaries.find((b) => b.id === recurringTransfer.toAccount)?.iban || "",
      beneficiaryName: beneficiaries.find((b) => b.id === recurringTransfer.toAccount)?.name || "",
      amount: Number.parseFloat(recurringTransfer.amount),
      reference: recurringTransfer.reference,
      status: "pending",
      nextDate: new Date(recurringTransfer.startDate).toISOString().split("T")[0],
      frequency: recurringTransfer.frequency as TransferFrequency,
    }

    if (recurringTransfer.endType === "occurrences") {
      newTransfer.remainingOccurrences = Number.parseInt(recurringTransfer.occurrences)
    } else if (recurringTransfer.endType === "endDate") {
      newTransfer.endDate = new Date(recurringTransfer.endDate).toISOString().split("T")[0]
    }

    setTransfers([...transfers, newTransfer])
    setShowRecurringTransferModal(false)
    displayToast("Virement récurrent programmé avec succès")
  }

  const deleteTransfer = () => {
    if (!selectedTransfer) return

    const updatedTransfers = transfers.filter((t) => t.id !== selectedTransfer.id)
    setTransfers(updatedTransfers)
    setShowDeleteAlert(false)
    displayToast("Virement supprimé avec succès")
  }

  const openDeleteAlert = (transfer: ScheduledTransfer) => {
    setSelectedTransfer(transfer)
    setShowDeleteAlert(true)
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding-horizontal dark-theme">
        <div className="status-bar"></div>

        <h1 className="page-title">Virements</h1>

        {/* Options de virement */}
        <div className="transfer-options">
          <button className="transfer-card" onClick={() => setShowSimpleTransferModal(true)}>
            <div className="transfer-icon">
              <IonIcon icon={cashOutline} />
            </div>
            <p>Effectuer un virement vers un bénéficiaire</p>
          </button>

          <button className="transfer-card" onClick={() => setShowBatchTransferModal(true)}>
            <div className="transfer-icon">
              <IonIcon icon={peopleOutline} />
            </div>
            <p>Effectuer un virement groupé</p>
          </button>
        </div>

        <div className="transfer-options">
          <button className="transfer-card" onClick={() => setShowRecurringTransferModal(true)}>
            <div className="transfer-icon">
              <IonIcon icon={repeatOutline} />
            </div>
            <p>Programmer un virement récurrent</p>
          </button>

          <button className="transfer-card" onClick={() => setShowScheduledTransfersModal(true)}>
            <div className="transfer-icon">
              <IonIcon icon={calendarOutline} />
            </div>
            <p>Gérer mes virements programmés</p>
          </button>
        </div>

        {/* Segments */}
        <IonSegment value={selectedSegment} onIonChange={handleSegmentChange} className="custom-segment">
          <IonSegmentButton value="historique">
            <IonLabel>Historique</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="a-signer">
            <IonLabel>Virement à signer</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* Section Historique */}
        {selectedSegment === "historique" && (
          <div className="history-section">
            <h2>Historique</h2>
            <IonSearchbar placeholder="Rechercher" className="custom-searchbar"></IonSearchbar>
            <div className="transfers-list">
              {transfers
                .filter((t) => t.status === "completed")
                .map((transfer) => (
                  <TransferHistoryItem key={transfer.id} transfer={transfer} />
                ))}
              {transfers.filter((t) => t.status === "completed").length === 0 && (
                <EmptyState message="Aucun virement dans l'historique" />
              )}
            </div>
          </div>
        )}

        {/* Section Virements à signer */}
        {selectedSegment === "a-signer" && (
          <div className="history-section">
            <h2>Virements à signer</h2>
            <IonSearchbar placeholder="Rechercher" className="custom-searchbar"></IonSearchbar>
            <div className="transfers-list">
              {transfers
                .filter((t) => t.status === "pending")
                .map((transfer) => (
                  <TransferHistoryItem
                    key={transfer.id}
                    transfer={transfer}
                    onDelete={() => openDeleteAlert(transfer)}
                  />
                ))}
              {transfers.filter((t) => t.status === "pending").length === 0 && (
                <EmptyState message="Aucun virement à signer" />
              )}
            </div>
          </div>
        )}

        <SimpleTransferModal
          isOpen={showSimpleTransferModal}
          onClose={() => setShowSimpleTransferModal(false)}
          onSubmit={submitSimpleTransfer}
          myAccounts={myAccounts}
          beneficiaries={beneficiaries}
        />

        <BatchTransferModal
          isOpen={showBatchTransferModal}
          onClose={() => setShowBatchTransferModal(false)}
          onSubmit={submitBatchTransfer}
          myAccounts={myAccounts}
          beneficiaries={beneficiaries}
        />

        <RecurringTransferModal
          isOpen={showRecurringTransferModal}
          onClose={() => setShowRecurringTransferModal(false)}
          onSubmit={submitRecurringTransfer}
          myAccounts={myAccounts}
          beneficiaries={beneficiaries}
        />

        <ScheduledTransfersModal
          isOpen={showScheduledTransfersModal}
          onClose={() => setShowScheduledTransfersModal(false)}
          transfers={transfers}
          onDelete={openDeleteAlert}
        />

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Supprimer le virement"
          message={`Êtes-vous sûr de vouloir supprimer ce virement vers ${selectedTransfer?.beneficiaryName} ?`}
          buttons={[
            {
              text: "Annuler",
              role: "cancel",
            },
            {
              text: "Supprimer",
              handler: deleteTransfer,
            },
          ]}
        />

        <Toast message={toastMessage} isOpen={showToast} />
      </IonContent>
      <NavMobile currentPage="virements" />
    </IonPage>
  )
}

export default VirementsMobile

