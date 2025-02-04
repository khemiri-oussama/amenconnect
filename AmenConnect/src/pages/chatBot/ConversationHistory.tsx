import type React from "react"
import { IonList, IonItem, IonLabel, IonBadge, IonIcon } from "@ionic/react"
import { chatbubbleEllipsesOutline } from "ionicons/icons"

interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  unread: number
}

interface ConversationHistoryProps {
  conversations: Conversation[]
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ conversations }) => {
  return (
    <div className="conversation-history-container">
      <h2 className="conversation-history-title">Historique des conversations</h2>
      <IonList className="conversation-history">
        {conversations.map((conversation) => (
          <IonItem key={conversation.id} className="conversation-item">
            <div className="conversation-icon">
              <IonIcon icon={chatbubbleEllipsesOutline} />
            </div>
            <IonLabel>
              <h2>{conversation.title}</h2>
              <p>{conversation.lastMessage}</p>
              <p className="conversation-timestamp">{conversation.timestamp.toLocaleString()}</p>
            </IonLabel>
            {conversation.unread > 0 && <IonBadge color="primary">{conversation.unread}</IonBadge>}
          </IonItem>
        ))}
      </IonList>
    </div>
  )
}

export default ConversationHistory

