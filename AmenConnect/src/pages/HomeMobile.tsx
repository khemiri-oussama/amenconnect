import type React from "react"
import { useEffect, useRef } from "react"
import {
  IonContent,
  IonPage,
  IonButton,
  IonImg,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonFab,
  IonFabButton,
  IonFabList,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
  logInOutline,
  personOutline,
  helpCircleOutline,
  languageOutline,
  phonePortraitOutline,
  chatbubbleEllipsesOutline,
  shieldCheckmarkOutline,
  cardOutline,
  cashOutline,
  trendingUpOutline,
  menuOutline,
} from "ionicons/icons"
import "./HomeMobile.css"

const HomeMobile: React.FC = () => {
  const history = useHistory()
  const contentRef = useRef<HTMLIonContentElement>(null)

  const handleLogin = () => {
    history.push("/login")
  }

  const handleGuestMode = () => {
    // Implement guest mode logic here
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollElement = contentRef.current?.shadowRoot?.querySelector(".inner-scroll")
      if (scrollElement) {
        const scrollPosition = scrollElement.scrollTop
        const windowHeight = window.innerHeight

        document.querySelectorAll(".fade-in-section").forEach((element) => {
          const rect = (element as HTMLElement).getBoundingClientRect()
          const elementTop = rect.top + scrollPosition
          const elementVisible = 150

          if (elementTop < scrollPosition + windowHeight - elementVisible) {
            element.classList.add("is-visible")
          } else {
            element.classList.remove("is-visible")
          }
        })
      }
    }

    contentRef.current?.addEventListener("ionScroll", handleScroll)

    return () => {
      contentRef.current?.removeEventListener("ionScroll", handleScroll)
    }
  }, [])

  return (
    <IonPage>
      <IonContent ref={contentRef} className="home-mobile-container" fullscreen scrollEvents={true}>
        {/* Background Elements */}
        <div className="home-mobile-background">
          <div className="home-mobile-gradient-1"></div>
          <div className="home-mobile-gradient-2"></div>
          <div className="home-mobile-grid"></div>
        </div>

        {/* Main Content */}
        <div className="home-mobile-content">
          <header className="home-mobile-header">
            <IonImg src="amen_logo.png" alt="Amen Bank Logo" className="home-mobile-logo-image" />
          </header>

          <main className="home-mobile-main">
            <div className="home-mobile-hero">
              <h1 className="home-mobile-title">Bienvenue chez Amen Bank</h1>
              <p className="home-mobile-subtitle">Votre partenaire financier de confiance</p>
              <div className="home-mobile-buttons">
                <IonButton expand="block" className="home-mobile-connect-button" onClick={handleLogin}>
                  <IonIcon icon={logInOutline} slot="start" />
                  Se Connecter
                </IonButton>
                <IonButton expand="block" className="home-mobile-guest-button" onClick={handleGuestMode}>
                  <IonIcon icon={personOutline} slot="start" />
                  Mode Invité
                </IonButton>
              </div>
            </div>

            {/* Application Features */}
            <section className="home-mobile-features fade-in-section">
              <h2 className="home-mobile-section-title">Nos Services Innovants</h2>
              <IonCard className="home-mobile-feature-card">
                <IonCardHeader>
                  <IonIcon icon={phonePortraitOutline} className="home-mobile-feature-icon" />
                  <IonCardTitle>Application Hybride</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>Accédez à vos comptes partout, sur tous vos appareils.</IonCardContent>
              </IonCard>
              <IonCard className="home-mobile-feature-card">
                <IonCardHeader>
                  <IonIcon icon={chatbubbleEllipsesOutline} className="home-mobile-feature-icon" />
                  <IonCardTitle>Chatbot Intelligent</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>Assistance 24/7 avec notre chatbot IA personnalisé.</IonCardContent>
              </IonCard>
              <IonCard className="home-mobile-feature-card">
                <IonCardHeader>
                  <IonIcon icon={shieldCheckmarkOutline} className="home-mobile-feature-icon" />
                  <IonCardTitle>Sécurité Renforcée</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>Protection avancée pour vos transactions bancaires.</IonCardContent>
              </IonCard>
            </section>

            {/* Additional Services */}
            <section className="home-mobile-services fade-in-section">
              <h2 className="home-mobile-section-title">Nos Services Bancaires</h2>
              <div className="home-mobile-services-grid">
                <div className="home-mobile-service">
                  <IonIcon icon={cardOutline} className="home-mobile-service-icon" />
                  <h3>Cartes Bancaires</h3>
                </div>
                <div className="home-mobile-service">
                  <IonIcon icon={cashOutline} className="home-mobile-service-icon" />
                  <h3>Prêts et Crédits</h3>
                </div>
                <div className="home-mobile-service">
                  <IonIcon icon={trendingUpOutline} className="home-mobile-service-icon" />
                  <h3>Investissements</h3>
                </div>
              </div>
            </section>
          </main>

          <footer className="home-mobile-footer fade-in-section">
            <p>© 2025 Amen Bank. Tous droits réservés.</p>
          </footer>
        </div>

        {/* Floating Action Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={menuOutline} />
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton>
              <IonIcon icon={helpCircleOutline} />
            </IonFabButton>
            <IonFabButton>
              <IonIcon icon={languageOutline} />
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default HomeMobile

