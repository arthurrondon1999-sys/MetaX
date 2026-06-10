"use client"

import type { ReactNode } from "react"
import { CurrencyProvider, type Currency } from "@/lib/currency/currency-context"
import { useMetaStatus } from "@/hooks/use-meta"

/**
 * Detecta a moeda a partir da conta de anúncios ativa do Meta
 * e injeta no CurrencyProvider como padrão inicial.
 */
export function CurrencyBootstrap({ children }: { children: ReactNode }) {
  const { status } = useMetaStatus()
  const accounts = status?.accounts ?? []
  const active = accounts.find((a) => a.account_id === status?.accountId) ?? accounts[0]
  const detected = (active?.currency as Currency | undefined) ?? null
  const normalized: Currency | null = detected === "USD" || detected === "BRL" ? detected : null

  return <CurrencyProvider detected={normalized}>{children}</CurrencyProvider>
}
