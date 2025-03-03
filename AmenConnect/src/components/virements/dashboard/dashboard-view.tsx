import type React from "react"
import { IonGrid, IonRow, IonCol } from "@ionic/react"
import AccountSummary from "./account-summary"
import RecentTransactions from "./recent-transactions"
import QuickActions from "./quick-actions"
import QuickTransferForm from "./quick-transfer-form"
import LimitsInfo from "./limits-info"
import type { Transfer } from "./../types/transfer"
import type { Beneficiary } from "./../types/beneficiary"
import type { Account } from "./../types/accounts"

export interface DashboardViewProps {
  transferHistory: Transfer[]
  beneficiaries: Beneficiary[]
  newTransfer: {
    beneficiaryId: string
    accountFrom: string
    amount: string
    reason: string
    date: string
    frequency: "once"
    endDate: string
  }
  onTransferChange: (field: string, value: string) => void
  onShowTransferModal: () => void
  onSetRecurring: (value: boolean) => void
  onViewAllHistory: () => void
  onTabChange: (tab: string) => void
  onSetSimpleTransferTab: (tab: string) => void
  onSetGroupTransferTab: (tab: string) => void
  accounts: Account[]
  mainAccount?: Account
  limits: {
    daily: {
      limit: number
      used: number
    }
    monthly: {
      limit: number
      used: number
    }
  }
}

const DashboardView: React.FC<DashboardViewProps> = ({
  transferHistory,
  beneficiaries,
  newTransfer,
  onTransferChange,
  onShowTransferModal,
  onSetRecurring,
  onViewAllHistory,
  onTabChange,
  onSetSimpleTransferTab,
  onSetGroupTransferTab,
  accounts,
  mainAccount,
  limits,
}) => {
  return (
    <IonGrid className="dashboard-grid">
      <IonRow>
        <IonCol size="12" sizeMd="8">
          <AccountSummary
            balance={mainAccount?.balance || 0}
            accountNumber={mainAccount?.value || ""}
            monthlyChange={1250}
            minBalance={1000}
            maxBalance={3000}
            balancePercentage={0.7}
            iban={mainAccount?.iban}
          />

          <RecentTransactions transactions={transferHistory} onViewAllClick={onViewAllHistory} />
        </IonCol>

        <IonCol size="12" sizeMd="4">
          <QuickActions
            onNewTransfer={() => {
              onTabChange("simple-transfer")
              onSetSimpleTransferTab("quick")
            }}
            onRecurringTransfer={() => {
              onSetRecurring(true)
              onShowTransferModal()
            }}
            onCsvImport={() => {
              onTabChange("group-transfer")
              onSetGroupTransferTab("csv")
            }}
            onScheduledTransfers={() => onTabChange("scheduled")}
          />

          <QuickTransferForm
            beneficiaries={beneficiaries}
            selectedBeneficiaryId={newTransfer.beneficiaryId}
            amount={newTransfer.amount}
            reason={newTransfer.reason}
            onBeneficiaryChange={(value) => onTransferChange("beneficiaryId", value)}
            onAmountChange={(value) => onTransferChange("amount", value)}
            onReasonChange={(value) => onTransferChange("reason", value)}
            onSubmit={onShowTransferModal}
            accounts={accounts}
            selectedAccountId={newTransfer.accountFrom}
            onAccountChange={(value) => onTransferChange("accountFrom", value)}
          />

          <LimitsInfo
            dailyLimit={limits.daily.limit}
            dailyUsed={limits.daily.used}
            monthlyLimit={limits.monthly.limit}
            monthlyUsed={limits.monthly.used}
            currency="DT"
            onSupportClick={() => console.log("Support clicked")}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}

export default DashboardView

