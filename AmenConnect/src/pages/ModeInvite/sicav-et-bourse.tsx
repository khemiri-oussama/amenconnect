"use client"
import type React from "react"
import { useState } from "react"
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonItem,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonList,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonContent,
  IonChip,
  IonProgressBar,
  IonText,
  IonSelect,
  IonSelectOption,
} from "@ionic/react"
import {
  alertCircleOutline,
  timeOutline,
  walletOutline,
  arrowUpOutline,
  arrowDownOutline,
  chevronForwardOutline,
  barChartOutline,
  pieChartOutline,
  documentTextOutline,
} from "ionicons/icons"

const SicavEtBourse: React.FC = () => {
  const [activeTab, setActiveTab] = useState("sicav")
  const [selectedFund, setSelectedFund] = useState<string | null>(null)
  const [stockFilter, setStockFilter] = useState("all")

  const sicavFunds = [
    {
      id: "amen-premiere",
      name: "Amen Première",
      type: "Monétaire",
      risk: "Faible",
      performance: { year1: 7.2, year3: 21.5, year5: 36.8 },
      nav: 104.52, // Valeur Liquidative
      description: "Fonds monétaire à faible risque, idéal pour la gestion de trésorerie à court terme.",
      assetAllocation: { bonds: 85, money: 15, equity: 0 },
      minInvestment: 100,
    },
    {
      id: "amen-equilibre",
      name: "Amen Équilibre",
      type: "Mixte",
      risk: "Moyen",
      performance: { year1: 8.5, year3: 24.8, year5: 42.3 },
      nav: 128.76,
      description:
        "Fonds mixte offrant un équilibre entre actions et obligations pour un horizon d'investissement moyen terme.",
      assetAllocation: { bonds: 60, money: 10, equity: 30 },
      minInvestment: 500,
    },
    {
      id: "amen-croissance",
      name: "Amen Croissance",
      type: "Actions",
      risk: "Élevé",
      performance: { year1: 12.3, year3: 32.7, year5: 58.9 },
      nav: 156.34,
      description:
        "Fonds actions visant une croissance du capital à long terme avec une exposition importante aux marchés actions.",
      assetAllocation: { bonds: 20, money: 5, equity: 75 },
      minInvestment: 1000,
    },
    {
      id: "amen-strategie",
      name: "Amen Stratégie",
      type: "Diversifié",
      risk: "Moyen-Élevé",
      performance: { year1: 9.8, year3: 28.5, year5: 49.2 },
      nav: 142.18,
      description: "Fonds diversifié avec une allocation d'actifs flexible adaptée aux conditions de marché.",
      assetAllocation: { bonds: 40, money: 10, equity: 50 },
      minInvestment: 750,
    },
  ]

  const stockMarketData = [
    { symbol: "AMEN", name: "Amen Bank", price: 28.45, change: 1.2, volume: 12500, sector: "Finance" },
    { symbol: "BIAT", name: "BIAT", price: 92.3, change: -0.8, volume: 8700, sector: "Finance" },
    { symbol: "SFBT", name: "SFBT", price: 18.75, change: 0.5, volume: 25600, sector: "Consommation" },
    {
      symbol: "TPAP",
      name: "Tunisie Profilés Aluminium",
      price: 5.62,
      change: -1.3,
      volume: 4200,
      sector: "Industrie",
    },
    { symbol: "TLNET", name: "Telnet Holding", price: 8.94, change: 2.1, volume: 15800, sector: "Technologie" },
    { symbol: "STIP", name: "STIP", price: 1.28, change: 0.2, volume: 3600, sector: "Industrie" },
    { symbol: "SOTUV", name: "SOTUVER", price: 7.35, change: 1.8, volume: 9200, sector: "Industrie" },
    { symbol: "STAR", name: "STAR", price: 132.5, change: -0.5, volume: 2100, sector: "Finance" },
  ]

  const filteredStocks =
    stockFilter === "all" ? stockMarketData : stockMarketData.filter((stock) => stock.sector === stockFilter)

  const sectors = Array.from(new Set(stockMarketData.map((stock) => stock.sector)))

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Faible":
        return "success"
      case "Moyen":
        return "warning"
      case "Moyen-Élevé":
        return "warning"
      case "Élevé":
        return "danger"
      default:
        return "medium"
    }
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "success" : "danger"
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? arrowUpOutline : arrowDownOutline
  }

  return (
    <IonContent>
      <IonSegment value={activeTab} onIonChange={(e) => setActiveTab(e.detail.value!)}>
        <IonSegmentButton value="sicav">
          <IonLabel>SICAV</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="bourse">
          <IonLabel>Bourse</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="services">
          <IonLabel>Services</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      {activeTab === "sicav" && (
        <div className="ion-padding">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Nos SICAV</IonCardTitle>
              <IonCardSubtitle>Découvrez nos fonds d'investissement</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                Les SICAV (Sociétés d'Investissement à Capital Variable) sont des fonds communs de placement qui
                permettent d'investir sur les marchés financiers. Amen Bank vous propose une gamme complète de SICAV
                adaptées à vos objectifs d'investissement et à votre profil de risque.
              </p>
            </IonCardContent>
          </IonCard>

          <IonGrid>
            <IonRow>
              {sicavFunds.map((fund) => (
                <IonCol size="12" sizeMd="6" key={fund.id}>
                  <IonCard
                    button
                    onClick={() => setSelectedFund(selectedFund === fund.id ? null : fund.id)}
                    className={selectedFund === fund.id ? "selected-card" : ""}
                  >
                    <IonCardHeader>
                      <IonCardTitle>{fund.name}</IonCardTitle>
                      <IonCardSubtitle>
                        {fund.type} -
                        <IonChip color={getRiskColor(fund.risk)} outline>
                          <IonLabel>Risque {fund.risk}</IonLabel>
                        </IonChip>
                      </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonGrid>
                        <IonRow>
                          <IonCol size="6">
                            <div className="value-label">Valeur Liquidative</div>
                            <div className="value-amount">{fund.nav.toFixed(2)} TND</div>
                          </IonCol>
                          <IonCol size="6">
                            <div className="value-label">Performance 1 an</div>
                            <div className="value-amount">+{fund.performance.year1.toFixed(1)}%</div>
                          </IonCol>
                        </IonRow>
                      </IonGrid>

                      {selectedFund === fund.id && (
                        <div className="fund-details">
                          <p>{fund.description}</p>

                          <h4>Allocation d'actifs</h4>
                          <div className="asset-allocation">
                            <div className="asset-item">
                              <div className="asset-label">Obligations</div>
                              <IonProgressBar value={fund.assetAllocation.bonds / 100} color="primary"></IonProgressBar>
                              <div className="asset-value">{fund.assetAllocation.bonds}%</div>
                            </div>
                            <div className="asset-item">
                              <div className="asset-label">Monétaire</div>
                              <IonProgressBar
                                value={fund.assetAllocation.money / 100}
                                color="secondary"
                              ></IonProgressBar>
                              <div className="asset-value">{fund.assetAllocation.money}%</div>
                            </div>
                            <div className="asset-item">
                              <div className="asset-label">Actions</div>
                              <IonProgressBar
                                value={fund.assetAllocation.equity / 100}
                                color="tertiary"
                              ></IonProgressBar>
                              <div className="asset-value">{fund.assetAllocation.equity}%</div>
                            </div>
                          </div>

                          <h4>Performance historique</h4>
                          <IonGrid>
                            <IonRow>
                              <IonCol size="4">
                                <div className="perf-label">1 an</div>
                                <div className="perf-value">+{fund.performance.year1.toFixed(1)}%</div>
                              </IonCol>
                              <IonCol size="4">
                                <div className="perf-label">3 ans</div>
                                <div className="perf-value">+{fund.performance.year3.toFixed(1)}%</div>
                              </IonCol>
                              <IonCol size="4">
                                <div className="perf-label">5 ans</div>
                                <div className="perf-value">+{fund.performance.year5.toFixed(1)}%</div>
                              </IonCol>
                            </IonRow>
                          </IonGrid>

                          <div className="fund-footer">
                            <div className="min-investment">
                              <IonIcon icon={walletOutline} />
                              <span>Investissement minimum: {fund.minInvestment} TND</span>
                            </div>
                            <IonButton size="small">
                              Souscrire
                              <IonIcon slot="end" icon={chevronForwardOutline} />
                            </IonButton>
                          </div>
                        </div>
                      )}
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </div>
      )}

      {activeTab === "bourse" && (
        <div className="ion-padding">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Marché Boursier</IonCardTitle>
              <IonCardSubtitle>Bourse de Tunis - Données en temps réel</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="market-summary">
                <div className="market-index">
                  <div className="index-name">TUNINDEX</div>
                  <div className="index-value">7,245.32</div>
                  <div className="index-change positive">
                    <IonIcon icon={arrowUpOutline} />
                    +0.75%
                  </div>
                </div>
                <div className="market-stats">
                  <div className="stat-item">
                    <div className="stat-label">Volume</div>
                    <div className="stat-value">3.2M TND</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Transactions</div>
                    <div className="stat-value">1,245</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Dernière MAJ</div>
                    <div className="stat-value">
                      <IonIcon icon={timeOutline} />
                      15:30
                    </div>
                  </div>
                </div>
              </div>

              <div className="stock-filter">
                <IonLabel>Filtrer par secteur:</IonLabel>
                <IonSelect value={stockFilter} onIonChange={(e) => setStockFilter(e.detail.value)}>
                  <IonSelectOption value="all">Tous les secteurs</IonSelectOption>
                  {sectors.map((sector) => (
                    <IonSelectOption key={sector} value={sector}>
                      {sector}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>

              <IonList>
                <IonItem lines="full" className="stock-header">
                  <IonLabel>Titre</IonLabel>
                  <IonLabel slot="end">Cours</IonLabel>
                  <IonLabel slot="end">Var.</IonLabel>
                  <IonLabel slot="end">Volume</IonLabel>
                </IonItem>

                {filteredStocks.map((stock) => (
                  <IonItem key={stock.symbol} button detail>
                    <IonLabel>
                      <h2>{stock.symbol}</h2>
                      <p>{stock.name}</p>
                      <IonBadge color="medium" className="sector-badge">
                        {stock.sector}
                      </IonBadge>
                    </IonLabel>
                    <IonLabel slot="end" className="stock-price">
                      {stock.price.toFixed(2)} TND
                    </IonLabel>
                    <IonLabel slot="end" color={getChangeColor(stock.change)} className="stock-change">
                      <IonIcon icon={getChangeIcon(stock.change)} />
                      {stock.change > 0 ? "+" : ""}
                      {stock.change.toFixed(1)}%
                    </IonLabel>
                    <IonLabel slot="end" className="stock-volume">
                      {stock.volume.toLocaleString()}
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>

              <div className="disclaimer">
                <IonIcon icon={alertCircleOutline} />
                <IonText color="medium">
                  Les données sont fournies à titre indicatif et peuvent être retardées de 15 minutes.
                </IonText>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      )}

      {activeTab === "services" && (
        <div className="ion-padding">
          <IonGrid>
            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonCard>
                  <IonCardHeader>
                    <IonIcon icon={barChartOutline} color="primary" className="service-icon" />
                    <IonCardTitle>Courtage en ligne</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>
                      Passez vos ordres de bourse en ligne et suivez l'évolution de votre portefeuille en temps réel.
                      Bénéficiez de frais de courtage réduits et d'outils d'analyse avancés.
                    </p>
                    <IonButton expand="block">
                      Accéder à la plateforme
                      <IonIcon slot="end" icon={chevronForwardOutline} />
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12" sizeMd="6">
                <IonCard>
                  <IonCardHeader>
                    <IonIcon icon={pieChartOutline} color="secondary" className="service-icon" />
                    <IonCardTitle>Gestion sous mandat</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>
                      Confiez la gestion de votre portefeuille à nos experts. Nous définissons ensemble votre stratégie
                      d'investissement en fonction de vos objectifs et de votre profil de risque.
                    </p>
                    <IonButton expand="block">
                      En savoir plus
                      <IonIcon slot="end" icon={chevronForwardOutline} />
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12" sizeMd="6">
                <IonCard>
                  <IonCardHeader>
                    <IonIcon icon={documentTextOutline} color="tertiary" className="service-icon" />
                    <IonCardTitle>Conseil en investissement</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>
                      Bénéficiez de conseils personnalisés pour optimiser vos investissements. Nos conseillers vous
                      accompagnent dans la construction et le suivi de votre portefeuille.
                    </p>
                    <IonButton expand="block">
                      Prendre rendez-vous
                      <IonIcon slot="end" icon={chevronForwardOutline} />
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Formation et éducation financière</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>
                      Amen Bank propose régulièrement des webinaires et des sessions de formation pour vous aider à
                      comprendre les marchés financiers et à prendre des décisions d'investissement éclairées.
                    </p>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="12" sizeMd="4">
                          <div className="event-card">
                            <h3>Introduction à la bourse</h3>
                            <p>Mercredi 15 Mars, 14h00</p>
                            <IonButton size="small" fill="outline">
                              S'inscrire
                            </IonButton>
                          </div>
                        </IonCol>
                        <IonCol size="12" sizeMd="4">
                          <div className="event-card">
                            <h3>Stratégies d'investissement</h3>
                            <p>Jeudi 23 Mars, 10h00</p>
                            <IonButton size="small" fill="outline">
                              S'inscrire
                            </IonButton>
                          </div>
                        </IonCol>
                        <IonCol size="12" sizeMd="4">
                          <div className="event-card">
                            <h3>Analyse technique</h3>
                            <p>Mardi 28 Mars, 15h30</p>
                            <IonButton size="small" fill="outline">
                              S'inscrire
                            </IonButton>
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      )}

      <style jsx>{`
        .selected-card {
          border: 2px solid var(--ion-color-primary);
        }
        
        .value-label {
          font-size: 0.9rem;
          color: var(--ion-color-medium);
        }
        
        .value-amount {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--ion-color-dark);
        }
        
        .fund-details {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .asset-allocation {
          margin: 1rem 0;
        }
        
        .asset-item {
          margin-bottom: 0.5rem;
        }
        
        .asset-label {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        
        .asset-value {
          text-align: right;
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }
        
        .perf-label {
          font-size: 0.9rem;
          color: var(--ion-color-medium);
        }
        
        .perf-value {
          font-size: 1.1rem;
          font-weight: bold;
          color: var(--ion-color-success);
        }
        
        .fund-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .min-investment {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        
        .market-summary {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .market-index {
          text-align: center;
        }
        
        .index-name {
          font-size: 1rem;
          font-weight: bold;
        }
        
        .index-value {
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .index-change {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
        }
        
        .index-change.positive {
          color: var(--ion-color-success);
        }
        
        .index-change.negative {
          color: var(--ion-color-danger);
        }
        
        .market-stats {
          display: flex;
          gap: 1.5rem;
        }
        
        .stat-label {
          font-size: 0.8rem;
          color: var(--ion-color-medium);
        }
        
        .stat-value {
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .stock-filter {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1rem 0;
        }
        
        .stock-header {
          font-weight: bold;
          --background: rgba(0, 0, 0, 0.05);
        }
        
        .sector-badge {
          margin-top: 0.5rem;
          font-size: 0.7rem;
        }
        
        .stock-price, .stock-change, .stock-volume {
          text-align: right;
        }
        
        .stock-change {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.25rem;
        }
        
        .disclaimer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          font-size: 0.8rem;
        }
        
        .service-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        
        .event-card {
          padding: 1rem;
          background-color: rgba(0, 0, 0, 0.03);
          border-radius: 8px;
          height: 100%;
        }
        
        .event-card h3 {
          margin-top: 0;
          font-size: 1.1rem;
        }
      `}</style>
    </IonContent>
  )
}

export default SicavEtBourse

