"use client"
import { useState } from "react"
import type React from "react"

import { IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react"
import Navbar from "../../../components/Navbar"
import "./VirementDesktop.css"
import TableauDeBord from "../../../components/virements/tabs/tableau-de-bord"
import VirementSimple from "../../../components/virements/tabs/virement-simple"
import VirementsGroupes from "../../../components/virements/tabs/virements-groupes"
import VirementsProgrammes from "../../../components/virements/tabs/virements-programmes"
import Historique from "../../../components/virements/tabs/historique"
import GestionBeneficiaires from "../../../components/virements/tabs/gestion-beneficiaires"
import "./tableau-de-bord.css"

const VirementDesktop: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tableau-de-bord")

  const renderTabContent = () => {
    switch (activeTab) {
      case "tableau-de-bord":
        return <TableauDeBord />
      case "virement-simple":
        return <VirementSimple />
      case "virements-groupes":
        return <VirementsGroupes />
      case "virements-programmes":
        return <VirementsProgrammes />
      case "historique":
        return <Historique />
      case "gestion-beneficiaires":
        return <GestionBeneficiaires />
      default:
        return <TableauDeBord />
    }
  }

  return (
    <IonPage className="virement-desktop">
      <IonHeader>
        <IonToolbar>
          <Navbar currentPage="virement" />
        </IonToolbar>
      </IonHeader>
      <IonContent className="virement-desktop__content">
        <div className="virement-desktop__container">
          <h1 className="virement-desktop__title">Virements</h1>

          <div className="virement-desktop__tabs">
            <button
              className={`virement-desktop__tab-button ${activeTab === "tableau-de-bord" ? "active" : ""}`}
              onClick={() => setActiveTab("tableau-de-bord")}
            >
              Tableau de bord
            </button>
            <button
              className={`virement-desktop__tab-button ${activeTab === "virement-simple" ? "active" : ""}`}
              onClick={() => setActiveTab("virement-simple")}
            >
              Virement simple
            </button>
            <button
              className={`virement-desktop__tab-button ${activeTab === "virements-groupes" ? "active" : ""}`}
              onClick={() => setActiveTab("virements-groupes")}
            >
              Virements groupés
            </button>
            <button
              className={`virement-desktop__tab-button ${activeTab === "virements-programmes" ? "active" : ""}`}
              onClick={() => setActiveTab("virements-programmes")}
            >
              Virements programmés
            </button>
            <button
              className={`virement-desktop__tab-button ${activeTab === "historique" ? "active" : ""}`}
              onClick={() => setActiveTab("historique")}
            >
              Historique
            </button>
            <button
              className={`virement-desktop__tab-button ${activeTab === "gestion-beneficiaires" ? "active" : ""}`}
              onClick={() => setActiveTab("gestion-beneficiaires")}
            >
              Gestion des bénéficiaires
            </button>
          </div>

          <div className="virement-desktop__tab-content">{renderTabContent()}</div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default VirementDesktop

