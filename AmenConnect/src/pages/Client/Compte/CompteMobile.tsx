"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import {
  statsChartOutline,
  chevronDownCircleOutline,
  trendingUpOutline,
  trendingDownOutline,
} from "ionicons/icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useAuth } from "../../../AuthContext";

import "./CompteMobile.css";
import NavMobile from "../../../components/NavMobile";

interface Operation {
  id: number;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
}

const CompteMobile: React.FC = () => {
  const [today, setToday] = useState<string>("");
  const [selectedSegment, setSelectedSegment] = useState<string>("operations");

  // Get profile data from context
  const { profile, authLoading, refreshProfile } = useAuth();

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setToday(formattedDate);
  }, []);

  // Refresh function for pull-to-refresh
  const handleRefreshC = async (event: CustomEvent) => {
    try {
      await refreshProfile();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      event.detail.complete();
    }
  };

  // Set a formatted date for display (example date)
  const [Day, setDay] = useState<string>("");
  useEffect(() => {
    const isoString = "2025-02-25T02:20:26.487Z";
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    let formattedDate = date.toLocaleDateString("fr-FR", options);
    // Capitalize month if needed
    const parts = formattedDate.split(" ");
    if (parts.length === 3) {
      parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
      formattedDate = parts.join(" ");
    }
    setDay(formattedDate);
  }, []);

  // Handle segment (tab) change
  const handleSegmentChange = (e: CustomEvent) => {
    setSelectedSegment(e.detail.value);
  };

  // Wait for profile data to load
  if (authLoading) {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding">
          <p>Chargement des données...</p>
        </IonContent>
      </IonPage>
    );
  }

  // Use the first account from profile data (or fallback)
  const account =
    profile?.comptes && profile.comptes.length > 0 ? profile.comptes[0] : null;

  // Fetch operations from the API
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loadingOperations, setLoadingOperations] = useState<boolean>(true);
  const [errorOperations, setErrorOperations] = useState<string | null>(null);

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const response = await fetch("/api/historique", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch operations");
        }
        const data: Operation[] = await response.json();
        setOperations(data);
      } catch (error) {
        console.error("Error fetching operations:", error);
        setErrorOperations("Erreur lors de la récupération des opérations.");
      } finally {
        setLoadingOperations(false);
      }
    };
    fetchOperations();
  }, []);

  // Build chart data from fetched operations
  const chartData = useMemo(() => {
    const grouped = operations.reduce((acc, op) => {
      // Get a short month string (e.g., "Jan", "Feb")
      const month = new Date(op.date).toLocaleString("default", { month: "short" });
      if (!acc[month]) {
        acc[month] = { month: month, income: 0, expenses: 0 };
      }
      if (op.type === "credit") {
        acc[month].income += op.amount;
      } else if (op.type === "debit") {
        acc[month].expenses += op.amount;
      }
      return acc;
    }, {} as { [key: string]: { month: string; income: number; expenses: number } });
    return Object.values(grouped);
  }, [operations]);

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* Pull-to-refresh */}
        <IonRefresher slot="fixed" onIonRefresh={handleRefreshC}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Tirer pour rafraîchir"
            refreshingSpinner="circles"
          ></IonRefresherContent>
        </IonRefresher>

        <div className="scrollable-content ion-padding-horizontal">
          <motion.h1
            className="page-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Mes comptes
          </motion.h1>

          {/* Account Card */}
          <motion.div
            className="account-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="account-header">
              <span>{account?.type || "Compte Epargne"}</span>
              <IonIcon icon={statsChartOutline} className="stats-icon" />
            </div>
            <div className="account-details">
              <div>
                <h2 className="balance">
                  {account ? `${account.solde} TND` : "450.0 TND"}
                </h2>
                <p className="account-number">
                  {account ? account.numéroCompte : "12345678987"}
                </p>
              </div>
              <span className="expiry-date">{Day}</span>
            </div>
          </motion.div>

          {/* Chart Section for Operations */}
          {selectedSegment === "operations" && (
            <motion.div
              className="mobile-chart-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {loadingOperations ? (
                <p>Loading chart data...</p>
              ) : errorOperations ? (
                <p>{errorOperations}</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF5722" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FF5722" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stackId="1"
                      stroke="#FF5722"
                      fillOpacity={1}
                      fill="url(#colorExpenses)"
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stackId="1"
                      stroke="#4CAF50"
                      fillOpacity={1}
                      fill="url(#colorIncome)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          )}

          {/* Segment Buttons */}
          <IonSegment
            mode="ios"
            value={selectedSegment}
            onIonChange={handleSegmentChange}
            className="custom-segment"
          >
            <IonSegmentButton value="operations">
              <IonLabel>Opérations</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="infos">
              <IonLabel>Infos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="credits">
              <IonLabel>Crédits</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="cheques">
              <IonLabel>Chèques</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          <IonSearchbar
            placeholder="Rechercher"
            className="custom-searchbar"
            mode="ios"
          ></IonSearchbar>

          {/* Operations List Section */}
          {selectedSegment === "operations" && (
            <motion.div
              className="operations-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3>Opérations</h3>
              <p className="last-update">Dernière mise à jour: {today}</p>
              {loadingOperations ? (
                <p>Loading operations...</p>
              ) : errorOperations ? (
                <p>{errorOperations}</p>
              ) : operations.length > 0 ? (
                operations.map((op) => (
                  <div key={op.id} className="operation-item">
                    <div className="operation-icon">
                      <IonIcon
                        icon={
                          op.type === "credit" ? trendingUpOutline : trendingDownOutline
                        }
                      />
                    </div>
                    <div className="operation-details">
                      <span className="operation-description">{op.description}</span>
                      <span className="operation-date">
                        {new Date(op.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="operation-amount">
                      <span className={`amount ${op.type === "credit" ? "credit" : "debit"}`}>
                        {op.type === "credit" ? "+" : "-"} {op.amount} TND
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p>Aucune opération disponible</p>
              )}
            </motion.div>
          )}

      
          {/* Account Information Section */}
          {selectedSegment === "infos" && (
            <motion.div
              className="account-info-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2>Information du compte</h2>
              <motion.div
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="info-label">RIB</span>
                <span className="info-value">
                  {account ? account.RIB : "07098050012167474684"}
                </span>
              </motion.div>
              <motion.div
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="info-label">Numéro du compte</span>
                <span className="info-value">
                  {account ? account.numéroCompte : "99999999"}
                </span>
              </motion.div>
              <motion.div
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="info-label">IBAN</span>
                <span className="info-value">
                  {account ? `TN${account.RIB}` : ""}
                </span>
              </motion.div>
              <motion.div
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <span className="info-label">Référence agence</span>
                <span className="info-value">
                  {account ? account.numéroCompte : "Réf. Agence"}
                </span>
              </motion.div>
              <motion.div
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <span className="info-label">Solde du compte</span>
                <span className="info-value">
                  {account ? `${account.solde} TND` : "40.0 TND"}
                </span>
              </motion.div>
              <motion.div
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span className="info-label">Date de création</span>
                <span className="info-value">
                  {account
                    ? new Date(account.createdAt).toLocaleDateString("fr-FR")
                    : "00/00/0000"}
                </span>
              </motion.div>
            </motion.div>
          )}
        </div>
      </IonContent>
      <NavMobile currentPage="compte" />
    </IonPage>
  );
};

export default CompteMobile;
