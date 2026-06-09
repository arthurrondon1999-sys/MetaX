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

export type MetaStatus = {
  connected: boolean
  tokenValid?: boolean
  accountId?: string | null
  updatedAt?: string
  error?: string
  accounts?: { id: string; account_id: string; name: string; currency?: string }[]
}

export function useMetaStatus() {
  const { data, error, isLoading, mutate } = useSWR<MetaStatus>("/api/meta/status", fetcher, {
    revalidateOnFocus: false,
  })
  return { status: data, error, isLoading, mutate }
}

export function useMetaCampaigns(datePreset = "last_30d", enabled = true) {
  const { data, error, isLoading, mutate } = useSWR(
    enabled ? `/api/meta/campaigns?date_preset=${datePreset}` : null,
    fetcher,
    { revalidateOnFocus: false },
  )
  return {
    campaigns: data?.campaigns ?? [],
    accountId: data?.accountId ?? null,
    error,
    isLoading,
    mutate,
  }
}

export function useMetaSummary(datePreset = "last_30d", enabled = true) {
  const { data, error, isLoading, mutate } = useSWR(
    enabled ? `/api/meta/summary?date_preset=${datePreset}` : null,
    fetcher,
    { revalidateOnFocus: false },
  )
  return { summary: data?.summary ?? null, error, isLoading, mutate }
}
