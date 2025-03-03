// beneficiaries/beneficiary-item.tsx
import React from "react";
import { IonAvatar, IonButton, IonIcon } from "@ionic/react";
import { arrowForward, createOutline, trashOutline } from "ionicons/icons";
import { useTransfersState } from "../../../hooks/use-transfers-state";
import type { Beneficiary } from "../types/beneficiary";

interface BeneficiaryItemProps {
  beneficiary: Beneficiary;
  index: number;
}

const BeneficiaryItem: React.FC<BeneficiaryItemProps> = ({ beneficiary, index }) => {
  // Get the beneficiaries list and actions from the hook
  const { beneficiaries, actions } = useTransfersState();

  // Handle transferring to beneficiary (customize as needed)
  const handleTransfer = () => {
    console.log("Transfer to beneficiary with ID:", beneficiary.id);
    // You can call any hook action or navigation here if needed.
  };

  // Handle editing beneficiary (customize as needed)
  const handleEdit = () => {
    console.log("Edit beneficiary with ID:", beneficiary.id);
    // Implement edit logic (e.g., open a modal with a form).
  };

  // Handle deletion by updating the beneficiaries state via the hook
  const handleDelete = () => {
    const updatedBeneficiaries = beneficiaries.filter((b) => b.id !== beneficiary.id);
    actions.setBeneficiaries(updatedBeneficiaries);
    console.log("Deleted beneficiary with ID:", beneficiary.id);
  };

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
        <IonButton fill="clear" size="small" onClick={handleTransfer}>
          <IonIcon icon={arrowForward} />
        </IonButton>
        <IonButton fill="clear" size="small" onClick={handleEdit}>
          <IonIcon icon={createOutline} />
        </IonButton>
        <IonButton fill="clear" size="small" color="danger" onClick={handleDelete}>
          <IonIcon icon={trashOutline} />
        </IonButton>
      </div>
    </div>
  );
};

export default BeneficiaryItem;
