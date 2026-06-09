"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export type RelatorioTab = "financeiro" | "performance" | "impostos" | "despesas"

interface TabNavigationProps {
  activeTab: RelatorioTab
  onTabChange: (tab: RelatorioTab) => void
}

const tabs = [
  { id: "financeiro" as const, label: "Financeiro" },
  { id: "performance" as const, label: "Performance de Anúncios" },
  { id: "impostos" as const, label: "Impostos" },
  { id: "despesas" as const, label: "Despesas" },
]

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-1 bg-card/30 backdrop-blur-xl border border-border rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
            activeTab === tab.id ? "text-white" : "text-muted-foreground hover:text-white"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeRelatorioTab"
              className="absolute inset-0 bg-gradient-to-r from-electric-blue to-neon-purple rounded-md"
              style={{ boxShadow: "0 0 20px rgba(0, 102, 255, 0.4)" }}
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
