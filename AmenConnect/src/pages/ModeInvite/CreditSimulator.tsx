"use client"

import type React from "react"
import { useState } from "react"
import { IonInput, IonButton, IonItem, IonLabel, IonRange } from "@ionic/react"

const CreditSimulator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(10000)
  const [interestRate, setInterestRate] = useState<number>(5)
  const [loanTerm, setLoanTerm] = useState<number>(12)
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null)

  const calculateMonthlyPayment = () => {
    const principal = loanAmount
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm

    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    setMonthlyPayment(payment)
  }

  return (
    <div className="credit-simulator">
      <h2>Simulateur de Crédit</h2>
      <IonItem>
        <IonLabel position="floating">Montant du prêt (TND)</IonLabel>
        <IonInput type="number" value={loanAmount} onIonChange={(e) => setLoanAmount(Number(e.detail.value))} />
      </IonItem>
      <IonItem>
        <IonLabel>Taux d'intérêt annuel (%): {interestRate}%</IonLabel>
        <IonRange
          min={1}
          max={20}
          step={0.1}
          value={interestRate}
          onIonChange={(e) => setInterestRate(Number(e.detail.value))}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Durée du prêt (mois): {loanTerm}</IonLabel>
        <IonRange
          min={6}
          max={360}
          step={6}
          value={loanTerm}
          onIonChange={(e) => setLoanTerm(Number(e.detail.value))}
        />
      </IonItem>
      <IonButton expand="block" onClick={calculateMonthlyPayment}>
        Calculer
      </IonButton>
      {monthlyPayment !== null && <p className="result">Paiement mensuel estimé: {monthlyPayment.toFixed(2)} TND</p>}
    </div>
  )
}

export default CreditSimulator

