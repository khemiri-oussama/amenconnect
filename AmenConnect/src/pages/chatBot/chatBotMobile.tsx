import type React from "react"
import { IonContent, IonPage, IonIcon, IonFooter, IonToolbar, IonInput } from "@ionic/react"
import { homeOutline, walletOutline, chatbubbleOutline, cardOutline, arrowForward, sendOutline } from "ionicons/icons"
import "./chatBotMobile.css"
import { useHistory } from "react-router-dom"

const ChatMobile: React.FC = () => {
    const history = useHistory()
  return (
    <IonPage>
      <IonContent fullscreen className="chat-content">
        <div className="status-bar"></div>

        {/* Chat Messages */}
        <div className="chat-container">
          <div className="message-group">
            <div className="message user">Bonjour</div>
          </div>

          <div className="message-group">
            <div className="message assistant">Bonjour ! Comment puis-je vous aider aujourd'hui ?</div>
          </div>

          <div className="message-group">
            <div className="message user">Quel est mon solde actuel ?</div>
          </div>

          <div className="message-group">
            <div className="message assistant">
              Votre solde est de 2 500 dt.
              <br />
              Vous souhaitez faire autre chose ?
            </div>
          </div>

          {/* Quick Reply Buttons */}
          <div className="quick-replies">
            <button className="quick-reply-btn">comment faire un virement ?</button>
            <button className="quick-reply-btn">Quel est mon solde actuel ?</button>
            <button className="quick-reply-btn">Je veux un crédit</button>
          </div>
        </div>

        {/* Message Input */}
        <IonFooter className="chat-footer">
          <IonToolbar>
            <div className="input-container">
              <IonInput placeholder="Message" className="message-input" />
              <button className="send-button">
                <IonIcon icon={sendOutline} />
              </button>
            </div>
          </IonToolbar>
        </IonFooter>

        {/* Bottom Navigation */}
        <div className="bottom-tabs">
          <button className="tab-button" onClick={() => history.push('/accueil')}>
            <IonIcon icon={homeOutline} />
            <span>Accueil</span>
          </button>
          <button className="tab-button" onClick={() => history.push('/compte')}>
            <IonIcon icon={walletOutline} />
            <span>Compte</span>
          </button>
          <button className="tab-button active">
            <IonIcon icon={chatbubbleOutline} />
            <span>Chat</span>
          </button>
          <button className="tab-button" onClick={() => history.push('/Carte')}>
            <IonIcon icon={cardOutline} />
            <span>Carte</span>
          </button>
          <button className="tab-button">
            <IonIcon icon={arrowForward} />
            <span>Virements</span>
          </button>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default ChatMobile

