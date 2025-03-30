//hooks/useVirement.tsx
import { useState } from "react";
import axios from "axios";

interface VirementData {
  fromAccount: string;
  toAccount: string;
  amount: number;
  description?: string;
}

interface VirementResponse {
  success: boolean;
  message: string;
  data?: any;
}

const useVirement = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<VirementResponse | null>(null);

  const makeVirement = async (virementData: VirementData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post<VirementResponse>("/api/virements", virementData, {
        withCredentials: true,
      });
      setResponse(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, response, makeVirement };
};

export default useVirement;
