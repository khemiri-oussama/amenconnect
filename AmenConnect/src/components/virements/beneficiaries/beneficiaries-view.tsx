// beneficiaries/beneficiaries-view.tsx
import { useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonInput,
} from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import BeneficiaryItem from "./beneficiary-item";
import { useTransfersState } from "../../../hooks/use-transfers-state";
import axios from "axios";
import type { Beneficiary } from "../types/beneficiary";

const BeneficiariesView: React.FC = () => {
  const { beneficiaries, actions } = useTransfersState();
  const [searchTerm, setSearchTerm] = useState("");
  const [newBeneficiary, setNewBeneficiary] = useState<Beneficiary>({
    id: "",
    name: "",
    accountNumber: "",
    bank: "",
  });

  // Filter beneficiaries based on search
  const filteredBeneficiaries = beneficiaries.filter(
    (ben) =>
      ben.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ben.accountNumber.includes(searchTerm)
  );

  // Handle form input change
  const handleInputChange = (field: keyof Beneficiary, value: string) => {
    setNewBeneficiary((prev) => ({ ...prev, [field]: value }));
  };

  // Handle adding a new beneficiary
  const addBeneficiary = async () => {
    if (!newBeneficiary.name || !newBeneficiary.accountNumber) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Optional: Call your backend API to persist the new beneficiary.
      const response = await axios.post(
        "/api/beneficiaries",
        {
          name: newBeneficiary.name,
          accountNumber: newBeneficiary.accountNumber,
          bankName: newBeneficiary.bank, // Your backend expects "bankName"
        },
        {
          withCredentials: true,
        }
      );

      // The newly created beneficiary might be in response.data or response.data.beneficiary
      const createdBeneficiary: Beneficiary =
        response.data.beneficiary || response.data;

      // Update the beneficiaries list in the hook's state
      actions.setBeneficiaries((prev) => [createdBeneficiary, ...prev]);
    } catch (error: any) {
      console.error("Error adding beneficiary:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while adding beneficiary."
      );
    } finally {
      // Reset the new beneficiary form
      setNewBeneficiary({ id: "", name: "", accountNumber: "", bank: "" });
    }
  };

  return (
    <div className="beneficiaries-container">
      <IonCard className="beneficiaries-card">
        <IonCardHeader>
          <IonCardTitle>Gestion des Bénéficiaires</IonCardTitle>
          <IonCardSubtitle>
            Gérez votre liste de bénéficiaires pour vos virements
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          {/* Search Bar */}
          <IonSearchbar
            placeholder="Rechercher un bénéficiaire"
            className="beneficiary-search"
            value={searchTerm}
            onIonChange={(e) => setSearchTerm(e.detail.value || "")}
          />

          {/* New Beneficiary Form */}
          <div className="new-beneficiary-form">
            <IonInput
              placeholder="Nom du bénéficiaire"
              value={newBeneficiary.name}
              onIonChange={(e) => handleInputChange("name", e.detail.value!)}
            />
            <IonInput
              placeholder="Numéro de compte"
              value={newBeneficiary.accountNumber}
              onIonChange={(e) =>
                handleInputChange("accountNumber", e.detail.value!)
              }
            />
            <IonInput
              placeholder="Banque (optionnel)"
              value={newBeneficiary.bank}
              onIonChange={(e) => handleInputChange("bank", e.detail.value!)}
            />
            <IonButton onClick={addBeneficiary}>
              <IonIcon icon={addCircleOutline} slot="start" />
              Ajouter
            </IonButton>
          </div>

          {/* Beneficiaries List */}
          <div className="beneficiaries-list">
            {filteredBeneficiaries.length > 0 ? (
              filteredBeneficiaries.map((ben, index) => (
                <BeneficiaryItem
                  key={ben.id}
                  beneficiary={ben}
                  index={index}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>Aucun bénéficiaire trouvé</p>
              </div>
            )}
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default BeneficiariesView;
