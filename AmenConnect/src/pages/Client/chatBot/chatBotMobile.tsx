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
  IonHeader,
  IonButtons,
} from "@ionic/react"
import {
  sendOutline,
  personOutline,
  chevronBackOutline,
  chatbubbleEllipsesOutline,
  menuOutline,
} from "ionicons/icons"
import { motion, AnimatePresence } from "framer-motion"
import "./ChatBotMobile.css"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

const ChatBotMobile: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const contentRef = useRef<HTMLIonContentElement>(null)

  const quickReplies = [
    "Vérifier mon solde",
    "Effectuer un virement",
    "Demander un prêt",
    "Signaler une carte perdue",
    "Modifier mes informations",
    "Parler à un conseiller",
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
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        isUser: true,
        timestamp: new Date(),
      }
      setMessages([...messages, newMessage])
      setInputMessage("")
      setShowQuickReplies(false)

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
    const userMessage: Message = {
      id: Date.now().toString(),
      text: reply,
      isUser: true,
      timestamp: new Date(),
    }
    setMessages([...messages, userMessage])
    setShowQuickReplies(false)

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

  return (
    <IonPage className="chat-mobile-page">
      <IonHeader className="chat-mobile-header">
        <div className="chat-mobile-toolbar">
          <IonButtons slot="start">
            <IonButton className="chat-mobile-back-button">
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <h1 className="chat-mobile-title">Assistant virtuel</h1>
          <IonButtons slot="end">
            <IonButton className="chat-mobile-menu-button">
              <IonIcon icon={menuOutline} />
            </IonButton>
          </IonButtons>
        </div>
      </IonHeader>

      <IonContent ref={contentRef} className="chat-mobile-content" scrollEvents={true}>
        {messages.length === 0 && (
          <div className="chat-mobile-welcome">
            <IonIcon icon={chatbubbleEllipsesOutline} className="chat-mobile-welcome-icon" />
            <h2>Bienvenue!</h2>
            <p>Comment puis-je vous aider aujourd'hui ?</p>
          </div>
        )}

        <div className="chat-mobile-messages">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`chat-mobile-message-group ${message.isUser ? "user" : "assistant"}`}
              >
                <div className="chat-mobile-avatar">
                  <IonAvatar>
                    <img
                      src={message.isUser ? "/assets/user-avatar.png" : "/assets/assistant-avatar.png"}
                      alt="Avatar"
                    />
                  </IonAvatar>
                </div>
                <div className="chat-mobile-message-content">
                  <div className="chat-mobile-message-bubble">{message.text}</div>
                  <div className="chat-mobile-timestamp">{message.timestamp.toLocaleTimeString()}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </IonContent>

      <IonFooter className="chat-mobile-footer">
        {showQuickReplies && (
          <div className="chat-mobile-quick-replies">
            {quickReplies.map((reply, index) => (
              <motion.button
                key={index}
                className="chat-mobile-quick-reply-btn ion-activatable"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
                <IonRippleEffect />
              </motion.button>
            ))}
          </div>
        )}

        <IonToolbar className="chat-mobile-toolbar">
          <div className="chat-mobile-input-container">
            <IonInput
              value={inputMessage}
              onIonChange={(e) => setInputMessage(e.detail.value!)}
              placeholder="Tapez votre message..."
              className="chat-mobile-input"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <motion.button
              className="chat-mobile-send-button ion-activatable"
              whileTap={{ scale: 0.9 }}
              onClick={handleSendMessage}
            >
              <IonIcon icon={sendOutline} />
              <IonRippleEffect />
            </motion.button>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  )
}

export default ChatBotMobile