import type React from "react"
import { useState } from "react"
import { IonContent, IonPage, IonIcon, IonSearchbar, IonLabel, IonSegment, IonSegmentButton } from "@ionic/react"
import { SegmentCustomEvent } from '@ionic/react';
import { cashOutline, businessOutline } from "ionicons/icons"
import { useHistory } from "react-router-dom"
import "./virementMobile.css"
import NavMobile from "../../components/NavMobile"

const VirementsMobile: React.FC = () => {
  const history = useHistory()
  const [selectedSegment, setSelectedSegment] = useState("historique")

  // ✅ Properly typed onIonChange handler
  const handleSegmentChange = (event: SegmentCustomEvent) => {
    setSelectedSegment(String(event.detail.value ?? "historique"));    // ✅ Ensures a fallback value
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding-horizontal dark-theme">
        <div className="status-bar"></div>

        <h1 className="page-title">Virements</h1>

        {/* Transfer Options */}
        <div className="transfer-options">
          <button className="transfer-card" onClick={() => history.push("/beneficiary-transfer")}>
            <div className="transfer-icon">
              <IonIcon icon={cashOutline} />
            </div>
            <p>Effectuer un virement vers un bénéficiaire</p>
          </button>

          <button className="transfer-card" onClick={() => history.push("/account-transfer")}>
            <div className="transfer-icon">
              <IonIcon icon={businessOutline} />
            </div>
            <p>Effectuer un virement de compte à compte</p>
          </button>
        </div>

        {/* Segments */}
        <IonSegment value={selectedSegment} onIonChange={handleSegmentChange} className="custom-segment">
          <IonSegmentButton value="historique">
            <IonLabel>Historique</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="a-signer">
            <IonLabel>Virement à signer</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* History Section */}
        {selectedSegment === "historique" && (
          <div className="history-section">
            <h2>Historique</h2>
            <IonSearchbar placeholder="Rechercher" className="custom-searchbar"></IonSearchbar>
            <div className="transfers-list">{/* Add transfer history items here */}</div>
          </div>
        )}
        
      </IonContent>
      <NavMobile currentPage="virements" />
    </IonPage>
  )
}

export default VirementsMobile
