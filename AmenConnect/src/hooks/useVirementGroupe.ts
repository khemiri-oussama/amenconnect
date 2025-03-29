import { useState } from "react";
import axios from "axios";

interface VirementEntry {
  beneficiary: string;
  amount: number;
  motif?: string;
}

interface VirementGroupeData {
  fromAccount: string;
  virements: VirementEntry[];
}

interface VirementGroupeResponse {
  success: boolean;
  message: string;
  data?: any;
}

const useVirementGroupe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<VirementGroupeResponse | null>(null);

  const makeVirementGroupe = async (data: VirementGroupeData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post<VirementGroupeResponse>(
        "/api/virements/group",
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

  return { loading, error, response, makeVirementGroupe };
};

export default useVirementGroupe;
