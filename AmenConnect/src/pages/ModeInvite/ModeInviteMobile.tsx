"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonModal,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonFooter,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
  menuOutline,
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
import "./ModeInviteMobile.css"
import CurrencyExchange from "../../components/modeInviteComponents/CurrencyExchange"
import CreditSimulator from "../../components/modeInviteComponents/CreditSimulator"
import ContactInfo from "../../components/modeInviteComponents/ContactInfo"
import AboutSection from "../../components/modeInviteComponents/AboutSection"
import ContactUs from "../../components/modeInviteComponents/contact-us"
import SicavEtBourse from "../../components/modeInviteComponents/sicav-et-bourse"
import Informations from "../../components/modeInviteComponents/informations"
import NosOffres from "../../components/modeInviteComponents/nos-offres"

const ModeInviteMobile: React.FC = () => {
  const history = useHistory()
  const [searchText, setSearchText] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const pageRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLIonContentElement | null>(null)

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

  const handleBackToHome = () => {
    history.push("/")
  }

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
    <IonPage ref={pageRef} className="mode-invite-mobile">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleBackToHome}>
              <IonIcon slot="icon-only" icon={arrowBackOutline} />
            </IonButton>
            <IonButton onClick={() => setShowMenu(true)}>
              <IonIcon slot="icon-only" icon={menuOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Amen Bank</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon slot="icon-only" icon={languageOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} fullscreen scrollEvents={true}>
        <div className="mode-invite-mobile-content">
          <IonImg src="/amen_logo.png" alt="Amen Bank Logo" className="mode-invite-mobile-logo" />
          <h1 className="mode-invite-mobile-title">Bienvenue chez Amen Bank</h1>
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Rechercher un service"
            className="mode-invite-mobile-searchbar"
          />

          <div className="mode-invite-mobile-grid">
            {filteredSections.map((section, index) => (
              <IonCard
                key={index}
                className={`mode-invite-mobile-card animate-staggered delay-${index}`}
                onClick={() => openModal(section.title)}
              >
                <IonCardHeader>
                  <IonIcon icon={section.icon} color={section.color} className="mode-invite-mobile-card-icon" />
                  <IonCardTitle>{section.title}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton fill="clear" color={section.color} className="mode-invite-mobile-card-button">
                    En savoir plus
                    <IonIcon slot="end" icon={chevronForwardOutline} />
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        </div>
      </IonContent>

      <IonFooter className="ion-no-border">
        <div className="mode-invite-mobile-footer">© 2025 Amen Bank. Tous droits réservés.</div>
      </IonFooter>

      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="mode-invite-mobile-modal">
        <IonHeader className="ion-no-border">
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

      <IonModal isOpen={showMenu} onDidDismiss={() => setShowMenu(false)} className="mode-invite-mobile-menu">
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowMenu(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem
              button
              onClick={() => {
                setShowMenu(false) /* Add action */
              }}
            >
              <IonIcon icon={helpCircleOutline} slot="start" />
              <IonLabel>Aide</IonLabel>
            </IonItem>
            <IonItem
              button
              onClick={() => {
                setShowMenu(false) /* Add action */
              }}
            >
              <IonIcon icon={languageOutline} slot="start" />
              <IonLabel>Changer de langue</IonLabel>
            </IonItem>
            {sections.map((section, index) => (
              <IonItem
                key={index}
                button
                onClick={() => {
                  setShowMenu(false)
                  openModal(section.title)
                }}
              >
                <IonIcon icon={section.icon} slot="start" color={section.color} />
                <IonLabel>{section.title}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonModal>
    </IonPage>
  )
}

export default ModeInviteMobile

