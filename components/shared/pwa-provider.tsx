"use client"

import { useEffect, useState } from "react"
import { WifiOff } from "lucide-react"

export function PwaProvider() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    // Registra o service worker
    if ("serviceWorker" in navigator) {
      const onLoad = () => {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
          console.log("[v0] Falha ao registrar service worker:", err)
        })
      }
      window.addEventListener("load", onLoad)
      return () => window.removeEventListener("load", onLoad)
    }
  }, [])

  useEffect(() => {
    // Monitora o estado da conexão
    const update = () => setOffline(!navigator.onLine)
    update()
    window.addEventListener("online", update)
    window.addEventListener("offline", update)
    return () => {
      window.removeEventListener("online", update)
      window.removeEventListener("offline", update)
    }
  }, [])

  if (!offline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[100] flex items-center justify-center gap-2 bg-[#F59E0B] px-4 py-2 text-center text-sm font-medium text-[#0B0F1A]"
      style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
    >
      <WifiOff className="h-4 w-4" />
      Você está offline — exibindo dados em cache
    </div>
  )
}
