"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { statsChartOutline, chevronDownCircleOutline } from "ionicons/icons";
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

// Sample chart data (replace this with your actual operations data if available)
const sampleChartData = [
  { month: "Jan", income: 2, expenses: 1 },
  { month: "Feb", income: 4, expenses: 2 },
  { month: "Mar", income: 3, expenses: 4 },
  { month: "Apr", income: 5, expenses: 3 },
  { month: "May", income: 7, expenses: 5 },
  { month: "Jun", income: 6, expenses: 4 },
];

const CompteMobile: React.FC = () => {
  const [today, setToday] = useState<string>("");
  const [selectedSegment, setSelectedSegment] = useState<string>("operations");

  // Fetch real data using the AuthContext
  const { profile, authLoading, refreshProfile } = useAuth();

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("fr-FR");
    setToday(formattedDate);
  }, []);

  // Refresh function called when the user pulls to refresh.
  const handleRefreshC = async (event: CustomEvent) => {
    try {
      await refreshProfile();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      event.detail.complete();
    }
  };

  // Handle segment change
  const handleSegmentChange = (e: CustomEvent) => {
    setSelectedSegment(e.detail.value);
  };

  // Display a loading state until profile data is fetched
  if (authLoading) {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding">
          <p>Chargement des données...</p>
        </IonContent>
      </IonPage>
    );
  }

  // Use the first account from the profile, if available
  const account =
    profile?.comptes && profile.comptes.length > 0 ? profile.comptes[0] : null;

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* IonRefresher is placed as a direct child of IonContent */}
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
              <span className="expiry-date">{today}</span>
            </div>
          </motion.div>

          {/* Chart */}
          {selectedSegment === "operations" && (
            <motion.div
              className="mobile-chart-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                  data={sampleChartData}
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
            </motion.div>
          )}

          {/* Segments */}
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

          {/* Operations Section */}
          {selectedSegment === "operations" && (
            <motion.div
              className="operations-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3>Opérations</h3>
              <p className="last-update">Dernière mise à jour: {today}</p>
            </motion.div>
          )}

          <IonSearchbar
            placeholder="Rechercher"
            className="custom-searchbar"
            mode="ios"
          ></IonSearchbar>

          {/* Account Information Section */}
          {selectedSegment === "infos" && (
            <motion.div
              className="account-info-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2>Information du compte</h2>
              {/* Replace dummy data with real account info where available */}
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
                  {account ? `${account.IBAN}` : ""}
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
