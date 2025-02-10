import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  IonContent,
  IonPage,
  IonIcon,
  IonFooter,
  IonToolbar,
  IonInput,
  IonRippleEffect,
  IonButton,
  IonAvatar,
} from "@ionic/react"
import { sendOutline, personOutline, menuOutline, chatbubbleEllipsesOutline } from "ionicons/icons"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "../../components/Navbar"
import ConversationHistory from "./ConversationHistory"
import "./ChatBotDesktop.css"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  unread: number
}

const ChatBotDesktop: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [showSidebar, setShowSidebar] = useState(false)
  const contentRef = useRef<HTMLIonContentElement>(null)

  const quickReplies = [
    "Vérifier mon solde",
    "Effectuer un virement",
    "Demander un prêt",
    "Signaler une carte perdue",
    "Modifier mes informations",
    "Parler à un conseiller",
  ]

  const conversations: Conversation[] = [
    {
      id: "1",
      title: "Demande de prêt",
      lastMessage: "Votre demande de prêt a été approuvée.",
      timestamp: new Date("2023-05-10T14:30:00"),
      unread: 2,
    },
    {
      id: "2",
      title: "Problème de carte",
      lastMessage: "Votre nouvelle carte a été envoyée.",
      timestamp: new Date("2023-05-09T10:15:00"),
      unread: 0,
    },
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollToBottom(300)
    }
  }

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = { id: Date.now().toString(), text: inputMessage, isUser: true, timestamp: new Date() }
      setMessages([...messages, newMessage])
      setInputMessage("")
      // Simulate assistant response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Je comprends votre demande. Comment puis-je vous aider davantage ?",
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }, 1000)
    }
  }

  const handleQuickReply = (reply: string) => {
    const userMessage: Message = { id: Date.now().toString(), text: reply, isUser: true, timestamp: new Date() }
    setMessages([...messages, userMessage])
    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Merci pour votre question. Je vais vous aider avec cela.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const requestHumanAssistant = () => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      text: "Votre demande a été prise en compte. Un conseiller humain vous contactera sous peu.",
      isUser: false,
      timestamp: new Date(),
    }
    setMessages([...messages, systemMessage])
  }

  return (
    <IonPage className="chat-desktop-page">
      <Navbar currentPage="chat"/>
      <div className="chat-content-wrapper">
        <div className={`chat-sidebar ${showSidebar ? "show" : ""}`}>
          <ConversationHistory conversations={conversations} />
        </div>
        <div className="chat-main">
          <div className="chat-header">
            <div className="chat-header-left">
              <IonButton fill="clear" className="menu-button" onClick={() => setShowSidebar(!showSidebar)}>
                <IonIcon icon={menuOutline} />
              </IonButton>
              <h1>Assistant bancaire virtuel</h1>
            </div>
            <IonButton fill="clear" className="human-assistant-button" onClick={requestHumanAssistant}>
              <IonIcon icon={personOutline} slot="start" />
              Demander un conseiller humain
            </IonButton>
          </div>
          <IonContent ref={contentRef} className="chat-desktop-content" scrollEvents={true}>
            {messages.length === 0 && (
              <div className="welcome-message">
                <IonIcon icon={chatbubbleEllipsesOutline} className="welcome-icon" />
                <h2>Bienvenue dans votre assistant bancaire virtuel</h2>
                <p>Comment puis-je vous aider aujourd'hui ?</p>
              </div>
            )}
            <div className="chat-desktop-messages">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`message-group-desktop ${message.isUser ? "user" : "assistant"}`}
                  >
                    <div className="message-avatar">
                      <IonAvatar>
                        <img
                          src={message.isUser ? "/assets/user-avatar.png" : "/assets/assistant-avatar.png"}
                          alt="Avatar"
                        />
                      </IonAvatar>
                    </div>
                    <div className="message-content">
                      <div className="message-desktop">{message.text}</div>
                      <div className="message-timestamp">{message.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </IonContent>
          <IonFooter className="chat-desktop-footer">
            <div className="quick-replies-container-desktop">
              {quickReplies.map((reply, index) => (
                <motion.button
                  key={index}
                  className="quick-reply-btn-desktop ion-activatable"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                  <IonRippleEffect />
                </motion.button>
              ))}
            </div>
            <IonToolbar>
              <div className="input-container-desktop">
                <IonInput
                  value={inputMessage}
                  onIonChange={(e) => setInputMessage(e.detail.value!)}
                  placeholder="Tapez votre message..."
                  className="message-input-desktop"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <motion.button
                  className="send-button-desktop ion-activatable"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSendMessage}
                >
                  <IonIcon icon={sendOutline} />
                  <IonRippleEffect />
                </motion.button>
              </div>
            </IonToolbar>
          </IonFooter>
        </div>
      </div>
    </IonPage>
  )
}

export default ChatBotDesktop

