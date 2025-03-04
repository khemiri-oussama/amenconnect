export interface Transfer {
  id: string
  beneficiaryId: string
  beneficiaryName: string
  accountFrom: string
  accountTo: string
  amount: number
  reason: string
  date: string
  status: "pending" | "completed" | "failed"
}

export interface ScheduledTransfer {
  id: string;
  fromAccount: string; // Added
  toAccount: string;
  beneficiaryName: string;
  amount: number;
  reference: string;
  status: string;
  nextDate: string;
  frequency: string;
  // Optionally:
  remainingOccurrences?: number;
  endDate?: string;
}


export interface TransferFrequency{
  frequency : string;
}
