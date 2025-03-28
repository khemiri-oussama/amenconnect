"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonChip,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonButton,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonRefresher,
  IonRefresherContent,
  IonToggle,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  useIonToast,
  IonSkeletonText
} from "@ionic/react"
import { 
  refreshOutline, 
  trendingUpOutline, 
  trendingDownOutline, 
  timeOutline,
  moonOutline,
  sunnyOutline,
  swapVerticalOutline,
  arrowUpOutline,
  arrowDownOutline,
  searchOutline,
  closeOutline,
  starOutline,
  star,
  alertCircleOutline
} from 'ionicons/icons'

// Add global styles
const addGlobalStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    :root {
      --color-primary: #6366f1;
      --color-primary-light: #818cf8;
      --color-primary-dark: #4f46e5;
      --color-success: #10b981;
      --color-danger: #ef4444;
      --color-warning: #f59e0b;
      --color-info: #3b82f6;
      --color-background-light: #ffffff;
      --color-background-dark: #1f2937;
      --color-text-light: #1f2937;
      --color-text-dark: #f9fafb;
      --color-border-light: #e5e7eb;
      --color-border-dark: #374151;
      --color-card-light: #ffffff;
      --color-card-dark: #111827;
      --color-muted-light: #9ca3af;
      --color-muted-dark: #6b7280;
      --border-radius: 12px;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --transition: all 0.2s ease;
    }

    body.dark-mode {
      --ion-background-color: var(--color-background-dark);
      --ion-text-color: var(--color-text-dark);
      --ion-border-color: var(--color-border-dark);
      --ion-item-background: var(--color-card-dark);
      --ion-toolbar-background: var(--color-card-dark);
      --ion-card-background: var(--color-card-dark);
    }

    .currency-card {
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: var(--shadow);
      transition: var(--transition);
      margin: 16px;
    }

    .currency-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .currency-row {
      transition: var(--transition);
      border-radius: 8px;
      margin: 8px 0;
    }

    .currency-row:hover {
      background-color: rgba(99, 102, 241, 0.08);
      transform: translateX(4px);
    }

    .currency-flag {
      font-size: 24px;
      margin-right: 12px;
    }

    .favorite-star {
      transition: var(--transition);
    }

    .favorite-star:hover {
      transform: scale(1.2);
    }

    .currency-badge {
      border-radius: 6px;
      font-weight: 500;
      padding: 4px 8px;
    }

    .pulse-animation {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .spin-icon {
      animation: spin 1s linear infinite;
    }

    .fade-in {
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .search-container {
      position: relative;
      margin: 16px;
    }

    .search-icon {
      position: absolute;
      top: 50%;
      left: 16px;
      transform: translateY(-50%);
      color: var(--color-muted-light);
      z-index: 10;
    }

    .search-input {
      padding-left: 40px !important;
      border-radius: 20px;
      background: rgba(99, 102, 241, 0.05);
      transition: var(--transition);
    }

    .search-input:focus {
      background: rgba(99, 102, 241, 0.1);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
    }

    .header-container {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: white;
      padding: 24px;
      border-radius: var(--border-radius) var(--border-radius) 0 0;
    }

    .segment-container {
      margin: 16px;
      --background: rgba(99, 102, 241, 0.1);
      border-radius: 20px;
      overflow: hidden;
    }

    .theme-toggle {
      --background: rgba(255, 255, 255, 0.2);
      --background-checked: rgba(0, 0, 0, 0.3);
      --handle-background: white;
      --handle-background-checked: white;
    }

    .rate-change-positive {
      color: var(--color-success);
      font-weight: 500;
    }

    .rate-change-negative {
      color: var(--color-danger);
      font-weight: 500;
    }

    .skeleton-row {
      display: flex;
      align-items: center;
      padding: 16px;
      margin: 8px 0;
      border-radius: 8px;
      background: rgba(99, 102, 241, 0.05);
    }

    @media (max-width: 768px) {
      .currency-name {
        display: none;
      }
      
      .currency-card {
        margin: 12px;
      }
      
      .header-container {
        padding: 16px;
      }
    }
  `;
  document.head.appendChild(style);
};

interface Currency {
  code: string
  name: string
  flag: string
  symbol: string
}

interface ExchangeRate {
  code: string
  rate: number
  previousRate: number | null
  change: number | null
  changePercent: number | null
}

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", symbol: "$" },
  { code: "EUR", name: "Euro", flag: "🇪🇺", symbol: "€" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", symbol: "¥" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦", symbol: "﷼" },
  { code: "MAD", name: "Moroccan Dirham", flag: "🇲🇦", symbol: "د.م." },
  { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬", symbol: "E£" },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷", symbol: "₺" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰", symbol: "HK$" }
]

// Generate realistic mock exchange rates against TND
const generateMockRates = (): ExchangeRate[] => {
  // Base rates against TND (approximate real-world values)
  const baseRates: Record<string, number> = {
    "USD": 0.32, // 1 TND ≈ 0.32 USD
    "EUR": 0.29, // 1 TND ≈ 0.29 EUR
    "GBP": 0.25, // 1 TND ≈ 0.25 GBP
    "JPY": 48.5, // 1 TND ≈ 48.5 JPY
    "CAD": 0.44, // 1 TND ≈ 0.44 CAD
    "AUD": 0.49, // 1 TND ≈ 0.49 AUD
    "CHF": 0.28, // 1 TND ≈ 0.28 CHF
    "CNY": 2.32, // 1 TND ≈ 2.32 CNY
    "AED": 1.18, // 1 TND ≈ 1.18 AED
    "SAR": 1.20, // 1 TND ≈ 1.20 SAR
    "MAD": 3.20, // 1 TND ≈ 3.20 MAD
    "EGP": 9.90, // 1 TND ≈ 9.90 EGP
    "TRY": 10.3, // 1 TND ≈ 10.3 TRY
    "SGD": 0.43, // 1 TND ≈ 0.43 SGD
    "HKD": 2.50  // 1 TND ≈ 2.50 HKD
  };
  
  return currencies.map(currency => {
    // Get base rate or use a random value if not defined
    const baseRate = baseRates[currency.code] || (Math.random() * 3 + 0.2);
    
    // Add small random variation (±2%)
    const variation = (Math.random() * 0.04) - 0.02;
    const rate = baseRate * (1 + variation);
    
    // Generate a previous rate with a small difference
    const previousVariation = (Math.random() * 0.03) - 0.015;
    const previousRate = baseRate * (1 + previousVariation);
    
    // Calculate change
    const change = rate - previousRate;
    const changePercent = (change / previousRate) * 100;
    
    return {
      code: currency.code,
      rate,
      previousRate,
      change,
      changePercent
    };
  });
};

const CurrencyExchange: React.FC = () => {
  const [rates, setRates] = useState<ExchangeRate[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [viewMode, setViewMode] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("code")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [favorites, setFavorites] = useState<string[]>(["USD", "EUR", "GBP"])
  const [usingMockData, setUsingMockData] = useState<boolean>(false)
  const [present] = useIonToast()
  const searchInputRef = useRef<HTMLIonSearchbarElement>(null)

  // Add the global styles when component mounts
  useEffect(() => {
    addGlobalStyles();
    
    // Check for user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    if (prefersDark) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const fetchExchangeRates = async () => {
    setRefreshing(true)
    try {
      // Try a different free API that doesn't require an API key
      const response = await fetch('https://open.er-api.com/v6/latest/TND');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.rates) {
        // Transform rates into our format
        const newRates = Object.entries(data.rates).map(([code, rate]) => {
          // Only process currencies we have in our list
          if (!currencies.some(c => c.code === code)) {
            return null;
          }
          
          // Find the previous rate for this currency
          const existingRate = rates.find(r => r.code === code)
          const currentRate = Number(rate)
          
          // Calculate change and percent change
          let change = null
          let changePercent = null
          
          if (existingRate && existingRate.previousRate !== null) {
            change = currentRate - existingRate.previousRate
            changePercent = (change / existingRate.previousRate) * 100
          }
          
          return {
            code,
            rate: currentRate,
            previousRate: existingRate ? existingRate.rate : null,
            change,
            changePercent
          }
        }).filter(Boolean) as ExchangeRate[];
        
        setRates(newRates)
        setUsingMockData(false)
        const now = new Date()
        setLastUpdated(now.toLocaleTimeString() + ' ' + now.toLocaleDateString())
      } else {
        throw new Error("Failed to fetch exchange rates")
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error)
      
      // Use mock data
      const mockRates = generateMockRates();
      setRates(mockRates);
      setUsingMockData(true);
      
      const now = new Date()
      setLastUpdated(now.toLocaleTimeString() + ' ' + now.toLocaleDateString() + ' (Demo Data)');
      
      present({
        message: "Using demo exchange rates. Real-time data unavailable.",
        duration: 3000,
        position: "top",
        color: "warning"
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchExchangeRates()
    
    // Set up interval to refresh rates every minute
    const interval = setInterval(fetchExchangeRates, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = (event?: CustomEvent) => {
    fetchExchangeRates()
    
    if (!usingMockData) {
      present({
        message: "Exchange rates updated",
        duration: 1500,
        position: "top",
        color: "success"
      })
    }
    
    if (event) {
      event.detail.complete()
    }
  }

  const toggleFavorite = (code: string) => {
    if (favorites.includes(code)) {
      setFavorites(favorites.filter(c => c !== code))
    } else {
      setFavorites([...favorites, code])
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new sort column and default to ascending
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    if (searchInputRef.current) {
      searchInputRef.current.value = ""
    }
  }

  const getChangeColor = (change: number | null) => {
    if (change === null) return ""
    return change > 0 ? "success" : change < 0 ? "danger" : ""
  }

  const formatChange = (change: number | null) => {
    if (change === null) return "-"
    const prefix = change > 0 ? "+" : ""
    return `${prefix}${change.toFixed(6)}`
  }

  const formatChangePercent = (changePercent: number | null) => {
    if (changePercent === null) return "-"
    const prefix = changePercent > 0 ? "+" : ""
    return `${prefix}${changePercent.toFixed(2)}%`
  }

  // Filter and sort the rates
  const filteredRates = rates.filter(rate => {
    const currency = currencies.find(c => c.code === rate.code)
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return rate.code.toLowerCase().includes(query) || 
             currency?.name.toLowerCase().includes(query)
    }
    
    // Filter by view mode
    if (viewMode === "favorites") {
      return favorites.includes(rate.code)
    }
    
    return true
  }).sort((a, b) => {
    const currencyA = currencies.find(c => c.code === a.code)
    const currencyB = currencies.find(c => c.code === b.code)
    
    if (sortBy === "code") {
      return sortDirection === "asc" 
        ? a.code.localeCompare(b.code) 
        : b.code.localeCompare(a.code)
    } else if (sortBy === "name") {
      return sortDirection === "asc" 
        ? (currencyA?.name || "").localeCompare(currencyB?.name || "") 
        : (currencyB?.name || "").localeCompare(currencyA?.name || "")
    } else if (sortBy === "rate") {
      return sortDirection === "asc" 
        ? a.rate - b.rate 
        : b.rate - a.rate
    } else if (sortBy === "change") {
      const changeA = a.changePercent || 0
      const changeB = b.changePercent || 0
      return sortDirection === "asc" 
        ? changeA - changeB 
        : changeB - changeA
    }
    
    return 0
  })

  // Render skeleton loaders
  const renderSkeletons = () => {
    return Array(8).fill(0).map((_, index) => (
      <div className="skeleton-row" key={index}>
        <div style={{ width: '40px', marginRight: '12px' }}>
          <IonSkeletonText animated style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
        </div>
        <div style={{ flex: 2 }}>
          <IonSkeletonText animated style={{ width: '80px', height: '20px' }} />
          <IonSkeletonText animated style={{ width: '120px', height: '16px' }} />
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <IonSkeletonText animated style={{ width: '60px', height: '20px', marginLeft: 'auto' }} />
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <IonSkeletonText animated style={{ width: '70px', height: '20px', marginLeft: 'auto' }} />
        </div>
      </div>
    ))
  }

  return (
    <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      
      <IonHeader className="ion-no-border">
        <IonToolbar className="header-container">
          <IonTitle size="large">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>Currency Exchange</h1>
                <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: '0.8' }}>
                  Live rates against Tunisian Dinar (TND)
                </p>
              </div>
              <IonToggle
                checked={darkMode}
                onIonChange={e => setDarkMode(e.detail.checked)}
                className="theme-toggle"
              >
                <IonIcon slot="start" icon={sunnyOutline} />
                <IonIcon slot="end" icon={moonOutline} />
              </IonToggle>
            </div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleRefresh} disabled={refreshing}>
              <IonIcon icon={refreshOutline} className={refreshing ? "spin-icon" : ""} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      {usingMockData && (
        <div style={{ 
          background: 'rgba(245, 158, 11, 0.1)', 
          padding: '8px 16px', 
          margin: '0 16px', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <IonIcon icon={alertCircleOutline} color="warning" />
          <p style={{ margin: '0', fontSize: '14px', color: 'var(--color-warning)' }}>
            Using demo data. Real-time exchange rates unavailable.
          </p>
        </div>
      )}
      
      <div className="search-container">
        <IonIcon icon={searchOutline} className="search-icon" />
        <IonSearchbar
          ref={searchInputRef}
          value={searchQuery}
          onIonChange={e => setSearchQuery(e.detail.value || "")}
          placeholder="Search currency..."
          className="search-input"
          showCancelButton="never"
          animated={true}
        />
        {searchQuery && (
          <IonButton 
            fill="clear" 
            size="small" 
            onClick={clearSearch}
            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
          >
            <IonIcon icon={closeOutline} />
          </IonButton>
        )}
      </div>
      
      <IonSegment 
        value={viewMode} 
        onIonChange={e => setViewMode(e.detail.value || "all")}
        className="segment-container"
      >
        <IonSegmentButton value="all">
          <IonLabel>All Currencies</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="favorites">
          <IonLabel>Favorites</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      
      <div style={{ padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IonChip outline color="medium">
          <IonIcon icon={timeOutline} />
          <IonLabel>Updated: {lastUpdated || "Loading..."}</IonLabel>
        </IonChip>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <IonButton 
            size="small" 
            fill="clear" 
            onClick={() => handleSort("code")}
            color={sortBy === "code" ? "primary" : "medium"}
          >
            Code
            {sortBy === "code" && (
              <IonIcon 
                icon={sortDirection === "asc" ? arrowUpOutline : arrowDownOutline} 
                slot="end"
              />
            )}
          </IonButton>
          
          <IonButton 
            size="small" 
            fill="clear" 
            onClick={() => handleSort("rate")}
            color={sortBy === "rate" ? "primary" : "medium"}
          >
            Rate
            {sortBy === "rate" && (
              <IonIcon 
                icon={sortDirection === "asc" ? arrowUpOutline : arrowDownOutline} 
                slot="end"
              />
            )}
          </IonButton>
          
          <IonButton 
            size="small" 
            fill="clear" 
            onClick={() => handleSort("change")}
            color={sortBy === "change" ? "primary" : "medium"}
          >
            Change
            {sortBy === "change" && (
              <IonIcon 
                icon={sortDirection === "asc" ? arrowUpOutline : arrowDownOutline} 
                slot="end"
              />
            )}
          </IonButton>
        </div>
      </div>
      
      <IonCard className="currency-card fade-in">
        <IonCardContent style={{ padding: '0' }}>
          {loading && rates.length === 0 ? (
            renderSkeletons()
          ) : filteredRates.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <p>No currencies found matching your search.</p>
              <IonButton size="small" fill="clear" onClick={clearSearch}>
                Clear Search
              </IonButton>
            </div>
          ) : (
            filteredRates.map((rate) => {
              const currency = currencies.find(c => c.code === rate.code)
              const changeColor = getChangeColor(rate.change)
              const isFavorite = favorites.includes(rate.code)
              
              return (
                <div 
                  key={rate.code} 
                  className="currency-row"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '16px', 
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 2 }}>
                    <IonButton 
                      fill="clear" 
                      size="small" 
                      onClick={() => toggleFavorite(rate.code)}
                      className="favorite-star"
                    >
                      <IonIcon 
                        icon={isFavorite ? star : starOutline} 
                        color={isFavorite ? "warning" : "medium"} 
                      />
                    </IonButton>
                    
                    <span className="currency-flag">{currency?.flag || ''}</span>
                    
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{rate.code}</div>
                      <div className="currency-name" style={{ fontSize: '12px', color: 'var(--color-muted-light)' }}>
                        {currency?.name || ''}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      <span style={{ opacity: 0.7, marginRight: '4px', fontSize: '14px' }}>
                        {currency?.symbol}
                      </span>
                      {rate.rate.toFixed(4)}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted-light)' }}>
                      1 TND
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <div 
                      className={changeColor ? `rate-change-${changeColor === 'success' ? 'positive' : 'negative'}` : ''}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                    >
                      {rate.change !== null && (
                        <IonIcon 
                          icon={rate.change > 0 ? trendingUpOutline : trendingDownOutline} 
                          color={changeColor || undefined}
                          style={{ marginRight: '4px' }}
                        />
                      )}
                      
                      <IonBadge 
                        color={changeColor || "medium"} 
                        className="currency-badge"
                      >
                        {formatChangePercent(rate.changePercent)}
                      </IonBadge>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </IonCardContent>
      </IonCard>
      
      <div style={{ textAlign: 'center', padding: '16px', color: 'var(--color-muted-light)', fontSize: '12px' }}>
        <p>Pull down to refresh or tap the refresh button</p>
        <p>Data provided by Exchange Rate API</p>
        {usingMockData && (
          <p>Currently showing demo data. Real-time data unavailable.</p>
        )}
      </div>
    </IonContent>
  )
}

export default CurrencyExchange