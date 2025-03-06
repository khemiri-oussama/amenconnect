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
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
} from "@ionic/react"
import { swapHorizontalOutline, refreshOutline } from "ionicons/icons"

interface ExchangeRates {
  rates: {
    [key: string]: number
  }
  base_code: string
  time_last_update_utc: string
}

const CURRENCIES = [
  { code: "EUR", name: "Euro" },
  { code: "USD", name: "Dollar américain" },
  { code: "CAD", name: "Dollar canadien" },
  { code: "DZD", name: "Dinar algérien" },
]

const CurrencyExchange: React.FC = () => {
  const [amount, setAmount] = useState<number>(1)
  const [fromCurrency, setFromCurrency] = useState<string>("TND")
  const [toCurrency, setToCurrency] = useState<string>("EUR")
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<number | null>(null)

  const fetchExchangeRates = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/TND")
      if (!response.ok) {
        throw new Error("Impossible de récupérer les taux de change")
      }
      const data = await response.json()
      setExchangeRates(data)
      setLoading(false)
    } catch (err) {
      setError("Une erreur est survenue lors de la récupération des taux de change")
      setLoading(false)
      console.error(err)
    }
  }

  useEffect(() => {
    fetchExchangeRates()
  }, [])

  useEffect(() => {
    if (exchangeRates && fromCurrency && toCurrency) {
      calculateExchange()
    }
  }, [fromCurrency, toCurrency, exchangeRates])

  const calculateExchange = () => {
    if (!exchangeRates || !amount) return

    let calculatedResult: number

    if (fromCurrency === "TND") {
      calculatedResult = amount * (exchangeRates.rates[toCurrency] || 0)
    } else if (toCurrency === "TND") {
      calculatedResult = amount / (exchangeRates.rates[fromCurrency] || 1)
    } else {
      const fromRate = exchangeRates.rates[fromCurrency] || 1
      const toRate = exchangeRates.rates[toCurrency] || 1
      calculatedResult = (amount / fromRate) * toRate
    }

    setResult(calculatedResult)
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Convertisseur de devises</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {loading ? (
          <div className="ion-text-center">
            <IonSpinner name="crescent" />
            <p>Chargement des taux de change...</p>
          </div>
        ) : error ? (
          <p className="ion-text-center ion-color-danger">{error}</p>
        ) : (
          <>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Montant</IonLabel>
                    <IonInput
                      type="number"
                      value={amount}
                      onIonChange={(e) => setAmount(Number.parseFloat(e.detail.value!) || 0)}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">De</IonLabel>
                    <IonSelect value={fromCurrency} onIonChange={(e) => setFromCurrency(e.detail.value)}>
                      <IonSelectOption value="TND">Dinar Tunisien (TND)</IonSelectOption>
                      {CURRENCIES.map((currency) => (
                        <IonSelectOption key={currency.code} value={currency.code}>
                          {currency.name} ({currency.code})
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </IonCol>
                <IonCol size="auto" className="ion-align-self-end">
                  <IonButton fill="clear" onClick={swapCurrencies}>
                    <IonIcon icon={swapHorizontalOutline} />
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Vers</IonLabel>
                    <IonSelect value={toCurrency} onIonChange={(e) => setToCurrency(e.detail.value)}>
                      <IonSelectOption value="TND">Dinar Tunisien (TND)</IonSelectOption>
                      {CURRENCIES.map((currency) => (
                        <IonSelectOption key={currency.code} value={currency.code}>
                          {currency.name} ({currency.code})
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
            <div className="ion-text-center ion-margin-top">
              <h2>{result !== null ? formatCurrency(result, toCurrency) : "—"}</h2>
              <p>
                {amount} {fromCurrency} = {result !== null ? formatCurrency(result, toCurrency) : "—"}
              </p>
            </div>
            <IonButton expand="block" onClick={fetchExchangeRates}>
              <IonIcon icon={refreshOutline} slot="start" />
              Actualiser les taux
            </IonButton>
          </>
        )}
      </IonCardContent>
    </IonCard>
  )
}

export default CurrencyExchange

