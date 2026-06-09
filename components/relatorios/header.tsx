"use client"

import { motion } from "framer-motion"
import { BarChart2, RefreshCw, Bell, ChevronDown } from "lucide-react"

const filters = [
  { label: "Período", value: "Este mês" },
  { label: "Conta de Anúncio", value: "Todas" },
]

export function RelatoriosHeader() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-60 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border z-40"
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left - Title */}
        <div className="flex items-center gap-3">
          <BarChart2 className="w-6 h-6 text-cyan drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
          <h1 className="text-lg font-semibold text-white">Relatórios</h1>
        </div>

        {/* Center - Filters */}
        <div className="flex items-center gap-2">
          {filters.map((filter, index) => (
            <motion.button
              key={filter.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-cyan/20 hover:border-cyan/40 transition-all duration-200 group"
            >
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground/60">
                {filter.label}
              </span>
              <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">
                {filter.value}
              </span>
              <ChevronDown className="w-3 h-3 text-cyan" />
            </motion.button>
          ))}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">Atualizado há 2 min</span>
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors group">
            <RefreshCw className="w-4 h-4 text-cyan group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center text-white font-semibold text-xs">
            AR
          </div>
        </div>
      </div>
    </motion.header>
  )
}
