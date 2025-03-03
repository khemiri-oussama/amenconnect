import type React from "react"
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonProgressBar,
} from "@ionic/react"
import { trendingUpOutline, walletOutline } from "ionicons/icons"

export interface AccountSummaryProps {
  balance: number
  accountNumber: string
  monthlyChange?: number
  minBalance?: number
  maxBalance?: number
  balancePercentage?: number
  iban?: string // Make iban optional
}

const AccountSummary: React.FC<AccountSummaryProps> = ({
  balance,
  accountNumber,
  monthlyChange = 0,
  minBalance = 0,
  maxBalance = balance * 2,
  balancePercentage = 0.5,
  iban,
}) => {
  return (
    <IonCard className="account-summary">
      <IonCardHeader>
        <IonCardSubtitle>Solde actuel</IonCardSubtitle>
        <IonCardTitle className="balance">
          <span className="amount">{balance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</span>
          <span className="currency">DT</span>
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div className="account-details">
          <div>
            <IonIcon icon={walletOutline} />
            <span>RIB: {accountNumber}</span>
          </div>
          <div>
            <IonIcon icon={trendingUpOutline} />
            <span>
              {monthlyChange > 0 ? "+" : ""}
              {monthlyChange.toLocaleString("fr-FR")} DT ce mois
            </span>
          </div>
        </div>
        <IonProgressBar
          value={balancePercentage}
          color={balancePercentage > 0.7 ? "warning" : "success"}
          className="balance-progress"
        ></IonProgressBar>
        <div className="balance-info">
          <span>Solde minimum: {minBalance.toLocaleString("fr-FR")} DT</span>
          <span>Solde maximum: {maxBalance.toLocaleString("fr-FR")} DT</span>
        </div>
        {iban && (
          <div className="account-iban">
            <small>IBAN: {iban}</small>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  )
}

export default AccountSummary

