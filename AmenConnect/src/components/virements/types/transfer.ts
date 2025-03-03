//types/transfer.ts
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

export interface ScheduledTransfer extends Transfer {
  frequency: "once" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
  endDate?: string
  nextDate: string
}

