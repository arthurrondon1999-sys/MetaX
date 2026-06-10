"use client"

import { motion } from "framer-motion"
import { Bell, RefreshCw } from "lucide-react"
import { useState } from "react"
import type { ReactNode } from "react"
import { CurrencyToggle } from "@/components/shared/currency-toggle"

interface PageHeaderProps {
  title: string
  titleIcon?: ReactNode
  subtitle?: string
  updatedLabel?: string
  /** Texto do countdown, ex: "Próxima atualização: 2:47" */
  countdownLabel?: string
  /** Estado de atualização em andamento */
  refreshing?: boolean
  /** Mostra o seletor de moeda (default: true) */
  showCurrency?: boolean
  /** Extra action buttons rendered to the left of the Atualizar button */
  actions?: ReactNode
  onRefresh?: () => void
}

export function PageHeader({
  title,
  titleIcon,
  subtitle,
  updatedLabel = "Atualizado agora mesmo",
  countdownLabel,
  refreshing = false,
  showCurrency = true,
  actions,
  onRefresh,
}: PageHeaderProps) {
  const [spinning, setSpinning] = useState(false)

  const handleRefresh = () => {
    setSpinning(true)
    onRefresh?.()
    setTimeout(() => setSpinning(false), 800)
  }

  const isBusy = spinning || refreshing

  return (
    <header className="fixed top-0 left-60 right-0 z-40 bg-[#050818]/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-3.5">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            {titleIcon}
            <h1 className="text-xl font-bold text-white">{title}</h1>
          </div>
          {subtitle && <p className="text-xs text-[#94A3B8] mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {actions}
          {showCurrency && <CurrencyToggle />}

          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-xs text-[#E5E7EB]">
              {isBusy ? "Atualizando..." : updatedLabel}
            </span>
            {countdownLabel && !isBusy && (
              <span className="text-[10px] text-[#94A3B8]">{countdownLabel}</span>
            )}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isBusy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-70"
            style={{ background: "linear-gradient(135deg, #0066FF, #8B00FF)" }}
          >
            <RefreshCw className={`w-4 h-4 ${isBusy ? "animate-spin" : ""}`} />
            Atualizar
          </button>
          <button className="relative p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-purple" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center text-white text-sm font-semibold">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              MX
            </motion.span>
          </div>
        </div>
      </div>
    </header>
  )
}
