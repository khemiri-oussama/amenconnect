// hooks/useBeneficiaries.tsx
import { useState } from "react";
import axios from "axios";
import type { Beneficiary } from "./../components/virements/types/beneficiary";

export function useBeneficiaries() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

  const fetchBeneficiaries = async () => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      const response = await axios.get("/api/beneficiaries", {
        withCredentials: true,
      });
      setBeneficiaries(response.data);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Unexpected error.");
    } finally {
      setIsLoading(false);
    }
  };

  const addBeneficiary = async (
    name: string,
    accountNumber: string,
    bank: string,
    IBAN?: string
  ) => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/beneficiaries",
        {
          name,
          accountNumber,
          bankName: bank, // backend expects "bankName"
          IBAN,
        },
        {
          withCredentials: true,
        }
      );
      // Depending on your backend, the newly created beneficiary may be at response.data or response.data.beneficiary
      const newBeneficiary: Beneficiary =
        response.data.beneficiary || response.data;
      setBeneficiaries((prev) => [...prev, newBeneficiary]);
      return newBeneficiary;
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Unexpected error.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    beneficiaries,
    isLoading,
    errorMessage,
    fetchBeneficiaries,
    addBeneficiary,
    setBeneficiaries,
  };
}
