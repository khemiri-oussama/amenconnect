import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonCardContent,
  IonRadioGroup,
  IonRadio,
  IonBadge,
} from "@ionic/react"
import {
  arrowForward,
  arrowBack,
  timeOutline,
  documentTextOutline,
  chatbubbleOutline,
  downloadOutline,
} from "ionicons/icons"
import "./VirementDesktop.css"
import Navbar from "../../components/Navbar"
const VirementsDesktop: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
      <Navbar />
      </IonHeader>

      <IonContent className="ion-padding">
        <h1 className="page-title">Virements</h1>

        <div className="grid-container">
          {/* Quick Transfer Card */}
          <IonCard className="quick-transfer-card">
            <IonCardContent>
              <h2>Virement Rapide</h2>
              <div className="form-group">
                <label>Bénéficiaire</label>
                <IonSelect placeholder="Choisir Bénéficiaire" interface="popover">
                  <IonSelectOption value="ben1">Bénéficiaire 1</IonSelectOption>
                  <IonSelectOption value="ben2">Bénéficiaire 2</IonSelectOption>
                </IonSelect>
              </div>
              <div className="form-group">
                <label>Montant (TND)</label>
                <input type="number" className="amount-input" placeholder="0.00" />
              </div>
              <IonButton expand="block" className="transfer-button">
                Effectuer le virement
                <IonIcon icon={arrowForward} slot="end" />
              </IonButton>
            </IonCardContent>
          </IonCard>

          {/* Transaction History Card */}
          <IonCard className="history-card">
            <IonCardContent>
              <IonSegment value="historique">
                <IonSegmentButton value="historique">
                  <IonLabel>
                    Historique <IonBadge>6</IonBadge>
                  </IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="asigner">
                  <IonLabel>
                    Virements à signer <IonBadge>3</IonBadge>
                  </IonLabel>
                </IonSegmentButton>
              </IonSegment>

              <IonList className="transaction-list">
                <IonItem lines="full">
                  <IonIcon icon={arrowBack} slot="start" className="outgoing" />
                  <IonLabel>
                    <h3>Virement à Ahmed Ben Ali</h3>
                    <p>Compte Epargne</p>
                  </IonLabel>
                  <div className="transaction-amount outgoing">-1000 DT</div>
                  <div className="transaction-date">01/02/2025</div>
                </IonItem>

                <IonItem lines="full">
                  <IonIcon icon={arrowForward} slot="start" className="incoming" />
                  <IonLabel>
                    <h3>Virement reçu de Société XYZ</h3>
                    <p>Compte Courant</p>
                  </IonLabel>
                  <div className="transaction-amount incoming">+1850 DT</div>
                  <div className="transaction-date">01/02/2025</div>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Transfer Options Card */}
          <IonCard className="transfer-options-card">
            <IonCardContent>
              <h2>Virement</h2>
              <div className="options-grid">
                <div className="option-item">
                  <IonIcon icon={timeOutline} />
                  <span>Virement Compte à Compte</span>
                </div>
                <div className="option-item">
                  <IonIcon icon={documentTextOutline} />
                  <span>Virement Permanent</span>
                </div>
              </div>

              <div className="mass-transfer-section">
                <h3>Virement de masse</h3>
                <IonRadioGroup value="standard">
                  <IonItem>
                    <IonRadio value="standard">Format Standard</IonRadio>
                  </IonItem>
                  <IonItem>
                    <IonRadio value="afb320">Format AFB320</IonRadio>
                  </IonItem>
                  <IonItem>
                    <IonRadio value="nt112">Format NT 112.15 de 1998</IonRadio>
                  </IonItem>
                </IonRadioGroup>
                <IonButton fill="outline" className="import-button">
                  Import
                  <IonIcon icon={downloadOutline} slot="end" />
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Help Card */}
          <IonCard className="help-card">
            <IonCardContent>
              <h2>Aide et informations</h2>
              <div className="help-grid">
                <div className="help-item">
                  <h3>Limites de virement</h3>
                  <p>Virement quotidien max: 10,000</p>
                  <p>Virement mensuel max: 50,000</p>
                </div>
                <div className="help-item">
                  <h3>Délais de traitement</h3>
                  <p>Virement interne: Instantané</p>
                  <p>Virement externe: 1-2 jours ouvrés</p>
                </div>
              </div>
              <IonButton expand="block" fill="clear" className="chat-button">
                <IonIcon icon={chatbubbleOutline} slot="start" />
                Chat Assistant
              </IonButton>
            </IonCardContent>
          </IonCard>

          {/* Account Details Card */}
          <IonCard className="account-details-card">
            <IonCardContent>
              <div className="details-grid">
                <div className="detail-item">
                  <label>RIB</label>
                  <span>07098050001216747468</span>
                </div>
                <div className="detail-item">
                  <label>IBAN</label>
                  <span>TN5907098050001216747468</span>
                </div>
                <div className="detail-item">
                  <label>Solde du compte</label>
                  <span>2580 DT</span>
                </div>
                <div className="detail-item">
                  <label>Date de création</label>
                  <span>22/01/2025</span>
                </div>
              </div>
              <IonButton expand="block" fill="clear" className="download-button">
                Télécharger le relevé
                <IonIcon icon={downloadOutline} slot="end" />
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  )
}




export default VirementsDesktop

