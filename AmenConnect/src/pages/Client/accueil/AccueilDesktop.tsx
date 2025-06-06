"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonIcon,
  IonRippleEffect,
  IonButton,
} from "@ionic/react";
import {
  walletOutline,
  cardOutline,
  pieChartOutline,
  trendingUpOutline,
  trendingDownOutline,
  eyeOutline,
  settingsOutline,
  timeOutline,
  peopleOutline,
  globeOutline,
} from "ionicons/icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../../../components/Navbar";
import "./AccueilDesktop.css";
import { useHistory } from "react-router-dom";
import Profile from "./MenuDesktop/ProfileMenu";
import { useAuth } from "../../../AuthContext";
import NotificationDesktop from "./NotificationMenu/NotificationDesktop";
import BudgetCategoryManager from "../../../components/BudgetCategory/BudgetCategoryManager";
import LoadingProgressBar from "../../../components/LoadingProgressBar"
interface Account {
  _id: string;
  numéroCompte: string;
  solde: number;
  type: string;
  IBAN?: string;
  RIB?: string;
  domiciliation?: string;
  avecChéquier?: boolean;
  avecCarteBancaire?: boolean;
  modalitésRetrait?: string;
  conditionsGel?: string;
}

interface Card {
  _id: string;
  CardNumber: string;
  ExpiryDate: string;
  CardHolder: string;
  TypeCarte?: string;
  monthlyExpenses?: {
    current: number;
    limit: number;
  };
  atmWithdrawal?: {
    current: number;
    limit: number;
  };
  pendingTransactions?: {
    amount: number;
    count: number;
  };
  cardStatus?: string;
}

interface Transaction {
  _id: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
  category?: string;
  description: string;
  rawDate?: string;
}

interface BudgetCategory {
  userId: string;
  id: string;
  name: string;
  limit: number;
  color: string;
  current: number;
  _id: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
}

