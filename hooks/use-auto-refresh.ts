"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const REFRESH_INTERVAL_MS = 180000 // 3 minutos

interface UseAutoRefreshOptions {
  /** Função chamada a cada ciclo e ao forçar refresh. Deve retornar uma promise. */
  onRefresh: () => Promise<unknown> | unknown
  /** Habilita o ciclo automático */
  enabled?: boolean
  intervalMs?: number
}

export function useAutoRefresh({ onRefresh, enabled = true, intervalMs = REFRESH_INTERVAL_MS }: UseAutoRefreshOptions) {
  const [secondsLeft, setSecondsLeft] = useState(Math.floor(intervalMs / 1000))
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<number>(() => Date.now())
  const onRefreshRef = useRef(onRefresh)
  onRefreshRef.current = onRefresh

  const run = useCallback(async () => {
    setRefreshing(true)
    try {
      await onRefreshRef.current()
    } finally {
      setRefreshing(false)
      setLastRefreshed(Date.now())
      setSecondsLeft(Math.floor(intervalMs / 1000))
    }
  }, [intervalMs])

  // Countdown tick
  useEffect(() => {
    if (!enabled) return
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // dispara refresh e reinicia
          void run()
          return Math.floor(intervalMs / 1000)
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [enabled, intervalMs, run])

  const refreshNow = useCallback(() => {
    void run()
  }, [run])

  return { secondsLeft, refreshing, lastRefreshed, refreshNow }
}

/** Formata segundos restantes como M:SS */
export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

/** Rótulo relativo "há X" baseado no timestamp do último refresh */
export function formatLastRefreshed(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000)
  if (diffSec < 10) return "Atualizado agora mesmo"
  if (diffSec < 60) return `Atualizado há ${diffSec}s`
  const min = Math.floor(diffSec / 60)
  return `Atualizado há ${min} min`
}
