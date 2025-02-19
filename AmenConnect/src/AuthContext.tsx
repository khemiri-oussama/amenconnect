import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface User {
  id: string;
  email: string;
  nom: string;
  prénom: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  pendingUser: { email: string } | null;
  setPendingUser: (user: { email: string } | null) => void;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [pendingUser, setPendingUser] = useState<{ email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Check authentication on component mount by calling your profile API
  useEffect(() => {
    axios
      .get("/api/auth/profile", { withCredentials: true })
      .then((response) => {
        if (response.data.user) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setUser(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
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