const AccueilDesktop: React.FC = () => {
  const history = useHistory();
  const { profile, authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [prenom, setPrenom] = useState("Utilisateur");
  const [nom, setNom] = useState("Foulen");
  const [email, setEmail] = useState("foulen@gmail.com");
  const [tel, setTel] = useState("06 12 34 56 78");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (profile) {
      setPrenom(profile.user?.prenom || "Utilisateur");
      setNom(profile.user?.nom || "Foulen");
      setEmail(profile.user?.email || "foulen@gmail.com");
      setTel(profile.user?.telephone || "06 12 34 56 78");

      setAccounts(
        (profile.comptes || []).map((compte: any) => ({
          _id: compte._id,
          numéroCompte: compte.numéroCompte,
          solde: compte.solde,
          type: compte.type,
          IBAN: compte.IBAN,
          RIB: compte.RIB,
          domiciliation: compte.domiciliation,
          avecChéquier: compte.avecChéquier,
          avecCarteBancaire: compte.avecCarteBancaire,
          modalitésRetrait: compte.modalitésRetrait,
          conditionsGel: compte.conditionsGel,
        }))
      );

      setCards(
        (profile.cartes || []).map((card: any) => ({
          _id: card._id,
          CardNumber: card.CardNumber,
          ExpiryDate: card.ExpiryDate,
          CardHolder: card.CardHolder,
          TypeCarte: card.TypeCarte,
          monthlyExpenses: card.monthlyExpenses,
          atmWithdrawal: card.atmWithdrawal,
          pendingTransactions: card.pendingTransactions,
          cardStatus: card.cardStatus,
        }))
      );
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      let allTransactions: Transaction[] = [];
      profile.comptes.forEach((compte: any) => {
        if (compte.historique && Array.isArray(compte.historique)) {
          allTransactions = [...allTransactions, ...compte.historique];
        }
      });
      // Sort transactions from newest to oldest
      allTransactions.sort(
        (a, b) =>
          new Date(b.rawDate || b.date).getTime() - new Date(a.rawDate || a.date).getTime()
      );
      setTransactions(allTransactions);
      setLoadingTransactions(false);
    }
  }, [profile]);
  

  useEffect(() => {
    const fetchBudgetCategories = async () => {
      try {
        const response = await fetch(`/api/categories?userId=${profile?.user._id}`);
        if (!response.ok) throw new Error("Error fetching budget categories");
        const data = await response.json();
        setBudgetCategories(data.map((cat: any) => ({ ...cat, id: cat._id })));
      } catch (error) {
        console.error(error);
      }
    };
    if (profile?.user._id) fetchBudgetCategories();
  }, [profile]);

  const totalBalance = useMemo(
    () => accounts.reduce((sum, account) => sum + account.solde, 0),
    [accounts]
  );

  const { currentMonthExpense, previousMonthExpense } = useMemo(() => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    let current = 0;
    let previous = 0;

    transactions.forEach((tx) => {
      const txDate = new Date(tx.rawDate || tx.date);
      const txMonth = txDate.getMonth();
      const txYear = txDate.getFullYear();

      if (tx.type === "debit") {
        if (txMonth === currentMonth.getMonth() && txYear === currentMonth.getFullYear()) {
          current += tx.amount;
        } else if (txMonth === previousMonth.getMonth() && txYear === previousMonth.getFullYear()) {
          previous += tx.amount;
        }
      }
    });

    return { currentMonthExpense: current, previousMonthExpense: previous };
  }, [transactions]);

  const expensePercentageChange = useMemo(() => {
    if (previousMonthExpense === 0) {
      return currentMonthExpense !== 0 ? 100 : 0;
    }
    return ((currentMonthExpense - previousMonthExpense) / previousMonthExpense) * 100;
  }, [currentMonthExpense, previousMonthExpense]);

  const lastMonthStats = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    let income = 0;

    transactions.forEach((tx) => {
      const txDate = new Date(tx.rawDate || tx.date);
      if (
        txDate.getMonth() === lastMonth.getMonth() &&
        txDate.getFullYear() === lastMonth.getFullYear() &&
        tx.type === "credit"
      ) {
        income += tx.amount;
      }
    });

    return {
      income,
      expense: currentMonthExpense,
      savings: income - currentMonthExpense,
    };
  }, [transactions, currentMonthExpense]);

  const savingsPercentage = useMemo(() => {
    if (currentMonthExpense > 0) {
      return (lastMonthStats.savings / currentMonthExpense) * 100;
    }
    return 0;
  }, [lastMonthStats.savings, currentMonthExpense]);

  const chartData = useMemo(() => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const groupedData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.rawDate || transaction.date);
      if (date < threeMonthsAgo) return acc;
      const monthNumber = date.getMonth();
      const month = date.toLocaleString("default", { month: "short" });

      if (!acc[month]) {
        acc[month] = { name: month, income: 0, expenses: 0, monthNumber };
      }

      if (transaction.type === "credit") {
        acc[month].income += transaction.amount;
      } else if (transaction.type === "debit") {
        acc[month].expenses += transaction.amount;
      }

      return acc;
    }, {} as Record<string, { name: string; income: number; expenses: number; monthNumber: number }>);

    return Object.values(groupedData)
      .sort((a, b) => a.monthNumber - b.monthNumber)
      .map((data) => ({
        ...data,
        savings: data.income - data.expenses,
      }));
  }, [transactions]);

  const handleAccountClick = (accountId: string) => {
    history.push(`/Compte/${accountId}`);
  };

  const renderStatCard = (
    label: string,
    value: string,
    change: string,
    icon: string,
    changeType: "positive" | "negative"
  ) => (
    <div className="stat-card">
      <div className="stat-icon">
        <IonIcon icon={icon} />
      </div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        <div className={`stat-change ${changeType}`}>
          <IonIcon icon={changeType === "positive" ? trendingUpOutline : trendingDownOutline} />
          {change}
        </div>
      </div>
    </div>
  );

  const handleSaveBudgetCategories = (updatedCategories: BudgetCategory[]) => {
    setBudgetCategories(updatedCategories);
  };

  if (authLoading) {
    return (
      <IonPage>
        <LoadingProgressBar />
      </IonPage>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <Navbar currentPage="accueil" />
      </IonHeader>
      <IonContent className="ion-padding custom-content">
        <div className="dashboard-container">
          <div className="welcome-section">
            <div className="welcome-text">
              <h1 className="welcome-title">Bienvenue, {nom} {prenom}</h1>
              <p className="welcome-subtitle">Voici un aperçu de vos finances</p>
            </div>
            <div className="welcome-actions">
              <NotificationDesktop />
              <Profile />
            </div>
          </div>

          <div className="stats-grid">
            {renderStatCard(
              "Solde Total",
              `${totalBalance.toFixed(2)} TND`,
              "+2.5% depuis le mois dernier",
              walletOutline,
              "positive"
            )}
            {renderStatCard(
              "Dépenses du mois",
              `${currentMonthExpense.toFixed(2)} TND`,
              `${expensePercentageChange >= 0 ? '+' : ''}${expensePercentageChange.toFixed(2)}% depuis le mois dernier`,
              pieChartOutline,
              expensePercentageChange > 0 ? "negative" : "positive"
            )}
            {renderStatCard(
              "Économies",
              `${lastMonthStats.savings.toFixed(2)} TND`,
              `${savingsPercentage >= 0 ? '+' : ''}${savingsPercentage.toFixed(2)}% depuis le mois dernier`,
              trendingUpOutline,
              savingsPercentage >= 0 ? "positive" : "negative"
            )}
          </div>

          <div className="main-grid">
            <div className="section-card accounts-section" onClick={() => history.push("/Compte")}>
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={walletOutline} />
                  Comptes
                </h2>
                <a href="#" className="section-link">
                  <IonIcon icon={eyeOutline} />
                  Voir tout
                </a>
              </div>
              <div className="accounts-list">
                {accounts.map((account) => (
                  <div key={account._id} className="account-item" onClick={() => handleAccountClick(account._id)}>
                    <IonRippleEffect />
                    <div className="account-icon">
                      <IonIcon icon={account.type === "Compte courant" ? walletOutline : trendingUpOutline} />
                    </div>
                    <div className="account-details">
                      <div className="account-name">{account.type}</div>
                      <div className="account-number">N° {account.numéroCompte}</div>
                      {account.IBAN && <div className="account-iban">IBAN: {account.IBAN}</div>}
                      {account.RIB && <div className="account-rib">RIB: {account.RIB}</div>}
                    </div>
                    <div className="account-balance">{account.solde.toFixed(2)} TND</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card chart-section">
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={pieChartOutline} />
                  Aperçu Financier
                </h2>
                <a href="#" className="section-link">
                  <IonIcon icon={eyeOutline} />
                  Détails
                </a>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }} />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorIncome)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorExpenses)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="section-card cards-section" onClick={() => history.push("/carte")}>
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={cardOutline} />
                  Cartes
                </h2>
                <a href="#" className="section-link">
                  <IonIcon icon={settingsOutline} />
                  Gérer les cartes
                </a>
              </div>
              <div className="cards-list">
                {cards.map((card) => (
                  <div key={card._id} className="card-item">
                    <IonRippleEffect />
                    <div className="card-icon">
                      <IonIcon icon={cardOutline} />
                    </div>
                    <div className="card-details">
                      <div className="card-number">•••• {card.CardNumber.slice(-4)}</div>
                      <div className="card-holder">{card.CardHolder}</div>
                      <div className="card-expiry">Expire: {card.ExpiryDate}</div>
                      {card.TypeCarte && <div className="card-type">Type: {card.TypeCarte}</div>}
                      {card.cardStatus && <div className="card-status">Status: {card.cardStatus}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card budget-section">
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={pieChartOutline} />
                  Budget
                </h2>
                <a href="#" className="section-link" onClick={() => setIsBudgetModalOpen(true)}>
                  <IonIcon icon={eyeOutline} />
                  Voir les détails
                </a>
              </div>
              {budgetCategories.length > 0 ? (
                budgetCategories.map((category) => {
                  const percentage = (category.current / category.limit) * 100;
                  return (
                    <div key={category.id} className="budget-item" onClick={() => setIsBudgetModalOpen(true)}>
                      <IonRippleEffect />
                      <div className="budget-item-header">
                        <div className="budget-item-label">
                          <span className="budget-item-color" style={{ backgroundColor: category.color }} />
                          <span>{category.name}</span>
                        </div>
                        <span className="budget-item-amount">
                          {category.current} / {category.limit} TND
                        </span>
                      </div>
                      <div className="budget-progress">
                        <div
                          className="budget-progress-bar"
                          style={{ width: `${percentage}%`, backgroundColor: category.color }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>Aucune donnée de budget disponible</div>
              )}
            </div>

            <div className="section-card transactions-section">
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={timeOutline} />
                  Transactions Récentes
                </h2>
                <a href="#" className="section-link">
                  <IonIcon icon={eyeOutline} />
                  Voir tout
                </a>
              </div>
              <div className="transactions-list">
                {transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction._id} className="transaction-item">
                    <IonRippleEffect />
                    <div className="transaction-icon">
                      <IonIcon icon={transaction.type === "credit" ? trendingUpOutline : trendingDownOutline} />
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-description">{transaction.description}</div>
                      <div className="transaction-date">
                        {new Date(transaction.rawDate || transaction.date).toLocaleString()}
                      </div>
                    </div>
                    <div className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === "credit" ? "+" : "-"} {transaction.amount.toFixed(2)} TND
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="quick-actions-section">
            <h2 className="section-title">Actions Rapides</h2>
            <div className="quick-actions-grid">
              <IonButton expand="block" className="quick-action-button" onClick={() => history.push("/virement")}>
                <IonIcon slot="start" icon={peopleOutline} />
                Virement
              </IonButton>
              <IonButton expand="block" className="quick-action-button" onClick={() => history.push("/virement")}>
                <IonIcon slot="start" icon={cardOutline} />
                Payer une Facture
              </IonButton>
              <IonButton expand="block" className="quick-action-button" onClick={() => history.push("/virement")}>
                <IonIcon slot="start" icon={globeOutline} />
                Transfert International
              </IonButton>
              <IonButton expand="block" className="quick-action-button" onClick={() => setIsBudgetModalOpen(true)}>
                <IonIcon slot="start" icon={pieChartOutline} />
                Gérer le Budget
              </IonButton>
            </div>
          </div>
        </div>

        <BudgetCategoryManager
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          userId={profile?.user._id || ""}
          initialCategories={budgetCategories}
          onSave={handleSaveBudgetCategories}
        />
      </IonContent>
    </IonPage>
  );
};

export default AccueilDesktop;