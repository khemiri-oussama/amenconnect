// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// Define interfaces for the detailed profile data
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
}

export interface Carte {
  _id: string;
  CardNumber: string;
  ExpiryDate: string;
  CardHolder: string;
  comptesId: string;
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
  // If your API later returns additional properties, they will be included automatically.
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  pendingUser: { email: string } | null;
  setPendingUser: (user: { email: string } | null) => void;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pendingUser, setPendingUser] = useState<{ email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch the entire profile response from the API
        const response = await axios.get("/api/auth/profile", { withCredentials: true });
        if (response.data && response.data.user) {
          // Set the profile state to the complete API response
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

    fetchProfile();
  }, []); // Run once when the component mounts

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
