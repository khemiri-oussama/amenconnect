"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useHistory } from "react-router-dom"
import {
  IonPage,
  IonHeader,
  IonContent,
  IonButton,
  IonTextarea,
  IonIcon,
  IonFooter,
  IonAvatar,
  IonSpinner,
  IonToolbar,
  IonTitle,
} from "@ionic/react"
import {
  sendOutline,
  personCircleOutline,
  informationCircleOutline,
  helpCircleOutline,
  documentTextOutline,
  chatbubbleEllipsesOutline,
  arrowBackOutline,
} from "ionicons/icons"
import { useAuth } from "../../../AuthContext"
import "./ChatBotMobile.css"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const ChatBotMobile: React.FC = () => {
  const { profile, authLoading } = useAuth()
  const history = useHistory()
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Bonjour ${profile?.user.prenom || ""} ! Je suis votre assistant bancaire. Comment puis-je vous aider aujourd'hui ?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [credits, setCredits] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true)
  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLIonContentElement>(null)
  const textareaRef = useRef<HTMLIonTextareaElement>(null)

  useEffect(() => {
    if (profile?.user?._id) {
      fetch(`/api/credit?userId=${profile.user._id}`)
        .then(res => res.json())
        .then(data => setCredits(Array.isArray(data) ? data : []))
        .catch(err => console.error("Erreur fetch credits:", err))
    }
  }, [profile])
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollToBottom(300)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle keyboard appearance
  useEffect(() => {
    const handleKeyboardShow = () => {
      setKeyboardOpen(true)
      // Force scroll to bottom when keyboard appears
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }

    const handleKeyboardHide = () => {
      setKeyboardOpen(false)
    }

    window.addEventListener("keyboardWillShow", handleKeyboardShow)
    window.addEventListener("keyboardWillHide", handleKeyboardHide)
    window.addEventListener("focusin", handleKeyboardShow)
    window.addEventListener("focusout", handleKeyboardHide)

    return () => {
      window.removeEventListener("keyboardWillShow", handleKeyboardShow)
      window.removeEventListener("keyboardWillHide", handleKeyboardHide)
      window.removeEventListener("focusin", handleKeyboardShow)
      window.removeEventListener("focusout", handleKeyboardHide)
    }
  }, [])

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.addEventListener("ionInput", (e: Event) => {
        const target = e.target as HTMLIonTextareaElement
        target.style.height = "auto"
        target.style.height = target.scrollHeight + "px"
      })
    }
  }, [])

  if (authLoading) {
    return (
      <div className="loading-container">
        <IonSpinner name="crescent" />
        <p>Chargement de votre profil...</p>
      </div>
    )
  }

  // Determine if user is authenticated
  const isAuthenticated = Boolean(profile)

  const userName = profile?.user ? `${profile.user.prenom} ${profile.user.nom}` : ""
  const userEmail = profile?.user?.email || ""
  const userAccounts = profile?.comptes || []
  const userCin = profile?.user?.cin || ""
  const userPhone = profile?.user?.telephone || ""
  const userAddress = profile?.user?.adresseEmployeur || ""

  const sendMessage = async (text = message) => {
    if (!text.trim()) return

    // Add user message to chat
    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
    setMessage("") // Clear input field
    setShowSuggestions(false) // Hide suggestions after sending a message

    try {
      // Prepare request payload based on authentication status
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

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      // Add bot response to chat
      const botMessage: Message = {
        id: messages.length + 2,
        text: data.response || "Je suis désolé, je n'ai pas pu traiter votre demande.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Erreur:", error)

      // Add error message to chat
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Une erreur s'est produite lors de la communication avec l'API. Veuillez réessayer plus tard.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    }

    setLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format message text to preserve line breaks
  const formatMessageText = (text: string) => {
    return text.split("\n").map((line, i) => (
      <p key={i} className="message-paragraph">
        {line || " "}
      </p>
    ))
  }

  // Quick suggestion messages
  const suggestions = [
    { text: "Quel est le solde de mon compte ?", icon: informationCircleOutline },
    { text: "Comment puis-je effectuer un virement ?", icon: helpCircleOutline },
    { text: "Afficher mes transactions récentes", icon: documentTextOutline },
  ]

  const handleSuggestionClick = (suggestionText: string) => {
    sendMessage(suggestionText)
  }

  return (
    <IonPage className={`chat-page ${keyboardOpen ? "keyboard-open" : ""}`}>
      <IonHeader className="chat-header-mobile">
        <IonToolbar className="chat-toolbar">
          <IonButton fill="clear" className="back-button" slot="start" onClick={() => history.goBack()}>
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <IonTitle className="chat-title">
            <div className="chat-title-content">
              <IonIcon icon={chatbubbleEllipsesOutline} />
              <span>Assistant Bancaire</span>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} className="chat-content" scrollEvents={true} scrollY={true} forceOverscroll={true}>
        <div className="chat-mobile-layout">
          {/* Messages container */}
          <div className="messages-container-mobile">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-bubble-mobile ${msg.sender === "user" ? "user-message" : "bot-message"}`}
              >
                <div className="message-content-mobile">
                  {msg.sender === "bot" && (
                    <div className="message-avatar-mobile">
                      <IonAvatar>
                        <img src="./bot.png" alt="Bot" />
                      </IonAvatar>
                    </div>
                  )}
                  <div className="message-text-mobile">
                    <div className="message-text-content-mobile">{formatMessageText(msg.text)}</div>
                    <span className="message-time-mobile">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="message-bubble-mobile bot-message">
                <div className="message-content-mobile">
                  <div className="message-avatar-mobile">
                    <IonAvatar>
                      <img src="./bot.png" alt="Bot" />
                    </IonAvatar>
                  </div>
                  <div className="message-text-mobile typing-indicator-mobile">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick suggestions */}
            {showSuggestions && !loading && (
              <div className="suggestions-container-mobile">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-chip-mobile"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                  >
                    <IonIcon icon={suggestion.icon} />
                    <span>{suggestion.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Invisible element for scrolling */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </IonContent>

      <IonFooter className="chat-footer-mobile">
        <div className="message-input-container-mobile">
          <IonTextarea
            ref={textareaRef}
            value={message}
            placeholder="Tapez votre message ici..."
            onIonChange={(e) => setMessage(e.detail.value!)}
            onKeyDown={handleKeyPress}
            autoGrow={true}
            rows={1}
            maxlength={500}
            className="message-input-mobile"
          />

          <IonButton
            className={`send-button-mobile ${message.trim() ? "active" : ""}`}
            onClick={() => sendMessage()}
            disabled={!message.trim()}
            strong={true}
          >
            <IonIcon icon={sendOutline} slot="icon-only" />
          </IonButton>
        </div>

        {isAuthenticated ? (
          <div className="chat-footer-info-mobile authenticated">
            <IonIcon icon={personCircleOutline} />
            <span>Les réponses incluront vos informations de compte personnelles</span>
          </div>
        ) : (
          <div className="chat-footer-info-mobile guest">
            <IonIcon icon={personCircleOutline} />
            <span>Connectez-vous pour obtenir une assistance bancaire personnalisée</span>
          </div>
        )}
      </IonFooter>
    </IonPage>
  )
}

export default ChatBotMobile
