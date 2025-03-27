"use client"

import type React from "react"
import { useState } from "react"
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
} from "@ionic/react"

const CreditSimulator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number | null>(10000)
  const [interestRate, setInterestRate] = useState<number | null>(5)
  const [loanTerm, setLoanTerm] = useState<number | null>(36)
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null)

  const calculateMonthlyPayment = () => {
    if (loanAmount === null || interestRate === null || loanTerm === null) {
      return
    }

    const monthlyInterestRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm

    const numerator = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1

    const payment = numerator / denominator
    setMonthlyPayment(payment)
  }

  return (
    <IonCard className="kiosk-component-card">
      <IonCardHeader>
        <IonCardTitle>Simulateur de crédit</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Montant du prêt</IonLabel>
            <IonInput
              type="number"
              value={loanAmount !== null ? loanAmount.toString() : ""}
              onIonChange={(e) =>
                setLoanAmount(
                  e.detail.value !== undefined && e.detail.value !== null && e.detail.value !== ""
                    ? Number.parseFloat(e.detail.value)
                    : null,
                )
              }
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Taux d'intérêt annuel (%)</IonLabel>
            <IonInput
              type="number"
              value={interestRate !== null ? interestRate.toString() : ""}
              onIonChange={(e) =>
                setInterestRate(
                  e.detail.value !== undefined && e.detail.value !== null && e.detail.value !== ""
                    ? Number.parseFloat(e.detail.value)
                    : null,
                )
              }
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Durée du prêt (mois)</IonLabel>
            <IonInput
              type="number"
              value={loanTerm !== null ? loanTerm.toString() : ""}
              onIonChange={(e) =>
                setLoanTerm(
                  e.detail.value !== undefined && e.detail.value !== null && e.detail.value !== ""
                    ? Number.parseFloat(e.detail.value)
                    : null,
                )
              }
            />
          </IonItem>
        </IonList>

        <IonButton expand="full" onClick={calculateMonthlyPayment}>
          Calculer
        </IonButton>

        {monthlyPayment !== null && (
          <IonItem>
            <IonLabel>Paiement mensuel estimé: {monthlyPayment.toFixed(2)}</IonLabel>
          </IonItem>
        )}
      </IonCardContent>
    </IonCard>
  )
}

export default CreditSimulator

