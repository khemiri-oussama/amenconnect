import type React from "react"
import { IonAvatar, IonButton, IonIcon } from "@ionic/react"
import { arrowForward, createOutline, trashOutline } from "ionicons/icons"
import type { Beneficiary } from "../types/beneficiary"

interface BeneficiaryItemProps {
  beneficiary: Beneficiary
  index: number
  onTransfer: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const BeneficiaryItem: React.FC<BeneficiaryItemProps> = ({ beneficiary, index, onTransfer, onEdit, onDelete }) => {
  return (
    <div className="beneficiary-item">
      <IonAvatar className="beneficiary-avatar">
        <img src={`https://i.pravatar.cc/100?img=${index + 10}`} alt="Avatar" />
      </IonAvatar>

      <div className="beneficiary-details">
        <h4>{beneficiary.name}</h4>
        <div className="account-number">{beneficiary.accountNumber}</div>
        {beneficiary.bank && <div className="bank-name">{beneficiary.bank}</div>}
      </div>

      <div className="beneficiary-actions">
        <IonButton fill="clear" size="small" onClick={() => onTransfer(beneficiary.id)}>
          <IonIcon icon={arrowForward} />
        </IonButton>
        <IonButton fill="clear" size="small" onClick={() => onEdit(beneficiary.id)}>
          <IonIcon icon={createOutline} />
        </IonButton>
        <IonButton fill="clear" size="small" color="danger" onClick={() => onDelete(beneficiary.id)}>
          <IonIcon icon={trashOutline} />
        </IonButton>
      </div>
    </div>
  )
}

export default BeneficiaryItem

