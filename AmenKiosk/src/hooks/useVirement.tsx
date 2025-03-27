// hooks/useVirement.tsx
import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

export function useVirement() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const history = useHistory();

  /**
   * Makes a virement (transfer) request.
   * @param params - Object containing virement details.
   * @returns The response data if successful.
   */
  const makeVirement = async (params: {
    sourceCompteId: string;
    destinationCompteId: string;
    amount: number;
    currency?: string;
    transferType: "internal" | "external";
    reason?: string;
    transferDate?: string;
    beneficiaryName?: string;
    beneficiaryBank?: string;
  }) => {
    setErrorMessage("");
    setIsLoading(true);

    // Basic validation can be added here if needed.

    try {
      const response = await axios.post(
        "http://localhost:3000/api/virements",
        params,
        { withCredentials: true }
      );

      // Optionally navigate after a successful transfer
      history.push("/virement");
      return response.data;
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Erreur inattendue.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, errorMessage, makeVirement };
}
