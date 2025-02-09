"use client"

import type React from "react"
import { useState } from "react"
import Navbar from "../../components/Navbar"
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonListHeader,
  IonSegment,
  IonSegmentButton,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
} from "@ionic/react"
import {
  notificationsOutline,
  settingsOutline,
  arrowForward,
  trendingUp,
  repeat,
  time,
  helpCircleOutline,
} from "ionicons/icons"
import "./VirementDesktop.css"

const VirementsDesktop: React.FC = () => {
  const [beneficiary, setBeneficiary] = useState("")
  const [amount, setAmount] = useState("")
  const [activeTab, setActiveTab] = useState("history")

  const transfers = [
    { id: 1, type: "outgoing", name: "Ahmed Ben Ali", date: "15 juil. 2023", amount: -1000 },
    { id: 2, type: "incoming", name: "Société XYZ", date: "10 juil. 2023", amount: 2500 },
    { id: 3, type: "outgoing", name: "Fatma Trabelsi", date: "05 juil. 2023", amount: -750 },
  ]

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <Navbar />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol sizeMd="6" sizeLg="4">
              <IonCard className="glass-card">
                <IonCardHeader>
                  <IonCardTitle>Virement rapide</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonItem>
                    <IonLabel position="floating">Bénéficiaire</IonLabel>
                    <IonInput value={beneficiary} onIonChange={(e) => setBeneficiary(e.detail.value!)} />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Montant (DT)</IonLabel>
                    <IonInput type="number" value={amount} onIonChange={(e) => setAmount(e.detail.value!)} />
                  </IonItem>
                  <IonButton expand="block" className="ion-margin-top">
                    Effectuer le virement
                    <IonIcon slot="end" icon={arrowForward} />
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol sizeMd="6" sizeLg="4">
              <IonCard className="glass-card">
                <IonCardHeader>
                  <IonCardTitle>Résumé des virements</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList lines="none">
                    <IonItem>
                      <IonIcon icon={trendingUp} slot="start" />
                      <IonLabel>
                        <h3>Total des virements ce mois</h3>
                        <p>5 250 DT</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonIcon icon={repeat} slot="start" />
                      <IonLabel>
                        <h3>Nombre de virements</h3>
                        <p>12</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonIcon icon={time} slot="start" />
                      <IonLabel>
                        <h3>Prochain virement prévu</h3>
                        <p>Loyer - 800 DT - 01/08/2023</p>
                      </IonLabel>
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol sizeMd="12" sizeLg="4">
              <IonCard className="glass-card">
                <IonCardHeader>
                  <IonCardTitle>Historique des virements</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonSegment value={activeTab} onIonChange={(e) => setActiveTab(e.detail.value!)}>
                    <IonSegmentButton value="history">
                      <IonLabel>Historique</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="pending">
                      <IonLabel>En attente</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                  <IonList>
                    {transfers.map((transfer) => (
                      <IonItem key={transfer.id}>
                        <IonLabel>
                          <h2>{transfer.name}</h2>
                          <p>{transfer.date}</p>
                        </IonLabel>
                        <IonBadge slot="end" color={transfer.amount > 0 ? "success" : "danger"}>
                          {transfer.amount > 0 ? "+" : ""}
                          {transfer.amount} DT
                        </IonBadge>
                      </IonItem>
                    ))}
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol sizeMd="6" sizeLg="4">
              <IonCard className="glass-card">
                <IonCardHeader>
                  <IonCardTitle>Actions rapides</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton expand="block" fill="outline" className="ion-margin-bottom">
                    Nouveau virement
                  </IonButton>
                  <IonButton expand="block" fill="outline" className="ion-margin-bottom">
                    Gérer les virements récurrents
                  </IonButton>
                  <IonButton expand="block" fill="outline">
                    Télécharger le relevé
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol sizeMd="6" sizeLg="4">
              <IonCard className="glass-card">
                <IonCardHeader>
                  <IonCardTitle>Aide et informations</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList lines="none">
                    <IonListHeader>
                      <IonLabel>Limites de virement</IonLabel>
                    </IonListHeader>
                    <IonItem>
                      <IonLabel>Quotidien max : 10 000 DT</IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>Mensuel max : 50 000 DT</IonLabel>
                    </IonItem>
                    <IonListHeader>
                      <IonLabel>Délais de traitement</IonLabel>
                    </IonListHeader>
                    <IonItem>
                      <IonLabel>Interne : Instantané</IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>Externe : 1-2 jours ouvrés</IonLabel>
                    </IonItem>
                  </IonList>
                  <IonButton expand="block" fill="clear">
                    Centre d'aide
                    <IonIcon slot="end" icon={helpCircleOutline} />
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}



export default VirementsDesktop

