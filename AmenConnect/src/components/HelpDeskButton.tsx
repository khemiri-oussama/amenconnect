"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonInput,
  IonText,
} from "@ionic/react"
import { chatbubbleEllipsesOutline, closeOutline, videocamOutline, sendOutline, arrowBackOutline } from "ionicons/icons"
import "./HelpDeskButton.css"

interface Message {
  content: string
  sender: "user" | "bot"
}

const HelpDeskButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [activeOption, setActiveOption] = useState<"main" | "chat" | "video" | "video-form" | "waiting-approval">(
    "main",
  )
  const [messages, setMessages] = useState<Message[]>([
    { content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", sender: "bot" },
  ])
  const [inputValue, setInputValue] = useState("")
  const [connecting, setConnecting] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
  })

  // Add scroll listener to handle visibility
  useEffect(() => {
    const handleScroll = () => {
      // Always keep the button visible
      setIsVisible(true)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleOpenModal = () => {
    setShowModal(true)
    setActiveOption("main")
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setTimeout(() => {
      setActiveOption("main")
    }, 300)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { content: inputValue, sender: "user" }])

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          content: "Merci pour votre message. Un de nos conseillers va vous répondre dans les plus brefs délais.",
          sender: "bot",
        },
      ])
    }, 1000)

    setInputValue("")
  }

  const startVideoCall = () => {
    setActiveOption("video-form")
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFormSubmit = () => {
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData)

    // Change to waiting approval state
    setActiveOption("waiting-approval")

    // Simulate admin response after 5 seconds (in a real app, this would be a websocket or polling)
    setTimeout(() => {
      setConnecting(true)
      setActiveOption("video")

      // Simulate connection
      setTimeout(() => {
        setConnecting(false)
      }, 3000)
    }, 5000)
  }

  const renderContent = () => {
    switch (activeOption) {
      case "chat":
        return (
          <>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => setActiveOption("main")}>
                    <IonIcon icon={arrowBackOutline} />
                  </IonButton>
                </IonButtons>
                <IonTitle>Assistant Virtuel</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={handleCloseModal}>
                    <IonIcon icon={closeOutline} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="help-desk-chat-content">
              <div className="help-desk-messages">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`help-desk-message ${message.sender === "user" ? "help-desk-message-user" : "help-desk-message-bot"}`}
                  >
                    {message.content}
                  </div>
                ))}
              </div>
              <div className="help-desk-input-container">
                <IonInput
                  value={inputValue}
                  onIonChange={(e) => setInputValue(e.detail.value || "")}
                  placeholder="Tapez votre message..."
                  className="help-desk-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage()
                  }}
                />
                <IonButton
                  fill="clear"
                  className="help-desk-send-button"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                >
                  <IonIcon icon={sendOutline} />
                </IonButton>
              </div>
            </IonContent>
          </>
        )

      case "video":
        return (
          <>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => setActiveOption("main")}>
                    <IonIcon icon={arrowBackOutline} />
                  </IonButton>
                </IonButtons>
                <IonTitle>Vidéoconférence</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={handleCloseModal}>
                    <IonIcon icon={closeOutline} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="help-desk-video-content">
              {connecting ? (
                <div className="help-desk-connecting">
                  <IonSpinner name="crescent" className="help-desk-spinner" />
                  <IonText color="primary">Connexion en cours avec un conseiller...</IonText>
                </div>
              ) : (
                <div className="help-desk-video-ready">
                  <div className="help-desk-video-icon-container">
                    <IonIcon icon={videocamOutline} className="help-desk-video-icon" />
                  </div>
                  <IonText color="dark" className="help-desk-video-title">
                    Conseiller disponible
                  </IonText>
                  <IonText color="medium" className="help-desk-video-subtitle">
                    Cliquez sur le bouton ci-dessous pour démarrer la vidéoconférence
                  </IonText>
                  <IonButton className="help-desk-start-video-button" onClick={startVideoCall}>
                    Démarrer la vidéoconférence
                  </IonButton>
                </div>
              )}
            </IonContent>
          </>
        )

      case "video-form":
        return (
          <>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => setActiveOption("main")}>
                    <IonIcon icon={arrowBackOutline} />
                  </IonButton>
                </IonButtons>
                <IonTitle>Demande de vidéoconférence</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={handleCloseModal}>
                    <IonIcon icon={closeOutline} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="help-desk-video-content">
              <div className="help-desk-form-container">
                <IonText color="dark" className="help-desk-video-title">
                  Vos informations
                </IonText>
                <IonText color="medium" className="help-desk-video-subtitle">
                  Veuillez remplir ce formulaire pour être mis en relation avec un conseiller
                </IonText>

                <div className="help-desk-form">
                  <div className="help-desk-form-field">
                    <IonText color="medium">Nom & prénom</IonText>
                    <IonInput
                      value={formData.name}
                      onIonChange={(e) => handleFormChange("name", e.detail.value || "")}
                      placeholder="John Doe"
                      className="help-desk-form-input"
                    />
                  </div>

                  <div className="help-desk-form-field">
                    <IonText color="medium">Email</IonText>
                    <IonInput
                      type="email"
                      value={formData.email}
                      onIonChange={(e) => handleFormChange("email", e.detail.value || "")}
                      placeholder="john@example.com"
                      className="help-desk-form-input"
                    />
                  </div>

                  <div className="help-desk-form-field">
                    <IonText color="medium">Sujet</IonText>
                    <IonInput
                      value={formData.subject}
                      onIonChange={(e) => handleFormChange("subject", e.detail.value || "")}
                      placeholder="Renseignement produit"
                      className="help-desk-form-input"
                    />
                  </div>

                  <div className="help-desk-form-field">
                    <IonText color="medium">Téléphone</IonText>
                    <IonInput
                      type="tel"
                      value={formData.phone}
                      onIonChange={(e) => handleFormChange("phone", e.detail.value || "")}
                      placeholder="12345678"
                      className="help-desk-form-input"
                    />
                  </div>

                  <IonButton
                    className="help-desk-submit-button"
                    onClick={handleFormSubmit}
                    disabled={!formData.name || !formData.email || !formData.subject || !formData.phone}
                  >
                    Soumettre la demande
                  </IonButton>
                </div>
              </div>
            </IonContent>
          </>
        )

      case "waiting-approval":
        return (
          <>
            <IonHeader>
              <IonToolbar>
                <IonTitle>En attente d'approbation</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={handleCloseModal}>
                    <IonIcon icon={closeOutline} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="help-desk-video-content">
              <div className="help-desk-connecting">
                <IonSpinner name="crescent" className="help-desk-spinner" />
                <IonText color="primary" className="help-desk-waiting-title">
                  Demande en cours de traitement
                </IonText>
                <IonText color="medium" className="help-desk-waiting-subtitle">
                  Un conseiller va examiner votre demande. Veuillez patienter...
                </IonText>
              </div>
            </IonContent>
          </>
        )

      default:
        return (
          <>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Comment pouvons-nous vous aider ?</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={handleCloseModal}>
                    <IonIcon icon={closeOutline} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="help-desk-options-content">
              <IonCard className="help-desk-option-card" onClick={() => setActiveOption("chat")}>
                <IonCardHeader>
                  <div className="help-desk-option-icon-container">
                    <IonIcon icon={chatbubbleEllipsesOutline} className="help-desk-option-icon" />
                  </div>
                  <IonCardTitle>Discuter avec un assistant virtuel</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>Obtenez des réponses instantanées à vos questions</IonCardContent>
              </IonCard>

              <IonCard className="help-desk-option-card" onClick={() => setActiveOption("video")}>
                <IonCardHeader>
                  <div className="help-desk-option-icon-container">
                    <IonIcon icon={videocamOutline} className="help-desk-option-icon" />
                  </div>
                  <IonCardTitle>Consulter un conseiller</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>Parlez à un conseiller en vidéoconférence</IonCardContent>
              </IonCard>
            </IonContent>
          </>
        )
    }
  }

  if (!isVisible) return null

  return (
    <>
      <IonButton className="help-desk-floating-button" onClick={handleOpenModal}>
        <IonIcon icon={chatbubbleEllipsesOutline} />
      </IonButton>

      <IonModal isOpen={showModal} onDidDismiss={handleCloseModal} className="help-desk-modal">
        {renderContent()}
      </IonModal>
    </>
  )
}

export default HelpDeskButton

