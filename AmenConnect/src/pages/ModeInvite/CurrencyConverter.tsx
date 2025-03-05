"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonBadge,
  IonIcon,
  IonSpinner,
  IonChip,
  IonButton,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react"
import { arrowUp, arrowDown, refreshOutline, timeOutline } from "ionicons/icons"
import "./CurrencyConverter.module.css"

interface Currency {
  code: string
  name: string
  rate: number
  flag: string
}

interface ExchangeRateResponse {
  base_code: string
  time_last_update_utc: string
  rates: Record<string, number>
}

// Currency names mapping
const currencyNames: Record<string, string> = {
  TND: "Tunisian Dinar",
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  INR: "Indian Rupee",
  BRL: "Brazilian Real",
  RUB: "Russian Ruble",
  KRW: "South Korean Won",
  SGD: "Singapore Dollar",
  NZD: "New Zealand Dollar",
  MXN: "Mexican Peso",
  HKD: "Hong Kong Dollar",
  TRY: "Turkish Lira",
  ZAR: "South African Rand",
  SEK: "Swedish Krona",
  NOK: "Norwegian Krone",
  DKK: "Danish Krone",
  PLN: "Polish Zloty",
  THB: "Thai Baht",
  IDR: "Indonesian Rupiah",
  HUF: "Hungarian Forint",
  CZK: "Czech Koruna",
  ILS: "Israeli Shekel",
  CLP: "Chilean Peso",
  PHP: "Philippine Peso",
  AED: "UAE Dirham",
  SAR: "Saudi Riyal",
  MAD: "Moroccan Dirham",
  EGP: "Egyptian Pound",
}

// Flag emoji for each currency
const getFlagEmoji = (countryCode: string): string => {
  const flagMapping: Record<string, string> = {
    TND: "🇹🇳",
    USD: "🇺🇸",
    EUR: "🇪🇺",
    GBP: "🇬🇧",
    JPY: "🇯🇵",
    CAD: "🇨🇦",
    AUD: "🇦🇺",
    CHF: "🇨🇭",
    CNY: "🇨🇳",
    INR: "🇮🇳",
    BRL: "🇧🇷",
    RUB: "🇷🇺",
    KRW: "🇰🇷",
    SGD: "🇸🇬",
    NZD: "🇳🇿",
    MXN: "🇲🇽",
    HKD: "🇭🇰",
    TRY: "🇹🇷",
    ZAR: "🇿🇦",
    SEK: "🇸🇪",
    NOK: "🇳🇴",
    DKK: "🇩🇰",
    PLN: "🇵🇱",
    THB: "🇹🇭",
    IDR: "🇮🇩",
    HUF: "🇭🇺",
    CZK: "🇨🇿",
    ILS: "🇮🇱",
    CLP: "🇨🇱",
    PHP: "🇵🇭",
    AED: "🇦🇪",
    SAR: "🇸🇦",
    MAD: "🇲🇦",
    EGP: "🇪🇬",
  }

  return flagMapping[countryCode] || "🏳️"
}

