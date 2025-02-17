// AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  pendingUser: User | null;
  setPendingUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!sessionStorage.getItem("token")
  );
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, pendingUser, setPendingUser }}>
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
