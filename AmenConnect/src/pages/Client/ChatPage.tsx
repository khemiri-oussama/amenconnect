"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  IonPage,
  IonContent,
  IonButton,
  IonTextarea,
  IonIcon,
  IonFooter,
  IonAvatar,
  IonChip,
  IonLabel,
  IonSpinner,
} from "@ionic/react"
import {
  sendOutline,
  personCircleOutline,
  chatbubbleEllipsesOutline,
  informationCircleOutline,
  helpCircleOutline,
  documentTextOutline,
} from "ionicons/icons"
import { useAuth } from "../../AuthContext"
import "./ChatPage.css"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const ChatPage: React.FC = () => {
  const { profile, authLoading } = useAuth()
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis votre assistant bancaire. Comment puis-je vous aider aujourd'hui ?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [loading, setLoading] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true)

  // Défilement vers le bas des messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (authLoading) {
    return (
      <div className="loading-container">
        <IonSpinner name="crescent" />
        <p>Chargement de votre profil...</p>
      </div>
    )
  }

  // Déterminer si l'utilisateur est authentifié
  // Déterminer si l'utilisateur est authentifié
  const isAuthenticated = Boolean(profile)

  const userName = profile?.user ? `${profile.user.prenom} ${profile.user.nom}` : ""
  const userEmail = profile?.user?.email || ""
  const userAccounts = profile?.comptes || []
  const userCin = profile?.user?.cin || ""
  const userPhone = profile?.user?.telephone || ""
  const userAddress = profile?.user?.adresseEmployeur || ""
  const userCreatedAt = profile?.user?.createdAt || ""

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
                createdAt: userCreatedAt,
            },
          }
        : { message: text }

      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

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


      <IonContent className="chat-content">
        <div className="chat-desktop-layout">
          <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <h2>Assistant Bancaire</h2>
              <p>Posez-moi n'importe quelle question sur vos comptes, transactions ou services bancaires.</p>
            </div>

            {isAuthenticated ? (
              <div className="user-profile-section">
                <div className="user-avatar">
                  <IonAvatar>
                    <img src="./avatar.png" alt="Utilisateur" />
                  </IonAvatar>
                </div>
                <div className="user-details">
                  <h3>{userName}</h3>
                  <p>{userEmail}</p>
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
                  <IonIcon icon={personCircleOutline} />
                </div>
                <div className="guest-details">
                  <h3>Utilisateur Invité</h3>
                  <p>Accès limité aux fonctionnalités bancaires</p>
                  <div className="account-badge">
                    <IonChip color="medium">
                      <IonLabel>Mode Invité</IonLabel>
                    </IonChip>
                  </div>
                </div>
              </div>
            )}

            <div className="chat-info-section">
              <h3>À propos de l'Assistant Bancaire</h3>
              <ul>
                <li>Obtenir des informations sur le compte</li>
                <li>Vérifier l'historique des transactions</li>
                <li>Se renseigner sur les services bancaires</li>
                <li>Obtenir de l'aide pour les tâches courantes</li>
              </ul>

              <div className="chat-disclaimer">
                <p>
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
                  <IonIcon icon={chatbubbleEllipsesOutline} />
                  <h2>Discuter avec l'Assistant Bancaire</h2>
                </div>
                {isAuthenticated ? (
                  <div className="chat-status">
                    <span className="status-dot authenticated"></span>
                    <span>Authentifié en tant que {userName}</span>
                  </div>
                ) : (
                  <div className="chat-status">
                    <span className="status-dot guest"></span>
                    <span>Mode Invité</span>
                  </div>
                )}
              </div>

              {/* Conteneur de messages */}
              <div className="messages-container">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-bubble ${msg.sender === "user" ? "user-message" : "bot-message"}`}
                  >
                    <div className="message-content">
                      {msg.sender === "bot" && (
                        <div className="message-avatar">
                          <IonAvatar>
                            <img src="./bot.png" alt="Bot" />
                          </IonAvatar>
                        </div>
                      )}
                      <div className="message-text">
                        <p>{msg.text}</p>
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
                          <img src="./bot.png" alt="Bot" />
                        </IonAvatar>
                      </div>
                      <div className="message-text typing-indicator">
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
                      <div
                        key={index}
                        className="suggestion-chip"
                        onClick={() => handleSuggestionClick(suggestion.text)}
                      >
                        <IonIcon icon={suggestion.icon} />
                        <span>{suggestion.text}</span>
                      </div>
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
                  value={message}
                  placeholder="Tapez votre message ici..."
                  onIonChange={(e) => setMessage(e.detail.value!)}
                  onKeyPress={handleKeyPress}
                  autoGrow={true}
                  rows={1}
                  maxlength={500}
                  className="message-input"
                />
                <IonButton className="send-button" onSubmit={()=>sendMessage()}  onClick={() => sendMessage()}>
                  <IonIcon icon={sendOutline} />
                </IonButton>
              </div>

              {isAuthenticated ? (
                <div className="chat-footer-info authenticated">
                  <IonIcon icon={personCircleOutline} />
                  <span>Les réponses incluront vos informations de compte personnelles</span>
                </div>
              ) : (
                <div className="chat-footer-info guest">
                  <IonIcon icon={personCircleOutline} />
                  <span>Connectez-vous pour obtenir une assistance bancaire personnalisée</span>
                </div>
              )}
            </IonFooter>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default ChatPage

