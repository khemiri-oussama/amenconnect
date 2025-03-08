"use client"
import type React from "react"
import { useState } from "react"
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonBadge,
  IonChip,
  IonContent,
  IonText,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonRouterOutlet,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
} from "@ionic/react"
import {
  walletOutline,
  cardOutline,
  cashOutline,
  homeOutline,
  businessOutline,
  globeOutline,
  phonePortraitOutline,
  shieldCheckmarkOutline,
  starOutline,
  checkmarkCircleOutline,
  chevronForwardOutline,
  arrowForwardOutline,
  personOutline,
  briefcaseOutline,
  heartOutline,
  closeOutline,
} from "ionicons/icons"

const NosOffres: React.FC = () => {
  const [activeTab, setActiveTab] = useState("particuliers")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<any>(null)

  const categories = {
    particuliers: [
      { id: "all", name: "Toutes les offres", icon: walletOutline },
      { id: "accounts", name: "Comptes", icon: walletOutline },
      { id: "cards", name: "Cartes", icon: cardOutline },
      { id: "savings", name: "Épargne", icon: cashOutline },
      { id: "loans", name: "Crédits", icon: homeOutline },
      { id: "insurance", name: "Assurances", icon: shieldCheckmarkOutline },
      { id: "digital", name: "Services digitaux", icon: phonePortraitOutline },
    ],
    professionnels: [
      { id: "all", name: "Toutes les offres", icon: walletOutline },
      { id: "business", name: "Comptes professionnels", icon: briefcaseOutline },
      { id: "financing", name: "Financement", icon: cashOutline },
      { id: "international", name: "International", icon: globeOutline },
      { id: "digital", name: "Services digitaux", icon: phonePortraitOutline },
    ],
    entreprises: [
      { id: "all", name: "Toutes les offres", icon: walletOutline },
      { id: "corporate", name: "Comptes entreprise", icon: businessOutline },
      { id: "treasury", name: "Gestion de trésorerie", icon: walletOutline },
      { id: "financing", name: "Financement", icon: cashOutline },
      { id: "international", name: "International", icon: globeOutline },
    ],
  }

  const offers = {
    particuliers: [
      {
        id: 1,
        title: "Compte Amen Privilège",
        category: "accounts",
        description:
          "Un compte courant premium avec des avantages exclusifs : carte Gold gratuite, assurance voyage, accès prioritaire en agence et conseiller dédié.",
        features: [
          "Carte Gold gratuite",
          "Assurance voyage incluse",
          "Accès prioritaire en agence",
          "Conseiller dédié",
          "Découvert autorisé avantageux",
        ],
        price: "15 TND/mois",
        badge: "Premium",
        badgeColor: "warning",
        icon: walletOutline,
      },
      {
        id: 2,
        title: "Compte Amen Jeunes",
        category: "accounts",
        description:
          "Un compte spécialement conçu pour les 18-25 ans avec des tarifs préférentiels et des services adaptés à vos besoins.",
        features: [
          "Carte de débit gratuite",
          "Frais de tenue de compte réduits",
          "Application mobile complète",
          "Offres partenaires pour les étudiants",
        ],
        price: "2 TND/mois",
        badge: "Jeunes",
        badgeColor: "success",
        icon: walletOutline,
      },
      {
        id: 3,
        title: "Carte Visa Premier",
        category: "cards",
        description:
          "Une carte haut de gamme offrant des plafonds élevés, des assurances premium et des services de conciergerie.",
        features: [
          "Plafonds de paiement et retrait élevés",
          "Assurance voyage complète",
          "Protection des achats",
          "Service de conciergerie 24/7",
          "Assistance médicale internationale",
        ],
        price: "180 TND/an",
        badge: "Premium",
        badgeColor: "warning",
        icon: cardOutline,
      },
      {
        id: 4,
        title: "Carte Visa Classic",
        category: "cards",
        description: "Une carte bancaire internationale pour vos paiements quotidiens en Tunisie et à l'étranger.",
        features: [
          "Acceptée dans le monde entier",
          "Paiements en ligne sécurisés",
          "Plafonds personnalisables",
          "Assurance basique incluse",
        ],
        price: "60 TND/an",
        badge: "",
        badgeColor: "",
        icon: cardOutline,
      },
      {
        id: 5,
        title: "Compte Épargne Avenir",
        category: "savings",
        description: "Un compte d'épargne flexible avec un taux attractif pour préparer vos projets futurs.",
        features: [
          "Taux d'intérêt de 5,5% par an",
          "Versements libres",
          "Retraits possibles à tout moment",
          "Gestion en ligne",
        ],
        price: "Gratuit",
        badge: "Populaire",
        badgeColor: "success",
        icon: cashOutline,
      },
      {
        id: 6,
        title: "Plan Épargne Logement",
        category: "savings",
        description:
          "Épargnez pour votre futur logement tout en bénéficiant d'un taux préférentiel pour votre crédit immobilier.",
        features: [
          "Taux d'intérêt de 4,75% par an",
          "Durée de 3 à 5 ans",
          "Accès à un crédit immobilier à taux préférentiel",
          "Fiscalité avantageuse",
        ],
        price: "Gratuit",
        badge: "",
        badgeColor: "",
        icon: cashOutline,
      },
      {
        id: 7,
        title: "Crédit Immobilier",
        category: "loans",
        description: "Financez l'achat de votre résidence principale ou secondaire avec des conditions avantageuses.",
        features: [
          "Taux compétitifs à partir de 5,9%",
          "Durée jusqu'à 25 ans",
          "Financement jusqu'à 90% du projet",
          "Assurance emprunteur incluse",
        ],
        price: "Taux à partir de 5,9%",
        badge: "",
        badgeColor: "",
        icon: homeOutline,
      },
      {
        id: 8,
        title: "Crédit Auto",
        category: "loans",
        description: "Financez l'achat de votre véhicule neuf ou d'occasion avec un crédit adapté à votre budget.",
        features: [
          "Taux à partir de 6,5%",
          "Durée de 1 à 7 ans",
          "Réponse rapide sous 48h",
          "Possibilité de remboursement anticipé",
        ],
        price: "Taux à partir de 6,5%",
        badge: "Offre spéciale",
        badgeColor: "tertiary",
        icon: cashOutline,
      },
      {
        id: 9,
        title: "Assurance Habitation",
        category: "insurance",
        description:
          "Protégez votre logement et vos biens contre les risques du quotidien avec notre assurance complète.",
        features: [
          "Protection contre les dégâts des eaux, incendies, vols",
          "Responsabilité civile incluse",
          "Assistance 24/7",
          "Tarifs préférentiels pour les clients Amen Bank",
        ],
        price: "À partir de 120 TND/an",
        badge: "",
        badgeColor: "",
        icon: shieldCheckmarkOutline,
      },
      {
        id: 10,
        title: "Amen Mobile",
        category: "digital",
        description: "Gérez vos comptes, effectuez vos opérations et suivez vos dépenses depuis votre smartphone.",
        features: [
          "Consultation des comptes en temps réel",
          "Virements nationaux et internationaux",
          "Paiement de factures",
          "Gestion des cartes bancaires",
          "Prise de rendez-vous en agence",
        ],
        price: "Gratuit",
        badge: "Nouveau",
        badgeColor: "primary",
        icon: phonePortraitOutline,
      },
    ],
    professionnels: [
      {
        id: 11,
        title: "Compte Pro Essentiel",
        category: "business",
        description: "Un compte professionnel complet pour gérer efficacement votre activité au quotidien.",
        features: [
          "Carte Business incluse",
          "Virements SEPA illimités",
          "Accès à la banque en ligne Pro",
          "Conseiller dédié",
        ],
        price: "25 TND/mois",
        badge: "",
        badgeColor: "",
        icon: briefcaseOutline,
      },
      {
        id: 12,
        title: "Crédit Investissement Pro",
        category: "financing",
        description: "Financez vos projets d'investissement et développez votre activité professionnelle.",
        features: [
          "Montant jusqu'à 500 000 TND",
          "Durée jusqu'à 7 ans",
          "Taux compétitifs",
          "Différé d'amortissement possible",
        ],
        price: "Taux à partir de 7,5%",
        badge: "",
        badgeColor: "",
        icon: cashOutline,
      },
    ],
    entreprises: [
      {
        id: 13,
        title: "Compte Entreprise Global",
        category: "corporate",
        description: "Une solution complète pour la gestion quotidienne des flux financiers de votre entreprise.",
        features: [
          "Gestion multi-comptes",
          "Virements internationaux",
          "Cartes Business pour vos collaborateurs",
          "Reporting financier avancé",
        ],
        price: "Sur devis",
        badge: "",
        badgeColor: "",
        icon: businessOutline,
      },
      {
        id: 14,
        title: "Financement du Cycle d'Exploitation",
        category: "financing",
        description:
          "Solutions de financement à court terme pour optimiser votre trésorerie et soutenir votre activité.",
        features: ["Découvert autorisé", "Escompte commercial", "Affacturage", "Crédit de campagne"],
        price: "Sur devis",
        badge: "",
        badgeColor: "",
        icon: cashOutline,
      },
    ],
  }

  const filteredOffers = offers[activeTab as keyof typeof offers].filter(
    (offer) => selectedCategory === "all" || offer.category === selectedCategory,
  )

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSelectedCategory("all")
  }

  const openOfferDetails = (offer: any) => {
    setSelectedOffer(offer)
    setShowModal(true)
  }

  return (
    <IonContent>
      <IonTabs>
        <IonTabBar slot="top" onIonTabsDidChange={(e) => handleTabChange(e.detail.tab)}>
          <IonTabButton tab="particuliers" selected={activeTab === "particuliers"}>
            <IonIcon icon={personOutline} />
            <IonLabel>Particuliers</IonLabel>
          </IonTabButton>
          <IonTabButton tab="professionnels" selected={activeTab === "professionnels"}>
            <IonIcon icon={briefcaseOutline} />
            <IonLabel>Professionnels</IonLabel>
          </IonTabButton>
          <IonTabButton tab="entreprises" selected={activeTab === "entreprises"}>
            <IonIcon icon={businessOutline} />
            <IonLabel>Entreprises</IonLabel>
          </IonTabButton>
        </IonTabBar>

        <IonRouterOutlet></IonRouterOutlet>
      </IonTabs>

      <div className="ion-padding">
        <IonCard className="hero-card">
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="12" sizeMd="7" className="hero-content">
                  <h1 className="hero-title">Découvrez nos offres {activeTab}</h1>
                  <p className="hero-subtitle">Des solutions bancaires adaptées à vos besoins et à votre situation</p>
                  <IonButton size="large" className="hero-button">
                    Prendre rendez-vous
                    <IonIcon slot="end" icon={arrowForwardOutline} />
                  </IonButton>
                </IonCol>
                <IonCol size="12" sizeMd="5" className="hero-image">
                  <img src="/amen_logo.png?height=300&width=400" alt="Nos offres" />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <div className="category-filter">
          {categories[activeTab as keyof typeof categories].map((category) => (
            <IonChip
              key={category.id}
              color={selectedCategory === category.id ? "primary" : "medium"}
              outline={selectedCategory !== category.id}
              onClick={() => setSelectedCategory(category.id)}
            >
              <IonIcon icon={category.icon} />
              <IonLabel>{category.name}</IonLabel>
            </IonChip>
          ))}
        </div>

        <IonGrid>
          <IonRow>
            {filteredOffers.map((offer) => (
              <IonCol size="12" sizeMd="6" sizeLg="4" key={offer.id}>
                <IonCard className="offer-card" onClick={() => openOfferDetails(offer)}>
                  <IonCardHeader>
                    <div className="offer-header">
                      <div className="offer-icon">
                        <IonIcon icon={offer.icon} color="primary" />
                      </div>
                      <div className="offer-title-container">
                        <IonCardTitle>{offer.title}</IonCardTitle>
                        {offer.badge && (
                          <IonBadge color={offer.badgeColor} className="offer-badge">
                            {offer.badge}
                          </IonBadge>
                        )}
                      </div>
                    </div>
                  </IonCardHeader>
                  <IonCardContent>
                    <p className="offer-description">{offer.description}</p>

                    <div className="offer-features">
                      <h4>Caractéristiques</h4>
                      <ul>
                        {offer.features.map((feature, index) => (
                          <li key={index}>
                            <IonIcon icon={checkmarkCircleOutline} color="success" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="offer-price">
                      <IonText color="medium">Tarif:</IonText>
                      <IonText color="dark" className="price-value">
                        {offer.price}
                      </IonText>
                    </div>

                    <div className="offer-actions">
                      <IonButton expand="block">
                        En savoir plus
                        <IonIcon slot="end" icon={chevronForwardOutline} />
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonCard className="promo-card">
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="12" sizeMd="8" className="promo-content">
                  <IonIcon icon={starOutline} className="promo-icon" />
                  <h2>Offre spéciale nouveaux clients</h2>
                  <p>
                    Ouvrez un compte chez Amen Bank et bénéficiez de 3 mois de gratuité sur les frais de tenue de compte
                    et une carte bancaire offerte la première année.
                  </p>
                  <IonButton>
                    J'en profite
                    <IonIcon slot="end" icon={arrowForwardOutline} />
                  </IonButton>
                </IonCol>
                <IonCol size="12" sizeMd="4" className="promo-image">
                  <img src="/amen_logo.png?height=200&width=200" alt="Offre spéciale" />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={heartOutline} className="header-icon" />
              Nos engagements
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="12" sizeMd="4">
                  <div className="engagement-item">
                    <IonIcon icon={shieldCheckmarkOutline} color="primary" />
                    <h3>Sécurité</h3>
                    <p>
                      Nous utilisons les technologies les plus avancées pour protéger vos données et vos transactions.
                    </p>
                  </div>
                </IonCol>
                <IonCol size="12" sizeMd="4">
                  <div className="engagement-item">
                    <IonIcon icon={personOutline} color="primary" />
                    <h3>Proximité</h3>
                    <p>Un réseau d'agences à travers tout le pays et des conseillers à votre écoute.</p>
                  </div>
                </IonCol>
                <IonCol size="12" sizeMd="4">
                  <div className="engagement-item">
                    <IonIcon icon={phonePortraitOutline} color="primary" />
                    <h3>Innovation</h3>
                    <p>Des solutions digitales innovantes pour vous simplifier la banque au quotidien.</p>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </div>

      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{selectedOffer?.title}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {selectedOffer && (
            <div>
              <IonCard>
                <IonCardHeader>
                  <div className="offer-header">
                    <div className="offer-icon">
                      <IonIcon icon={selectedOffer.icon} color="primary" />
                    </div>
                    <div className="offer-title-container">
                      <IonCardTitle>{selectedOffer.title}</IonCardTitle>
                      {selectedOffer.badge && (
                        <IonBadge color={selectedOffer.badgeColor} className="offer-badge">
                          {selectedOffer.badge}
                        </IonBadge>
                      )}
                    </div>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <p className="offer-description">{selectedOffer.description}</p>

                  <div className="offer-features">
                    <h4>Caractéristiques</h4>
                    <ul>
                      {selectedOffer.features.map((feature: string, index: number) => (
                        <li key={index}>
                          <IonIcon icon={checkmarkCircleOutline} color="success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="offer-price">
                    <IonText color="medium">Tarif:</IonText>
                    <IonText color="dark" className="price-value">
                      {selectedOffer.price}
                    </IonText>
                  </div>

                  <div className="offer-actions">
                    <IonButton expand="block">
                      Souscrire
                      <IonIcon slot="end" icon={arrowForwardOutline} />
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
          )}
        </IonContent>
      </IonModal>

      <style jsx>{`
        .hero-card {
          background: linear-gradient(135deg, var(--ion-color-primary) 0%, #2dd36f 100%);
          color: white;
          margin-bottom: 2rem;
        }
        
        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: white;
        }
        
        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        
        .hero-button {
          --background: white;
          --color: var(--ion-color-primary);
          font-weight: 600;
        }
        
        .hero-image {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .category-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        
        .offer-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .offer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .offer-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .offer-icon {
          font-size: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(var(--ion-color-primary-rgb), 0.1);
        }
        
        .offer-title-container {
          flex: 1;
        }
        
        .offer-badge {
          margin-top: 0.5rem;
          font-weight: normal;
        }
        
        .offer-description {
          margin-bottom: 1.5rem;
          color: var(--ion-color-medium-shade);
        }
        
        .offer-features {
          margin-bottom: 1.5rem;
        }
        
        .offer-features h4 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: var(--ion-color-dark);
        }
        
        .offer-features ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        
        .offer-features li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        .offer-features li ion-icon {
          min-width: 20px;
        }
        
        .offer-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 0.75rem;
          background-color: rgba(0, 0, 0, 0.03);
          border-radius: 8px;
        }
        
        .price-value {
          font-weight: bold;
          font-size: 1.1rem;
        }
        
        .offer-actions {
          margin-top: auto;
        }
        
        .promo-card {
          background: linear-gradient(135deg, #ffcc00 0%, #ff9500 100%);
          color: white;
          margin: 2rem 0;
        }
        
        .promo-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .promo-content h2 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: white;
        }
        
        .promo-content p {
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }
        
        .promo-content ion-button {
          --background: white;
          --color: #ff9500;
          font-weight: 600;
        }
        
        .header-icon {
          margin-right: 0.5rem;
          vertical-align: middle;
        }
        
        .engagement-item {
          text-align: center;
          padding: 1.5rem;
        }
        
        .engagement-item ion-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .engagement-item h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: var(--ion-color-dark);
        }
        
        .engagement-item p {
          color: var(--ion-color-medium-shade);
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-content {
            order: 2;
            text-align: center;
          }
          
          .hero-image {
            order: 1;
            margin-bottom: 1.5rem;
          }
          
          .promo-content {
            order: 2;
            text-align: center;
          }
          
          .promo-image {
            order: 1;
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </IonContent>
  )
}

export default NosOffres

