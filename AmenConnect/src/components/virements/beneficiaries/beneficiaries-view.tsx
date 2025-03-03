"use client"

import type React from "react"
import { useState } from "react"
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSearchbar,
  IonButton,
  IonIcon,
} from "@ionic/react"
import { addCircleOutline } from "ionicons/icons"
import BeneficiaryItem from "./beneficiary-item"
import type { Beneficiary } from "../types/beneficiary"

interface BeneficiariesViewProps {
  beneficiaries: Beneficiary[]
  onNewBeneficiary: () => void
  onTransferToBeneficiary: (id: string) => void
  onEditBeneficiary: (id: string) => void
  onDeleteBeneficiary: (id: string) => void
}

const BeneficiariesView: React.FC<BeneficiariesViewProps> = ({
  beneficiaries,
  onNewBeneficiary,
  onTransferToBeneficiary,
  onEditBeneficiary,
  onDeleteBeneficiary,
}) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBeneficiaries = beneficiaries.filter(
    (ben) => ben.name.toLowerCase().includes(searchTerm.toLowerCase()) || ben.accountNumber.includes(searchTerm),
  )

  return (
    <div className="beneficiaries-container">
      <IonCard className="beneficiaries-card">
        <IonCardHeader>
          <IonCardTitle>Gestion des Bénéficiaires</IonCardTitle>
          <IonCardSubtitle>Gérez votre liste de bénéficiaires pour vos virements</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="beneficiaries-header">
            <IonSearchbar
              placeholder="Rechercher un bénéficiaire"
              className="beneficiary-search"
              value={searchTerm}
              onIonChange={(e) => setSearchTerm(e.detail.value || "")}
            ></IonSearchbar>
            <IonButton fill="outline" onClick={onNewBeneficiary}>
              <IonIcon icon={addCircleOutline} slot="start" />
              Nouveau Bénéficiaire
            </IonButton>
          </div>

          <div className="beneficiaries-list">
            {filteredBeneficiaries.length > 0 ? (
              filteredBeneficiaries.map((ben, index) => (
                <BeneficiaryItem
                  key={ben.id}
                  beneficiary={ben}
                  index={index}
                  onTransfer={onTransferToBeneficiary}
                  onEdit={onEditBeneficiary}
                  onDelete={onDeleteBeneficiary}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>Aucun bénéficiaire ne correspond à votre recherche</p>
              </div>
            )}
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  )
}

export default BeneficiariesView

