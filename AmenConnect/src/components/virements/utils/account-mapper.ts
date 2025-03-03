import type { Compte } from "../../../AuthContext"
import type { Account } from "../types/accounts"

export const mapCompteToAccount = (compte: Compte): Account => {
  return {
    id: compte._id,
    label: `${compte.type} - ${compte.RIB}`,
    value: compte.RIB,
    balance: compte.solde,
    iban: compte.IBAN,
  }
}