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
  IonHeader,
  IonButtons,
  IonBackButton,
  IonTitle,
} from "@ionic/react"
import { sendOutline, chevronBackOutline } from "ionicons/icons"
import { useHistory } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import "./chatBotMobile.css"

interface Message {
  text: string
  isUser: boolean
}

const ChatMobile: React.FC = () => {
  const history = useHistory()
  const [messages, setMessages] = useState<Message[]>([
    { text: "Bonjour", isUser: true },
    { text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", isUser: false },
    { text: "Quel est mon solde actuel ?", isUser: true },
    { text: "Votre solde est de 2 500 dt.\nVous souhaitez faire autre chose ?", isUser: false },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const contentRef = useRef<HTMLIonContentElement>(null)

  const quickReplies = [
    "Comment faire un virement ?",
    "Quel est mon solde actuel ?",
    "Je veux un crédit",
    "Bloquer ma carte",
    "Changer mon code PIN",
    "Contacter un conseiller",
  ]

  useEffect(() => {
    scrollToBottom()
  }, []) // Removed unnecessary dependency 'messages'

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollToBottom(300)
    }
  }

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }])
      setInputMessage("")
      // Simulate assistant response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Je comprends votre demande. Comment puis-je vous aider davantage ?", isUser: false },
        ])
      }, 1000)
    }
  }

  const handleQuickReply = (reply: string) => {
    setMessages([...messages, { text: reply, isUser: true }])
    // Simulate assistant response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Merci pour votre question. Je vais vous aider avec cela.", isUser: false },
      ])
    }, 1000)
  }

  return (
    <IonPage className="chat-page">
      <IonHeader className="chat-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton icon={chevronBackOutline} text="" className="custom-back-button" defaultHref="/accueil" />
          </IonButtons>
          <IonTitle>AMEN Ai</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef} fullscreen className="chat-content">
        <div className="chat-container">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`message-group ${message.isUser ? "user" : "assistant"}`}
              >
                <div className="message">{message.text}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </IonContent>

      <IonFooter className="chat-footer">
        <div className="quick-replies-container">
          <div className="quick-replies">
            {quickReplies.map((reply, index) => (
              <motion.button
                key={index}
                className="quick-reply-btn ion-activatable"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
                <IonRippleEffect />
              </motion.button>
            ))}
          </div>
        </div>
        <IonToolbar>
          <div className="input-container">
            <IonInput
              value={inputMessage}
              onIonChange={(e) => setInputMessage(e.detail.value!)}
              placeholder="Tapez votre message..."
              className="message-input"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <motion.button
              className="send-button ion-activatable"
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

export default ChatMobile

