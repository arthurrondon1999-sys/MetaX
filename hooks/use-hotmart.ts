"use client"

import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
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
