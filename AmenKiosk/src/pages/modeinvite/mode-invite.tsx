"use client"

import type React from "react"
import { useRef, useState, useEffect, useCallback } from "react"
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
  IonSearchbar,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
  helpCircleOutline,
  languageOutline,
  walletOutline,
  cashOutline,
  calculatorOutline,
  trendingUpOutline,
  locationOutline,
  informationCircleOutline,
  peopleOutline,
  mailOutline,
  closeOutline,
  chevronForwardOutline,
  arrowBackOutline,
} from "ionicons/icons"
import "./mode-invite.css"
import CurrencyExchange from "../../components/modeInviteComponents/CurrencyExchange"
import CreditSimulator from "../../components/modeInviteComponents/CreditSimulator"
import ContactInfo from "../../components/modeInviteComponents/ContactInfo"
import AboutSection from "../../components/modeInviteComponents/AboutSection"
import ContactUs from "../../components/modeInviteComponents/contact-us"
import SicavEtBourse from "../../components/modeInviteComponents/sicav-et-bourse"
import Informations from "../../components/modeInviteComponents/informations"
import NosOffres from "../../components/modeInviteComponents/nos-offres"
import HelpDeskButton from "../../components/HelpDeskButton"

const ModeInviteKiosk: React.FC = () => {
  const history = useHistory()
  const [active, setActive] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  const inactivityTimer = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const contentRef = useRef<HTMLIonContentElement | null>(null)

  const sections = [
    { title: "Nos offres", icon: walletOutline, color: "primary" },
    { title: "Devises", icon: cashOutline, color: "secondary" },
    { title: "Simulateur de crédit", icon: calculatorOutline, color: "tertiary" },
    { title: "Sicav et Bourse", icon: trendingUpOutline, color: "success" },
    { title: "Adresses et contacts", icon: locationOutline, color: "warning" },
    { title: "Informations", icon: informationCircleOutline, color: "danger" },
    { title: "À propos", icon: peopleOutline, color: "light" },
    { title: "Nous contacter", icon: mailOutline, color: "medium" },
  ]

  const filteredSections = sections.filter((section) => section.title.toLowerCase().includes(searchText.toLowerCase()))

  // Enhanced timer reset with configurable timeout
  const INACTIVITY_TIMEOUT = 60000 // 60 seconds

  const resetTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current)
    }
    inactivityTimer.current = setTimeout(() => {
      setActive(false)
      setShowModal(false)
      if (videoRef.current) {
        videoRef.current.currentTime = 0 // Reset video to beginning
        videoRef.current.play().catch((error) => console.error("Erreur lors de la lecture de la vidéo :", error))
      }
    }, INACTIVITY_TIMEOUT)
  }, [])

  const handleUserInteraction = useCallback(() => {
    if (!active) {
      setActive(true)
    }
    resetTimer()
  }, [active, resetTimer])

  const handleBackToHome = () => {
    try {
      history.push("/home")
    } catch (error) {
      console.error("Navigation error:", error)
      // Fallback navigation
      window.location.href = "/home"
    }
  }

  const openModal = (title: string) => {
    setSelectedSection(title)
    setShowModal(true)
    resetTimer()
  }

  // Handle video loading
  const handleVideoLoad = () => {
    setVideoLoaded(true)
  }

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Erreur lors du chargement de la vidéo :", e)
    setVideoLoaded(true) // Still set to true to show UI even if video fails
  }

  useEffect(() => {
    document.addEventListener("touchstart", handleUserInteraction)
    document.addEventListener("click", handleUserInteraction)

    return () => {
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("click", handleUserInteraction)
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    }
  }, [handleUserInteraction])

  // Fix for scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const fadeElements = document.querySelectorAll(".fade-in-section")

      fadeElements.forEach((element) => {
        const rect = (element as HTMLElement).getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight - 150

        if (isVisible) {
          element.classList.add("is-visible")
        } else {
          element.classList.remove("is-visible")
        }
      })
    }

    // Initial check
    handleScroll()

    // Add scroll event listener to IonContent
    const ionContent = contentRef.current
    if (ionContent) {
      ionContent.addEventListener("ionScroll", handleScroll)
    }

    return () => {
      if (ionContent) {
        ionContent.removeEventListener("ionScroll", handleScroll)
      }
    }
  }, [active])

  const renderModalContent = () => {
    switch (selectedSection) {
      case "Devises":
        return <CurrencyExchange />
      case "Simulateur de crédit":
        return <CreditSimulator />
      case "Adresses et contacts":
        return <ContactInfo />
      case "À propos":
        return <AboutSection />
      case "Nous contacter":
        return <ContactUs />
      case "Sicav et Bourse":
        return <SicavEtBourse />
      case "Informations":
        return <Informations />
      case "Nos offres":
        return <NosOffres />
      default:
        return (
          <div>
            <p>Contenu détaillé pour {selectedSection}</p>
            <p>Cette section est en cours de développement.</p>
          </div>
        )
    }
  }

  return (
    <IonPage className="mode-invite-kiosk">
      <IonContent ref={contentRef} fullscreen scrollEvents={true}>
        {active ? (
          <div className="kiosk-container">
            <div className="kiosk-bg-circle-1"></div>
            <div className="kiosk-bg-circle-2"></div>
            <div className="kiosk-bg-blob"></div>

            <div className="kiosk-content">
              <header className="kiosk-header">
                <div className="kiosk-logo">
                  <IonImg src="/amen_logo.png" alt="Amen Bank Logo" className="kiosk-logo-image" />
                </div>
                <nav className="kiosk-nav">
                  <IonButton fill="clear" className="kiosk-nav-button">
                    <IonIcon icon={helpCircleOutline} slot="start" />
                    Aide
                  </IonButton>
                  <IonButton fill="clear" className="kiosk-nav-button">
                    <IonIcon icon={languageOutline} slot="start" />
                    Français
                  </IonButton>
                </nav>
              </header>

              <main className="kiosk-main">
                <h1 className="kiosk-title">Bienvenue chez Amen Bank</h1>
                <IonSearchbar
                  value={searchText}
                  onIonInput={(e) => setSearchText(e.detail.value!)}
                  placeholder="Rechercher un service"
                  className="kiosk-searchbar animate-fade-in"
                />

                <IonGrid className="kiosk-grid">
                  <IonRow>
                    {filteredSections.map((section, index) => (
                      <IonCol size="12" sizeSm="6" sizeMd="4" sizeLg="3" key={index}>
                        <IonCard
                          className={`kiosk-card animate-staggered delay-${index % 8}`}
                          onClick={() => openModal(section.title)}
                        >
                          <IonCardHeader>
                            <IonIcon icon={section.icon} color={section.color} className="kiosk-card-icon" />
                            <IonCardTitle>{section.title}</IonCardTitle>
                          </IonCardHeader>
                          <IonCardContent>
                            <IonButton fill="clear" color={section.color} className="kiosk-card-button">
                              En savoir plus
                              <IonIcon slot="end" icon={chevronForwardOutline} />
                            </IonButton>
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              </main>

              <footer className="kiosk-footer fade-in-section">
                <IonGrid>
                  <IonRow>
                    <IonCol size="12" sizeMd="4">
                      <h3>À Propos</h3>
                      <p>
                        Amen Bank, votre partenaire financier depuis 1967, s'engage à vous offrir des services bancaires
                        innovants et sécurisés.
                      </p>
                    </IonCol>
                    <IonCol size="12" sizeMd="4">
                      <h3>Contactez-nous</h3>
                      <p>Email: contact@amenbank.com</p>
                      <p>Téléphone: +216 71 148 000</p>
                    </IonCol>
                    <IonCol size="12" sizeMd="4">
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
                    </IonCol>
                  </IonRow>
                </IonGrid>
                <IonText className="kiosk-copyright">© 2025 Amen Bank. Tous droits réservés.</IonText>
              </footer>
            </div>
            <HelpDeskButton />
            <IonButton fill="clear" className="kiosk-back-button" onClick={handleBackToHome}>
              <IonIcon icon={arrowBackOutline} slot="start" />
              Retour à l'accueil
            </IonButton>

            <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="kiosk-modal">
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton fill="clear" onClick={() => setShowModal(false)}>
                      <IonIcon icon={closeOutline} />
                    </IonButton>
                  </IonButtons>
                  <IonTitle>{selectedSection}</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => setShowModal(false)}>
                      <IonIcon icon={closeOutline} />
                    </IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding modal-content">{renderModalContent()}</IonContent>
            </IonModal>
          </div>
        ) : (
          <div className="kiosk-video-container">
            {!videoLoaded && (
              <div className="video-loading">
                <IonImg src="favicon.png" alt="Amen Bank Logo" className="video-loading-logo" />
                <div className="video-loading-spinner"></div>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              className={videoLoaded ? "video-loaded" : ""}
            >
              <source src="pub.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
            <div className="video-overlay">
              <div className="video-tap-instruction">
                <span>Touchez l'écran pour continuer</span>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  )
}

export default ModeInviteKiosk

