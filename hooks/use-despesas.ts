"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/auth-provider"

export interface Despesa {
  id: string
  user_id: string
  descricao: string
  tipo: string
  categoria: string
  data: string
  valor: number
  created_at: string
}

export function useDespesas() {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const { data, error, isLoading, mutate } = useSWR(
    userId ? ["despesas", userId] : null,
    async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("despesas")
        .select("*")
        .order("data", { ascending: false })
      if (error) throw error
      return (data ?? []) as Despesa[]
    },
  )

  const total = (data ?? []).reduce((sum, d) => sum + Number(d.valor || 0), 0)

  return {
    despesas: data ?? [],
    total,
    isLoading,
    error,
    mutate,
    userId,
  }
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
