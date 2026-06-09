"use client"

import { motion } from "framer-motion"
import { Plug, RefreshCw, Bell } from "lucide-react"

interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-60 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border z-40"
    >
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-electric-blue/20 to-neon-purple/20 border border-cyan/20 flex items-center justify-center">
            <Plug className="w-5 h-5 text-cyan" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>

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
