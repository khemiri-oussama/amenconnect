"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
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
import "./ModeInviteDesktop.css"
import CurrencyExchange from "../../components/modeInviteComponents/CurrencyExchange"
import CreditSimulator from "../../components/modeInviteComponents/CreditSimulator"
import ContactInfo from "../../components/modeInviteComponents/ContactInfo"
import AboutSection from "../../components/modeInviteComponents/AboutSection"
import ContactUs from "../../components/modeInviteComponents/contact-us"
import SicavEtBourse from "../../components/modeInviteComponents/sicav-et-bourse"
import Informations from "../../components/modeInviteComponents/informations"
import NosOffres from "../../components/modeInviteComponents/nos-offres"
import HelpDeskButton from "../../components/HelpDeskButton"

const ModeInviteDesktop: React.FC = () => {
  const contentRef = useRef<HTMLIonContentElement | null>(null)
  const [searchText, setSearchText] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

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

  const openModal = (title: string) => {
    setSelectedSection(title)
    setShowModal(true)
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
    <IonPage className="mode-invite-desktop">
      <IonContent ref={contentRef} fullscreen scrollEvents={true}>
        <div className="mode-invite-desktop-background">
          <div className="mode-invite-desktop-gradient-1"></div>
          <div className="mode-invite-desktop-gradient-2"></div>
          <div className="mode-invite-desktop-grid"></div>
        </div>

        <div className="mode-invite-desktop-content">
          <header className="mode-invite-desktop-header">
            <IonImg src="/amen_logo.png" alt="Amen Bank Logo" className="mode-invite-desktop-logo-image" />
            <nav className="mode-invite-desktop-nav">
              <IonButton fill="clear" className="mode-invite-desktop-nav-button">
                <IonIcon icon={helpCircleOutline} slot="start" />
                Aide
              </IonButton>
              <IonButton fill="clear" className="mode-invite-desktop-nav-button">
                <IonIcon icon={languageOutline} slot="start" />
                Français
              </IonButton>
            </nav>
          </header>

          <main className="mode-invite-desktop-main">
            <h1 className="mode-invite-desktop-title">Bienvenue chez Amen Bank</h1>
            <IonSearchbar
              value={searchText}
              onIonInput={(e) => setSearchText(e.detail.value!)}
              placeholder="Rechercher un service"
              className="mode-invite-desktop-searchbar"
            />
            <IonGrid>
              <IonRow>
                {filteredSections.map((section, index) => (
                  <IonCol size="12" sizeMd="6" sizeLg="3" key={index}>
                    <IonCard className="mode-invite-desktop-card" onClick={() => openModal(section.title)}>
                      <IonCardHeader>
                        <IonIcon icon={section.icon} color={section.color} className="mode-invite-desktop-card-icon" />
                        <IonCardTitle>{section.title}</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonButton fill="clear" color={section.color} className="mode-invite-desktop-card-button">
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

          <footer className="mode-invite-desktop-footer fade-in-section">
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
            <IonText className="mode-invite-desktop-copyright">© 2025 Amen Bank. Tous droits réservés.</IonText>
          </footer>
        </div>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="mode-invite-desktop-modal">
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
        <HelpDeskButton/>
      </IonContent>
    </IonPage>
  )
}

export default ModeInviteDesktop

