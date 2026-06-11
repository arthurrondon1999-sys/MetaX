"use client"

import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.error || "Erro ao carregar dados")
  }
  return json
}

export type HotmartStatus = {
  connected: boolean
  tokenValid?: boolean
  clientId?: string | null
  updatedAt?: string
  error?: string
}

export type HotmartSale = {
  transaction: string
  productName: string
  productId: string
  buyerName: string
  value: number
  currency: string
  commissionValue: number
  status: string
  paymentType: string
  purchaseDate: string | null
}

export function useHotmartStatus() {
  const { data, error, isLoading, mutate } = useSWR<HotmartStatus>("/api/hotmart/status", fetcher, {
    revalidateOnFocus: false,
  })
  return { status: data, error, isLoading, mutate }
}

export function useHotmartSales(datePreset = "last_30d", enabled = true) {
  const { data, error, isLoading, mutate } = useSWR(
    enabled ? `/api/hotmart/sales?date_preset=${datePreset}` : null,
    fetcher,
    { revalidateOnFocus: false },
  )
  return {
    sales: (data?.sales ?? []) as HotmartSale[],
    error,
    isLoading,
    mutate,
  }
}

export type ApprovalRate = { method: string; approved: number; total: number; rate: number }

export type CombinedSummary = {
  spend: number
  iof: number
  revenue: number
  profit: number
  sales: number
  roas: number
  roi: number
  cpa: number
  averageTicket: number
  margin: number
  refunds: number
  approvalRates: ApprovalRate[]
}

export type SummarySources = {
  meta: { connected: boolean; error?: string }
  hotmart: { connected: boolean; error?: string; hasData?: boolean }
}

/** Resumo combinado Meta (gastos) + Hotmart (faturamento/vendas). */
export function useCombinedSummary(datePreset = "last_30d") {
  const { data, error, isLoading, mutate } = useSWR<{ summary: CombinedSummary; sources: SummarySources }>(
    `/api/summary?date_preset=${datePreset}`,
    fetcher,
    { revalidateOnFocus: false },
  )
  return {
    summary: data?.summary,
    sources: data?.sources,
    error,
    isLoading,
    mutate,
  }
}

export type DailyReportRow = {
  date: string
  sales: number
  spend: number
  revenue: number
  profit: number
  roas: number
  roi: number
  cpa: number
  averageTicket: number
  margin: number
  refunds: number
}

/** Relatório diário combinado. */
export function useDailyReport(datePreset = "last_7d") {
  const { data, error, isLoading, mutate } = useSWR<{ rows: DailyReportRow[]; sources: SummarySources }>(
    `/api/report/daily?date_preset=${datePreset}`,
    fetcher,
    { revalidateOnFocus: false },
  )
  return {
    rows: data?.rows ?? [],
    sources: data?.sources,
    error,
    isLoading,
    mutate,
  }
}
