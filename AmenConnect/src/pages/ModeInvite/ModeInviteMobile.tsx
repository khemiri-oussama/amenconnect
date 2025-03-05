"use client"

import type React from "react"
import { useState, useRef } from "react"
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

const ModeInviteMobile: React.FC = () => {
  const history = useHistory()
  const [searchText, setSearchText] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const pageRef = useRef<HTMLElement | null>(null)

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

  return (
    <IonPage ref={pageRef} className="mode-invite-mobile dark">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.push("/home")}>
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

      <IonContent fullscreen>
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
              <IonCard key={index} className="mode-invite-mobile-card" onClick={() => openModal(section.title)}>
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
        <IonContent className="ion-padding">
          <p>Contenu détaillé pour {selectedSection}</p>
          {/* Add more detailed content here based on the selected section */}
        </IonContent>
      </IonModal>

      <IonModal isOpen={showMenu} onDidDismiss={() => setShowMenu(false)} className="mode-invite-mobile-menu">
        <IonHeader>
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

