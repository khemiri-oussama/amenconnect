"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonAvatar,
  IonChip,
  IonSearchbar,
  IonToggle,
  IonProgressBar,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonTabBar,
  IonTabButton,
  IonTab,
  IonTabs,
  IonDatetime,
  IonRadioGroup,
  IonRadio,
  IonList,
  IonListHeader,
  IonNote,
  IonFab,
  IonFabButton,
  IonModal,
  IonTextarea,
  IonAlert
} from "@ionic/react"
import {
  arrowForward,
  addCircleOutline,
  repeatOutline,
  searchOutline,
  trendingUpOutline,
  walletOutline,
  alertCircleOutline,
  moonOutline,
  sunnyOutline,
  peopleOutline,
  cardOutline,
  documentTextOutline,
  chevronForward,
  calendarOutline,
  closeCircleOutline,
  cloudUploadOutline,
  createOutline,
  saveOutline,
  trashOutline,
  checkmarkCircleOutline,
  timeOutline,
  warningOutline
} from "ionicons/icons"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "../../../components/Navbar"
import "./VirementDesktop.css"
import Profile from "../accueil/MenuDesktop/ProfileMenu"

interface Beneficiary {
  id: string
  name: string
  accountNumber: string
  bank?: string
}

interface Transfer {
  id: string
  beneficiaryId: string
  beneficiaryName: string
  accountFrom: string
  accountTo: string
  amount: number
  reason: string
  date: string
  status: 'pending' | 'completed' | 'failed'
}

interface ScheduledTransfer extends Transfer {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  endDate?: string
  nextDate: string
}

