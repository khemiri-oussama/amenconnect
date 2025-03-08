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
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonSearchbar,
  IonBadge,
  IonChip,
} from "@ionic/react"
import {
  informationCircleOutline,
  documentTextOutline,
  lockClosedOutline,
  shieldCheckmarkOutline,
  newspaperOutline,
  helpCircleOutline,
  timeOutline,
  cashOutline,
  cardOutline,
  walletOutline,
  globeOutline,
  chevronForwardOutline,
  downloadOutline,
} from "ionicons/icons"

const Informations: React.FC = () => {
  const [searchText, setSearchText] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "Tout", icon: informationCircleOutline },
    { id: "accounts", name: "Comptes", icon: walletOutline },
    { id: "cards", name: "Cartes", icon: cardOutline },
    { id: "loans", name: "Crédits", icon: cashOutline },
    { id: "security", name: "Sécurité", icon: shieldCheckmarkOutline },
    { id: "international", name: "International", icon: globeOutline },
  ]

  const faqs = [
    {
      id: 1,
      question: "Comment ouvrir un compte chez Amen Bank ?",
      answer:
        "Pour ouvrir un compte chez Amen Bank, vous pouvez vous rendre dans l'une de nos agences avec une pièce d'identité valide, un justificatif de domicile récent et un montant initial de dépôt. Vous pouvez également commencer le processus en ligne sur notre site web ou via notre application mobile.",
      category: "accounts",
      tags: ["ouverture", "compte"],
    },
    {
      id: 2,
      question: "Quels sont les frais de tenue de compte ?",
      answer:
        "Les frais de tenue de compte varient selon le type de compte et le package choisi. Pour un compte courant standard, les frais sont de 5 TND par trimestre. Pour les comptes premium, les frais sont de 15 TND par trimestre mais incluent des avantages supplémentaires comme des réductions sur les frais de transaction et une carte bancaire gratuite.",
      category: "accounts",
      tags: ["frais", "compte"],
    },
    {
      id: 3,
      question: "Comment demander une carte bancaire ?",
      answer:
        "Vous pouvez demander une carte bancaire directement depuis votre espace client en ligne, via notre application mobile, ou en vous rendant dans l'une de nos agences. Plusieurs types de cartes sont disponibles selon vos besoins : cartes de débit, cartes de crédit, cartes prépayées, etc.",
      category: "cards",
      tags: ["carte", "demande"],
    },
    {
      id: 4,
      question: "Que faire en cas de perte ou de vol de ma carte ?",
      answer:
        "En cas de perte ou de vol de votre carte, vous devez immédiatement la bloquer en appelant notre service client au +216 71 148 000 (disponible 24h/24 et 7j/7) ou via votre espace client en ligne. Une nouvelle carte vous sera envoyée dans les plus brefs délais.",
      category: "cards",
      tags: ["carte", "perte", "vol", "sécurité"],
    },
    {
      id: 5,
      question: "Comment demander un crédit immobilier ?",
      answer:
        "Pour demander un crédit immobilier, vous pouvez prendre rendez-vous avec un conseiller en agence ou commencer votre demande en ligne. Vous devrez fournir des documents justificatifs tels que vos relevés de compte des 3 derniers mois, vos fiches de paie, une promesse de vente ou un devis pour les travaux, etc.",
      category: "loans",
      tags: ["crédit", "immobilier"],
    },
    {
      id: 6,
      question: "Quels sont les taux d'intérêt actuels pour les crédits à la consommation ?",
      answer:
        "Les taux d'intérêt pour les crédits à la consommation varient entre 8% et 12% selon la durée du prêt, le montant emprunté et votre profil. Pour obtenir une simulation personnalisée, utilisez notre simulateur de crédit en ligne ou contactez l'un de nos conseillers.",
      category: "loans",
      tags: ["crédit", "taux", "consommation"],
    },
    {
      id: 7,
      question: "Comment sécuriser mes opérations bancaires en ligne ?",
      answer:
        "Pour sécuriser vos opérations bancaires en ligne, nous vous recommandons de : changer régulièrement votre mot de passe, ne jamais communiquer vos identifiants à des tiers, vérifier que vous êtes bien sur le site officiel d'Amen Bank (https://www.amenbank.tn), activer l'authentification à deux facteurs, et mettre à jour régulièrement votre navigateur et votre application mobile.",
      category: "security",
      tags: ["sécurité", "en ligne", "protection"],
    },
    {
      id: 8,
      question: "Comment effectuer un virement international ?",
      answer:
        "Pour effectuer un virement international, vous pouvez utiliser votre espace client en ligne, notre application mobile ou vous rendre en agence. Vous aurez besoin des coordonnées bancaires complètes du bénéficiaire (IBAN, code SWIFT/BIC), de son nom complet et de son adresse. Des frais peuvent s'appliquer selon la destination et le montant du virement.",
      category: "international",
      tags: ["virement", "international", "transfert"],
    },
    {
      id: 9,
      question: "Quels sont les horaires d'ouverture des agences ?",
      answer:
        "Nos agences sont généralement ouvertes du lundi au vendredi de 8h30 à 16h30 et le samedi de 8h30 à 12h00. Certaines agences peuvent avoir des horaires spécifiques, notamment dans les centres commerciaux. Vous pouvez consulter les horaires précis de chaque agence sur notre site web ou notre application mobile.",
      category: "accounts",
      tags: ["agence", "horaires"],
    },
    {
      id: 10,
      question: "Comment activer le service de notification par SMS ?",
      answer:
        "Pour activer le service de notification par SMS, connectez-vous à votre espace client en ligne, allez dans la section 'Paramètres' puis 'Notifications', et activez l'option 'Alertes SMS'. Vous pouvez choisir les types d'opérations pour lesquelles vous souhaitez recevoir des notifications (retraits, paiements, virements, etc.).",
      category: "security",
      tags: ["notification", "SMS", "alerte"],
    },
  ]

  const news = [
    {
      id: 1,
      title: "Lancement de la nouvelle application mobile Amen Bank",
      date: "15 février 2025",
      summary:
        "Découvrez notre nouvelle application mobile entièrement repensée pour une expérience utilisateur optimale.",
      image: "/news1.jpg",
    },
    {
      id: 2,
      title: "Nouveaux taux préférentiels pour les crédits immobiliers",
      date: "3 février 2025",
      summary: "Amen Bank propose des taux exceptionnels pour l'acquisition de votre résidence principale.",
      image: "/news2.jpg",
    },
    {
      id: 3,
      title: "Ouverture d'une nouvelle agence à Sousse",
      date: "20 janvier 2025",
      summary: "Amen Bank renforce sa présence dans la région de Sousse avec une nouvelle agence moderne.",
      image: "/news3.jpg",
    },
  ]

  const documents = [
    {
      id: 1,
      title: "Conditions générales d'utilisation",
      type: "PDF",
      size: "1.2 MB",
      category: "legal",
    },
    {
      id: 2,
      title: "Tarification des services bancaires",
      type: "PDF",
      size: "850 KB",
      category: "tarifs",
    },
    {
      id: 3,
      title: "Guide d'utilisation de l'application mobile",
      type: "PDF",
      size: "3.5 MB",
      category: "guides",
    },
    {
      id: 4,
      title: "Formulaire d'ouverture de compte",
      type: "PDF",
      size: "420 KB",
      category: "formulaires",
    },
    {
      id: 5,
      title: "Brochure des produits d'épargne",
      type: "PDF",
      size: "1.8 MB",
      category: "produits",
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      (activeCategory === "all" || faq.category === activeCategory) &&
      (searchText === "" ||
        faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchText.toLowerCase()) ||
        faq.tags.some((tag) => tag.toLowerCase().includes(searchText.toLowerCase()))),
  )

  return (
    <IonContent>
      <IonGrid>
        <IonRow>
          <IonCol size="12">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Centre d'information</IonCardTitle>
                <IonCardSubtitle>Trouvez toutes les informations dont vous avez besoin</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonSearchbar
                  value={searchText}
                  onIonInput={(e) => setSearchText(e.detail.value!)}
                  placeholder="Rechercher une information"
                  className="info-searchbar"
                />

                <div className="category-filter">
                  {categories.map((category) => (
                    <IonChip
                      key={category.id}
                      color={activeCategory === category.id ? "primary" : "medium"}
                      outline={activeCategory !== category.id}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <IonIcon icon={category.icon} />
                      <IonLabel>{category.name}</IonLabel>
                    </IonChip>
                  ))}
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol size="12" sizeMd="8">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={helpCircleOutline} className="header-icon" />
                  Foire aux questions
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {filteredFaqs.length > 0 ? (
                  <IonAccordionGroup>
                    {filteredFaqs.map((faq) => (
                      <IonAccordion key={faq.id}>
                        <IonItem slot="header">
                          <IonLabel>{faq.question}</IonLabel>
                        </IonItem>
                        <div slot="content" className="ion-padding faq-answer">
                          <p>{faq.answer}</p>
                          <div className="faq-tags">
                            {faq.tags.map((tag, index) => (
                              <IonBadge key={index} color="light" className="faq-tag">
                                {tag}
                              </IonBadge>
                            ))}
                          </div>
                        </div>
                      </IonAccordion>
                    ))}
                  </IonAccordionGroup>
                ) : (
                  <div className="no-results">
                    <IonIcon icon={informationCircleOutline} className="no-results-icon" />
                    <h3>Aucun résultat trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche</p>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          </IonCol>

          <IonCol size="12" sizeMd="4">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={newspaperOutline} className="header-icon" />
                  Actualités
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {news.map((item) => (
                  <div key={item.id} className="news-item">
                    <div className="news-date">
                      <IonIcon icon={timeOutline} />
                      {item.date}
                    </div>
                    <h3 className="news-title">{item.title}</h3>
                    <p className="news-summary">{item.summary}</p>
                    <IonButton size="small" fill="clear">
                      Lire la suite
                      <IonIcon slot="end" icon={chevronForwardOutline} />
                    </IonButton>
                  </div>
                ))}
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={documentTextOutline} className="header-icon" />
                  Documents utiles
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {documents.map((doc) => (
                    <IonItem key={doc.id} button>
                      <IonIcon icon={documentTextOutline} slot="start" color="primary" />
                      <IonLabel>
                        <h2>{doc.title}</h2>
                        <p>
                          {doc.type} • {doc.size}
                        </p>
                      </IonLabel>
                      <IonButton slot="end" fill="clear" size="small">
                        <IonIcon icon={downloadOutline} />
                      </IonButton>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol size="12">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={shieldCheckmarkOutline} className="header-icon" />
                  Sécurité et confidentialité
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol size="12" sizeMd="6">
                      <div className="security-section">
                        <h3>
                          <IonIcon icon={lockClosedOutline} />
                          Protection de vos données
                        </h3>
                        <p>
                          Chez Amen Bank, la sécurité de vos données est notre priorité absolue. Nous utilisons des
                          technologies de cryptage avancées pour protéger vos informations personnelles et financières.
                        </p>
                        <p>
                          Toutes les transactions effectuées sur nos plateformes sont sécurisées par des protocoles de
                          chiffrement conformes aux normes internationales les plus strictes.
                        </p>
                      </div>
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <div className="security-section">
                        <h3>
                          <IonIcon icon={informationCircleOutline} />
                          Conseils de sécurité
                        </h3>
                        <ul className="security-tips">
                          <li>Ne communiquez jamais vos identifiants ou mots de passe à des tiers</li>
                          <li>Vérifiez toujours l'URL du site avant de vous connecter (https://www.amenbank.tn)</li>
                          <li>Changez régulièrement votre mot de passe</li>
                          <li>Activez l'authentification à deux facteurs</li>
                          <li>Soyez vigilant face aux tentatives de phishing</li>
                        </ul>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

      <style jsx>{`
        .info-searchbar {
          margin-bottom: 1rem;
        }
        
        .category-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .header-icon {
          margin-right: 0.5rem;
          vertical-align: middle;
        }
        
        .faq-answer {
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        .faq-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .faq-tag {
          font-size: 0.7rem;
          font-weight: normal;
        }
        
        .no-results {
          text-align: center;
          padding: 2rem;
        }
        
        .no-results-icon {
          font-size: 3rem;
          color: var(--ion-color-medium);
          margin-bottom: 1rem;
        }
        
        .news-item {
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .news-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        
        .news-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--ion-color-medium);
          margin-bottom: 0.5rem;
        }
        
        .news-title {
          font-size: 1.1rem;
          margin: 0.5rem 0;
        }
        
        .news-summary {
          font-size: 0.9rem;
          color: var(--ion-color-medium-shade);
          margin-bottom: 0.5rem;
        }
        
        .security-section {
          margin-bottom: 1.5rem;
        }
        
        .security-section h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: var(--ion-color-dark);
        }
        
        .security-tips {
          padding-left: 1.5rem;
          margin: 0;
        }
        
        .security-tips li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </IonContent>
  )
}

export default Informations

