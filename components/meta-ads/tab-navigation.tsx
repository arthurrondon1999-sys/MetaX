"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type TabType = "campanhas" | "conjuntos" | "anuncios"

interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs = [
  { id: "campanhas" as const, label: "Campanhas" },
  { id: "conjuntos" as const, label: "Conjuntos de Anúncios" },
  { id: "anuncios" as const, label: "Anúncios" },
]

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-card/30 backdrop-blur-xl border border-border rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
            activeTab === tab.id
              ? "text-white"
              : "text-muted-foreground hover:text-white"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-electric-blue/30 to-neon-purple/30 rounded-md border border-cyan/30"
              style={{
                boxShadow: "0 0 20px rgba(0, 212, 255, 0.2)",
              }}
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