const CurrencyConverter: React.FC = () => {
  const [baseCurrency, setBaseCurrency] = useState<string>("TND")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" }>({
    key: "rate",
    direction: "ascending",
  })
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true)
  const [refreshInterval, setRefreshInterval] = useState<number>(60000) // 1 minute by default

  // Fetch exchange rates
  const fetchExchangeRates = async () => {
    try {
      setLoading(true)
      const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`)

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data: ExchangeRateResponse = await response.json()

      // Format the currencies data
      const formattedCurrencies: Currency[] = Object.entries(data.rates)
        .filter(([code]) => code !== baseCurrency) // Remove base currency from the list
        .map(([code, rate]) => ({
          code,
          name: currencyNames[code] || code,
          rate,
          flag: getFlagEmoji(code),
        }))

      setCurrencies(formattedCurrencies)
      setLastUpdated(new Date().toLocaleTimeString())
      setError(null)
    } catch (err) {
      setError(`Failed to fetch exchange rates: ${err instanceof Error ? err.message : String(err)}`)
      console.error("Error fetching exchange rates:", err)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch and setup auto-refresh
  useEffect(() => {
    fetchExchangeRates()

    // Set up auto-refresh
    let intervalId: NodeJS.Timeout | null = null

    if (autoRefresh) {
      intervalId = setInterval(fetchExchangeRates, refreshInterval)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [autoRefresh, refreshInterval]) //Corrected dependencies

  // Handle manual refresh
  const handleRefresh = (event: CustomEvent) => {
    fetchExchangeRates().then(() => {
      event.detail.complete()
    })
  }

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })
  }

  // Apply sorting and filtering
  const filteredAndSortedCurrencies = useMemo(() => {
    let result = [...currencies]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (currency) => currency.code.toLowerCase().includes(query) || currency.name.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key as keyof Currency] < b[sortConfig.key as keyof Currency]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key as keyof Currency] > b[sortConfig.key as keyof Currency]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })

    return result
  }, [currencies, searchQuery, sortConfig])

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh((prev) => !prev)
  }

  // Change refresh interval
  const changeRefreshInterval = (newInterval: number) => {
    setRefreshInterval(newInterval)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="ion-text-center">
            <span className="title-text">Currency Exchange Rates</span>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="currencyConverter">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="controls-container">
          <div className="base-currency-selector">
            <IonItem lines="none">
              <IonLabel>Base Currency</IonLabel>
              <IonSelect
                value={baseCurrency}
                onIonChange={(e) => setBaseCurrency(e.detail.value)}
                interface="popover"
                className="currency-select"
              >
                {Object.keys(currencyNames).map((code) => (
                  <IonSelectOption key={code} value={code}>
                    {getFlagEmoji(code)} {code} - {currencyNames[code]}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </div>

          <div className="search-container">
            <IonSearchbar
              value={searchQuery}
              onIonChange={(e) => setSearchQuery(e.detail.value || "")}
              placeholder="Search currency..."
              showCancelButton="never"
              animated
              className="currency-search"
            ></IonSearchbar>
          </div>

          <div className="refresh-controls">
            <IonChip
              color={autoRefresh ? "success" : "medium"}
              onClick={toggleAutoRefresh}
              className="auto-refresh-chip"
            >
              <IonIcon icon={refreshOutline} />
              <IonLabel>Auto-refresh: {autoRefresh ? "ON" : "OFF"}</IonLabel>
            </IonChip>

            {autoRefresh && (
              <IonChip color="primary" className="interval-chip">
                <IonIcon icon={timeOutline} />
                <IonLabel>Every {refreshInterval / 1000}s</IonLabel>
                <IonSelect
                  value={refreshInterval}
                  onIonChange={(e) => changeRefreshInterval(e.detail.value)}
                  interface="popover"
                  className="interval-select"
                >
                  <IonSelectOption value={30000}>30s</IonSelectOption>
                  <IonSelectOption value={60000}>1m</IonSelectOption>
                  <IonSelectOption value={300000}>5m</IonSelectOption>
                </IonSelect>
              </IonChip>
            )}

            <IonButton fill="clear" onClick={() => fetchExchangeRates()} className="refresh-button">
              <IonIcon slot="icon-only" icon={refreshOutline} />
            </IonButton>
          </div>
        </div>

        {error && (
          <div className="error-container">
            <IonItem color="danger">
              <IonLabel>{error}</IonLabel>
            </IonItem>
          </div>
        )}

        <div className="last-updated">
          <IonChip color="tertiary">
            <IonIcon icon={timeOutline} />
            <IonLabel>Last updated: {lastUpdated}</IonLabel>
          </IonChip>
        </div>

        {loading && currencies.length === 0 ? (
          <div className="loading-container">
            <IonSpinner name="crescent" />
            <p>Loading exchange rates...</p>
          </div>
        ) : (
          <div className="table-container">
            <IonGrid className="rates-table">
              <IonRow className="table-header">
                <IonCol size="2" className="header-cell" onClick={() => requestSort("code")}>
                  <div className="sort-header">
                    Code
                    {sortConfig.key === "code" && (
                      <IonIcon icon={sortConfig.direction === "ascending" ? arrowUp : arrowDown} />
                    )}
                  </div>
                </IonCol>
                <IonCol size="6" className="header-cell" onClick={() => requestSort("name")}>
                  <div className="sort-header">
                    Currency
                    {sortConfig.key === "name" && (
                      <IonIcon icon={sortConfig.direction === "ascending" ? arrowUp : arrowDown} />
                    )}
                  </div>
                </IonCol>
                <IonCol size="4" className="header-cell" onClick={() => requestSort("rate")}>
                  <div className="sort-header">
                    Rate
                    {sortConfig.key === "rate" && (
                      <IonIcon icon={sortConfig.direction === "ascending" ? arrowUp : arrowDown} />
                    )}
                  </div>
                </IonCol>
              </IonRow>

              {filteredAndSortedCurrencies.length > 0 ? (
                filteredAndSortedCurrencies.map((currency, index) => (
                  <IonRow key={currency.code} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                    <IonCol size="2" className="currency-code">
                      <div className="flag-code">
                        <span className="flag">{currency.flag}</span>
                        <span className="code">{currency.code}</span>
                      </div>
                    </IonCol>
                    <IonCol size="6" className="currency-name">
                      {currency.name}
                    </IonCol>
                    <IonCol size="4" className="currency-rate">
                      <IonBadge color="tertiary" className="rate-badge">
                        {currency.rate.toFixed(4)}
                      </IonBadge>
                    </IonCol>
                  </IonRow>
                ))
              ) : (
                <IonRow>
                  <IonCol size="12" className="no-results">
                    <p>No currencies found matching "{searchQuery}"</p>
                  </IonCol>
                </IonRow>
              )}
            </IonGrid>
          </div>
        )}
      </IonContent>
    </IonPage>
  )
}


export default CurrencyConverter

