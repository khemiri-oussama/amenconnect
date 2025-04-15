"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { IonPage, IonContent, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonSpinner } from "@ionic/react"
import {
  arrowForwardOutline,
  peopleOutline,
  timeOutline,
  gridOutline,
  calendarOutline,
  layersOutline,
  chevronBackOutline,
} from "ionicons/icons"
import { useHistory } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import NavbarKiosk from "../../components/NavbarKiosk"
import "./virement.css"

// Import all the required components
import GestionBeneficiaires from "../../components/virement/gestion-beneficiaires"
import Historique from "../../components/virement/historique"
import TableauDeBord from "../../components/virement/tableau-de-bord"
import VirementSimple from "../../components/virement/virement-simple"
import VirementsGroupes from "../../components/virement/virements-groupes"
import VirementsProgrammes from "../../components/virement/virements-programmes"

const Virement: React.FC = () => {
  const { profile, authLoading } = useAuth()
  const history = useHistory()
  const [activeTab, setActiveTab] = useState<string>("tableau-de-bord")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [activeTab])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleBack = () => {
    history.push("/accueil")
  }

  if (authLoading) {
    return (
      <div className="virement-kiosk-loading">
        <IonSpinner name="crescent" />
        <p>Chargement des données...</p>
      </div>
    )
  }

  return (
    <IonPage>
      <NavbarKiosk currentPage="virement" />
      <IonContent fullscreen>
        <div className="virement-kiosk-container">
          <div className="background-white"></div>
          <svg className="background-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 983 1920" fill="none">
            <path
              d="M0 0H645.236C723.098 0 770.28 85.9638 728.469 151.647C697.151 200.847 715.114 266.33 767.152 292.664L793.096 305.793C854.316 336.773 866.865 418.795 817.709 466.662L691.328 589.731C677.652 603.048 659.319 610.5 640.231 610.5C577.253 610.5 543.641 684.721 585.184 732.054L641.155 795.826C676.082 835.621 671.964 896.237 631.974 930.943L582.069 974.254C522.93 1025.58 568.96 1122.18 646.076 1108.59C700.297 1099.03 746.811 1147.67 734.833 1201.41L727.617 1233.79C715.109 1289.9 752.705 1344.88 809.534 1353.59L836.788 1357.76C862.867 1361.76 886.31 1375.9 902.011 1397.1L964.656 1481.7C1003.87 1534.65 970.947 1610.18 905.469 1617.5C862.212 1622.34 829.5 1658.92 829.5 1702.44V1717.72C829.5 1756.01 800.102 1787.88 761.94 1790.96L696.194 1796.27C667.843 1798.56 652.928 1831 669.644 1854.01C685.614 1876 672.771 1907.1 645.942 1911.41L597.738 1919.16C594.251 1919.72 590.726 1920 587.195 1920H462.5H200.5H0V0Z"
              fill="#47CE65"
              stroke="#47CE65"
            />
          </svg>

          <div className="virement-kiosk-content">
            <div className="virement-kiosk-header">
              <div className="virement-kiosk-back-btn" onClick={handleBack}>
                <IonIcon icon={chevronBackOutline} />
                <span>Retour</span>
              </div>
              <h1 className="virement-kiosk-title">Virements</h1>
              <p className="virement-kiosk-subtitle">Gérez vos virements et bénéficiaires</p>
            </div>

            <div className="virement-kiosk-tabs">
              <IonSegment value={activeTab} onIonChange={(e) => handleTabChange(e.detail.value as string)}>
                <IonSegmentButton value="tableau-de-bord">
                  <IonIcon icon={gridOutline} />
                  <IonLabel>Tableau de bord</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="virement-simple">
                  <IonIcon icon={arrowForwardOutline} />
                  <IonLabel>Virement simple</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="virements-groupes">
                  <IonIcon icon={layersOutline} />
                  <IonLabel>Virements groupés</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="virements-programmes">
                  <IonIcon icon={calendarOutline} />
                  <IonLabel>Virements programmés</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="gestion-beneficiaires">
                  <IonIcon icon={peopleOutline} />
                  <IonLabel>Bénéficiaires</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="historique">
                  <IonIcon icon={timeOutline} />
                  <IonLabel>Historique</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </div>

            <div className="virement-kiosk-tab-content">
              {isLoading ? (
                <div className="virement-kiosk-loading-content">
                  <IonSpinner name="crescent" />
                  <p>Chargement...</p>
                </div>
              ) : (
                <>
                  {activeTab === "tableau-de-bord" && <TableauDeBord profile={profile} />}
                  {activeTab === "virement-simple" && <VirementSimple profile={profile} />}
                  {activeTab === "virements-groupes" && <VirementsGroupes profile={profile} />}
                  {activeTab === "virements-programmes" && <VirementsProgrammes profile={profile} />}
                  {activeTab === "gestion-beneficiaires" && <GestionBeneficiaires profile={profile} />}
                  {activeTab === "historique" && <Historique profile={profile} />}
                </>
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Virement
