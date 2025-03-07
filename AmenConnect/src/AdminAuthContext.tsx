// AdminAuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface AdminProfile {
  _id: string;
  cin: string;
  name: string;
  email: string;
  phone: string;
  dateDeNaissance: string;
  role: string;
  department: string;
  // Add any additional admin fields here as needed
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  adminProfile: AdminProfile | null;
  setAdminProfile: (profile: AdminProfile | null) => void;
  pendingAdmin: { email: string } | null;
  setPendingAdmin: (admin: { email: string } | null) => void;
  authLoading: boolean;
  refreshAdminProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [pendingAdmin, setPendingAdmin] = useState<{ email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const fetchAdminProfile = async () => {
    try {
      const response = await axios.get("/admin/profile", { withCredentials: true });
      if (response.data && response.data.admin) {
        setAdminProfile(response.data);
        setIsAuthenticated(true);
      } else {
        setAdminProfile(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Admin auth check failed:", error);
      setAdminProfile(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const refreshAdminProfile = async () => {
    try {
      const response = await axios.get("/admin/profile", { withCredentials: true });
      if (response.data && response.data.admin) {
        setAdminProfile(response.data);
      } else {
        setAdminProfile(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error refreshing admin profile:", error);
      setAdminProfile(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        adminProfile,
        setAdminProfile,
        pendingAdmin,
        setPendingAdmin,
        authLoading,
        refreshAdminProfile,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
