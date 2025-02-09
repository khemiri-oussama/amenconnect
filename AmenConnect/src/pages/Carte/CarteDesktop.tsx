"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  IonContent,
  IonPage,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react"
import { eyeOutline, eyeOffOutline, cardOutline, cashOutline, listOutline } from "ionicons/icons"
import Navbar from "../../components/Navbar" 
import "./CarteDesktop.css"

const CarteDesktop: React.FC = () => {
  const [isCardNumberVisible, setIsCardNumberVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const toggleCardNumber = () => {
    setIsCardNumberVisible(!isCardNumberVisible)
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="carte-desktop-container">
          <motion.h1
            className="page-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Mes cartes
          </motion.h1>

          <div className="carte-desktop-content">
            <div className="carte-desktop-left">
              <motion.div
                className="credit-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="card-header">
                  <span className="card-type">EL AMEN WHITE EMV</span>
                  <IonButton fill="clear" onClick={toggleCardNumber}>
                    <IonIcon icon={isCardNumberVisible ? eyeOffOutline : eyeOutline} />
                  </IonButton>
                </div>
                <div className="card-body">
                  <img src="/puce.png" alt="Card Chip" className="chip" />
                  <motion.div className="card-number" animate={{ opacity: isCardNumberVisible ? 1 : 0.5 }}>
                    {isCardNumberVisible ? "1234 5678 9012 3456" : "1234 •••• •••• 3456"}
                  </motion.div>
                  <div className="card-holder">Foulen ben foulen</div>
                </div>
                <div className="card-footer">
                  <div className="expiry">
                    <span>Expire à </span>
                    <span>01/28</span>
                  </div>
                  <div className="bank-logo">
                    <img src="/amen_logo.png" alt="Amen Bank" className="bank-name" />
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="carte-desktop-right">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Détails de la carte</IonCardTitle>
                  <IonCardSubtitle>Gérez vos informations de carte</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonSegment value={activeTab} onIonChange={(e) => setActiveTab(e.detail.value as string)}>
                    <IonSegmentButton value="details">
                      <IonIcon icon={cardOutline} />
                      <IonLabel>Détails</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="encours">
                      <IonIcon icon={cashOutline} />
                      <IonLabel>Encours</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="operations">
                      <IonIcon icon={listOutline} />
                      <IonLabel>Opérations</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>

                  {activeTab === "details" && (
                    <IonList>
                      {[
                        { label: "Titulaire de la carte", value: "Foulen Ben Foulen" },
                        { label: "Type de la carte", value: "ELAMENWHITE EMV" },
                        { label: "Plafond retrait", value: "10000.0" },
                        { label: "Plafond total", value: "10000.0" },
                        { label: "Date d'expiration", value: "01/27" },
                      ].map((detail, index) => (
                        <IonItem key={index}>
                          <IonLabel>{detail.label}</IonLabel>
                          <IonLabel slot="end">{detail.value}</IonLabel>
                        </IonItem>
                      ))}
                    </IonList>
                  )}

                  {activeTab === "encours" && (
                    <div className="card-encours">
                      <h3>Encours de la carte</h3>
                      <div className="encours-amount">
                        <span>Montant disponible</span>
                        <span className="amount">5000.00 TND</span>
                      </div>
                    </div>
                  )}

                  {activeTab === "operations" && (
                    <IonList>
                      {[
                        { date: "2023-05-01", description: "Achat en ligne", amount: -150.0 },
                        { date: "2023-04-28", description: "Retrait DAB", amount: -200.0 },
                        { date: "2023-04-25", description: "Paiement restaurant", amount: -75.5 },
                      ].map((operation, index) => (
                        <IonItem key={index}>
                          <IonLabel>
                            <h3>{operation.date}</h3>
                            <p>{operation.description}</p>
                          </IonLabel>
                          <IonLabel slot="end" color={operation.amount < 0 ? "danger" : "success"}>
                            {operation.amount.toFixed(2)} TND
                          </IonLabel>
                        </IonItem>
                      ))}
                    </IonList>
                  )}
                </IonCardContent>
                <div className="ion-padding">
                  <IonButton expand="block">Gérer la carte</IonButton>
                </div>
              </IonCard>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CarteDesktop

