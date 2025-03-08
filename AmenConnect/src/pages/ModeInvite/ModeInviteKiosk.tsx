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
  IonBackButton,
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
} from "ionicons/icons"
import "./ModeInviteKiosk.css"
import CurrencyExchange from "../../components/modeInviteComponents/CurrencyExchange"
import CreditSimulator from "../../components/modeInviteComponents/CreditSimulator"
import ContactInfo from "../../components/modeInviteComponents/ContactInfo"
import AboutSection from "../../components/modeInviteComponents/AboutSection"
import ContactUs from "../../components/modeInviteComponents/contact-us"
import SicavEtBourse from "../../components/modeInviteComponents/sicav-et-bourse"
import Informations from "../../components/modeInviteComponents/informations"
import NosOffres from "../../components/modeInviteComponents/nos-offres"

const ModeInviteKiosk: React.FC = () => {
  const history = useHistory()
  const [active, setActive] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

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

  const resetTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current)
    }
    inactivityTimer.current = setTimeout(() => {
      setActive(false)
      setShowModal(false)
      if (videoRef.current) {
        videoRef.current.play().catch((error) => console.error("Erreur lors de la lecture de la vidéo :", error))
      }
    }, 60000) // 60 seconds of inactivity
  }, [])

  const handleUserInteraction = useCallback(() => {
    if (!active) {
      setActive(true)
    }
    resetTimer()
  }, [active, resetTimer])

  const handleBackToHome = () => {
    history.push("/")
  }

  const openModal = (title: string) => {
    setSelectedSection(title)
    setShowModal(true)
    resetTimer()
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
            <div className="background-white"></div>
            <svg className="background-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 983 1920" fill="none">
              <path
                d="M0 0H645.236C723.098 0 770.28 85.9638 728.469 151.647C697.151 200.847 715.114 266.33 767.152 292.664L793.096 305.793C854.316 336.773 866.865 418.795 817.709 466.662L691.328 589.731C677.652 603.048 659.319 610.5 640.231 610.5C577.253 610.5 543.641 684.721 585.184 732.054L641.155 795.826C676.082 835.621 671.964 896.237 631.974 930.943L582.069 974.254C522.93 1025.58 568.96 1122.18 646.076 1108.59C700.297 1099.03 746.811 1147.67 734.833 1201.41L727.617 1233.79C715.109 1289.9 752.705 1344.88 809.534 1353.59L836.788 1357.76C862.867 1361.76 886.31 1375.9 902.011 1397.1L964.656 1481.7C1003.87 1534.65 970.947 1610.18 905.469 1617.5C862.212 1622.34 829.5 1658.92 829.5 1702.44V1717.72C829.5 1756.01 800.102 1787.88 761.94 1790.96L696.194 1796.27C667.843 1798.56 652.928 1831 669.644 1854.01C685.614 1876 672.771 1907.1 645.942 1911.41L597.738 1919.16C594.251 1919.72 590.726 1920 587.195 1920H462.5H200.5H0V0Z"
                fill="#47CE65"
                stroke="#47CE65"
              />
            </svg>

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
                          className={`kiosk-card animate-staggered delay-${index}`}
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

            <IonButton fill="clear" className="kiosk-back-button" onClick={handleBackToHome}>
              Retour à l'accueil
            </IonButton>

            <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="kiosk-modal">
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonBackButton defaultHref="#" onClick={() => setShowModal(false)} />
                  </IonButtons>
                  <IonTitle>{selectedSection}</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => setShowModal(false)}>
                      <IonIcon icon={closeOutline} />
                    </IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">{renderModalContent()}</IonContent>
            </IonModal>
          </div>
        ) : (
          <div className="kiosk-video-container">
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              controls={false}
              onError={(e) => console.error("Erreur lors du chargement de la vidéo :", e)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src="pub.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>
        )}
      </IonContent>
    </IonPage>
  )
}

export default ModeInviteKiosk

