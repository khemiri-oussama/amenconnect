// hooks/useBeneficiaries.tsx
import { useState, useEffect } from "react";

export interface Beneficiaire {
  _id: string;
  nom: string;
  prenom: string;
  numeroCompte: string;
  banque: string;
  email?: string;
  telephone?: string;
  dateAjout: string;
}

export const useBeneficiaries = () => {
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBeneficiaires = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/beneficiaires", {
        credentials: "include", // include credentials so that the cookie is sent
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des bénéficiaires");
      }
      const data = await response.json();
      setBeneficiaires(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeneficiaires();
  }, []);

  const addBeneficiaire = async (newBeneficiaire: Partial<Beneficiaire>) => {
    try {
      const response = await fetch("/api/beneficiaires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // include credentials
        body: JSON.stringify(newBeneficiaire),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du bénéficiaire");
      }
      const created = await response.json();
      setBeneficiaires((prev) => [...prev, created]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateBeneficiaire = async (id: string, updatedData: Partial<Beneficiaire>) => {
    try {
      const response = await fetch(`/api/beneficiaires/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // include credentials
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du bénéficiaire");
      }
      const updated = await response.json();
      setBeneficiaires((prev) =>
        prev.map((ben) => (ben._id === id ? updated : ben))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteBeneficiaire = async (id: string) => {
    try {
      const response = await fetch(`/api/beneficiaires/${id}`, {
        method: "DELETE",
        credentials: "include", // include credentials
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du bénéficiaire");
      }
      setBeneficiaires((prev) => prev.filter((ben) => ben._id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    beneficiaires,
    loading,
    error,
    fetchBeneficiaires,
    addBeneficiaire,
    updateBeneficiaire,
    deleteBeneficiaire,
  };
};
