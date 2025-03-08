import type React from "react"
import { useEffect, useRef } from "react"
import HelpDeskButton from "../components/HelpDeskButton"
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
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
  logInOutline,
  personOutline,
  helpCircleOutline,
  languageOutline,
  phonePortraitOutline,
  desktopOutline,
  chatbubbleEllipsesOutline,
  shieldCheckmarkOutline,
  cardOutline,
  cashOutline,
  trendingUpOutline,
} from "ionicons/icons"
import "./HomeDesktop.css"

const HomeDesktop: React.FC = () => {
  const history = useHistory()
  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const handleLogin = () => {
    history.push("/login")
  }

  const handleGuestMode = () => {
    history.push("/ModeInvite")
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
      <IonContent ref={contentRef} className="home-desktop-container" fullscreen scrollEvents={true}>
        {/* Background Elements */}
        <div className="home-desktop-background">
          <div className="home-desktop-gradient-1"></div>
          <div className="home-desktop-gradient-2"></div>
          <div className="home-desktop-grid"></div>
        </div>

        {/* Main Content */}
        <div className="home-desktop-content">
          <header className="home-desktop-header">
            <IonImg src="amen_logo.png" alt="Amen Bank Logo" className="home-desktop-logo-image" />
            <nav className="home-desktop-nav">
              <IonButton fill="clear" className="home-desktop-nav-button">
                <IonIcon icon={helpCircleOutline} slot="start" />
                Aide
              </IonButton>
              <IonButton fill="clear" className="home-desktop-nav-button">
                <IonIcon icon={languageOutline} slot="start" />
                Français
              </IonButton>
            </nav>
          </header>

          <main className="home-desktop-main">
            <div className="home-desktop-hero">
              <div className="home-desktop-text">
                <h1 className="home-desktop-title">Bienvenue chez Amen Bank</h1>
                <p className="home-desktop-subtitle">Votre partenaire financier de confiance pour un avenir prospère</p>
              </div>
              <div className="home-desktop-buttons">
                <IonButton expand="block" className="home-desktop-connect-button" onClick={handleLogin}>
                  <IonIcon icon={logInOutline} slot="start" />
                  Se Connecter
                </IonButton>
                <IonButton expand="block" className="home-desktop-guest-button" onClick={handleGuestMode}>
                  <IonIcon icon={personOutline} slot="start" />
                  Mode Invité
                </IonButton>
              </div>
            </div>

            {/* Application Features */}
            <section className="home-desktop-features fade-in-section">
              <h2 className="home-desktop-features-title">Découvrez nos services bancaires innovants</h2>
              <div className="home-desktop-features-grid">
                <IonCard className="home-desktop-feature-card">
                  <IonCardHeader>
                    <IonIcon icon={phonePortraitOutline} className="home-desktop-feature-icon" />
                    <IonCardTitle>Application Hybride</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>
                      Accédez à vos comptes sur mobile, web et totems interactifs. Une expérience bancaire unifiée, où
                      que vous soyez.
                    </p>
                  </IonCardContent>
                </IonCard>
                <IonCard className="home-desktop-feature-card">
                  <IonCardHeader>
                    <IonIcon icon={chatbubbleEllipsesOutline} className="home-desktop-feature-icon" />
                    <IonCardTitle>Chatbot Intelligent</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>
                      Assistance instantanée 24/7 pour répondre à vos questions. Notre chatbot utilise l'IA pour vous
                      offrir un support personnalisé.
                    </p>
                  </IonCardContent>
                </IonCard>
                <IonCard className="home-desktop-feature-card">
                  <IonCardHeader>
                    <IonIcon icon={desktopOutline} className="home-desktop-feature-icon" />
                    <IonCardTitle>Gestion des Comptes</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>
                      Consultez vos soldes, effectuez des virements et gérez vos finances en toute simplicité avec notre
                      interface intuitive.
                    </p>
                  </IonCardContent>
                </IonCard>
                <IonCard className="home-desktop-feature-card">
                  <IonCardHeader>
                    <IonIcon icon={shieldCheckmarkOutline} className="home-desktop-feature-icon" />
                    <IonCardTitle>Sécurité Renforcée</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>
                      Profitez d'une protection avancée avec notre authentification à deux facteurs et nos systèmes de
                      cryptage de pointe.
                    </p>
                  </IonCardContent>
                </IonCard>
              </div>
            </section>

            {/* Additional Services */}
            <section className="home-desktop-services fade-in-section">
              <h2 className="home-desktop-services-title">Nos Services Bancaires</h2>
              <div className="home-desktop-services-grid">
                <div className="home-desktop-service">
                  <IonIcon icon={cardOutline} className="home-desktop-service-icon" />
                  <h3>Cartes Bancaires</h3>
                  <p>Découvrez notre gamme de cartes adaptées à vos besoins</p>
                </div>
                <div className="home-desktop-service">
                  <IonIcon icon={cashOutline} className="home-desktop-service-icon" />
                  <h3>Prêts et Crédits</h3>
                  <p>Des solutions de financement sur mesure pour vos projets</p>
                </div>
                <div className="home-desktop-service">
                  <IonIcon icon={trendingUpOutline} className="home-desktop-service-icon" />
                  <h3>Investissements</h3>
                  <p>Faites fructifier votre patrimoine avec nos conseils experts</p>
                </div>
              </div>
            </section>
          </main>

          <footer className="home-desktop-footer fade-in-section">
            <div className="home-desktop-footer-content">
              <div className="home-desktop-footer-section">
                <h3>À Propos</h3>
                <p>
                  Amen Bank, votre partenaire financier depuis 1967, s'engage à vous offrir des services bancaires
                  innovants et sécurisés.
                </p>
              </div>
              <HelpDeskButton />
              <div className="home-desktop-footer-section">
                <h3>Contactez-nous</h3>
                <p>Email: contact@amenbank.com</p>
                <p>Téléphone: +216 71 148 000</p>
              </div>
              <div className="home-desktop-footer-section">
                <h3>Liens Rapides</h3>
                <ul>
                  <li>
                    <a href="#">Nos Agences</a>
                  </li>
                  <li>
                    <a href="#">Carrières</a>
                  </li>
                  <li>
                    <a href="#">Mentions Légales</a>
                  </li>
                </ul>
              </div>
            </div>
            <p className="home-desktop-copyright">© 2025 Amen Bank. Tous droits réservés.</p>
          </footer>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default HomeDesktop

