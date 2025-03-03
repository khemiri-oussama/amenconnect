import type React from "react"
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonChip, IonIcon } from "@ionic/react"
import { documentTextOutline, createOutline } from "ionicons/icons"
import CsvImport from "./csv-import"
import ManualBatch from "./manual-batch"
import type { Beneficiary } from "../types/beneficiary"

interface GroupTransferViewProps {
  activeTab: string
  onTabChange: (tab: string) => void
  csvFile: File | null
  csvData: any[]
  batchTransfers: any[]
  beneficiaries: Beneficiary[]
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSubmitCsv: () => void
  onAddBatchRow: () => void
  onRemoveBatchRow: (index: number) => void
  onUpdateBatchRow: (index: number, field: string, value: string) => void
  onSubmitBatch: () => void
}

const GroupTransferView: React.FC<GroupTransferViewProps> = ({
  activeTab,
  onTabChange,
  csvFile,
  csvData,
  batchTransfers,
  beneficiaries,
  onFileUpload,
  onSubmitCsv,
  onAddBatchRow,
  onRemoveBatchRow,
  onUpdateBatchRow,
  onSubmitBatch,
}) => {
  return (
    <div className="transfer-container">
      <IonCard className="transfer-card">
        <IonCardHeader>
          <IonCardTitle>Virements Groupés</IonCardTitle>
          <IonCardSubtitle>Effectuez plusieurs virements en une seule opération</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="transfer-tabs">
            <IonChip color={activeTab === "csv" ? "primary" : "medium"} onClick={() => onTabChange("csv")}>
              <IonIcon icon={documentTextOutline} />
              Import CSV
            </IonChip>
            <IonChip color={activeTab === "manual" ? "primary" : "medium"} onClick={() => onTabChange("manual")}>
              <IonIcon icon={createOutline} />
              Saisie Manuelle
            </IonChip>
          </div>

          {activeTab === "csv" ? (
            <CsvImport csvFile={csvFile} csvData={csvData} onFileUpload={onFileUpload} onSubmit={onSubmitCsv} />
          ) : (
            <ManualBatch
              batchTransfers={batchTransfers}
              beneficiaries={beneficiaries}
              onAddRow={onAddBatchRow}
              onRemoveRow={onRemoveBatchRow}
              onUpdateRow={onUpdateBatchRow}
              onSubmit={onSubmitBatch}
            />
          )}
        </IonCardContent>
      </IonCard>
    </div>
  )
}

export default GroupTransferView

