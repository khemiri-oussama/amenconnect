import type React from "react"
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonProgressBar, IonButton } from "@ionic/react"
import { walletOutline, alertCircleOutline } from "ionicons/icons"

interface LimitsInfoProps {
  dailyLimit: number
  dailyUsed: number
  monthlyLimit: number
  monthlyUsed: number
  currency: string
  onSupportClick: () => void
}

const LimitsInfo: React.FC<LimitsInfoProps> = ({
  dailyLimit,
  dailyUsed,
  monthlyLimit,
  monthlyUsed,
  currency,
  onSupportClick,
}) => {
  const dailyPercentage = dailyUsed / dailyLimit
  const monthlyPercentage = monthlyUsed / monthlyLimit

  return (
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
              <span>
                {dailyLimit.toLocaleString("fr-FR")} {currency}
              </span>
              <IonProgressBar
                value={dailyPercentage}
                color={dailyPercentage > 0.7 ? "warning" : "success"}
              ></IonProgressBar>
            </div>
          </div>
          <div className="limit-item">
            <IonIcon icon={alertCircleOutline} />
            <div>
              <h4>Limite Mensuelle</h4>
              <span>
                {monthlyLimit.toLocaleString("fr-FR")} {currency}
              </span>
              <IonProgressBar
                value={monthlyPercentage}
                color={monthlyPercentage > 0.7 ? "warning" : "success"}
              ></IonProgressBar>
            </div>
          </div>
        </div>
        <IonButton expand="block" fill="clear" className="chat-button" onClick={onSupportClick}>
          Contacter le Support
        </IonButton>
      </IonCardContent>
    </IonCard>
  )
}

export default LimitsInfo

