"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  useIonToast,
} from "@ionic/react"

interface Currency {
  code: string
  name: string
}

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
]

const CurrencyExchange: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("EUR")
  const [amount, setAmount] = useState<string>("")
  const [result, setResult] = useState<number | null>(null)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [present] = useIonToast()

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchExchangeRate(fromCurrency, toCurrency)
    }
  }, [fromCurrency, toCurrency])

  const fetchExchangeRate = async (from: string, to: string) => {
    try {
      const response = await fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`)
      const data = await response.json()

      if (data.rates && data.rates[to]) {
        setExchangeRate(data.rates[to])
      } else {
        setExchangeRate(null)
        present({
          message: "Failed to fetch exchange rate.",
          duration: 2000,
          position: "top",
        })
      }
    } catch (error) {
      console.error("Error fetching exchange rate:", error)
      setExchangeRate(null)
      present({
        message: "Error fetching exchange rate.",
        duration: 2000,
        position: "top",
      })
    }
  }

  const convertCurrency = () => {
    if (!amount) {
      present({
        message: "Please enter an amount to convert.",
        duration: 2000,
        position: "top",
      })
      return
    }

    const amountValue = Number.parseFloat(amount)

    if (isNaN(amountValue)) {
      present({
        message: "Please enter a valid number for the amount.",
        duration: 2000,
        position: "top",
      })
      return
    }

    if (exchangeRate) {
      setResult(amountValue * exchangeRate)
    } else {
      present({
        message: "Exchange rate not available. Please try again later.",
        duration: 2000,
        position: "top",
      })
    }
  }

  return (
    <IonCard className="kiosk-component-card">
      <IonCardHeader>
        <IonCardTitle>Convertisseur de devises</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonItem>
                <IonLabel position="floating">De</IonLabel>
                <IonSelect value={fromCurrency} onIonChange={(e) => setFromCurrency(e.detail.value)}>
                  {currencies.map((currency) => (
                    <IonSelectOption key={currency.code} value={currency.code}>
                      {currency.name} ({currency.code})
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCol>
            <IonCol size="6">
              <IonItem>
                <IonLabel position="floating">À</IonLabel>
                <IonSelect value={toCurrency} onIonChange={(e) => setToCurrency(e.detail.value)}>
                  {currencies.map((currency) => (
                    <IonSelectOption key={currency.code} value={currency.code}>
                      {currency.name} ({currency.code})
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Montant</IonLabel>
                <IonInput type="number" value={amount} onIonChange={(e) => setAmount(e.detail.value!)} />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton expand="full" onClick={convertCurrency}>
                Convertir
              </IonButton>
            </IonCol>
          </IonRow>
          {result !== null && (
            <IonRow>
              <IonCol>
                <p>
                  Résultat: {result.toFixed(2)} {toCurrency}
                </p>
                {exchangeRate && (
                  <p>
                    Taux de change: 1 {fromCurrency} = {exchangeRate.toFixed(2)} {toCurrency}
                  </p>
                )}
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonCardContent>
    </IonCard>
  )
}

export default CurrencyExchange

