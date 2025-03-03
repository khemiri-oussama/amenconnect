"use client"

import type React from "react"
import { useState, useRef } from "react"
import { IonContent, IonPage, IonHeader, IonToolbar, IonChip, IonIcon, IonModal, IonAlert } from "@ionic/react"
import { cardOutline, arrowForward, documentTextOutline, calendarOutline, peopleOutline } from "ionicons/icons"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../../../AuthContext"
import { useTransfersState } from "../../../hooks/use-transfers-state"
import Navbar from "../../../components/Navbar"
import "./VirementDesktop.css"
import Profile from "../accueil/MenuDesktop/ProfileMenu"

// Import components
import DashboardView from "../../../components/virements/dashboard/dashboard-view"
import SimpleTransferView from "../../../components/virements/simple-transfer/simple-transfer-view"
import GroupTransferView from "../../../components/virements/group-transfer/group-transfer-view"
import ScheduledTransfersView from "../../../components/virements/scheduled-transfers/scheduled-transfers-view"
import HistoryView from "../../../components/virements/history/history-view"
import BeneficiariesView from "../../../components/virements/beneficiaries/beneficiaries-view"
import TransferModal from "../../../components/virements/modals/transfer-modal"

const VirementsDesktop: React.FC = () => {
  const { profile, authLoading } = useAuth()
  const {
    accounts,
    mainAccount,
    transferHistory,
    scheduledTransfers,
    beneficiaries,
    newTransfer,
    batchTransfers,
    limits,
    actions,
  } = useTransfersState()

  const [selectedTab, setSelectedTab] = useState<string>("dashboard")
  const [simpleTransferTab, setSimpleTransferTab] = useState<string>("quick")
  const [groupTransferTab, setGroupTransferTab] = useState<string>("csv")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<any[]>([])
  const [isRecurring, setIsRecurring] = useState<boolean>(false)
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (authLoading) {
    return <div>Loading...</div>
  }

  if (!profile) {
    return <div>Please log in to access transfers</div>
  }

  // Handle CSV file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setCsvFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const rows = text.split("\n")
          const headers = rows[0].split(",")

          const parsedData = rows.slice(1).map((row) => {
            const values = row.split(",")
            const rowData: any = {}

            headers.forEach((header, index) => {
              rowData[header.trim()] = values[index]?.trim() || ""
            })

            return rowData
          })

          setCsvData(parsedData.filter((item) => item.name && item.accountNumber))
        } catch (error) {
          console.error("Error parsing CSV:", error)
          setCsvData([])
        }
      }
      reader.readAsText(file)
    }
  }

  // Submit a single transfer
  const submitTransfer = async () => {
    try {
      const success = await actions.submitTransfer(isRecurring)
      if (success) {
        setAlertMessage(isRecurring ? "Virement récurrent programmé avec succès" : "Virement effectué avec succès")
        setShowTransferModal(false)
        setShowSuccessAlert(true)
        setIsRecurring(false)
      }
    } catch (error) {
      setAlertMessage(error instanceof Error ? error.message : "Une erreur s'est produite")
      setShowSuccessAlert(true)
    }
  }

  const submitCsvTransfers = async () => {
    //Implementation for submitting CSV transfers
    console.log("Submitting CSV transfers")
  }

  const addBatchTransferRow = () => {
    //Implementation for adding a row to batch transfers
    console.log("Adding batch transfer row")
  }

  const removeBatchTransferRow = (index: number) => {
    //Implementation for removing a row from batch transfers
    console.log("Removing batch transfer row at index:", index)
  }

  const updateBatchTransferRow = (index: number, updatedRow: any) => {
    //Implementation for updating a row in batch transfers
    console.log("Updating batch transfer row at index:", index, "with data:", updatedRow)
  }

  const submitBatchTransfers = async () => {
    //Implementation for submitting batch transfers
    console.log("Submitting batch transfers")
  }

  const editScheduledTransfer = (transferId: string) => {
    console.log("Editing scheduled transfer with ID:", transferId)
  }

  const cancelScheduledTransfer = (transferId: string) => {
    console.log("Cancelling scheduled transfer with ID:", transferId)
  }

  const handleTransferToBeneficiary = (beneficiaryId: string) => {
    console.log("Transferring to beneficiary with ID:", beneficiaryId)
  }

  return (
    <IonPage className={`virements-desktop`}>
      <IonHeader>
        <IonToolbar>
          <Navbar currentPage="virements" />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="tab-buttons">
          <IonChip
            color={selectedTab === "dashboard" ? "primary" : "medium"}
            onClick={() => setSelectedTab("dashboard")}
          >
            <IonIcon icon={cardOutline} />
            Tableau de Bord
          </IonChip>
          <IonChip
            color={selectedTab === "simple-transfer" ? "primary" : "medium"}
            onClick={() => setSelectedTab("simple-transfer")}
          >
            <IonIcon icon={arrowForward} />
            Virement Simple
          </IonChip>
          <IonChip
            color={selectedTab === "group-transfer" ? "primary" : "medium"}
            onClick={() => setSelectedTab("group-transfer")}
          >
            <IonIcon icon={documentTextOutline} />
            Virements Groupés
          </IonChip>
          <IonChip
            color={selectedTab === "scheduled" ? "primary" : "medium"}
            onClick={() => setSelectedTab("scheduled")}
          >
            <IonIcon icon={calendarOutline} />
            Virements Programmés
          </IonChip>
          <IonChip color={selectedTab === "history" ? "primary" : "medium"} onClick={() => setSelectedTab("history")}>
            <IonIcon icon={documentTextOutline} />
            Historique
          </IonChip>
          <IonChip
            color={selectedTab === "beneficiaries" ? "primary" : "medium"}
            onClick={() => setSelectedTab("beneficiaries")}
          >
            <IonIcon icon={peopleOutline} />
            Bénéficiaires
          </IonChip>

          <div className="ProfileV">
            <Profile />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTab === "dashboard" && (
              <DashboardView
                transferHistory={transferHistory}
                beneficiaries={beneficiaries}
                newTransfer={newTransfer}
                onTransferChange={actions.handleTransferChange}
                onShowTransferModal={() => setShowTransferModal(true)}
                onSetRecurring={setIsRecurring}
                onViewAllHistory={() => setSelectedTab("history")}
                onTabChange={setSelectedTab}
                onSetSimpleTransferTab={setSimpleTransferTab}
                onSetGroupTransferTab={setGroupTransferTab}
                accounts={accounts}
                mainAccount={mainAccount}
                limits={limits}
              />
            )}

            {selectedTab === "simple-transfer" && (
              <SimpleTransferView
                activeTab={simpleTransferTab}
                onTabChange={setSimpleTransferTab}
                beneficiaries={beneficiaries}
                transfer={newTransfer}
                onTransferChange={actions.handleTransferChange}
                onSubmit={submitTransfer}
                onSchedule={() => {
                  setIsRecurring(true)
                  setShowTransferModal(true)
                }}
                onCancel={() => setSelectedTab("dashboard")}
                accounts={accounts}
              />
            )}

            {selectedTab === "group-transfer" && (
              <GroupTransferView
                activeTab={groupTransferTab}
                onTabChange={setGroupTransferTab}
                csvFile={csvFile}
                csvData={csvData}
                batchTransfers={batchTransfers}
                beneficiaries={beneficiaries}
                onFileUpload={handleFileUpload}
                onSubmitCsv={submitCsvTransfers}
                onAddBatchRow={addBatchTransferRow}
                onRemoveBatchRow={removeBatchTransferRow}
                onUpdateBatchRow={updateBatchTransferRow}
                onSubmitBatch={submitBatchTransfers}
              />
            )}

            {selectedTab === "scheduled" && (
              <ScheduledTransfersView
                scheduledTransfers={scheduledTransfers}
                onNewScheduled={() => {
                  setIsRecurring(true)
                  setShowTransferModal(true)
                }}
                onEditScheduled={editScheduledTransfer}
                onCancelScheduled={cancelScheduledTransfer}
              />
            )}

            {selectedTab === "history" && <HistoryView transferHistory={transferHistory} />}

            {selectedTab === "beneficiaries" && (
              <BeneficiariesView
                beneficiaries={beneficiaries}
                onNewBeneficiary={() => console.log("New beneficiary")}
                onTransferToBeneficiary={handleTransferToBeneficiary}
                onEditBeneficiary={(id) => console.log("Edit beneficiary", id)}
                onDeleteBeneficiary={(id) => console.log("Delete beneficiary", id)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Modals */}
        <IonModal isOpen={showTransferModal} onDidDismiss={() => setShowTransferModal(false)}>
          <TransferModal
            isOpen={showTransferModal}
            isRecurring={isRecurring}
            transfer={newTransfer}
            beneficiaries={beneficiaries}
            onClose={() => setShowTransferModal(false)}
            onTransferChange={actions.handleTransferChange}
            onToggleRecurring={setIsRecurring}
            onSubmit={submitTransfer}
            accounts={accounts}
          />
        </IonModal>

        <IonAlert
          isOpen={showSuccessAlert}
          onDidDismiss={() => setShowSuccessAlert(false)}
          header="Information"
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  )
}

export default VirementsDesktop

