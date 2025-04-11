"use client"
import { v4 as uuidv4 } from "uuid"
import { useIonRouter } from "@ionic/react"
import type React from "react"
import { useState, useEffect, useRef } from "react"
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
  IonRippleEffect,
} from "@ionic/react"
import {
  chatbubbleEllipsesOutline,
  closeOutline,
  videocamOutline,
  sendOutline,
  arrowBackOutline,
  helpCircleOutline,
} from "ionicons/icons"
import TypingEffect from "./typing-effect"
import "./HelpDeskButton.css"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  isTyping?: boolean
}

const HelpDeskButton: React.FC = () => {
  const [desktop, setDesktop] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [activeOption, setActiveOption] = useState<"main" | "chat" | "video" | "video-form" | "waiting-approval">(
    "main",
  )
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      sender: "bot",
      isTyping: true,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
  })
  const [roomId, setRoomId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Keep the button visible on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(true)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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

  // Updated send message handler with API call and typing effect
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add the user's message to the chat
    const userMessageId = uuidv4()
    const userMessage: Message = {
      id: userMessageId,
      content: inputValue,
      sender: "user",
    }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
    const payload = { message: inputValue }

    // Clear the input right away to show the message has been sent
    setInputValue("")

    try {
      // Add a temporary typing indicator
      const typingIndicatorId = uuidv4()
      setMessages((prev) => [
        ...prev,
        {
          id: typingIndicatorId,
          content: "",
          sender: "bot",
          isTyping: true,
        },
      ])

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      // Remove the typing indicator and add the bot's response
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== typingIndicatorId)
          .concat({
            id: uuidv4(),
            content: data.response || "Je suis désolé, je n'ai pas pu traiter votre demande.",
            sender: "bot",
            isTyping: true,
          }),
      )
    } catch (error) {
      console.error("Erreur lors de la communication avec l'API:", error)

      // Remove the typing indicator and add an error message
      setMessages((prev) =>
        prev
          .filter((msg) => msg.isTyping)
          .concat({
            id: uuidv4(),
            content: "Une erreur s'est produite lors de la communication avec l'API. Veuillez réessayer plus tard.",
            sender: "bot",
            isTyping: true,
          }),
      )
    }
    setLoading(false)
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

  const router = useIonRouter()

  const handleFormSubmit = async () => {
    const newRoomId = uuidv4()
    const payload = { ...formData, roomId: newRoomId }

    setRoomId(null)
    try {
      setActiveOption("waiting-approval")

      const response = await fetch("/api/video-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la soumission de la demande.")
      }

      const data = await response.json()
      console.log("Demande de vidéoconférence créée:", data)

      if (data.request && data.request.roomId) {
        setRoomId(data.request.roomId)
      }

      setTimeout(() => {
        setConnecting(true)
        setActiveOption("video")

        setTimeout(() => {
          setConnecting(false)
          // Use Ionic navigation method or a simple redirect
          window.location.href = `/video/${newRoomId}`
        }, 3000)
      }, 5000)
    } catch (error) {
      console.error("Erreur lors de la soumission de la demande:", error)
    }
  }

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="typing-indicator">
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
    </div>
  )

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
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`help-desk-message ${
                      message.sender === "user" ? "help-desk-message-user" : "help-desk-message-bot"
                    }`}
                  >
                    {message.isTyping ? (
                      <TypingEffect
                        text={message.content}
                        speed={20}
                        onComplete={() => {
                          // Mark message as no longer typing once animation completes
                          setMessages((prev) =>
                            prev.map((msg) => (msg.id === message.id ? { ...msg, isTyping: false } : msg)),
                          )
                        }}
                      />
                    ) : (
                      message.content
                    )}
                  </div>
                ))}
                {loading && !messages.some((m) => m.isTyping) && (
                  <div className="help-desk-message help-desk-message-bot">
                    <TypingIndicator />
                  </div>
                )}
                <div ref={messagesEndRef} />
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
                  disabled={!inputValue.trim() || loading}
                >
                  <IonIcon icon={sendOutline} />
                  <IonRippleEffect />
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
                  <IonText color="primary">
                    <h3>Connexion en cours</h3>
                  </IonText>
                  <IonText color="medium">
                    <p>Nous vous mettons en relation avec un conseiller...</p>
                  </IonText>
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
                    Cliquez sur le bouton ci-dessous pour démarrer la vidéoconférence avec un de nos experts
                  </IonText>
                  {roomId && (
                    <IonText color="medium" className="help-desk-video-room">
                      Salle: {roomId}
                    </IonText>
                  )}
                  <IonButton className="help-desk-start-video-button" onClick={startVideoCall}>
                    Démarrer la vidéoconférence
                    <IonRippleEffect />
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
                      placeholder="Foulen Ben Foulen"
                      className="help-desk-form-input"
                    />
                  </div>

                  <div className="help-desk-form-field">
                    <IonText color="medium">Email</IonText>
                    <IonInput
                      type="email"
                      value={formData.email}
                      onIonChange={(e) => handleFormChange("email", e.detail.value || "")}
                      placeholder="Foulen@example.com"
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
                    <IonRippleEffect />
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
                  Un conseiller va examiner votre demande. Veuillez patienter quelques instants...
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
