// CarteContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
// Import the Carte interface from AuthContext (or define it here if preferred)
import { Carte } from "./AuthContext";

interface CarteContextType {
  cartes: Carte[];
  loading: boolean;
  error: string | null;
  /**
   * Updates the status of a card.
   * @param carteId - The ID of the card to update.
   * @param status - The new status (e.g., "Active" or "Bloquer").
   */
  updateCarteStatus: (carteId: string, status: string) => Promise<void>;
  /**
   * Refreshes the list of cards from the backend.
   */
  refreshCartes: () => Promise<void>;
  /**
   * Allows manual setting of the cards (if needed).
   */
  setCartes: React.Dispatch<React.SetStateAction<Carte[]>>;
}

const CarteContext = createContext<CarteContextType | undefined>(undefined);

export const CarteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartes, setCartes] = useState<Carte[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch the user's cards from the API.
   */
  const refreshCartes = async () => {
    setLoading(true);
    try {
      // Adjust this endpoint based on your API design.
      const response = await axios.get("/api/carte", { withCredentials: true });
      // Assume the API returns an object with a 'cartes' property.
      setCartes(response.data.cartes || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching cartes:", err);
      setError("Error fetching cartes");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update the status of a given card.
   * For example, to lock or unlock a card.
   */
  const updateCarteStatus = async (carteId: string, status: string) => {
    setLoading(true);
    try {
      // Call the PATCH endpoint to update the card status.
      const response = await axios.patch(
        "/api/carte/updateStatus",
        { carteId, status },
        { withCredentials: true }
      );
      // The API should return the updated card.
      const updatedCarte: Carte = response.data.carte;
      // Update the card list in state.
      setCartes((prevCartes) =>
        prevCartes.map((carte) =>
          carte._id === updatedCarte._id ? updatedCarte : carte
        )
      );
      setError(null);
    } catch (err) {
      console.error("Error updating carte status:", err);
      setError("Error updating carte status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CarteContext.Provider
      value={{ cartes, loading, error, updateCarteStatus, refreshCartes, setCartes }}
    >
      {children}
    </CarteContext.Provider>
  );
};

/**
 * Custom hook to use the CarteContext.
 */
export const useCarte = () => {
  const context = useContext(CarteContext);
  if (!context) {
    throw new Error("useCarte must be used within a CarteProvider");
  }
  return context;
};
