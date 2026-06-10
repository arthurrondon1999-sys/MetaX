"use client"

import { useCallback, useEffect, useState } from "react"
import { ALL_COLUMN_IDS, DEFAULT_VISIBLE_IDS } from "@/lib/meta/columns"

const ORDER_KEY = "metax:meta-columns-order"
const VISIBLE_KEY = "metax:meta-columns-visible"

function readArray(key: string): string[] | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) return parsed
  } catch {
    // ignore
  }
  return null
}

/**
 * Gerencia a ordem e a visibilidade das colunas da tabela de Meta Ads,
 * persistindo as preferências no localStorage.
 */
export function useMetaColumns() {
  const [order, setOrder] = useState<string[]>(ALL_COLUMN_IDS)
  const [visible, setVisible] = useState<string[]>(DEFAULT_VISIBLE_IDS)

  // Hidrata a partir do localStorage no cliente
  useEffect(() => {
    const savedOrder = readArray(ORDER_KEY)
    const savedVisible = readArray(VISIBLE_KEY)

    if (savedOrder) {
      // Mantém apenas ids válidos e acrescenta colunas novas ao final
      const valid = savedOrder.filter((id) => ALL_COLUMN_IDS.includes(id))
      const missing = ALL_COLUMN_IDS.filter((id) => !valid.includes(id))
      setOrder([...valid, ...missing])
    }
    if (savedVisible) {
      setVisible(savedVisible.filter((id) => ALL_COLUMN_IDS.includes(id)))
    }
  }, [])

  const persistOrder = useCallback((next: string[]) => {
    setOrder(next)
    if (typeof window !== "undefined") window.localStorage.setItem(ORDER_KEY, JSON.stringify(next))
  }, [])

  const persistVisible = useCallback((next: string[]) => {
    setVisible(next)
    if (typeof window !== "undefined") window.localStorage.setItem(VISIBLE_KEY, JSON.stringify(next))
  }, [])

  const reset = useCallback(() => {
    persistOrder(ALL_COLUMN_IDS)
    persistVisible(DEFAULT_VISIBLE_IDS)
  }, [persistOrder, persistVisible])

  // Ordem das colunas atualmente visíveis (respeita order + visible)
  const visibleOrdered = order.filter((id) => visible.includes(id))

  return { order, visible, visibleOrdered, setOrder: persistOrder, setVisible: persistVisible, reset }
}
