// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  pendingUser: User | null;
  setPendingUser: (user: User | null) => void;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Check authentication on component mount
  useEffect(() => {
    axios
      .get("/api/auth/profile", { withCredentials: true })
      .then((response) => {
        if (response.data.user) {
          setIsAuthenticated(true);
          setPendingUser(response.data.user);
        } else {
          setIsAuthenticated(false);
          setPendingUser(null);
        }
      })
      .catch((error) => {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setPendingUser(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, pendingUser, setPendingUser, authLoading }}
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
