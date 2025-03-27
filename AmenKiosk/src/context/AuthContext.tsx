// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";


export interface Compte {
  _id: string;
  numéroCompte: string;
  solde: number;
  type: string;
  avecChéquier: boolean;
  avecCarteBancaire: boolean;
  modalitésRetrait: string;
  conditionsGel: string;
  createdAt: string;
  updatedAt: string;
  IBAN : string;
  RIB : string;
}

export interface Carte {
  _id: string;
  CardNumber: string;
  ExpiryDate: string;
  CardHolder: string;
  comptesId: string;
  TypeCarte: string;
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
  creditCardTransactions?: CreditCardTransaction[];
}

export interface CreditCardTransaction {
  _id: string;
  amount: number;
  transactionDate: string;
  description: string;
  currency: string;
  merchant: string;
  status: string;
  carteId: string;
}

export interface Profile {
  user: {
    _id: string;
    cin: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    employeur: string;
    adresseEmployeur: string;
    createdAt: string;
    updatedAt: string;
  };
  comptes: Compte[];
  cartes: Carte[];
  
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  pendingUser: { email: string } | null;
  setPendingUser: (user: { email: string } | null) => void;
  authLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pendingUser, setPendingUser] = useState<{ email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
     
      const response = await axios.get("/api/auth/profile", { withCredentials: true });
      if (response.data && response.data.user) {
        setProfile(response.data);
        setIsAuthenticated(true);
      } else {
        setProfile(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setProfile(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  
  const refreshProfile = async () => {
    try {
      const response = await axios.get("/api/auth/profile", { withCredentials: true });
      if (response.data && response.data.user) {
        setProfile(response.data);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
      setProfile(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        pendingUser,
        setPendingUser,
        authLoading,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
