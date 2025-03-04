// virement-context.tsx
import React, { createContext, useContext } from "react";
import { useTransfersState } from "./hooks/use-transfers-state";
import type { Transfer, ScheduledTransfer } from "./components/virements/types/transfer";
import type { Beneficiary } from "./components/virements/types/beneficiary";
import type { Account } from "./components/virements/types/accounts";

interface VirementContextType {
  accounts: Account[];
  mainAccount: Account | undefined;
  transferHistory: Transfer[];
  scheduledTransfers: ScheduledTransfer[];
  beneficiaries: Beneficiary[];
  newTransfer: {
    beneficiaryId: string;
    accountFrom: string;
    amount: string;
    reason: string;
    date: string;
    frequency: string;
    endDate: string;
  };
  batchTransfers: any[];
  limits: {
    daily: { limit: number; used: number };
    monthly: { limit: number; used: number };
  };
  actions: {
    handleTransferChange: (field: string, value: any) => void;
    submitTransfer: (isRecurring: boolean) => Promise<boolean>;
    setBatchTransfers: React.Dispatch<React.SetStateAction<any[]>>;
    setTransferHistory: React.Dispatch<React.SetStateAction<Transfer[]>>;
    setScheduledTransfers: React.Dispatch<React.SetStateAction<ScheduledTransfer[]>>;
    setBeneficiaries: React.Dispatch<React.SetStateAction<Beneficiary[]>>;
  };
}

const VirementContext = createContext<VirementContextType | undefined>(undefined);

export const VirementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const transfersState = useTransfersState();
  return (
    <VirementContext.Provider value={transfersState}>
      {children}
    </VirementContext.Provider>
  );
};

export const useVirement = () => {
  const context = useContext(VirementContext);
  if (!context) {
    throw new Error("useVirement must be used within a VirementProvider");
  }
  return context;
};
