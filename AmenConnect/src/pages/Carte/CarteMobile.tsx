import type React from "react"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import {
  IonContent,
  IonPage,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonImg,
  IonRippleEffect,
} from "@ionic/react"
import {
  homeOutline,
  walletOutline,
  chatbubbleOutline,
  cardOutline,
  arrowForward,
  eyeOutline,
  eyeOffOutline,
} from "ionicons/icons"
import { motion, AnimatePresence } from "framer-motion"
import "./CarteMobile.css"

const CarteMobile: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<string>("details")
  const [isCardNumberVisible, setIsCardNumberVisible] = useState(false)
  const history = useHistory()

  const toggleCardNumber = () => {
    setIsCardNumberVisible(!isCardNumberVisible)
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding-horizontal">
        <div className="status-bar"></div>

        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Mes cartes
        </motion.h1>

        {/* Card Display */}
        <motion.div
          className="card-display"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="credit-card">
            <div className="card-header">
              <span className="card-type">EL AMEN WHITE EMV</span>
              <button className="toggle-visibility" onClick={toggleCardNumber}>
                <IonIcon icon={isCardNumberVisible ? eyeOffOutline : eyeOutline} />
              </button>
            </div>
            <div className="card-body">
              <IonImg src="../puce.png" className="chip" />
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
                <IonImg src="../amen_logo.png" className="bank-name" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Segments */}
        <IonSegment
          mode="ios"
          value={selectedSegment}
          onIonChange={(e) => setSelectedSegment(e.detail.value as string)}
          className="custom-segment"
        >
          <IonSegmentButton value="encours">
            <IonLabel>Encours</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="details">
            <IonLabel>Détails</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="operations">
            <IonLabel>Opérations</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* Card Details */}
        <AnimatePresence mode="wait">
          {selectedSegment === "details" && (
            <motion.div
              key="details"
              className="card-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Détails de la carte</h2>
              {[
                { label: "Titulaire de la carte", value: "Foulen Ben Foulen" },
                { label: "Type de la carte", value: "ELAMENWHITE EMV" },
                { label: "Plafond retrait", value: "10000.0" },
                { label: "Plafond total", value: "10000.0" },
                { label: "Date d'expiration", value: "01/27" },
              ].map((detail, index) => (
                <motion.div
                  key={index}
                  className="detail-item"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <span className="detail-label">{detail.label}</span>
                  <span className="detail-value">{detail.value}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
          {selectedSegment === "encours" && (
            <motion.div
              key="encours"
              className="card-encours"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Encours de la carte</h2>
              <div className="encours-amount">
                <span>Montant disponible</span>
                <span className="amount">5000.00 TND</span>
              </div>
            </motion.div>
          )}
          {selectedSegment === "operations" && (
            <motion.div
              key="operations"
              className="card-operations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Dernières opérations</h2>
              {[
                { date: "2023-05-01", description: "Achat en ligne", amount: -150.0 },
                { date: "2023-04-28", description: "Retrait DAB", amount: -200.0 },
                { date: "2023-04-25", description: "Paiement restaurant", amount: -75.5 },
              ].map((operation, index) => (
                <motion.div
                  key={index}
                  className="operation-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="operation-info">
                    <span className="operation-date">{operation.date}</span>
                    <span className="operation-description">{operation.description}</span>
                  </div>
                  <span className={`operation-amount ${operation.amount < 0 ? "negative" : "positive"}`}>
                    {operation.amount.toFixed(2)} TND
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <div className="bottom-tabs">
          {[
            { icon: homeOutline, label: "Accueil", path: "/accueil" },
            { icon: walletOutline, label: "Compte", path: "/compte" },
            { icon: chatbubbleOutline, label: "Chat", path: "/ChatBot" },
            { icon: cardOutline, label: "Carte", path: "/carte", active: true },
            { icon: arrowForward, label: "Virements", path: "/virements" },
          ].map((tab, index) => (
            <button
              key={index}
              className={`tab-button ${tab.active ? "active" : ""}`}
              onClick={() => tab.path && history.push(tab.path)}
            >
              <IonIcon icon={tab.icon} />
              <span>{tab.label}</span>
              <IonRippleEffect />
            </button>
          ))}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CarteMobile

