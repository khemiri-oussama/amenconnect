// hooks/use-transfers-state.tsx
"use client"

import { useState, useEffect } from "react";
import { useAuth } from "./../AuthContext";
import { mapCompteToAccount } from "./../components/virements/utils/account-mapper";
import type { Transfer, ScheduledTransfer } from "./../components/virements/types/transfer";
import type { Beneficiary } from "./../components/virements/types/beneficiary";
import type { Account } from "./../components/virements/types/accounts";
import axios from "axios";

export const useTransfersState = () => {
  const { profile } = useAuth();

  // Map Compte to Account
  const accounts: Account[] = profile?.comptes.map(mapCompteToAccount) || [];

  // Get the main account (using 'iban' because the Account type doesn't have 'RIB')
  const mainAccount = accounts.find(
    (account) =>
      account.label.toLowerCase().includes("courant") ||
      account.label.toLowerCase().includes("current")
  );

  // State for transfers
  const [transferHistory, setTransferHistory] = useState<Transfer[]>([]);
  const [scheduledTransfers, setScheduledTransfers] = useState<ScheduledTransfer[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

  // Fetch beneficiaries from backend on mount
  useEffect(() => {
    async function fetchBeneficiaries() {
      try {
        const response = await axios.get("/api/beneficiaries", {
          withCredentials: true,
        });
        setBeneficiaries(response.data);
      } catch (error: any) {
        console.error("Error fetching beneficiaries:", error);
      }
    }

    fetchBeneficiaries();
  }, []);

  // Calculate transfer limits
  const dailyLimit = 10000;
  const monthlyLimit = 50000;
  const currentDayUsage = 0;
  const currentMonthUsage = 0;

  // Form state for new transfer
  const [newTransfer, setNewTransfer] = useState({
    beneficiaryId: "",
    accountFrom: mainAccount?.iban || "", // Use 'iban' instead of 'RIB'
    amount: "",
    reason: "",
    date: new Date().toISOString(),
    frequency: "once" as const,
    endDate: "",
  });

  // Form state for batch transfers
  const [batchTransfers, setBatchTransfers] = useState<any[]>([
    { beneficiaryId: "", amount: "", reason: "" },
  ]);

  const handleTransferChange = (field: string, value: any) => {
    setNewTransfer((prev) => ({ ...prev, [field]: value }));
  };

  const submitTransfer = async (isRecurring: boolean) => {
    const selectedAccount = accounts.find((acc) => acc.value === newTransfer.accountFrom);
    if (!selectedAccount) {
      throw new Error("Account not found");
    }

    if (!newTransfer.amount || Number.parseFloat(newTransfer.amount) <= 0) {
      throw new Error("Invalid amount");
    }

    if (Number.parseFloat(newTransfer.amount) > selectedAccount.balance) {
      throw new Error("Insufficient funds");
    }

    const transfer: Transfer = {
      id: `tr${Date.now()}`,
      beneficiaryId: newTransfer.beneficiaryId,
      beneficiaryName:
        beneficiaries.find((b) => b.id === newTransfer.beneficiaryId)?.name || "",
      accountFrom: newTransfer.accountFrom,
      accountTo:
        beneficiaries.find((b) => b.id === newTransfer.beneficiaryId)?.accountNumber ||
        "",
      amount: Number.parseFloat(newTransfer.amount),
      reason: newTransfer.reason,
      date: newTransfer.date,
      status: "pending",
    };

    if (isRecurring) {
      const scheduledTransfer: ScheduledTransfer = {
        ...transfer,
        frequency: newTransfer.frequency,
        nextDate: newTransfer.date,
        endDate: newTransfer.endDate || undefined,
      };
      setScheduledTransfers((prev) => [scheduledTransfer, ...prev]);
    } else {
      setTransferHistory((prev) => [transfer, ...prev]);
    }

    // Reset form
    setNewTransfer({
      beneficiaryId: "",
      accountFrom: mainAccount?.iban || "",
      amount: "",
      reason: "",
      date: new Date().toISOString(),
      frequency: "once",
      endDate: "",
    });

    return true;
  };

  const limits = {
    daily: {
      limit: dailyLimit,
      used: currentDayUsage,
    },
    monthly: {
      limit: monthlyLimit,
      used: currentMonthUsage,
    },
  };

  const actions = {
    handleTransferChange,
    submitTransfer,
    setBatchTransfers,
    setTransferHistory,
    setScheduledTransfers,
    setBeneficiaries,
  };

  return {
    accounts,
    mainAccount,
    transferHistory,
    scheduledTransfers,
    beneficiaries,
    newTransfer,
    batchTransfers,
    limits,
    actions,
  };
};
