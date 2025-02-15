"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  IonContent,
  IonPage,
  IonIcon,
  IonFooter,
  IonToolbar,
  IonInput,
  IonButtons,
  IonButton,
  IonTitle,
  IonMenu,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonMenuToggle,
} from "@ionic/react"
import {
  sendOutline,
  refreshOutline,
  menuOutline,
  closeOutline,
  timeOutline,
  chevronForwardOutline,
} from "ionicons/icons"
import { motion, AnimatePresence } from "framer-motion"
import "./ChatBotMobile.css"

interface Message {
  text: string
  isUser: boolean
}

interface ChatSession {
  id: string
  title: string
  timestamp: Date
  messages: Message[]
}

const ChatMobile: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", isUser: false },
    { text: "Quel est mon solde actuel ?", isUser: true },
    { text: "Votre solde est de 2 500 dt.\nVous souhaitez faire autre chose ?", isUser: false },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Chat précédent",
      timestamp: new Date(),
      messages: [
        { text: "Bonjour", isUser: true },
        { text: "Comment puis-je vous aider ?", isUser: false },
      ],
    },
  ])
  const contentRef = useRef<HTMLIonContentElement>(null)

  const quickReplies = [
    { text: "Comment faire un virement ?", color: "blue" },
    { text: "Quel est mon solde actuel ?", color: "green" },
    { text: "Je veux un crédit", color: "purple" },
  ]

  useEffect(() => {
    scrollToBottom()
  }, [])

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollToBottom(300)
    }
  }

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }])
      setInputMessage("")
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
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Merci pour votre question. Je vais vous aider avec cela.", isUser: false },
      ])
    }, 1000)
  }

  const handleNewChat = () => {
    if (messages.length > 0) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: messages[0].text,
        timestamp: new Date(),
        messages: [...messages],
      }
      setChatSessions([newSession, ...chatSessions])
    }
    setMessages([{ text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", isUser: false }])
  }

  const loadChatSession = (session: ChatSession) => {
    setMessages(session.messages)
  }

  return (
    <>
      <IonMenu side="start" contentId="main-content" className="recent-chats-menu">
        <IonToolbar>
          <IonTitle>Conversations récentes</IonTitle>
          <IonButtons slot="end">
            <IonMenuToggle>
              <IonButton>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonMenuToggle>
          </IonButtons>
        </IonToolbar>
        <IonContent>
          <IonList>
            {chatSessions.map((session) => (
              <IonMenuToggle key={session.id}>
                <IonItem button onClick={() => loadChatSession(session)} className="chat-session-item">
                  <IonIcon icon={timeOutline} slot="start" />
                  <IonLabel>
                    <h2>{session.title}</h2>
                    <p>{session.timestamp.toLocaleDateString()}</p>
                  </IonLabel>
                  <IonIcon icon={chevronForwardOutline} slot="end" />
                </IonItem>
              </IonMenuToggle>
            ))}
          </IonList>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content" className="chat-page">
        <div className="gradient-background" />
        <div className="top-icons safe-area-top">
          <IonMenuToggle>
            <IonButton>
              <IonIcon icon={menuOutline} />
            </IonButton>
          </IonMenuToggle>
          <IonButton onClick={handleNewChat}>
            <IonIcon icon={refreshOutline} />
          </IonButton>
        </div>

        <IonContent ref={contentRef} className="chat-content">
          <h1 className="chat-title">Assistant IA</h1>
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
                  {!message.isUser && (
                    <IonAvatar className="assistant-avatar">
                      <img src="/placeholder.svg?height=40&width=40" alt="AI Assistant" />
                    </IonAvatar>
                  )}
                  <div className="message">{message.text}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </IonContent>

        <IonFooter className="chat-footer">
          <div className="quick-replies-container">
            <div className="quick-replies-scroll">
              <AnimatePresence>
                {quickReplies.map((reply, index) => (
                  <motion.button
                    key={index}
                    className={`quick-reply-btn quick-reply-${reply.color}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    onClick={() => handleQuickReply(reply.text)}
                  >
                    {reply.text}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="input-container">
            <IonInput
              value={inputMessage}
              onIonChange={(e) => setInputMessage(e.detail.value!)}
              placeholder="Tapez votre message..."
              className="message-input"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <IonButton fill="clear" className="send-button" onClick={handleSendMessage} disabled={!inputMessage.trim()}>
              <IonIcon icon={sendOutline} />
            </IonButton>
          </div>
        </IonFooter>
      </IonPage>
    </>
  )
}

export default ChatMobile

