"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"

export type Currency = "USD" | "BRL"

interface CurrencyContextValue {
  currency: Currency
  setCurrency: (c: Currency) => void
  /** Format a monetary value in the active currency */
  formatMoney: (value: number) => string
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

const STORAGE_KEY = "metax:currency"

function buildFormatter(currency: Currency) {
  const locale = currency === "USD" ? "en-US" : "pt-BR"
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function CurrencyProvider({
  children,
  detected,
}: {
  children: ReactNode
  /** Currency detected from the Meta account, used as initial default */
  detected?: Currency | null
}) {
  const [currency, setCurrencyState] = useState<Currency>("BRL")
  const [userSet, setUserSet] = useState(false)

  // Load saved preference on mount
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null
    if (saved === "USD" || saved === "BRL") {
      setCurrencyState(saved)
      setUserSet(true)
    }
  }, [])

  // Apply detected currency only if the user hasn't explicitly chosen one
  useEffect(() => {
    if (!userSet && (detected === "USD" || detected === "BRL")) {
      setCurrencyState(detected)
    }
  }, [detected, userSet])

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c)
    setUserSet(true)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, c)
    }
  }, [])

  const formatMoney = useCallback(
    (value: number) => buildFormatter(currency).format(value || 0),
    [currency],
  )

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatMoney }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) {
    throw new Error("useCurrency deve ser usado dentro de CurrencyProvider")
  }
  return ctx
}
