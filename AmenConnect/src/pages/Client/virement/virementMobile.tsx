"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  IonContent,
  IonPage,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react"
import { walletOutline, chevronDownCircleOutline } from "ionicons/icons"
import { motion } from "framer-motion"
import { useAuth } from "../../../AuthContext"
import NavMobile from "../../../components/NavMobile"
import "./virementMobile.css"

// Import mobile components
import VirementDashboardMobile from "../../../components/virements/mobile/VirementDashboardMobile"
import VirementSimpleMobile from "../../../components/virements/mobile/VirementSimpleMobile"
import VirementProgrammesMobile from "../../../components/virements/mobile/VirementProgrammesMobile"
import VirementHistoriqueMobile from "../../../components/virements/mobile/VirementHistoriqueMobile"
import VirementGroupesMobile from "../../../components/virements/mobile/VirementGroupesMobile"
import GestionBeneficiairesMobile from "../../../components/virements/mobile/GestionBeneficiairesMobile"

const VirementMobile: React.FC = () => {
  const { profile, authLoading, refreshProfile } = useAuth()
  const [selectedSegment, setSelectedSegment] = useState<string>("dashboard")
  const [today, setToday] = useState<string>("")

  useEffect(() => {
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    setToday(formattedDate)
  }, [])

  const handleRefresh = async (event: CustomEvent) => {
    try {
      await refreshProfile()
    } catch (error) {
      console.error("Refresh failed:", error)
    } finally {
      event.detail.complete()
    }
  }

  const handleSegmentChange = (e: CustomEvent) => {
    setSelectedSegment(e.detail.value)
  }

  const account = profile && profile.comptes && profile.comptes.length > 0 ? profile.comptes[0] : null

  if (authLoading) {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding">
          <p>Chargement des données...</p>
        </IonContent>
      </IonPage>
    )
  }

  return (
    <IonPage>
      <IonContent fullscreen className="custom-content-mobile">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Tirer pour rafraîchir"
            refreshingSpinner="circles"
          ></IonRefresherContent>
        </IonRefresher>

        <div className="safe-area-padding">
          <div className="content-wrapper-mobile">
            <motion.h1
              className="page-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Virements
            </motion.h1>

            {/* Account Card */}
            <motion.div
              className="account-card-mobile"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="account-header-mobile">
                <h2>{account ? account.type : "Compte Epargne"}</h2>
                <IonIcon icon={walletOutline} className="stats-icon-mobile" />
              </div>
              <div className="account-details-mobile">
                <div>
                  <p className="balance-mobile">{account ? `${account.solde} TND` : "450.0 TND"}</p>
                  <p className="account-number-mobile">{account ? account.numéroCompte : "12345678987"}</p>
                </div>
                <p className="expiry-date-mobile">{today}</p>
              </div>
            </motion.div>

            {/* Segment Control */}
            <IonSegment mode="ios" value={selectedSegment} onIonChange={handleSegmentChange} className="custom-segment">
              <IonSegmentButton value="dashboard">
                <IonLabel>Tableau</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="nouveau">
                <IonLabel>Nouveau</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="historique">
                <IonLabel>Historique</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="plus">
                <IonLabel>Plus</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {/* Content based on selected segment */}
            <motion.div
              className="segment-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {selectedSegment === "dashboard" && <VirementDashboardMobile />}

              {selectedSegment === "nouveau" && (
                <div className="transfer-options">
                  <div className="section-header-mobile">
                    <h3 className="section-title">Nouveau virement</h3>
                  </div>
                  <VirementSimpleMobile onSuccess={() => setSelectedSegment("historique")} />
                </div>
              )}

              {selectedSegment === "historique" && <VirementHistoriqueMobile />}

              {selectedSegment === "plus" && (
                <div className="more-options">
                  <div className="options-section">
                    <div className="section-header-mobile">
                      <h3 className="section-title">Virements programmés</h3>
                    </div>
                    <VirementProgrammesMobile onSuccess={() => setSelectedSegment("historique")} />
                  </div>

                  <div className="options-section">
                    <div className="section-header-mobile">
                      <h3 className="section-title">Virements groupés</h3>
                    </div>
                    <VirementGroupesMobile onSuccess={() => setSelectedSegment("historique")} />
                  </div>

                  <div className="options-section">
                    <div className="section-header-mobile">
                      <h3 className="section-title">Gestion des bénéficiaires</h3>
                    </div>
                    <GestionBeneficiairesMobile />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </IonContent>
      <NavMobile currentPage="virement" />
    </IonPage>
  )
}

export default VirementMobile

