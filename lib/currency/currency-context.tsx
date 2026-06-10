"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"

export type Currency = "USD" | "BRL"

interface CurrencyContextValue {
  currency: Currency
  setCurrency: (c: Currency) => void
  /** Taxa de câmbio USD -> BRL atualmente em uso (ex.: 5.87) */
  rate: number
  /** Format a monetary value (in USD) in the active currency, convertendo se necessário */
  formatMoney: (value: number) => string
  /** Converte um valor em USD para a moeda ativa (sem formatar) */
  convert: (valueUsd: number) => number
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

const STORAGE_KEY = "metax:currency"
const RATE_STORAGE_KEY = "metax:usdbrl-rate"
const RATE_TTL_MS = 60 * 60 * 1000 // 1 hora
const FALLBACK_RATE = 5.0

function buildFormatter(currency: Currency) {
  const locale = currency === "USD" ? "en-US" : "pt-BR"
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

type CachedRate = { rate: number; ts: number }

function readCachedRate(): CachedRate | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(RATE_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CachedRate
    if (typeof parsed.rate === "number" && typeof parsed.ts === "number") return parsed
  } catch {
    // ignore
  }
  return null
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
  const [rate, setRate] = useState<number>(FALLBACK_RATE)

  // Load saved preference on mount
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null
    if (saved === "USD" || saved === "BRL") {
      setCurrencyState(saved)
      setUserSet(true)
    }
    // Hidrata a taxa em cache imediatamente (mesmo se expirada, melhor que o fallback)
    const cached = readCachedRate()
    if (cached) setRate(cached.rate)
  }, [])

  // Apply detected currency only if the user hasn't explicitly chosen one
  useEffect(() => {
    if (!userSet && (detected === "USD" || detected === "BRL")) {
      setCurrencyState(detected)
    }
  }, [detected, userSet])

  // Busca a taxa USD/BRL em tempo real, com cache de 1h no localStorage
  useEffect(() => {
    const cached = readCachedRate()
    const fresh = cached && Date.now() - cached.ts < RATE_TTL_MS
    if (fresh) {
      setRate(cached.rate)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
        const json = await res.json()
        const brl = Number(json?.rates?.BRL)
        if (!cancelled && brl > 0) {
          setRate(brl)
          if (typeof window !== "undefined") {
            window.localStorage.setItem(RATE_STORAGE_KEY, JSON.stringify({ rate: brl, ts: Date.now() }))
          }
        }
      } catch {
        // mantém o fallback / cache existente
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c)
    setUserSet(true)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, c)
    }
  }, [])

  const convert = useCallback(
    (valueUsd: number) => (currency === "BRL" ? (valueUsd || 0) * rate : valueUsd || 0),
    [currency, rate],
  )

  const formatMoney = useCallback(
    (value: number) => buildFormatter(currency).format(convert(value)),
    [currency, convert],
  )

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rate, formatMoney, convert }}>
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
