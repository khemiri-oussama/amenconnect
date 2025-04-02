"use client"
import React, { useMemo, useState, useEffect } from "react"
import { IonContent, IonPage, IonIcon, IonRippleEffect, IonButton } from "@ionic/react"
import {
  walletOutline,
  repeatOutline,
  analyticsOutline,
  cardOutline,
  trendingUpOutline,
  trendingDownOutline,
  arrowBack,
  printOutline,
} from "ionicons/icons"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { useHistory } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import NavbarKiosk from "../../components/NavbarKiosk"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./CompteKiosk.css"

interface Operation {
  id: number
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
}

const CompteKiosk: React.FC = () => {
  const { profile, authLoading } = useAuth()
  const history = useHistory()

  const accounts = profile?.comptes ?? []
  const [operations, setOperations] = useState<Operation[]>([])
  const [loadingOperations, setLoadingOperations] = useState<boolean>(true)
  const [errorOperations, setErrorOperations] = useState<string | null>(null)
  
  const chartData = useMemo(() => {
    const grouped = operations.reduce((acc, op) => {
      const month = new Date(op.date).toLocaleString("default", { month: "short" })
      if (!acc[month]) {
        acc[month] = { name: month, revenus: 0, depenses: 0 }
      }
      if (op.type === "credit") {
        acc[month].revenus += op.amount
      } else if (op.type === "debit") {
        acc[month].depenses += op.amount
      }
      return acc
    }, {} as { [key: string]: { name: string; revenus: number; depenses: number } })
    return Object.values(grouped)
  }, [operations])

  // Fetch operations from the API.
  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const response = await fetch("/api/historique", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch operations")
        }
        const data: Operation[] = await response.json()
        setOperations(data)
      } catch (error) {
        console.error("Error fetching operations:", error)
        setErrorOperations("Erreur lors de la récupération des opérations.")
      } finally {
        setLoadingOperations(false)
      }
    }
    fetchOperations()
  }, [])

  const handleAccountClick = (accountId: string) => {
    console.log(`Viewing account ${accountId}...`)
    history.push(`/Compte/${accountId}`)
  }

  const handleBack = () => {
    history.push("/")
  }

  // New function to generate and download the bank statement as a PDF
  const handlePrintStatement = async () => {
    const accountDetails = accounts[0] || {
      _id: "inconnu",
      numéroCompte: "N/A",
      solde: 0,
      type: "Compte courant",
    };

    const totalCredit = operations
      .filter((op) => op.type === "credit")
      .reduce((sum, op) => sum + op.amount, 0);
    const totalDebit = operations
      .filter((op) => op.type === "debit")
      .reduce((sum, op) => sum + op.amount, 0);
    const netBalance = totalCredit - totalDebit;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Relevé de Compte", pageWidth / 2, 20, { align: "center" });

    // Account Information
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Compte: ${accountDetails.numéroCompte}`, 15, 40);
    doc.text(`Type: ${accountDetails.type}`, 15, 48);
    doc.text(`Solde: ${accountDetails.solde.toFixed(2)} TND`, 15, 56);

    // Summary
    doc.text(`Total Crédits: ${totalCredit.toFixed(2)} TND`, 15, 70);
    doc.text(`Total Débits: ${totalDebit.toFixed(2)} TND`, 15, 78);
    doc.text(`Solde Net: ${netBalance.toFixed(2)} TND`, 15, 86);

    // Table of Operations
    const tableColumn = ["Date", "Description", "Type", "Montant"];
    const tableRows = operations.map((op) => [
      new Date(op.date).toLocaleDateString(),
      op.description,
      op.type === "credit" ? "Crédit" : "Débit",
      op.amount.toFixed(2) + " TND",
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 95,
    });

    // Footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        pageWidth - 30,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    doc.save("releve_de_compte.pdf");
  };

  if (authLoading) {
    return <div className="compte-kiosk-loading">Chargement...</div>
  }

  return (
    <IonPage>
      <NavbarKiosk currentPage="compte" />
      <IonContent fullscreen>
        <div className="compte-kiosk-container">
          <div className="background-white"></div>
          <svg className="background-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 983 1920" fill="none">
            {/* SVG path omitted for brevity */}
          </svg>

          <div className="compte-kiosk-content">
            <div className="compte-kiosk-header">
              <h1 className="compte-kiosk-title">Mes Comptes</h1>
              <p className="compte-kiosk-subtitle">Gérez vos comptes et suivez vos finances</p>
            </div>

            <div className="compte-kiosk-accounts-list">
              {accounts.map((account) => (
                <div
                  key={account._id}
                  className="compte-kiosk-account-card"
                  onClick={() => handleAccountClick(account._id)}
                >
                  <IonRippleEffect />
                  <div className="compte-kiosk-account-icon">
                    <IonIcon icon={account.type === "Compte courant" ? walletOutline : trendingUpOutline} />
                  </div>
                  <div className="compte-kiosk-account-details">
                    <div className="compte-kiosk-account-type">{account.type}</div>
                    <div className="compte-kiosk-account-number">{account.numéroCompte}</div>
                  </div>
                  <div className="compte-kiosk-account-balance">{account.solde.toFixed(2)} TND</div>
                </div>
              ))}
            </div>

            {/* New button to generate the bank statement */}
            <div className="compte-kiosk-section compte-kiosk-statement-section" style={{ margin: "20px 0" }}>
              <IonButton onClick={handlePrintStatement}>
                <IonIcon icon={printOutline} slot="start" />
                Relevé
              </IonButton>
            </div>

            <div className="compte-kiosk-section compte-kiosk-chart-section">
              <div className="compte-kiosk-section-header">
                <h2 className="compte-kiosk-section-title">Aperçu Financier</h2>
              </div>
              <div className="compte-kiosk-chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenus"
                      stroke="#6366F1"
                      fillOpacity={1}
                      fill="url(#colorRevenus)"
                    />
                    <Area
                      type="monotone"
                      dataKey="depenses"
                      stroke="#F43F5E"
                      fillOpacity={1}
                      fill="url(#colorDepenses)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="compte-kiosk-section compte-kiosk-actions-section">
              <div className="compte-kiosk-section-header">
                <h2 className="compte-kiosk-section-title">Actions Rapides</h2>
              </div>
              <div className="compte-kiosk-actions-grid">
                <IonButton className="compte-kiosk-action-button">
                  <div className="compte-kiosk-action-content">
                    <IonIcon icon={walletOutline} />
                    <span>Virement</span>
                  </div>
                </IonButton>
                <IonButton className="compte-kiosk-action-button">
                  <div className="compte-kiosk-action-content">
                    <IonIcon icon={cardOutline} />
                    <span>Recharge</span>
                  </div>
                </IonButton>
                <IonButton className="compte-kiosk-action-button">
                  <div className="compte-kiosk-action-content">
                    <IonIcon icon={repeatOutline} />
                    <span>Conversion</span>
                  </div>
                </IonButton>
                <IonButton className="compte-kiosk-action-button">
                  <div className="compte-kiosk-action-content">
                    <IonIcon icon={analyticsOutline} />
                    <span>Analyse</span>
                  </div>
                </IonButton>
              </div>
            </div>

            <div className="compte-kiosk-section compte-kiosk-operations-section">
              <div className="compte-kiosk-section-header">
                <h2 className="compte-kiosk-section-title">Opérations Récentes</h2>
                <div className="compte-kiosk-update-date">Dernière mise à jour: 21/01/2025</div>
              </div>
              <div className="compte-kiosk-operations-list">
                {operations.map((op) => (
                  <div key={op.id} className="compte-kiosk-operation-item">
                    <IonRippleEffect />
                    <div className="compte-kiosk-operation-icon">
                      <IonIcon icon={op.type === "credit" ? trendingUpOutline : trendingDownOutline} />
                    </div>
                    <div className="compte-kiosk-operation-details">
                      <div className="compte-kiosk-operation-description">{op.description}</div>
                      <div className="compte-kiosk-operation-date">{op.date}</div>
                    </div>
                    <div className={`compte-kiosk-operation-amount ${op.type}`}>
                      {op.type === "credit" ? "+" : "-"} {op.amount.toFixed(2)} TND
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CompteKiosk
