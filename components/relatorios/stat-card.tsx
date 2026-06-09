"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StatCardData {
  title: string
  value: string
  subtitle?: string
  trend?: {
    value: string
    positive: boolean
  }
  warning?: boolean
}

export function StatCard({ card, index }: { card: StatCardData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-cyan/0 via-electric-blue/0 to-neon-purple/0 group-hover:from-cyan/20 group-hover:via-electric-blue/20 group-hover:to-neon-purple/20 transition-all duration-300 blur-sm" />

      <div className="relative bg-card/50 backdrop-blur-xl border border-border rounded-xl p-4 h-full overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
          <p
            className={cn(
              "text-2xl font-bold tracking-tight mb-2",
              card.warning ? "text-orange-400" : "text-white"
            )}
          >
            {card.value}
          </p>
          <div className="flex items-center gap-1">
            {card.trend ? (
              <>
                {card.trend.positive ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-green-500" />
                )}
                <span className="text-xs font-medium text-green-500">
                  {card.trend.value} vs mês anterior
                </span>
              </>
            ) : (
              card.subtitle && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    card.warning ? "text-orange-400" : "text-muted-foreground"
                  )}
                >
                  {card.subtitle}
                </span>
              )
            )}
          </div>
        </div>

        <div className="absolute inset-0 rounded-xl border border-cyan/10 group-hover:border-cyan/30 transition-colors duration-300" />
      </div>
    </motion.div>
  )
}
