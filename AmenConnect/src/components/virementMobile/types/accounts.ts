export interface Account {
  id: string
  name: string
  iban: string
  balance: number
  currency: string
  type: "checking" | "savings" | "credit"
}

