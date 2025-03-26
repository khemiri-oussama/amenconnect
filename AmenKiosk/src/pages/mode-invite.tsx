import React, { useState } from "react"
import { IonContent, IonPage, IonButton, IonIcon, IonBadge, IonToast } from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
  arrowBackOutline,
  calculatorOutline,
  mapOutline,
  helpCircleOutline,
  newspaperOutline,
  cardOutline,
  homeOutline,
  searchOutline,
  notificationsOutline,
  chevronForwardOutline,
} from "ionicons/icons"
import KioskLayout from "../components/KioskLayout"
import AnimatedCard from "../components/AnimatedCard"
import { useOrientation } from "../context/OrientationContext"
import "./mode-invite.css"

const ModeInvite: React.FC = () => {
  const history = useHistory()
  const { isLandscape } = useOrientation()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [featuredService] = useState<string>("Simulateurs")

  const features = [
    {
      name: "Simulateurs",
      icon: calculatorOutline,
      color: "blue",
      description: "Calculez vos prêts et investissements",
      featured: true,
    },
    { 
      name: "Agences", 
      icon: mapOutline, 
      color: "green", 
      description: "Trouvez l'agence la plus proche" 
    },
    { 
      name: "Cartes", 
      icon: cardOutline, 
      color: "yellow", 
      description: "Découvrez nos offres de cartes" 
    },
    { 
      name: "Actualités", 
      icon: newspaperOutline, 
      color: "blue", 
      description: "Suivez nos dernières nouvelles" 
    },
    { 
      name: "Aide", 
      icon: helpCircleOutline, 
      color: "green", 
      description: "Questions fréquentes et support" 
    },
    { 
      name: "Prêts", 
      icon: homeOutline, 
      color: "yellow", 
      description: "Informations sur nos prêts" 
    },
  ]

  const handleFeatureClick = (feature: string) => {
    setToastMessage(`Fonctionnalité "${feature}" en cours de développement`)
    setShowToast(true)
  }

  const filteredFeatures = () => {
    if (!searchQuery) return features

    return features.filter(
      (feature) =>
        feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <KioskLayout pageTitle="Mode Invite">
          <div className="invite-container">
            <AnimatedCard delay={100}>
              <div className="invite-header">
                <IonButton className="invite-back-button" fill="clear" onClick={() => history.push("/home")}>
                  <IonIcon icon={arrowBackOutline} slot="start" />
                  Retour
                </IonButton>
                <h2>Découvrez nos services sans vous connecter</h2>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={200}>
              <div className="invite-notification">
                <div className="invite-notification-icon">
                  <IonIcon icon={notificationsOutline} />
                </div>
                <div className="invite-notification-content">
                  <p>
                    Nouveau! Découvrez notre service <strong>{featuredService}</strong>
                  </p>
                </div>
                <IonButton
                  fill="clear"
                  size="small"
                  className="invite-notification-button"
                  onClick={() => handleFeatureClick(featuredService)}
                >
                  Découvrir
                </IonButton>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={300}>
              <div className="invite-search">
                <div className={`invite-search-box ${isSearchFocused ? "focused" : ""}`}>
                  <IonIcon icon={searchOutline} />
                  <input
                    type="text"
                    placeholder="Rechercher un service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={400}>
              <div className={`invite-features ${isLandscape ? 'landscape' : 'portrait'}`}>
                {filteredFeatures().map((feature, index) => (
                  <div
                    key={index}
                    className={`invite-feature ${feature.color} ${feature.featured ? 'featured' : ''}`}
                    onClick={() => handleFeatureClick(feature.name)}
                  >
                    <div className="invite-feature-icon">
                      <IonIcon icon={feature.icon} />
                    </div>
                    <h3>{feature.name}</h3>
                    <p>{feature.description}</p>
                    {feature.featured && (
                      <IonBadge color="warning" className="invite-feature-badge">
                        Nouveau
                      </IonBadge>
                    )}
                  </div>
                ))}
              </div>
            </AnimatedCard>

            <AnimatedCard delay={500}>
              <div className="invite-cta">
                <p>Vous souhaitez accéder à tous nos services?</p>
                <div className={`invite-cta-buttons ${isLandscape ? 'landscape' : 'portrait'}`}>
                  <IonButton className="invite-cta-login" onClick={() => history.push("/login")}>
                    <span>Se connecter</span>
                    <IonIcon icon={chevronForwardOutline} slot="end" />
                  </IonButton>
                  <IonButton className="invite-cta-register" onClick={() => history.push("/account-creation")}>
                    <span>Créer un compte</span>
                    <IonIcon icon={chevronForwardOutline} slot="end" />
                  </IonButton>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </KioskLayout>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
          color="primary"
        />
      </IonContent>
    </IonPage>
  )
}

export default ModeInvite
