"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonRange,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react"

const CreditSimulator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(50000)
  const [loanTerm, setLoanTerm] = useState(5)
  const [interestRate, setInterestRate] = useState(7.5)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [loanType, setLoanType] = useState("personal")

  const loanTypes = {
    personal: { rate: 7.5, maxAmount: 100000, maxTerm: 10 },
    home: { rate: 5.9, maxAmount: 500000, maxTerm: 30 },
    car: { rate: 6.5, maxAmount: 100000, maxTerm: 7 },
    business: { rate: 8.2, maxAmount: 300000, maxTerm: 15 },
  }

  useEffect(() => {
    calculateLoan()
  }, [])

  const calculateLoan = () => {
    const monthlyRate = interestRate / 100 / 12
    const termMonths = loanTerm * 12

    if (monthlyRate === 0) {
      setMonthlyPayment(loanAmount / termMonths)
    } else {
      const x = Math.pow(1 + monthlyRate, termMonths)
      setMonthlyPayment((loanAmount * monthlyRate * x) / (x - 1))
    }

    const calculatedTotalPayment = monthlyPayment * termMonths
    setTotalPayment(calculatedTotalPayment)
    setTotalInterest(calculatedTotalPayment - loanAmount)
  }

  const handleLoanTypeChange = (type: string) => {
    setLoanType(type)
    setInterestRate(loanTypes[type as keyof typeof loanTypes].rate)
    setLoanAmount(Math.min(loanAmount, loanTypes[type as keyof typeof loanTypes].maxAmount))
    setLoanTerm(Math.min(loanTerm, loanTypes[type as keyof typeof loanTypes].maxTerm))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND" }).format(value)
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Simulateur de crédit</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonSegment value={loanType} onIonChange={(e) => handleLoanTypeChange(e.detail.value!)}>
          <IonSegmentButton value="personal">
            <IonLabel>Personnel</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="home">
            <IonLabel>Immobilier</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="car">
            <IonLabel>Auto</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="business">
            <IonLabel>Professionnel</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <IonItem>
          <IonLabel position="stacked">Montant du prêt</IonLabel>
          <IonRange
            min={1000}
            max={loanTypes[loanType as keyof typeof loanTypes].maxAmount}
            step={1000}
            value={loanAmount}
            onIonChange={(e) => setLoanAmount(e.detail.value as number)}
          />
          <IonInput
            type="number"
            value={loanAmount}
            onIonChange={(e) => setLoanAmount(Number.parseInt(e.detail.value!, 10))}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Durée (années)</IonLabel>
          <IonRange
            min={1}
            max={loanTypes[loanType as keyof typeof loanTypes].maxTerm}
            step={1}
            value={loanTerm}
            onIonChange={(e) => setLoanTerm(e.detail.value as number)}
          />
          <IonInput
            type="number"
            value={loanTerm}
            onIonChange={(e) => setLoanTerm(Number.parseInt(e.detail.value!, 10))}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Taux d'intérêt (%)</IonLabel>
          <IonInput
            type="number"
            value={interestRate}
            onIonChange={(e) => setInterestRate(Number.parseFloat(e.detail.value!))}
          />
        </IonItem>

        <IonGrid>
          <IonRow>
            <IonCol>
              <h2>Mensualité estimée</h2>
              <p>{formatCurrency(monthlyPayment)}</p>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <h3>Montant total</h3>
              <p>{formatCurrency(totalPayment)}</p>
            </IonCol>
            <IonCol>
              <h3>Total des intérêts</h3>
              <p>{formatCurrency(totalInterest)}</p>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonButton expand="block" onClick={calculateLoan}>
          Calculer
        </IonButton>
      </IonCardContent>
    </IonCard>
  )
}

export default CreditSimulator

