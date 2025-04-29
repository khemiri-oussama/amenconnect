"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  IonPage,
  IonHeader,
  IonContent,
  IonButton,
  IonTextarea,
  IonIcon,
  IonFooter,
  IonAvatar,
  IonChip,
  IonLabel,
  IonSpinner,
  IonToast,
} from "@ionic/react"
import {
  sendOutline,
  personCircleOutline,
  chatbubbleEllipsesOutline,
  informationCircleOutline,
  helpCircleOutline,
  documentTextOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from "ionicons/icons"
import { useAuth } from "../../../AuthContext"
import Navbar from "../../../components/Navbar"
import "./ChatBotDesktop.css"
import LoadingProgressBar from "../../../components/LoadingProgressBar"
interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const ChatBotDesktop: React.FC = () => {
  const { profile, authLoading } = useAuth()
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Bonjour ${profile?.user.prenom || ""} ! Je suis votre assistant bancaire. Comment puis-je vous aider aujourd'hui ?	`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [credits, setCredits] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showToast, setShowToast] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string>("")
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLIonTextareaElement>(null)
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true)
  const [typingMessageId, setTypingMessageId] = useState<number | null>(null)
  const [visibleText, setVisibleText] = useState<string>("")
  const typingSpeed = 10 // milliseconds per character

  // Défilement vers le bas des messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus on textarea when component mounts
  useEffect(() => {
    if (!authLoading && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.setFocus()
      }, 500)
    }
  }, [authLoading])

  // Handle typing animation for bot messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]

    if (lastMessage && lastMessage.sender === "bot" && !loading) {
      // Start typing animation for this message
      setTypingMessageId(lastMessage.id)
      setVisibleText("")

      let currentText = ""
      let charIndex = 0

      const typeNextChar = () => {
        if (charIndex < lastMessage.text.length) {
          currentText += lastMessage.text.charAt(charIndex)
          setVisibleText(currentText)
          charIndex++
          setTimeout(typeNextChar, typingSpeed)
        } else {
          // Animation complete
          setTypingMessageId(null)
        }
      }

      // Start typing animation
      typeNextChar()
    }
  }, [messages, loading])

  if (authLoading) {
    return (
      <IonPage>
        <LoadingProgressBar />
      </IonPage>
    )
  }

  // Déterminer si l'utilisateur est authentifié
  const isAuthenticated = Boolean(profile)

  const userName = profile?.user ? `${profile.user.prenom} ${profile.user.nom}` : ""
  const userEmail = profile?.user?.email || ""
  const userAccounts = profile?.comptes || []
  const userCin = profile?.user?.cin || ""
  const userPhone = profile?.user?.telephone || ""
  const userAddress = profile?.user?.adresseEmployeur || ""

  useEffect(() => {
    if (profile?.user?._id) {
      fetch(`/api/credit?userId=${profile.user._id}`)
        .then(res => res.json())
        .then(data => setCredits(Array.isArray(data) ? data : []))
        .catch(err => console.error("Erreur fetch credits:", err))
    }
  }, [profile])
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  const sendMessage = async (text = message) => {
    if (!text.trim()) return

    // Ajouter le message de l'utilisateur au chat
    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
    setMessage("") // Effacer le champ de saisie
    setShowSuggestions(false) // Masquer les suggestions après l'envoi d'un message

    try {
      // Préparer la charge utile de la requête en fonction du statut d'authentification
      const payload = isAuthenticated
        ? {
            message: text,
            user: {
              name: userName,
              email: userEmail,
              accounts: userAccounts,
              cin: userCin,
              phone: userPhone,
              address: userAddress,
              credits: credits,
            },
          }
        : { message: text }
        console.log("About to send payload:", { message});

      // around line 178 in chatBotDesktop.tsx
const response = await fetch("/api/chat", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: text }),
});


      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      // Ajouter la réponse du bot au chat
      const botMessage: Message = {
        id: messages.length + 2,
        text: data.response || "Je suis désolé, je n'ai pas pu traiter votre demande.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])

      // Afficher à nouveau les suggestions après la réponse du bot
      setShowSuggestions(true)
    } catch (error) {
      console.error("Erreur:", error)

      // Show toast instead of error message in chat
      setToastMessage("Une erreur s'est produite. Veuillez réessayer plus tard.")
      setShowToast(true)

      // Ajouter un message d'erreur au chat
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Une erreur s'est produite lors de la communication avec l'API. Veuillez réessayer plus tard.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    }

    setLoading(false)

    // Focus back on textarea after sending
    setTimeout(() => {
      textareaRef.current?.setFocus()
    }, 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Formater l'horodatage
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Formater le texte du message pour préserver les sauts de ligne
  const formatMessageText = (text: string) => {
    if (!text) return <p className="message-paragraph"> </p>
    return text.split("\n").map((line, i) => (
      <p key={i} className="message-paragraph">
        {line || " "}
      </p>
    ))
  }

  // Messages de suggestion rapide
  const suggestions = [
    { text: "Quel est le solde de mon compte ?", icon: informationCircleOutline },
    { text: "Comment puis-je effectuer un virement ?", icon: helpCircleOutline },
    { text: "Afficher mes transactions récentes", icon: documentTextOutline },
  ]

  const handleSuggestionClick = (suggestionText: string) => {
    sendMessage(suggestionText)
  }

  return (
    <IonPage className="chat-page">
      <IonHeader>
        <Navbar currentPage="chat" />
      </IonHeader>

      <IonContent className="chat-content">
        <div className="chat-desktop-layout">
          {/* Sidebar toggle button for mobile */}
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label={sidebarVisible ? "Masquer le panneau latéral" : "Afficher le panneau latéral"}
          >
            <IonIcon icon={sidebarVisible ? chevronBackOutline : chevronForwardOutline} />
          </button>

          {/* Sidebar with conditional class for visibility */}
          <div className={`chat-sidebar ${sidebarVisible ? "visible" : "hidden"}`}>
            <div className="chat-sidebar-header">
              <h2>Assistant Bancaire</h2>
              <p className="sidebar-description">
                Posez-moi n'importe quelle question sur vos comptes, transactions ou services bancaires.
              </p>
            </div>

            {isAuthenticated ? (
              <div className="user-profile-section">
                <div className="user-avatar">
                  <IonAvatar>
                    <img src="./avatar.png" alt="Photo de profil" />
                  </IonAvatar>
                </div>
                <div className="user-details">
                  <h3 className="user-name">{userName}</h3>
                  <p className="user-email">{userEmail}</p>
                  <div className="account-badge">
                    <IonChip color="success">
                      <IonLabel>Authentifié</IonLabel>
                    </IonChip>
                  </div>
                </div>
              </div>
            ) : (
              <div className="guest-profile-section">
                <div className="guest-avatar">
                  <IonIcon icon={personCircleOutline} aria-hidden="true" />
                </div>
                <div className="guest-details">
                  <h3 className="guest-title">Utilisateur Invité</h3>
                  <p className="guest-description">Accès limité aux fonctionnalités bancaires</p>
                  <div className="account-badge">
                    <IonChip color="medium">
                      <IonLabel>Mode Invité</IonLabel>
                    </IonChip>
                  </div>
                </div>
              </div>
            )}

            <div className="chat-info-section">
              <h3 className="info-title">À propos de l'Assistant Bancaire</h3>
              <ul className="info-list">
                <li>Obtenir des informations sur le compte</li>
                <li>Vérifier l'historique des transactions</li>
                <li>Se renseigner sur les services bancaires</li>
                <li>Obtenir de l'aide pour les tâches courantes</li>
              </ul>

              <div className="chat-disclaimer">
                <p className="disclaimer-text">
                  Pour des raisons de sécurité, certaines opérations peuvent nécessiter une authentification
                  supplémentaire.
                </p>
              </div>
            </div>
          </div>

          <div className="chat-main">
            <div className="chat-container">
              <div className="chat-header-desktop">
                <div className="chat-title">
                  <IonIcon icon={chatbubbleEllipsesOutline} aria-hidden="true" />
                  <h2>Discuter avec l'Assistant Bancaire</h2>
                </div>
                {isAuthenticated ? (
                  <div className="chat-status">
                    <span className="status-dot authenticated" aria-hidden="true"></span>
                    <span>Authentifié en tant que {userName}</span>
                  </div>
                ) : (
                  <div className="chat-status">
                    <span className="status-dot guest" aria-hidden="true"></span>
                    <span>Mode Invité</span>
                  </div>
                )}
              </div>

              {/* Conteneur de messages */}
              <div
                className="messages-container"
                role="log"
                aria-live="polite"
                aria-label="Conversation avec l'assistant bancaire"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-bubble ${msg.sender === "user" ? "user-message" : "bot-message"}`}
                  >
                    <div className="message-content">
                      {msg.sender === "bot" && (
                        <div className="message-avatar">
                          <IonAvatar>
                            <img src="./bot.png" alt="Avatar de l'assistant" />
                          </IonAvatar>
                        </div>
                      )}
                      <div className="message-text">
                        <div className="message-text-content">
                          {msg.sender === "bot" && typingMessageId === msg.id
                            ? // Show the currently visible text for the typing message
                              formatMessageText(visibleText)
                            : // Show the full text for other messages
                              formatMessageText(msg.text)}
                          {msg.sender === "bot" && typingMessageId === msg.id && (
                            <span className="typing-cursor"></span>
                          )}
                        </div>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Indicateur de chargement */}
                {loading && (
                  <div className="message-bubble bot-message">
                    <div className="message-content">
                      <div className="message-avatar">
                        <IonAvatar>
                          <img src="./bot.png" alt="Avatar de l'assistant" />
                        </IonAvatar>
                      </div>
                      <div className="message-text typing-indicator" aria-label="L'assistant est en train d'écrire">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions rapides */}
                {showSuggestions && !loading && (
                  <div className="suggestions-container">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-chip"
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        aria-label={`Suggestion: ${suggestion.text}`}
                      >
                        <IonIcon icon={suggestion.icon} aria-hidden="true" />
                        <span>{suggestion.text}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Élément invisible pour défiler vers */}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <IonFooter className="chat-footer">
              <div className="message-input-container">
                <IonTextarea
                  ref={textareaRef}
                  value={message}
                  placeholder="Tapez votre message ici..."
                  onIonInput={(e) => setMessage(e.detail.value!)}
                  onKeyDown={handleKeyPress}
                  autoGrow={true}
                  rows={1}
                  maxlength={500}
                  className="message-input"
                  aria-label="Zone de saisie de message"
                />

                <IonButton
                  className="send-button"
                  onClick={() => sendMessage()}
                  disabled={!message.trim()}
                  aria-label="Envoyer le message"
                >
                  <IonIcon icon={sendOutline} aria-hidden="true" />
                </IonButton>
              </div>

              {isAuthenticated ? (
                <div className="chat-footer-info authenticated">
                  <IonIcon icon={personCircleOutline} aria-hidden="true" />
                  <span>Les réponses incluront vos informations de compte personnelles</span>
                </div>
              ) : (
                <div className="chat-footer-info guest">
                  <IonIcon icon={personCircleOutline} aria-hidden="true" />
                  <span>Connectez-vous pour obtenir une assistance bancaire personnalisée</span>
                </div>
              )}
            </IonFooter>
          </div>
        </div>
      </IonContent>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="top"
        color="danger"
        buttons={[
          {
            text: "Fermer",
            role: "cancel",
          },
        ]}
      />
    </IonPage>
  )
}

export default ChatBotDesktop

