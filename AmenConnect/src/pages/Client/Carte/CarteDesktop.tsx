"use client"
import Profile from "../accueil/MenuDesktop/ProfileMenu"
import type React from "react"
import { useState } from "react"
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonProgressBar,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonChip,
} from "@ionic/react"
import {
  shieldOutline,
  notificationsOutline,
  lockClosedOutline,
  downloadOutline,
  trendingUpOutline,
  pieChartOutline,
  walletOutline,
} from "ionicons/icons"
import "./CarteDesktop.css"
import Navbar from "../../../components/Navbar"

interface Transaction {
  id: string
  date: string
  merchant: string
  amount: number
  type: "debit" | "credit"
  category: string
  icon: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "09 févr. 2024",
    merchant: "Carrefour Market",
    amount: 156.7,
    type: "debit",
    category: "Courses",
    icon: "🛒",
  },
  {
    id: "2",
    date: "08 févr. 2024",
    merchant: "Virement Reçu - Salaire",
    amount: 3500.0,
    type: "credit",
    category: "Revenus",
    icon: "💰",
  },
  {
    id: "3",
    date: "07 févr. 2024",
    merchant: "Restaurant Le Petit Jardin",
    amount: 89.5,
    type: "debit",
    category: "Restauration",
    icon: "🍽️",
  },
  {
    id: "4",
    date: "07 févr. 2024",
    merchant: "SNCF",
    amount: 45.0,
    type: "debit",
    category: "Transport",
    icon: "🚂",
  },
  {
    id: "5",
    date: "06 févr. 2024",
    merchant: "Netflix",
    amount: 15.99,
    type: "debit",
    category: "Divertissement",
    icon: "🎬",
  },
]

const spendingCategories = [
  { name: "Courses", amount: 450.7, color: "#FF6B6B", percentage: 35 },
  { name: "Restauration", amount: 289.5, color: "#4ECDC4", percentage: 25 },
  { name: "Transport", amount: 145.0, color: "#45B7D1", percentage: 20 },
  { name: "Divertissement", amount: 115.99, color: "#96CEB4", percentage: 20 },
]

