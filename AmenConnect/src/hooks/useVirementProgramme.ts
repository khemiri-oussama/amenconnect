"use client";
import { useState } from "react";
import axios from "axios";

interface VirementProgrammeData {
  fromAccount: string;
  toAccount: string;
  amount: number;
  description?: string;
  frequency: "quotidien" | "hebdomadaire" | "mensuel" | "trimestriel" | "annuel";
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string;   // ISO date string (YYYY-MM-DD)
}

interface VirementProgrammeResponse {
  success: boolean;
  message: string;
  data?: any;
}

const useVirementProgramme = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<VirementProgrammeResponse | null>(null);

  const makeVirementProgramme = async (data: VirementProgrammeData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post<VirementProgrammeResponse>(
        "/api/virements/programme",
        data,
        { withCredentials: true }
      );
      setResponse(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, response, makeVirementProgramme };
};

export default useVirementProgramme;
