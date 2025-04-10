import React, { useState, useEffect, useMemo } from "react";
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

  // Aggregate historique (operations) from profile.comptes
  const operations = useMemo(() => {
    if (!profile) return [];
    let allOperations: typeof profile.comptes[0]["historique"] = [];
    profile.comptes.forEach((compte) => {
      if (compte.historique && Array.isArray(compte.historique)) {
        allOperations = allOperations.concat(compte.historique);
      }
    });
    return allOperations;
  }, [profile]);

  // Build chart data from operations
  const chartData = useMemo(() => {
    const grouped = operations.reduce((acc, op) => {
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

  // Handle segment (tab) change
  const handleSegmentChange = (e: CustomEvent) => {
    setSelectedSegment(e.detail.value);
  };

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

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* Pull-to-refresh */}
        <IonRefresher
          slot="fixed"
          onIonRefresh={async (event) => {
            try {
              await refreshProfile();
            } catch (error) {
              console.error("Refresh failed:", error);
            } finally {
              event.detail.complete();
            }
          }}
        >
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

          {/* Chart Section for Operations */}
          {selectedSegment === "operations" && (
            <motion.div
              className="mobile-chart-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {chartData.length === 0 ? (
                <p>Aucune donnée pour le graphique</p>
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
              {operations.length > 0 ? (
                operations.map((op) => (
                  <div key={op._id} className="operation-item">
                    <div className="operation-icon">
                      <IonIcon
                        icon={op.type === "credit" ? trendingUpOutline : trendingDownOutline}
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
          {selectedSegment === "infos" && account && (
            <motion.div
              className="account-info-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2>Informations du compte</h2>
              <div className="info-item">
                <span className="info-label">Type de compte:</span>
                <span className="info-value">{account.type}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Numéro de compte:</span>
                <span className="info-value">{account.numéroCompte}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Solde:</span>
                <span className="info-value">{account.solde} TND</span>
              </div>
              <div className="info-item">
                <span className="info-label">IBAN:</span>
                <span className="info-value">{account.IBAN}</span>
              </div>
              <div className="info-item">
                <span className="info-label">RIB:</span>
                <span className="info-value">{account.RIB}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date de création:</span>
                <span className="info-value">
                  {new Date(account.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </IonContent>
      <NavMobile currentPage="compte" />
    </IonPage>
  );
};

export default CompteMobile;
