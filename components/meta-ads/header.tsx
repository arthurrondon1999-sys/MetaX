"use client"

import { motion } from "framer-motion"
import { RefreshCw, Bell, ChevronDown } from "lucide-react"

const filters = [
  { label: "Período", value: "Hoje" },
  { label: "Conta de Anúncio", value: "Todas" },
  { label: "Fonte de Tráfego", value: "Todas" },
  { label: "Plataforma", value: "Todas" },
  { label: "Produto", value: "Todos" },
]

// Meta/Facebook style logo icon
function MetaIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_8px_rgba(0,102,255,0.5)]"
    >
      <path
        d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
        fill="#0066FF"
      />
    </svg>
  )
}

export function MetaAdsHeader() {
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
          <MetaIcon />
          <h1 className="text-lg font-semibold text-white">
            Meta Ads — <span className="text-muted-foreground">Campanhas</span>
          </h1>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-500">Ao vivo</span>
          </div>
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
              <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">
                {filter.value}
              </span>
              <ChevronDown className="w-3 h-3 text-cyan" />
            </motion.button>
          ))}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">
            Atualizado há 2 min
          </span>
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