const VirementsDesktop: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("dashboard")
  const [simpleTransferTab, setSimpleTransferTab] = useState<string>("quick")
  const [groupTransferTab, setGroupTransferTab] = useState<string>("csv")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<any[]>([])
  const [isRecurring, setIsRecurring] = useState<boolean>(false)
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false)
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Sample data for beneficiaries
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    { id: "ben1", name: "Ahmed Ben Ali", accountNumber: "TN591000067891234567890" },
    { id: "ben2", name: "Société XYZ", accountNumber: "TN592000054321987654321" },
    { id: "ben3", name: "Mohamed Karim", accountNumber: "TN593000012345678901234" },
  ])
  
  // Sample data for scheduled transfers
  const [scheduledTransfers, setScheduledTransfers] = useState<ScheduledTransfer[]>([
    {
      id: "sched1",
      beneficiaryId: "ben1",
      beneficiaryName: "Ahmed Ben Ali",
      accountFrom: "Compte Courant",
      accountTo: "TN591000067891234567890",
      amount: 500,
      reason: "Loyer mensuel",
      date: "2023-05-01",
      status: "pending",
      frequency: "monthly",
      nextDate: "2023-06-01"
    },
    {
      id: "sched2",
      beneficiaryId: "ben2",
      beneficiaryName: "Société XYZ",
      accountFrom: "Compte Epargne",
      accountTo: "TN592000054321987654321",
      amount: 1200,
      reason: "Paiement facture",
      date: "2023-04-15",
      status: "completed",
      frequency: "quarterly",
      nextDate: "2023-07-15"
    }
  ])
  
  // Sample data for transfer history
  const [transferHistory, setTransferHistory] = useState<Transfer[]>([
    {
      id: "tr1",
      beneficiaryId: "ben1",
      beneficiaryName: "Ahmed Ben Ali",
      accountFrom: "Compte Courant",
      accountTo: "TN591000067891234567890",
      amount: 1000,
      reason: "Remboursement",
      date: "2023-04-28",
      status: "completed"
    },
    {
      id: "tr2",
      beneficiaryId: "ben2",
      beneficiaryName: "Société XYZ",
      accountFrom: "Compte Epargne",
      accountTo: "TN592000054321987654321",
      amount: 750,
      reason: "Facture électricité",
      date: "2023-04-20",
      status: "completed"
    },
    {
      id: "tr3",
      beneficiaryId: "ben3",
      beneficiaryName: "Mohamed Karim",
      accountFrom: "Compte Courant",
      accountTo: "TN593000012345678901234",
      amount: 250,
      reason: "Remboursement déjeuner",
      date: "2023-04-10",
      status: "failed"
    }
  ])
  
  // Form state for creating a new transfer
  const [newTransfer, setNewTransfer] = useState({
    beneficiaryId: "",
    accountFrom: "Compte Courant",
    amount: "",
    reason: "",
    date: new Date().toISOString(),
    frequency: "once",
    endDate: ""
  })
  
  // Form state for batch transfers
  const [batchTransfers, setBatchTransfers] = useState<any[]>([
    { beneficiaryId: "", amount: "", reason: "" }
  ])
  
  // Handle CSV file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setCsvFile(file)
    
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const rows = text.split('\n')
          const headers = rows[0].split(',')
          
          const parsedData = rows.slice(1).map(row => {
            const values = row.split(',')
            const rowData: any = {}
            
            headers.forEach((header, index) => {
              rowData[header.trim()] = values[index]?.trim() || ''
            })
            
            return rowData
          })
          
          setCsvData(parsedData.filter(item => item.name && item.accountNumber))
        } catch (error) {
          console.error("Error parsing CSV:", error)
          setCsvData([])
        }
      }
      reader.readAsText(file)
    }
  }
  
  // Add a new empty row to batch transfers
  const addBatchTransferRow = () => {
    setBatchTransfers([...batchTransfers, { beneficiaryId: "", amount: "", reason: "" }])
  }
  
  // Update a batch transfer row
  const updateBatchTransferRow = (index: number, field: string, value: string) => {
    const updated = [...batchTransfers]
    updated[index] = { ...updated[index], [field]: value }
    setBatchTransfers(updated)
  }
  
  // Remove a batch transfer row
  const removeBatchTransferRow = (index: number) => {
    const updated = [...batchTransfers]
    updated.splice(index, 1)
    setBatchTransfers(updated)
  }
  
  // Handle form input changes for new transfer
  const handleTransferChange = (field: string, value: any) => {
    setNewTransfer({ ...newTransfer, [field]: value })
  }
  
  // Submit a single transfer
  const submitTransfer = () => {
    const selectedBeneficiary = beneficiaries.find(b => b.id === newTransfer.beneficiaryId)
    
    if (!selectedBeneficiary) {
      setAlertMessage("Veuillez sélectionner un bénéficiaire")
      setShowSuccessAlert(true)
      return
    }
    
    if (!newTransfer.amount || parseFloat(newTransfer.amount.toString()) <= 0) {
      setAlertMessage("Veuillez entrer un montant valide")
      setShowSuccessAlert(true)
      return
    }
    
    const transfer: Transfer = {
      id: `tr${Date.now()}`,
      beneficiaryId: selectedBeneficiary.id,
      beneficiaryName: selectedBeneficiary.name,
      accountFrom: newTransfer.accountFrom,
      accountTo: selectedBeneficiary.accountNumber,
      amount: parseFloat(newTransfer.amount.toString()),
      reason: newTransfer.reason,
      date: newTransfer.date,
      status: 'pending'
    }
    
    // For recurring transfers
    if (isRecurring && newTransfer.frequency !== 'once') {
      const scheduledTransfer: ScheduledTransfer = {
        ...transfer,
        frequency: newTransfer.frequency as any,
        nextDate: newTransfer.date,
        endDate: newTransfer.endDate || undefined
      }
      
      setScheduledTransfers([scheduledTransfer, ...scheduledTransfers])
      setAlertMessage("Virement récurrent programmé avec succès")
    } else {
      setTransferHistory([transfer, ...transferHistory])
      setAlertMessage("Virement effectué avec succès")
    }
    
    // Reset form
    setNewTransfer({
      beneficiaryId: "",
      accountFrom: "Compte Courant",
      amount: "",
      reason: "",
      date: new Date().toISOString(),
      frequency: "once",
      endDate: ""
    })
    
    setIsRecurring(false)
    setShowTransferModal(false)
    setShowScheduleModal(false)
    setShowSuccessAlert(true)
  }
  
  // Submit batch transfers
  const submitBatchTransfers = () => {
    const newTransfers: Transfer[] = []
    let hasErrors = false
    
    // Validate all entries
    batchTransfers.forEach((transfer, index) => {
      if (!transfer.beneficiaryId || !transfer.amount || parseFloat(transfer.amount) <= 0) {
        hasErrors = true
        return
      }
      
      const selectedBeneficiary = beneficiaries.find(b => b.id === transfer.beneficiaryId)
      if (!selectedBeneficiary) {
        hasErrors = true
        return
      }
      
      newTransfers.push({
        id: `tr${Date.now()}-${index}`,
        beneficiaryId: selectedBeneficiary.id,
        beneficiaryName: selectedBeneficiary.name,
        accountFrom: "Compte Courant",
        accountTo: selectedBeneficiary.accountNumber,
        amount: parseFloat(transfer.amount),
        reason: transfer.reason || "Virement groupé",
        date: new Date().toISOString(),
        status: 'pending'
      })
    })
    
    if (hasErrors) {
      setAlertMessage("Veuillez compléter correctement tous les champs")
      setShowSuccessAlert(true)
      return
    }
    
    // Add transfers to history
    setTransferHistory([...newTransfers, ...transferHistory])
    
    // Reset form
    setBatchTransfers([{ beneficiaryId: "", amount: "", reason: "" }])
    setAlertMessage("Virements groupés effectués avec succès")
    setShowSuccessAlert(true)
  }
  
  // Submit CSV transfers
  const submitCsvTransfers = () => {
    if (csvData.length === 0) {
      setAlertMessage("Veuillez importer un fichier CSV valide")
      setShowSuccessAlert(true)
      return
    }
    
    const newTransfers: Transfer[] = csvData.map((row, index) => {
      return {
        id: `tr${Date.now()}-csv-${index}`,
        beneficiaryId: `csv-${index}`,
        beneficiaryName: row.name,
        accountFrom: "Compte Courant",
        accountTo: row.accountNumber,
        amount: parseFloat(row.amount) || 0,
        reason: row.reason || "Virement par CSV",
        date: new Date().toISOString(),
        status: 'pending'
      }
    })
    
    // Add transfers to history
    setTransferHistory([...newTransfers, ...transferHistory])
    
    // Reset form
    setCsvFile(null)
    setCsvData([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    
    setAlertMessage("Virements par CSV effectués avec succès")
    setShowSuccessAlert(true)
  }
  
  // Cancel a scheduled transfer
  const cancelScheduledTransfer = (id: string) => {
    setScheduledTransfers(scheduledTransfers.filter(t => t.id !== id))
    setAlertMessage("Virement programmé annulé avec succès")
    setShowSuccessAlert(true)
  }
  
  // Render dashboard tab
  const renderDashboard = () => (
    <IonGrid className="dashboard-grid">
      <IonRow>
        <IonCol size="12" sizeMd="8">
          <IonCard className="account-summary">
            <IonCardHeader>
              <IonCardSubtitle>Solde actuel</IonCardSubtitle>
              <IonCardTitle className="balance">
                <span className="amount">2,580.00</span>
                <span className="currency">DT</span>
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="account-details">
                <div>
                  <IonIcon icon={walletOutline} />
                  <span>RIB: 07098050001216747468</span>
                </div>
                <div>
                  <IonIcon icon={trendingUpOutline} />
                  <span>+1,250 DT ce mois</span>
                </div>
              </div>
              <IonProgressBar value={0.7} color="success" className="balance-progress"></IonProgressBar>
              <div className="balance-info">
                <span>Solde minimum: 1,000 DT</span>
                <span>Solde maximum: 3,000 DT</span>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="recent-transactions">
            <IonCardHeader>
              <IonCardTitle>Transactions Récentes</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonSearchbar placeholder="Rechercher une transaction" className="transaction-search"></IonSearchbar>
              <div className="transaction-list">
                {transferHistory.slice(0, 5).map((transaction, index) => (
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
                    <div className={`transaction-amount outgoing`}>
                      -{transaction.amount.toFixed(2)} DT
                    </div>
                    <div className={`transaction-status status-${transaction.status}`}>
                      {transaction.status === 'completed' && 
                        <IonIcon icon={checkmarkCircleOutline} color="success" />}
                      {transaction.status === 'pending' && 
                        <IonIcon icon={timeOutline} color="warning" />}
                      {transaction.status === 'failed' && 
                        <IonIcon icon={warningOutline} color="danger" />}
                    </div>
                  </motion.div>
                ))}
              </div>
              <IonButton expand="block" fill="clear" className="view-all-button" onClick={() => setSelectedTab("history")}>
                Voir Tout l'Historique
                <IonIcon slot="end" icon={chevronForward} />
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonCol>

        <IonCol size="12" sizeMd="4">
          <IonCard className="quick-actions">
            <IonCardHeader>
              <IonCardTitle>Actions Rapides</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="actions-grid">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <IonButton fill="clear" className="action-button" onClick={() => {
                    setSelectedTab("simple-transfer");
                    setSimpleTransferTab("quick");
                  }}>
                    <IonIcon icon={arrowForward} slot="start" />
                    Nouveau Virement
                  </IonButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <IonButton fill="clear" className="action-button" onClick={() => {
                    setIsRecurring(true);
                    setShowTransferModal(true);
                  }}>
                    <IonIcon icon={repeatOutline} slot="start" />
                    Virement Permanent
                  </IonButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <IonButton fill="clear" className="action-button" onClick={() => {
                    setSelectedTab("group-transfer");
                    setGroupTransferTab("csv");
                  }}>
                    <IonIcon icon={cloudUploadOutline} slot="start" />
                    Import CSV
                  </IonButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <IonButton fill="clear" className="action-button" onClick={() => setSelectedTab("scheduled")}>
                    <IonIcon icon={calendarOutline} slot="start" />
                    Virements Programmés
                  </IonButton>
                </motion.div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="quick-transfer">
            <IonCardHeader>
              <IonCardTitle>Virement Rapide</IonCardTitle>
            </IonCardHeader>
            
            <IonCardContent>
              <form className="quick-transfer-form" onSubmit={(e) => {
                e.preventDefault();
                setShowTransferModal(true);
              }}>
                <IonItem>
                  <IonLabel position="floating">Bénéficiaire</IonLabel>
                  <IonSelect 
                    interface="popover"
                    value={newTransfer.beneficiaryId}
                    onIonChange={(e) => handleTransferChange('beneficiaryId', e.detail.value)}
                  >
                    {beneficiaries.map(ben => (
                      <IonSelectOption key={ben.id} value={ben.id}>{ben.name}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Montant (DT)</IonLabel>
                  <IonInput 
                    type="number" 
                    placeholder="0.00" 
                    value={newTransfer.amount}
                    onIonChange={(e) => handleTransferChange('amount', e.detail.value)}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Motif du virement</IonLabel>
                  <IonInput 
                    type="text" 
                    placeholder="Ex: Paiement facture"
                    value={newTransfer.reason}
                    onIonChange={(e) => handleTransferChange('reason', e.detail.value)}
                  />
                </IonItem>
                <IonButton expand="block" className="transfer-button" type="submit">
                  Effectuer le Virement
                  <IonIcon icon={arrowForward} slot="end" />
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>

          <IonCard className="limits-info">
            <IonCardHeader>
              <IonCardTitle>Limites et Informations</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="limits-grid">
                <div className="limit-item">
                  <IonIcon icon={walletOutline} />
                  <div>
                    <h4>Limite Quotidienne</h4>
                    <span>10,000 DT</span>
                    <IonProgressBar value={0.5} color="warning"></IonProgressBar>
                  </div>
                </div>
                <div className="limit-item">
                  <IonIcon icon={alertCircleOutline} />
                  <div>
                    <h4>Limite Mensuelle</h4>
                    <span>50,000 DT</span>
                    <IonProgressBar value={0.3} color="success"></IonProgressBar>
                  </div>
                </div>
              </div>
              <IonButton expand="block" fill="clear" className="chat-button">
                Contacter le Support
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
  
  // Render Simple Transfer Tab
  const renderSimpleTransfer = () => (
    <div className="transfer-container">
      <IonCard className="transfer-card">
        <IonCardHeader>
          <IonCardTitle>Virement Simple</IonCardTitle>
          <IonCardSubtitle>Transfert rapide entre vos comptes ou vers un bénéficiaire</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="transfer-tabs">
            <IonChip
              color={simpleTransferTab === "quick" ? "primary" : "medium"}
              onClick={() => setSimpleTransferTab("quick")}
            >
              <IonIcon icon={arrowForward} />
              Virement Rapide
            </IonChip>
            <IonChip
              color={simpleTransferTab === "scheduled" ? "primary" : "medium"}
              onClick={() => setSimpleTransferTab("scheduled")}
            >
              <IonIcon icon={calendarOutline} />
              Virement Programmé
            </IonChip>
          </div>
          
          <div className="transfer-form-container">
            <form className="transfer-form" onSubmit={(e) => {
              e.preventDefault();
              if (simpleTransferTab === "scheduled") {
                setIsRecurring(true);
                setShowScheduleModal(true);
              } else {
                submitTransfer();
              }
            }}>
              <IonItem>
                <IonLabel position="floating">Compte source</IonLabel>
                <IonSelect 
                  value={newTransfer.accountFrom}
                  onIonChange={(e) => handleTransferChange('accountFrom', e.detail.value)}
                >
                  <IonSelectOption value="Compte Courant">Compte Courant - 07098050001216747468</IonSelectOption>
                  <IonSelectOption value="Compte Epargne">Compte Epargne - 07098050001216747469</IonSelectOption>
                </IonSelect>
              </IonItem>
              
              <IonItem>
                <IonLabel position="floating">Bénéficiaire</IonLabel>
                <IonSelect 
                  value={newTransfer.beneficiaryId}
                  onIonChange={(e) => handleTransferChange('beneficiaryId', e.detail.value)}
                >
                  {beneficiaries.map(ben => (
                    <IonSelectOption key={ben.id} value={ben.id}>{ben.name} - {ben.accountNumber}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              
              <IonItem>
                <IonLabel position="floating">Montant (DT)</IonLabel>
                <IonInput 
                  type="number" 
                  placeholder="0.00" 
                  value={newTransfer.amount}
                  onIonChange={(e) => handleTransferChange('amount', e.detail.value)}
                  required
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="floating">Motif du virement</IonLabel>
                <IonInput 
                  type="text" 
                  placeholder="Ex: Paiement facture" 
                  value={newTransfer.reason}
                  onIonChange={(e) => handleTransferChange('reason', e.detail.value)}
                />
              </IonItem>
              
              {simpleTransferTab === "scheduled" && (
                <IonItem>
                  <IonLabel position="floating">Date d'exécution</IonLabel>
                  <IonInput 
                    type="date" 
                    value={newTransfer.date.substring(0, 10)}
                    onIonChange={(e) => handleTransferChange('date', e.detail.value)}
                    min={new Date().toISOString().substring(0, 10)}
                  />
                </IonItem>
              )}
              
              <div className="transfer-actions">
                <IonButton type="button" fill="outline" onClick={() => setSelectedTab("dashboard")}>
                  Annuler
                </IonButton>
                <IonButton type="submit" expand="block">
                  {simpleTransferTab === "scheduled" ? "Planifier le Virement" : "Effectuer le Virement"}
                  <IonIcon slot="end" icon={arrowForward} />
                </IonButton>
              </div>
            </form>
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  )
  
  // Render Group Transfer Tab
  const renderGroupTransfer = () => (
    <div className="transfer-container">
      <IonCard className="transfer-card">
        <IonCardHeader>
          <IonCardTitle>Virements Groupés</IonCardTitle>
          <IonCardSubtitle>Effectuez plusieurs virements en une seule opération</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="transfer-tabs">
            <IonChip
              color={groupTransferTab === "csv" ? "primary" : "medium"}
              onClick={() => setGroupTransferTab("csv")}
            >
              <IonIcon icon={documentTextOutline} />
              Import CSV
            </IonChip>
            <IonChip
              color={groupTransferTab === "manual" ? "primary" : "medium"}
              onClick={() => setGroupTransferTab("manual")}
            >
              <IonIcon icon={createOutline} />
              Saisie Manuelle
            </IonChip>
          </div>
          
          {groupTransferTab === "csv" ? (
            <div className="csv-upload-container">
              <div className="csv-upload-box">
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileUpload} 
                  className="file-input" 
                  ref={fileInputRef}
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="file-label">
                  <IonIcon icon={cloudUploadOutline} className="upload-icon" />
                  <span>Cliquez pour sélectionner un fichier CSV</span>
                  {csvFile && <span className="file-name">{csvFile.name}</span>}
                </label>
              </div>
              
              {csvData.length > 0 && (
                <div className="csv-preview">
                  <h4>Aperçu des données ({csvData.length} bénéficiaires)</h4>
                  <div className="csv-table-container">
                    <table className="csv-table">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Numéro de compte</th>
                          <th>Montant</th>
                          <th>Motif</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.slice(0, 5).map((row, index) => (
                          <tr key={index}>
                            <td>{row.name}</td>
                            <td>{row.accountNumber}</td>
                            <td>{row.amount} DT</td>
                            <td>{row.reason || "-"}</td>
                          </tr>
                        ))}
                        {csvData.length > 5 && (
                          <tr>
                            <td colSpan={4} className="more-rows">
                              ... et {csvData.length - 5} autres bénéficiaires
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="csv-actions">
                    <IonButton expand="block" onClick={submitCsvTransfers}>
                      Confirmer les virements
                      <IonIcon slot="end" icon={checkmarkCircleOutline} />
                    </IonButton>
                  </div>
                </div>
              )}
              
              <div className="csv-instructions">
                <h4>Format du fichier CSV</h4>
                <p>Le fichier CSV doit contenir les colonnes suivantes :</p>
                <ul>
                  <li>name - Nom du bénéficiaire</li>
                  <li>accountNumber - Numéro de compte du bénéficiaire</li>
                  <li>amount - Montant du virement (en DT)</li>
                  <li>reason - Motif du virement (optionnel)</li>
                </ul>
                <p>Exemple : name,accountNumber,amount,reason</p>
                <p>Ahmed Ali,TN591000067891234567890,500,Loyer</p>
              </div>
            </div>
          ) : (
            <div className="manual-batch-container">
              <div className="batch-transfers-list">
                {batchTransfers.map((transfer, index) => (
                  <div className="batch-transfer-item" key={index}>
                    <div className="batch-transfer-header">
                      <h4>Bénéficiaire #{index + 1}</h4>
                      {index > 0 && (
                        <IonButton 
                          fill="clear" 
                          color="danger" 
                          size="small"
                          onClick={() => removeBatchTransferRow(index)}
                        >
                          <IonIcon icon={closeCircleOutline} />
                        </IonButton>
                      )}
                    </div>
                    <div className="batch-transfer-form">
                      <IonItem>
                        <IonLabel position="floating">Bénéficiaire</IonLabel>
                        <IonSelect 
                          value={transfer.beneficiaryId}
                          onIonChange={(e) => updateBatchTransferRow(index, 'beneficiaryId', e.detail.value)}
                        >
                          {beneficiaries.map(ben => (
                            <IonSelectOption key={ben.id} value={ben.id}>{ben.name}</IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                      
                      <IonItem>
                        <IonLabel position="floating">Montant (DT)</IonLabel>
                        <IonInput 
                          type="number" 
                          placeholder="0.00" 
                          value={transfer.amount}
                          onIonChange={(e) => updateBatchTransferRow(index, 'amount', e.detail.value)}
                        />
                      </IonItem>
                      
                      <IonItem>
                        <IonLabel position="floating">Motif du virement</IonLabel>
                        <IonInput 
                          type="text" 
                          placeholder="Ex: Paiement facture" 
                          value={transfer.reason}
                          onIonChange={(e) => updateBatchTransferRow(index, 'reason', e.detail.value)}
                        />
                      </IonItem>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="batch-actions">
                <IonButton fill="outline" onClick={addBatchTransferRow}>
                  <IonIcon icon={addCircleOutline} slot="start" />
                  Ajouter un bénéficiaire
                </IonButton>
                
                <IonButton expand="block" onClick={submitBatchTransfers} disabled={batchTransfers.length === 0}>
                  Confirmer les virements
                  <IonIcon slot="end" icon={checkmarkCircleOutline} />
                </IonButton>
              </div>
            </div>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  )
  
  // Render Scheduled Transfers Tab
  const renderScheduledTransfers = () => (
    <div className="transfer-container">
      <IonCard className="transfer-card">
        <IonCardHeader>
          <IonCardTitle>Virements Programmés</IonCardTitle>
          <IonCardSubtitle>Gérez vos virements récurrents et programmés</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          {scheduledTransfers.length > 0 ? (
            <div className="scheduled-transfers-list">
              {scheduledTransfers.map((transfer, index) => (
                <div className="scheduled-transfer-item" key={transfer.id}>
                  <div className="transfer-icon">
                    <IonIcon icon={repeatOutline} />
                    <div className="frequency-badge">{transfer.frequency}</div>
                  </div>
                  
                  <div className="transfer-details">
                    <h4>{transfer.beneficiaryName}</h4>
                    <div className="transfer-info">
                      <span>{transfer.amount.toFixed(2)} DT</span>
                      <span className="separator">•</span>
                      <span>Prochaine date: {new Date(transfer.nextDate).toLocaleDateString()}</span>
                      {transfer.endDate && (
                        <>
                          <span className="separator">•</span>
                          <span>Fin: {new Date(transfer.endDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    <div className="transfer-reason">{transfer.reason}</div>
                  </div>
                  
                  <div className="transfer-actions">
                    <IonButton fill="clear" size="small">
                      <IonIcon icon={createOutline} />
                    </IonButton>
                    <IonButton fill="clear" size="small" color="danger" onClick={() => cancelScheduledTransfer(transfer.id)}>
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <IonIcon icon={calendarOutline} className="empty-icon" />
              <h4>Aucun virement programmé</h4>
              <p>Vous n'avez pas encore programmé de virements récurrents</p>
              <IonButton onClick={() => {
                setIsRecurring(true);
                setShowTransferModal(true);
              }}>
                <IonIcon icon={addCircleOutline} slot="start" />
                Programmer un virement
              </IonButton>
            </div>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  )
  
  // Render History Tab
  const renderHistory = () => (
    <div className="history-container">
      <IonCard className="history-card">
        <IonCardHeader>
          <IonCardTitle>Historique des Virements</IonCardTitle>
          <div className="history-filters">
            <IonSearchbar placeholder="Rechercher un virement" className="history-search"></IonSearchbar>
            <IonSelect placeholder="Filtrer par statut" className="status-filter">
              <IonSelectOption value="all">Tous les statuts</IonSelectOption>
              <IonSelectOption value="completed">Complétés</IonSelectOption>
              <IonSelectOption value="pending">En attente</IonSelectOption>
              <IonSelectOption value="failed">Échoués</IonSelectOption>
            </IonSelect>
          </div>
        </IonCardHeader>
        <IonCardContent>
          <div className="history-list">
            {transferHistory.map((transfer, index) => (
              <div className="history-item" key={transfer.id}>
                <div className="history-date">
                  <div className="day">{new Date(transfer.date).getDate()}</div>
                  <div className="month">{new Date(transfer.date).toLocaleDateString('fr', { month: 'short' })}</div>
                </div>
                
                <div className="history-details">
                  <div className="history-top">
                    <h4>{transfer.beneficiaryName}</h4>
                    <div className={`history-amount outgoing`}>-{transfer.amount.toFixed(2)} DT</div>
                  </div>
                  <div className="history-bottom">
                    <div className="history-info">
                      <span>De: {transfer.accountFrom}</span>
                      <span className="separator">•</span>
                      <span>Motif: {transfer.reason}</span>
                    </div>
                    <div className={`history-status status-${transfer.status}`}>
                      {transfer.status === 'completed' && 'Complété'}
                      {transfer.status === 'pending' && 'En attente'}
                      {transfer.status === 'failed' && 'Échoué'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  )
  
  // Render Beneficiaries Tab
  const renderBeneficiaries = () => (
    <div className="beneficiaries-container">
      <IonCard className="beneficiaries-card">
        <IonCardHeader>
          <IonCardTitle>Gestion des Bénéficiaires</IonCardTitle>
          <IonCardSubtitle>Gérez votre liste de bénéficiaires pour vos virements</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="beneficiaries-header">
            <IonSearchbar placeholder="Rechercher un bénéficiaire" className="beneficiary-search"></IonSearchbar>
            <IonButton fill="outline">
              <IonIcon icon={addCircleOutline} slot="start" />
              Nouveau Bénéficiaire
            </IonButton>
          </div>
          
          <div className="beneficiaries-list">
            {beneficiaries.map((ben, index) => (
              <div className="beneficiary-item" key={ben.id}>
                <IonAvatar className="beneficiary-avatar">
                  <img src={`https://i.pravatar.cc/100?img=${index + 10}`} alt="Avatar" />
                </IonAvatar>
                
                <div className="beneficiary-details">
                  <h4>{ben.name}</h4>
                  <div className="account-number">{ben.accountNumber}</div>
                  {ben.bank && <div className="bank-name">{ben.bank}</div>}
                </div>
                
                <div className="beneficiary-actions">
                  <IonButton fill="clear" size="small" onClick={() => {
                    setNewTransfer({...newTransfer, beneficiaryId: ben.id});
                    setShowTransferModal(true);
                  }}>
                    <IonIcon icon={arrowForward} />
                  </IonButton>
                  <IonButton fill="clear" size="small">
                    <IonIcon icon={createOutline} />
                  </IonButton>
                  <IonButton fill="clear" size="small" color="danger">
                    <IonIcon icon={trashOutline} />
                  </IonButton>
                </div>
              </div>
            ))}
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  )
  
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
          <IonChip 
            color={selectedTab === "history" ? "primary" : "medium"} 
            onClick={() => setSelectedTab("history")}
          >
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
          
          <div className="ProfileV"><Profile/></div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTab === "dashboard" && renderDashboard()}
            {selectedTab === "simple-transfer" && renderSimpleTransfer()}
            {selectedTab === "group-transfer" && renderGroupTransfer()}
            {selectedTab === "scheduled" && renderScheduledTransfers()}
            {selectedTab === "history" && renderHistory()}
            {selectedTab === "beneficiaries" && renderBeneficiaries()}
          </motion.div>
        </AnimatePresence>
        
        {/* Transfer Modal */}
        <IonModal isOpen={showTransferModal} onDidDismiss={() => setShowTransferModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{isRecurring ? "Virement Récurrent" : "Confirmer le Virement"}</IonTitle>
              <IonButton slot="end" fill="clear" onClick={() => setShowTransferModal(false)}>
                <IonIcon icon={closeCircleOutline} />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {isRecurring ? (
              <div className="recurring-form">
                <h3>Configurer la récurrence</h3>
                
                <IonItem>
                  <IonLabel>Fréquence</IonLabel>
                  <IonSelect 
                    value={newTransfer.frequency} 
                    onIonChange={(e) => handleTransferChange('frequency', e.detail.value)}
                  >
                    <IonSelectOption value="once">Une seule fois</IonSelectOption>
                    <IonSelectOption value="daily">Quotidien</IonSelectOption>
                    <IonSelectOption value="weekly">Hebdomadaire</IonSelectOption>
                    <IonSelectOption value="monthly">Mensuel</IonSelectOption>
                    <IonSelectOption value="quarterly">Trimestriel</IonSelectOption>
                    <IonSelectOption value="yearly">Annuel</IonSelectOption>
                  </IonSelect>
                </IonItem>
                
                <IonItem>
                  <IonLabel position="stacked">Date de début</IonLabel>
                  <IonInput 
                    type="date" 
                    value={newTransfer.date.substring(0, 10)}
                    onIonChange={(e) => handleTransferChange('date', e.detail.value)}
                    min={new Date().toISOString().substring(0, 10)}
                  />
                </IonItem>
                
                <IonItem>
                  <IonLabel position="stacked">Date de fin (optionnel)</IonLabel>
                  <IonInput 
                    type="date" 
                    value={newTransfer.endDate}
                    onIonChange={(e) => handleTransferChange('endDate', e.detail.value)}
                    min={newTransfer.date.substring(0, 10)}
                  />
                </IonItem>
                
                <div className="modal-summary">
                  <h4>Résumé du virement</h4>
                  <div className="summary-item">
                    <span>Bénéficiaire:</span>
                    <span>{beneficiaries.find(b => b.id === newTransfer.beneficiaryId)?.name || 'Non sélectionné'}</span>
                  </div>
                  <div className="summary-item">
                    <span>Montant:</span>
                    <span>{newTransfer.amount || '0'} DT</span>
                  </div>
                  <div className="summary-item">
                    <span>Compte source:</span>
                    <span>{newTransfer.accountFrom}</span>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <IonButton expand="block" onClick={submitTransfer}>
                    Confirmer la programmation
                    <IonIcon slot="end" icon={checkmarkCircleOutline} />
                  </IonButton>
                </div>
              </div>
            ) : (
              <div className="confirmation-form">
                <div className="confirmation-summary">
                  <h3>Détails du virement</h3>
                  
                  <div className="summary-item">
                    <span>Bénéficiaire:</span>
                    <span>{beneficiaries.find(b => b.id === newTransfer.beneficiaryId)?.name || 'Non sélectionné'}</span>
                  </div>
                  <div className="summary-item">
                    <span>Compte bénéficiaire:</span>
                    <span>{beneficiaries.find(b => b.id === newTransfer.beneficiaryId)?.accountNumber || '-'}</span>
                  </div>
                  <div className="summary-item">
                    <span>Montant:</span>
                    <span className="amount">{newTransfer.amount || '0'} DT</span>
                  </div>
                  <div className="summary-item">
                    <span>Compte source:</span>
                    <span>{newTransfer.accountFrom}</span>
                  </div>
                  <div className="summary-item">
                    <span>Motif:</span>
                    <span>{newTransfer.reason || 'Non spécifié'}</span>
                  </div>
                  <div className="summary-item">
                    <span>Date d'exécution:</span>
                    <span>{new Date(newTransfer.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="confirmation-details">
                  <IonItem>
                    <IonLabel>Programmer une récurrence?</IonLabel>
                    <IonToggle checked={isRecurring} onIonChange={(e) => setIsRecurring(e.detail.checked)} />
                  </IonItem>
                </div>
                
                <div className="modal-actions">
                  <IonButton expand="block" onClick={submitTransfer}>
                    Confirmer le virement
                    <IonIcon slot="end" icon={checkmarkCircleOutline} />
                  </IonButton>
                </div>
              </div>
            )}
          </IonContent>
        </IonModal>
        
        {/* Success Alert */}
        <IonAlert
          isOpen={showSuccessAlert}
          onDidDismiss={() => setShowSuccessAlert(false)}
          header="Information"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  )
}

export default VirementsDesktop
