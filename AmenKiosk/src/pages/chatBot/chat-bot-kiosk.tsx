"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  IonPage,
  IonContent,
  IonButton,
  IonTextarea,
  IonIcon,
  IonAvatar,
  IonChip,
  IonLabel,
  IonSpinner,
  IonImg,
} from "@ionic/react"
import {
  sendOutline,
  personCircleOutline,
  helpCircleOutline,
  documentTextOutline,
  timeOutline,
  walletOutline,
} from "ionicons/icons"
import { useAuth } from "../../context/AuthContext"
import NavbarKiosk from "../../components/NavbarKiosk"
import "./chat-bot-kiosk.css"
import Keyboard from "react-simple-keyboard"
import "react-simple-keyboard/build/css/index.css"
import { TypingEffect } from "../../components/KioskComponents/typing-effect"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
  isTyping?: boolean
  isComplete?: boolean
}

const ChatBotKiosk: React.FC = () => {
  const { profile, authLoading } = useAuth()
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Bonjour ${profile?.user?.prenom || ""} ! Je suis votre assistant bancaire. Comment puis-je vous aider aujourd'hui ?`,
      sender: "bot",
      timestamp: new Date(),
      isComplete: true,
    },
  ])
  const [loading, setLoading] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true)
  const textareaRef = useRef<HTMLIonTextareaElement>(null)
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false)
  const [hasUserSentMessage, setHasUserSentMessage] = useState<boolean>(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (authLoading) {
    return (
      <div className="kiosk-loading-container">
        <IonSpinner name="crescent" />
        <p>Chargement de votre profil...</p>
      </div>
    )
  }

  const isAuthenticated = Boolean(profile)
  const userName = profile?.user ? `${profile.user.prenom} ${profile.user.nom}` : ""
  const userEmail = profile?.user?.email || ""
  const userAccounts = profile?.comptes || []
  const userCin = profile?.user?.cin || ""
  const userPhone = profile?.user?.telephone || ""
  const userAddress = profile?.user?.adresseEmployeur || ""

  const sendMessage = async (text = message) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      sender: "user",
      timestamp: new Date(),
      isComplete: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
    setMessage("")
    setShowSuggestions(false)
    setShowKeyboard(false)
    setHasUserSentMessage(true)

    try {
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
            },
          }
        : { message: text }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      const botMessage: Message = {
        id: messages.length + 2,
        text: data.response || "Je suis désolé, je n'ai pas pu traiter votre demande.",
        sender: "bot",
        timestamp: new Date(),
        isTyping: true,
        isComplete: false,
      }

      setMessages((prev) => [...prev, botMessage])
      setLoading(false)
    } catch (error) {
      console.error("Erreur:", error)
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Une erreur s'est produite lors de la communication avec l'API. Veuillez réessayer plus tard.",
        sender: "bot",
        timestamp: new Date(),
        isComplete: true,
      }

      setMessages((prev) => [...prev, errorMessage])
      setLoading(false)
    }
  }

  const handleTypingComplete = (messageId: number) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, isTyping: false, isComplete: true } : msg)),
    )
    setShowSuggestions(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessageText = (text: string) => {
    return text.split("\n").map((line, i) => (
      <p key={i} className="kiosk-message-paragraph">
        {line || " "}
      </p>
    ))
  }

  const suggestions = [
    { text: "Quel est le solde de mon compte ?", icon: walletOutline },
    { text: "Comment puis-je effectuer un virement ?", icon: helpCircleOutline },
    { text: "Afficher mes transactions récentes", icon: documentTextOutline },
    { text: "Quels sont les frais bancaires ?", icon: timeOutline },
  ]

  const handleSuggestionClick = (suggestionText: string) => {
    sendMessage(suggestionText)
  }

  const focusTextarea = () => {
    if (!showKeyboard) {
      setShowKeyboard(true)
      setTimeout(() => {
        scrollToBottom()
      }, 300)
    }
  }

  const onKeyboardChange = (input: string) => {
    setMessage(input)
  }

  const onKeyboardKeyPress = (button: string) => {
    if (button === "{enter}") {
      sendMessage()
    }
  }

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (!target.closest(".kiosk-message-input-container") && !target.closest(".virtual-keyboard-container")) {
      setShowKeyboard(false)
    }
  }

  const isBotTyping = messages.some((msg) => msg.sender === "bot" && msg.isTyping)

  return (
    <IonPage className="kiosk-chat-page">
      <NavbarKiosk currentPage="chat" />

      <IonContent className="kiosk-chat-content">
        <div className={`kiosk-chat-container ${showKeyboard ? "keyboard-visible" : ""}`} onClick={handleClickOutside}>
          <div className="kiosk-chat-header">
            <IonImg className="kiosk-logo" src="amen_logo.png" alt="Amen Bank Logo" />
            <div className="kiosk-chat-title">
              <h1 className="kiosk-title">Assistant Bancaire</h1>
              <p className="kiosk-subtitle">Posez vos questions sur vos comptes et services bancaires</p>
            </div>
          </div>

          <div className="kiosk-chat-main">
            <div className="kiosk-user-info">
              {isAuthenticated ? (
                <div className="kiosk-user-profile">
                  <div className="kiosk-user-avatar">
                    <IonAvatar>
                      <img src="./avatar.png" alt="Utilisateur" />
                    </IonAvatar>
                  </div>
                  <div className="kiosk-user-details">
                    <h3 className="kiosk-user-name">{userName}</h3>
                    <IonChip color="success" className="kiosk-user-status">
                      <IonLabel>Authentifié</IonLabel>
                    </IonChip>
                  </div>
                </div>
              ) : (
                <div className="kiosk-user-profile">
                  <div className="kiosk-user-avatar">
                    <IonIcon icon={personCircleOutline} />
                  </div>
                  <div className="kiosk-user-details">
                    <h3 className="kiosk-user-name">Utilisateur Invité</h3>
                    <IonChip color="medium" className="kiosk-user-status">
                      <IonLabel>Mode Invité</IonLabel>
                    </IonChip>
                  </div>
                </div>
              )}
            </div>

            <div className="kiosk-messages-container" onClick={focusTextarea}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`kiosk-message-bubble ${msg.sender === "user" ? "kiosk-user-message" : "kiosk-bot-message"}`}
                >
                  <div className="kiosk-message-content">
                    {msg.sender === "bot" && (
                      <div className="kiosk-message-avatar">
                        <IonAvatar>
                          <img src="./bot.png" alt="Bot" />
                        </IonAvatar>
                      </div>
                    )}
                    <div className="kiosk-message-text">
                      <div className="kiosk-message-text-content">
                        {msg.sender === "bot" && msg.isTyping ? (
                          <TypingEffect text={msg.text} onComplete={() => handleTypingComplete(msg.id)} />
                        ) : (
                          formatMessageText(msg.text)
                        )}
                      </div>
                      <span className="kiosk-message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="kiosk-message-bubble kiosk-bot-message">
                  <div className="kiosk-message-content">
                    <div className="kiosk-message-avatar">
                      <IonAvatar>
                        <img src="./bot.png" alt="Bot" />
                      </IonAvatar>
                    </div>
                    <div className="kiosk-message-text kiosk-typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {showSuggestions && !hasUserSentMessage && !loading && !isBotTyping && (
              <div className="kiosk-suggestions-container">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="kiosk-suggestion-chip"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                  >
                    <IonIcon icon={suggestion.icon} />
                    <span>{suggestion.text}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="kiosk-chat-input-area">
              <div className="kiosk-message-input-container" onClick={focusTextarea}>
                <IonTextarea
                  ref={textareaRef}
                  value={message}
                  placeholder="Tapez votre message ici..."
                  onIonChange={(e) => setMessage(e.detail.value!)}
                  onKeyDown={handleKeyPress}
                  autoGrow={true}
                  rows={1}
                  maxlength={500}
                  className="kiosk-message-input"
                  readonly={showKeyboard ? true : false}
                />
                <IonButton className="kiosk-send-button" onClick={() => sendMessage()} disabled={!message.trim()}>
                  <IonIcon icon={sendOutline} />
                </IonButton>
              </div>

              <div className={`kiosk-chat-footer-info ${isAuthenticated ? "authenticated" : "guest"}`}>
                <IonIcon icon={personCircleOutline} />
                <span>
                  {isAuthenticated
                    ? "Les réponses incluront vos informations de compte personnelles"
                    : "Connectez-vous pour obtenir une assistance bancaire personnalisée"}
                </span>
              </div>
            </div>
          </div>

          {showKeyboard && (
            <div className="keyboard-overlay">
              <div className="floating-input-container">
                <div className="kiosk-message-input-container">
                  <IonTextarea
                    value={message}
                    placeholder="Tapez votre message ici..."
                    onIonChange={(e) => setMessage(e.detail.value!)}
                    autoGrow={true}
                    rows={1}
                    maxlength={500}
                    className="kiosk-message-input"
                  />
                  <IonButton className="kiosk-send-button" onClick={() => sendMessage()} disabled={!message.trim()}>
                    <IonIcon icon={sendOutline} />
                  </IonButton>
                </div>
              </div>
              <div className="virtual-keyboard-container" onMouseDown={(e) => e.preventDefault()}>
                <div className="keyboard-wrapper">
                  <Keyboard
                    onChange={onKeyboardChange}
                    onKeyPress={onKeyboardKeyPress}
                    value={message}
                    layout={{
                      default: [
                        "1 2 3 4 5 6 7 8 9 0 {bksp}",
                        "q w e r t y u i o p",
                        "a s d f g h j k l",
                        "z x c v b n m , .",
                        "{space} {enter}",
                      ],
                    }}
                    display={{
                      "{bksp}": "⌫",
                      "{enter}": "Envoyer",
                      "{space}": "Espace",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default ChatBotKiosk