const CarteDesktop: React.FC = () => {
  const [activeTab, setActiveTab] = useState("operations")
  const [isCardLocked, setIsCardLocked] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tn-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  return (
    <IonPage className="carte-desktop">
      <IonHeader>
        <IonToolbar>
          <Navbar currentPage="carte"/>
        </IonToolbar>
      </IonHeader>

      <IonContent className="carte-desktop__content">
        <div className="carte-desktop__layout">
        <div className="ProfileVir"><Profile/></div>
          <div className="carte-desktop__left-panel">
            <IonCard className="carte-desktop__credit-card">
              <IonCardContent>
                <div className="carte-desktop__card-chip"></div>
                <div className="carte-desktop__card-details">
                  <span className="carte-desktop__card-number">1234 •••• •••• 1234</span>
                  <div className="carte-desktop__card-info">
                    <span>
                      <small>Expire à fin</small>
                      <br />
                      01/26
                    </span>
                    <span>
                      <small>Foulen ben foulen</small>
                    </span>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <div className="carte-desktop__quick-actions">
              <IonButton
                expand="block"
                color={isCardLocked ? "danger" : "success"}
                onClick={() => setIsCardLocked(!isCardLocked)}
              >
                <IonIcon slot="start" icon={lockClosedOutline} />
                {isCardLocked ? "Débloquer la carte" : "Bloquer la carte"}
              </IonButton>
              <IonButton expand="block" color="success">
                <IonIcon slot="start" icon={shieldOutline} />
                Paramètres de sécurité
              </IonButton>
              <IonButton expand="block" color="success">
                <IonIcon slot="start" icon={downloadOutline} />
                Télécharger le relevé
              </IonButton>
            </div>

            <IonCard className="carte-desktop__card-limits">
              <IonCardHeader>
                <IonCardTitle>Limites de la carte</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="carte-desktop__limit-item">
                  <div className="carte-desktop__limit-info">
                    <span>Dépenses mensuelles</span>
                    <span>3 450 TND / 5 000 TND</span>
                  </div>
                  <IonProgressBar value={0.69} color="success"></IonProgressBar>
                </div>
                <div className="carte-desktop__limit-item">
                  <div className="carte-desktop__limit-info">
                    <span>Retrait DAB</span>
                    <span>400 TND / 1 000 TND</span>
                  </div>
                  <IonProgressBar value={0.4} color="success"></IonProgressBar>
                </div>
              </IonCardContent>
            </IonCard>
          </div>

          <div className="carte-desktop__right-panel">
            <div className="carte-desktop__tabs">
              <IonButton
                fill={activeTab === "operations" ? "solid" : "clear"}
                color="success"
                onClick={() => setActiveTab("operations")}
              >
                Opérations
              </IonButton>
              <IonButton
                fill={activeTab === "details" ? "solid" : "clear"}
                color="success"
                onClick={() => setActiveTab("details")}
              >
                Détails
              </IonButton>
              <IonButton
                fill={activeTab === "analytics" ? "solid" : "clear"}
                color="success"
                onClick={() => setActiveTab("analytics")}
              >
                Analyses
              </IonButton>
            </div>

            <div className="carte-desktop__tab-content">
              {activeTab === "operations" && (
                <div className="carte-desktop__operations-tab">
                  <div className="carte-desktop__balance-summary">
                    <IonCard className="carte-desktop__balance-card">
                      <IonCardContent>
                        <h4>Solde actuel</h4>
                        <h2>{formatCurrency(4521.8)}</h2>
                        <IonChip color="success">+2,4% par rapport au mois dernier</IonChip>
                      </IonCardContent>
                    </IonCard>
                    <IonCard className="carte-desktop__balance-card">
                      <IonCardContent>
                        <h4>Transactions en attente</h4>
                        <h2>{formatCurrency(245.3)}</h2>
                        <span>3 transactions en attente</span>
                      </IonCardContent>
                    </IonCard>
                  </div>

                  <IonCard className="carte-desktop__recent-transactions">
                    <IonCardHeader>
                      <IonCardTitle>Transactions récentes</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonList>
                        {mockTransactions.map((transaction) => (
                          <IonItem key={transaction.id} className="carte-desktop__transaction-item">
                            <IonAvatar slot="start">
                              <div className="carte-desktop__transaction-icon">{transaction.icon}</div>
                            </IonAvatar>
                            <IonLabel>
                              <h2>{transaction.merchant}</h2>
                              <p>{transaction.date}</p>
                            </IonLabel>
                            <IonChip slot="end" color={transaction.type === "debit" ? "danger" : "success"}>
                              {transaction.type === "debit" ? "-" : "+"}
                              {formatCurrency(transaction.amount)}
                            </IonChip>
                          </IonItem>
                        ))}
                      </IonList>
                    </IonCardContent>
                  </IonCard>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="carte-desktop__analytics-tab">
                  <h3>Analyse des dépenses</h3>
                  <IonList className="carte-desktop__spending-categories">
                    {spendingCategories.map((category, index) => (
                      <IonItem key={index} className="carte-desktop__category-item">
                        <IonLabel>
                          <h2>{category.name}</h2>
                          <p>{formatCurrency(category.amount)}</p>
                        </IonLabel>
                        <IonProgressBar
                          value={category.percentage / 100}
                          color={category.color.replace("#", "")}
                        ></IonProgressBar>
                        <IonChip slot="end">{category.percentage}%</IonChip>
                      </IonItem>
                    ))}
                  </IonList>

                  <div className="carte-desktop__spending-insights">
                    <h4>Aperçus</h4>
                    <div className="carte-desktop__insights-grid">
                      <IonCard className="carte-desktop__insight-card">
                        <IonCardContent>
                          <IonIcon icon={trendingUpOutline} />
                          <p>Vos dépenses pour les courses ont augmenté de 15% ce mois-ci</p>
                        </IonCardContent>
                      </IonCard>
                      <IonCard className="carte-desktop__insight-card">
                        <IonCardContent>
                          <IonIcon icon={pieChartOutline} />
                          <p>Vous avez atteint 80% de votre budget restauration</p>
                        </IonCardContent>
                      </IonCard>
                      <IonCard className="carte-desktop__insight-card">
                        <IonCardContent>
                          <IonIcon icon={walletOutline} />
                          <p>Économisez 200 € en réduisant les dépenses de divertissement</p>
                        </IonCardContent>
                      </IonCard>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="carte-desktop__details-tab">
                  <IonCard className="carte-desktop__card-details">
                    <IonCardContent>
                      <div className="carte-desktop__details-grid">
                        <div className="carte-desktop__detail-item">
                          <h4>Type de carte</h4>
                          <p>Visa Premier</p>
                        </div>
                        <div className="carte-desktop__detail-item">
                          <h4>Statut de la carte</h4>
                          <IonChip color="success">Active</IonChip>
                        </div>
                        <div className="carte-desktop__detail-item">
                          <h4>Valable à partir de</h4>
                          <p>01/23</p>
                        </div>
                        <div className="carte-desktop__detail-item">
                          <h4>Valable jusqu'à</h4>
                          <p>01/26</p>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>

                  <IonCard className="carte-desktop__security-features">
                    <IonCardHeader>
                      <IonCardTitle>Fonctionnalités de sécurité</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="carte-desktop__features-grid">
                        <div className="carte-desktop__feature-card">
                          <IonIcon icon={shieldOutline} />
                          <h4>3D Secure</h4>
                          <p>Sécurité renforcée pour les transactions en ligne</p>
                        </div>
                        <div className="carte-desktop__feature-card">
                          <IonIcon icon={lockClosedOutline} />
                          <h4>Blocage instantané</h4>
                          <p>Bloquez votre carte instantanément via l'application</p>
                        </div>
                        <div className="carte-desktop__feature-card">
                          <IonIcon icon={notificationsOutline} />
                          <h4>Notifications instantanées</h4>
                          <p>Alertes en temps réel pour les transactions</p>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </div>
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CarteDesktop

