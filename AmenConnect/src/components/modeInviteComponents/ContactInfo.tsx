"use client"

import type React from "react"
import { useState } from "react"
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonListHeader,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react"
import { searchOutline, locationOutline, callOutline, mailOutline, timeOutline } from "ionicons/icons"

const BRANCHES = [
  {
    id: 1,
    name: "Agence Principale",
    address: "Avenue Mohamed V, Tunis",
    phone: "+216 71 148 000",
    email: "agence.principale@amenbank.com",
    hours: "Lun-Ven: 8h-17h, Sam: 8h-12h",
  },
  {
    id: 2,
    name: "Agence La Marsa",
    address: "Avenue Habib Bourguiba, La Marsa",
    phone: "+216 71 749 400",
    email: "agence.marsa@amenbank.com",
    hours: "Lun-Ven: 8h-16h30, Sam: 8h-12h",
  },
  {
    id: 3,
    name: "Agence Sousse",
    address: "Avenue 14 Janvier, Sousse",
    phone: "+216 73 368 850",
    email: "agence.sousse@amenbank.com",
    hours: "Lun-Ven: 8h-16h30, Sam: 8h-12h",
  },
  {
    id: 4,
    name: "Agence Sfax",
    address: "Avenue Majida Boulila, Sfax",
    phone: "+216 74 402 500",
    email: "agence.sfax@amenbank.com",
    hours: "Lun-Ven: 8h-16h30, Sam: 8h-12h",
  },
]

const ContactInfo: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0])

  const filteredBranches = BRANCHES.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Adresses et contacts</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonItem>
          <IonInput
            value={searchTerm}
            placeholder="Rechercher une agence"
            onIonChange={(e) => setSearchTerm(e.detail.value!)}
          >
            <IonIcon icon={searchOutline} slot="start" />
          </IonInput>
        </IonItem>

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <IonList>
                <IonListHeader>Nos agences</IonListHeader>
                {filteredBranches.map((branch) => (
                  <IonItem
                    key={branch.id}
                    button
                    onClick={() => setSelectedBranch(branch)}
                    color={selectedBranch.id === branch.id ? "light" : ""}
                  >
                    <IonLabel>{branch.name}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
            <IonCol size="12" sizeMd="8">
              <h2>{selectedBranch.name}</h2>
              <IonList>
                <IonItem>
                  <IonIcon icon={locationOutline} slot="start" />
                  <IonLabel>
                    <h3>Adresse</h3>
                    <p>{selectedBranch.address}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={callOutline} slot="start" />
                  <IonLabel>
                    <h3>Téléphone</h3>
                    <p>{selectedBranch.phone}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={mailOutline} slot="start" />
                  <IonLabel>
                    <h3>Email</h3>
                    <p>{selectedBranch.email}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={timeOutline} slot="start" />
                  <IonLabel>
                    <h3>Horaires d'ouverture</h3>
                    <p>{selectedBranch.hours}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
              <IonButton expand="block" className="ion-margin-top">
                Prendre rendez-vous
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  )
}

export default ContactInfo

