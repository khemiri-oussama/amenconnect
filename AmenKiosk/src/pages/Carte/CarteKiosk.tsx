"use client"
import type React from "react"
import { useState, useEffect } from "react"
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonProgressBar,
  IonImg,
  IonRippleEffect,
  IonSpinner,
  IonFab,
  IonFabButton,
  useIonViewDidEnter,
} from "@ionic/react"
import {
  shieldOutline,
  notificationsOutline,
  lockClosedOutline,
  downloadOutline,
  eyeOutline,
  eyeOffOutline,
  chevronForward,
  chevronBack,
} from "ionicons/icons"
import { motion, AnimatePresence } from "framer-motion"
import "./CarteKiosk.css"
import NavbarKiosk from "../../components/NavbarKiosk"
import { useAuth, type Carte, type Compte } from "../../context/AuthContext"
import { generateBankStatement, type CardDetails, type Transaction } from "../../services/pdf-generator"
import { useCarte } from "../../context/CarteContext"
import { useHistory } from "react-router-dom"
import { createGesture } from "@ionic/react"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
interface CreditCardTransaction {
  _id: string
  transactionDate: string
  amount: number
  currency: string
  merchant: string
  status: string
  description: string
}

const CarteKiosk: React.FC = () => {
  const { profile, authLoading } = useAuth()
  const { updateCarteStatus } = useCarte()
  const history = useHistory()

  const [activeTab, setActiveTab] = useState("operations")
  const [isCardLocked, setIsCardLocked] = useState(false)
  const [isCardNumberVisible, setIsCardNumberVisible] = useState(false)
  const [cardDetails, setCardDetails] = useState<Carte | null>(null)
  const [accountDetails, setAccountDetails] = useState<Compte | null>(null)
  const [transactions, setTransactions] = useState<CreditCardTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // New state for card swiping
  const [allCards, setAllCards] = useState<Carte[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  useEffect(() => {
    if (profile && profile.cartes && profile.cartes.length > 0) {
      // Store all cards
      setAllCards(profile.cartes)
      
      // Set the first card as default
      const cardFromProfile = profile.cartes[0]
      setCardDetails(cardFromProfile)
      setIsCardLocked(cardFromProfile.cardStatus?.toLowerCase() !== "active")
      setTransactions(cardFromProfile.creditCardTransactions || [])

      const associatedAccount = profile.comptes.find((compte) => compte._id === cardFromProfile.comptesId)
      setAccountDetails(associatedAccount || null)
    }
    setIsLoading(false)
  }, [profile])

  // Setup swipe gesture detection
  useIonViewDidEnter(() => {
    const cardElement = document.querySelector('.carte-kiosk-credit-card')
    if (cardElement) {
      const gesture = createGesture({
        gestureName: "card-swipe", // Add this property with a unique name
        el: cardElement as HTMLElement,
        threshold: 15,
        direction: "x",
        onStart: () => {},
        onMove: (detail) => {
          // Optional: Add visual feedback during swipe
          if (detail.deltaX > 0) {
            cardElement.setAttribute(
              "style",
              `transform: translateX(${detail.deltaX / 5}px) rotate(${detail.deltaX / 50}deg)`
            );
          } else {
            cardElement.setAttribute(
              "style",
              `transform: translateX(${detail.deltaX / 5}px) rotate(${detail.deltaX / 50}deg)`
            );
          }
        },
        onEnd: (detail) => {
          cardElement.setAttribute("style", "");
          // Detect swipe direction and change card if threshold is met
          if (detail.deltaX > 100 && currentCardIndex > 0) {
            // Swipe right - go to previous card
            setSwipeDirection("right");
            changeCard(currentCardIndex - 1);
          } else if (detail.deltaX < -100 && currentCardIndex < allCards.length - 1) {
            // Swipe left - go to next card
            setSwipeDirection("left");
            changeCard(currentCardIndex + 1);
          }
        },
      });
      
      
      gesture.enable()
      
      // Clean up gesture when component unmounts
      return () => {
        gesture.destroy()
      }
    }
  })

  const changeCard = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < allCards.length) {
      setCurrentCardIndex(newIndex)
      const newCard = allCards[newIndex]
      
      // Update card details
      setCardDetails(newCard)
      setIsCardLocked(newCard.cardStatus?.toLowerCase() !== "active")
      setTransactions(newCard.creditCardTransactions || [])
      
      // Update associated account
      const associatedAccount = profile?.comptes.find((compte) => compte._id === newCard.comptesId)
      setAccountDetails(associatedAccount || null)
    }
  }

  const goToNextCard = () => {
    if (currentCardIndex < allCards.length - 1) {
      setSwipeDirection('left')
      changeCard(currentCardIndex + 1)
    }
  }

  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setSwipeDirection('right')
      changeCard(currentCardIndex - 1)
    }
  }

  const toggleCardNumber = () => {
    setIsCardNumberVisible(!isCardNumberVisible)
  }

  const toggleCardLock = async () => {
    if (!cardDetails) return

    const currentStatus = cardDetails.cardStatus?.toLowerCase()
    const newStatus = currentStatus === "active" ? "Bloquer" : "Active"
    try {
      await updateCarteStatus(cardDetails._id, newStatus)
      setIsCardLocked(newStatus.toLowerCase() !== "active")
      setCardDetails((prev) => (prev ? { ...prev, cardStatus: newStatus } : prev))
      
      // Update the card in allCards array
      setAllCards(prevCards => {
        return prevCards.map(card => {
          if (card._id === cardDetails._id) {
            return { ...card, cardStatus: newStatus }
          }
          return card
        })
      })
    } catch (err) {
      console.error("Failed to update card status:", err)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tn-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

// Add these imports at the top with other imports

// Add these constants above the component
const bankBranding = {
  name: "Amen Bank",
  logo: "/amen_logo.png",
  primaryColor: [0, 51, 102],
  secondaryColor: [0, 85, 165],
  address: ["Avenue Mohamed V", "Tunis 1002", "Tunisie"],
  website: "www.amenbank.com.tn",
  phone: "(+216) 71 148 000",
  email: "contact@amenbank.com.tn",
};

const statementConfig = {
  showLogo: true,
  showFooter: true,
  dateFormat: "fr-FR",
  locale: "fr-FR",
  currency: "TND",
  theme: {
    headerColor: [0, 51, 102],
    textColor: [33, 33, 33],
    accentColor: [0, 102, 204],
    tableHeaderColor: [0, 51, 102],
    alternateRowColor: [240, 240, 240],
  },
};

// Modified handleDownloadStatement function
const handleDownloadStatement = async () => {
  try {
    if (!cardDetails || !transactions.length || !accountDetails) {
      throw new Error("Les données ne sont pas disponibles");
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // ─── Header ──────────────────────────────
    const headerHeight = 40;
    doc.setFillColor(...statementConfig.theme.headerColor);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), headerHeight, "F");

    // Bank Info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(bankBranding.address, 15, 15);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Relevé de Carte", doc.internal.pageSize.getWidth() / 2, 25, { align: "center" });

    // Logo
    if (statementConfig.showLogo) {
      const img = new Image();
      img.src = bankBranding.logo;
      await new Promise((resolve) => (img.onload = resolve));
      doc.addImage(img, "PNG", doc.internal.pageSize.getWidth() - 55, 10, 45, 20);
    }

    // ─── Card Details ──────────────────────────────
    const cardDetailsY = headerHeight + 15;
    doc.setFontSize(12);
    doc.setTextColor(...statementConfig.theme.textColor);
    
    autoTable(doc, {
      startY: cardDetailsY,
      body: [
        ["Titulaire", cardDetails.CardHolder],
        ["Numéro de carte", `**** **** **** ${cardDetails.CardNumber.slice(-4)}`],
        ["Date d'expiration", cardDetails.ExpiryDate],
        ["Statut", isCardLocked ? "Bloquée" : "Active"],
        ["Solde associé", formatCurrency(accountDetails.solde)],
      ],
      theme: "plain",
      styles: {
        fontSize: 12,
        cellPadding: 8,
        textColor: statementConfig.theme.textColor,
      },
      columnStyles: {
        0: { fontStyle: "bold", fillColor: [245, 245, 245] },
        1: { halign: "right" }
      }
    });

    // ─── Limits Section ──────────────────────────────
    const limitsY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(...statementConfig.theme.headerColor);
    doc.text("Limites de la carte", 15, limitsY);

    autoTable(doc, {
      startY: limitsY + 10,
      head: [["Type de limite", "Utilisé", "Limite", "Progression"]],
      body: [
        [
          "Dépenses mensuelles",
          formatCurrency(cardDetails.monthlyExpenses?.current || 0),
          formatCurrency(cardDetails.monthlyExpenses?.limit || 0),
          `${Math.round((cardDetails.monthlyExpenses?.current / cardDetails.monthlyExpenses?.limit) * 100)}%`
        ],
        [
          "Retrait DAB",
          formatCurrency(cardDetails.atmWithdrawal?.current || 0),
          formatCurrency(cardDetails.atmWithdrawal?.limit || 0),
          `${Math.round((cardDetails.atmWithdrawal?.current / cardDetails.atmWithdrawal?.limit) * 100)}%`
        ]
      ],
      theme: "grid",
      headStyles: {
        fillColor: statementConfig.theme.tableHeaderColor,
        textColor: 255,
        fontSize: 12
      },
      alternateRowStyles: {
        fillColor: statementConfig.theme.alternateRowColor
      },
      columnStyles: {
        3: { cellWidth: 30 }
      }
    });

    // ─── Transactions Section ──────────────────────────────
    const transactionsY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(...statementConfig.theme.headerColor);
    doc.text("Transactions récentes", 15, transactionsY);

    autoTable(doc, {
      startY: transactionsY + 10,
      head: [["Date", "Marchand", "Montant", "Statut"]],
      body: transactions.map(t => [
        new Date(t.transactionDate).toLocaleDateString(statementConfig.locale),
        t.merchant,
        formatCurrency(t.amount),
        t.status
      ]),
      theme: "grid",
      headStyles: {
        fillColor: statementConfig.theme.tableHeaderColor,
        textColor: 255,
        fontSize: 12
      },
      alternateRowStyles: {
        fillColor: statementConfig.theme.alternateRowColor
      },
      styles: {
        fontSize: 10,
        cellPadding: 6
      },
      columnStyles: {
        3: { cellWidth: 30 }
      }
    });

    // ─── Footer ──────────────────────────────
    if (statementConfig.showFooter) {
      const pageCount = (doc.internal as any).getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(...statementConfig.theme.headerColor);
        doc.rect(0, doc.internal.pageSize.getHeight() - 20, doc.internal.pageSize.getWidth(), 20, "F");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text(
          `Généré le ${new Date().toLocaleDateString(statementConfig.locale)} • Page ${i}/${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }
    }

    // ─── Open Print Dialog ──────────────────────────────
    doc.autoPrint();
    const blobUrl = doc.output("bloburl");
    const printWindow = window.open(blobUrl);
    if (printWindow) {
      printWindow.focus();
    }

  } catch (error) {
    console.error("Erreur lors de la génération du relevé:", error);
    setError("Échec de la génération du relevé");
  }
};

  const handleBack = () => {
    history.push("/")
  }

  if (authLoading || isLoading) {
    return (
      <IonPage>
        <div className="carte-kiosk-loading">
          <IonSpinner name="crescent" />
          <p>Chargement des données...</p>
        </div>
      </IonPage>
    )
  }

  if (error) {
    return (
      <IonPage>
        <div className="carte-kiosk-error">
          <p>{error}</p>
          <IonButton onClick={() => window.location.reload()}>Réessayer</IonButton>
        </div>
      </IonPage>
    )
  }

  return (
    <IonPage>
      <NavbarKiosk currentPage="carte" />
      <IonContent fullscreen>
        <div className="carte-kiosk-container">
          <div className="background-white"></div>
          <svg className="background-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 983 1920" fill="none">
            <path
              d="M0 0H645.236C723.098 0 770.28 85.9638 728.469 151.647C697.151 200.847 715.114 266.33 767.152 292.664L793.096 305.793C854.316 336.773 866.865 418.795 817.709 466.662L691.328 589.731C677.652 603.048 659.319 610.5 640.231 610.5C577.253 610.5 543.641 684.721 585.184 732.054L641.155 795.826C676.082 835.621 671.964 896.237 631.974 930.943L582.069 974.254C522.93 1025.58 568.96 1122.18 646.076 1108.59C700.297 1099.03 746.811 1147.67 734.833 1201.41L727.617 1233.79C715.109 1289.9 752.705 1344.88 809.534 1353.59L836.788 1357.76C862.867 1361.76 886.31 1375.9 902.011 1397.1L964.656 1481.7C1003.87 1534.65 970.947 1610.18 905.469 1617.5C862.212 1622.34 829.5 1658.92 829.5 1702.44V1717.72C829.5 1756.01 800.102 1787.88 761.94 1790.96L696.194 1796.27C667.843 1798.56 652.928 1831 669.644 1854.01C685.614 1876 672.771 1907.1 645.942 1911.41L597.738 1919.16C594.251 1919.72 590.726 1920 587.195 1920H462.5H200.5H0V0Z"
              fill="#47CE65"
              stroke="#47CE65"
            />
          </svg>

          <div className="carte-kiosk-content">
            

            <div className="carte-kiosk-header">
              <h1 className="carte-kiosk-title">Ma Carte</h1>
              <p className="carte-kiosk-subtitle">Gérez votre carte et vos transactions</p>
              
              {/* Card pagination indicator */}
              {allCards.length > 1 && (
                <div className="carte-kiosk-pagination">
                  <span className="carte-kiosk-pagination-text">
                    Carte {currentCardIndex + 1} sur {allCards.length}
                  </span>
                  <div className="carte-kiosk-pagination-dots">
                    {allCards.map((_, index) => (
                      <div 
                        key={index} 
                        className={`carte-kiosk-pagination-dot ${index === currentCardIndex ? 'active' : ''}`}
                        onClick={() => changeCard(index)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="carte-kiosk-card-display">
              {/* Navigation buttons for cards */}
              {currentCardIndex > 0 && (
                <div className="carte-kiosk-nav-button carte-kiosk-prev-button" onClick={goToPrevCard}>
                  <IonIcon icon={chevronBack} />
                </div>
              )}
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCardIndex}
                  className="carte-kiosk-credit-card"
                  initial={{ 
                    opacity: 0, 
                    x: swipeDirection === 'left' ? 100 : swipeDirection === 'right' ? -100 : 0,
                    scale: 0.9 
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: 1 
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: swipeDirection === 'left' ? -100 : swipeDirection === 'right' ? 100 : 0,
                    scale: 0.9 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="carte-kiosk-card-body">
                    <div className="carte-kiosk-card-top">
                      <IonImg src="../puce.png" className="carte-kiosk-chip" />
                      <div className="carte-kiosk-card-type">{cardDetails?.TypeCarte}</div>
                    </div>
                    <div className="carte-kiosk-card-middle">
                      <motion.div
                        className="carte-kiosk-card-number"
                        animate={{ opacity: isCardNumberVisible ? 1 : 0.5 }}
                      >
                        {isCardNumberVisible
                          ? cardDetails?.CardNumber
                          : cardDetails?.CardNumber.replace(/\d{4}(?=.)/g, "•••• ")}
                      </motion.div>
                      <div className="carte-kiosk-toggle-visibility" onClick={toggleCardNumber}>
                        <IonIcon icon={isCardNumberVisible ? eyeOffOutline : eyeOutline} />
                      </div>
                    </div>
                    <div className="carte-kiosk-card-bottom">
                      <div className="carte-kiosk-card-holder">{cardDetails?.CardHolder}</div>
                      <div className="carte-kiosk-expiry">
                        <span>Expire à </span>
                        <span>{cardDetails?.ExpiryDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="carte-kiosk-card-footer">
                    <div className="carte-kiosk-bank-logo">
                      <IonImg src="../amen_logo.png" className="carte-kiosk-bank-name" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {currentCardIndex < allCards.length - 1 && (
                <div className="carte-kiosk-nav-button carte-kiosk-next-button" onClick={goToNextCard}>
                  <IonIcon icon={chevronForward} />
                </div>
              )}
            </div>

            <div className="carte-kiosk-swipe-hint">
              {allCards.length > 1 && (
                <div className="carte-kiosk-swipe-text">
                  <span>Glissez pour naviguer entre vos cartes</span>
                </div>
              )}
            </div>

            <div className="carte-kiosk-quick-actions">
              <IonButton
                expand="block"
                color={isCardLocked ? "danger" : "success"}
                onClick={toggleCardLock}
                className="carte-kiosk-action-button"
              >
                <IonIcon slot="start" icon={lockClosedOutline} />
                {isCardLocked ? "Débloquer la carte" : "Bloquer la carte"}
              </IonButton>

              <IonButton
                expand="block"
                color="success"
                onClick={handleDownloadStatement}
                className="carte-kiosk-action-button"
              >
                <IonIcon slot="start" icon={downloadOutline} />
                Télécharger le relevé
              </IonButton>
            </div>

            <div className="carte-kiosk-section carte-kiosk-limits-section">
              <div className="carte-kiosk-section-header">
                <h2 className="carte-kiosk-section-title">Limites de la carte</h2>
              </div>
              <div className="carte-kiosk-limits-content">
                <div className="carte-kiosk-limit-item">
                  <div className="carte-kiosk-limit-info">
                    <span>Dépenses mensuelles</span>
                    <span>
                      {formatCurrency(cardDetails?.monthlyExpenses?.current || 0)} /{" "}
                      {formatCurrency(cardDetails?.monthlyExpenses?.limit || 0)}
                    </span>
                  </div>
                  <IonProgressBar
                    value={
                      cardDetails?.monthlyExpenses
                        ? cardDetails.monthlyExpenses.current / cardDetails.monthlyExpenses.limit
                        : 0
                    }
                    color="success"
                  ></IonProgressBar>
                </div>
                <div className="carte-kiosk-limit-item">
                  <div className="carte-kiosk-limit-info">
                    <span>Retrait DAB</span>
                    <span>
                      {formatCurrency(cardDetails?.atmWithdrawal?.current || 0)} /{" "}
                      {formatCurrency(cardDetails?.atmWithdrawal?.limit || 0)}
                    </span>
                  </div>
                  <IonProgressBar
                    value={
                      cardDetails?.atmWithdrawal
                        ? cardDetails.atmWithdrawal.current / cardDetails.atmWithdrawal.limit
                        : 0
                    }
                    color="success"
                  ></IonProgressBar>
                </div>
              </div>
            </div>

            <div className="carte-kiosk-tabs">
              <div
                className={`carte-kiosk-tab ${activeTab === "operations" ? "active" : ""}`}
                onClick={() => setActiveTab("operations")}
              >
                Opérations
              </div>
              <div
                className={`carte-kiosk-tab ${activeTab === "details" ? "active" : ""}`}
                onClick={() => setActiveTab("details")}
              >
                Détails
              </div>
            </div>

            <div className="carte-kiosk-tab-content">
              {activeTab === "operations" && (
                <div className="carte-kiosk-operations-tab">
                  <div className="carte-kiosk-balance-summary">
                    <div className="carte-kiosk-balance-card">
                      <h4>Solde actuel</h4>
                      <h2 className="carte-kiosk-balance-amount">{formatCurrency(accountDetails?.solde || 0)}</h2>
                    </div>
                    <div className="carte-kiosk-balance-card">
                      <h4>Transactions en attente</h4>
                      <h2 className="carte-kiosk-balance-amount">
                        {formatCurrency(cardDetails?.pendingTransactions?.amount || 0)}
                      </h2>
                      <span className="carte-kiosk-pending-count">
                        {cardDetails?.pendingTransactions?.count || 0} transactions en attente
                      </span>
                    </div>
                  </div>

                  <div className="carte-kiosk-section carte-kiosk-transactions-section">
                    <div className="carte-kiosk-section-header">
                      <h2 className="carte-kiosk-section-title">Transactions récentes</h2>
                    </div>
                    <div className="carte-kiosk-transactions-list">
                      {transactions.map((transaction) => (
                        <div key={transaction._id} className="carte-kiosk-transaction-item">
                          <IonRippleEffect />
                          <div className="carte-kiosk-transaction-icon">💳</div>
                          <div className="carte-kiosk-transaction-details">
                            <div className="carte-kiosk-transaction-merchant">{transaction.merchant}</div>
                            <div className="carte-kiosk-transaction-info">
                              {new Date(transaction.transactionDate).toLocaleDateString()} - {transaction.status}
                            </div>
                            {transaction.description && (
                              <div className="carte-kiosk-transaction-description">{transaction.description}</div>
                            )}
                          </div>
                          <div
                            className={`carte-kiosk-transaction-amount ${transaction.amount < 0 ? "negative" : "positive"}`}
                          >
                            {transaction.amount < 0 ? "-" : "+"}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="carte-kiosk-details-tab">
                  <div className="carte-kiosk-section carte-kiosk-card-details-section">
                    <div className="carte-kiosk-details-grid">
                      <div className="carte-kiosk-detail-item">
                        <h4>Type de carte</h4>
                        <p>{cardDetails?.TypeCarte}</p>
                      </div>
                      <div className="carte-kiosk-detail-item">
                        <h4>Statut de la carte</h4>
                        <div className={`carte-kiosk-status-chip ${isCardLocked ? "locked" : "active"}`}>
                          {isCardLocked ? "Bloquée" : "Active"}
                        </div>
                      </div>
                      <div className="carte-kiosk-detail-item">
                        <h4>Valable à partir de</h4>
                        <p>{cardDetails?.ExpiryDate.split("/")[1]}/23</p>
                      </div>
                      <div className="carte-kiosk-detail-item">
                        <h4>Valable jusqu'à</h4>
                        <p>{cardDetails?.ExpiryDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="carte-kiosk-section carte-kiosk-security-section">
                    <div className="carte-kiosk-section-header">
                      <h2 className="carte-kiosk-section-title">Fonctionnalités de sécurité</h2>
                    </div>
                    <div className="carte-kiosk-security-features">
                      <div className="carte-kiosk-security-feature">
                        <div className="carte-kiosk-feature-icon">
                          <IonIcon icon={shieldOutline} />
                        </div>
                        <div className="carte-kiosk-feature-details">
                          <h4>3D Secure</h4>
                          <p>Sécurité renforcée pour les transactions en ligne</p>
                        </div>
                      </div>

                      <div className="carte-kiosk-security-feature">
                        <div className="carte-kiosk-feature-icon">
                          <IonIcon icon={lockClosedOutline} />
                        </div>
                        <div className="carte-kiosk-feature-details">
                          <h4>Blocage instantané</h4>
                          <p>Bloquez votre carte instantanément via l'application</p>
                        </div>
                      </div>

                      <div className="carte-kiosk-security-feature">
                        <div className="carte-kiosk-feature-icon">
                          <IonIcon icon={notificationsOutline} />
                        </div>
                        <div className="carte-kiosk-feature-details">
                          <h4>Notifications instantanées</h4>
                          <p>Alertes en temps réel pour les transactions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CarteKiosk
