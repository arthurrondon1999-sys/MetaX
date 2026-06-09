"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Sidebar } from "@/components/shared/sidebar"
import { DashboardBackground } from "@/components/dashboard/background"
import { RelatoriosHeader } from "@/components/relatorios/header"
import { TabNavigation, type RelatorioTab } from "@/components/relatorios/tab-navigation"
import { FinanceiroTab } from "@/components/relatorios/financeiro-tab"
import { PerformanceTab } from "@/components/relatorios/performance-tab"
import { ImpostosTab } from "@/components/relatorios/impostos-tab"
import { DespesasTab } from "@/components/relatorios/despesas-tab"

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState<RelatorioTab>("financeiro")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardBackground />
      <Sidebar activePage="relatorios" />
      <RelatoriosHeader />

      <main className="ml-60 pt-16">
        <div className="p-6 space-y-6 max-w-7xl">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeTab === "financeiro" && <FinanceiroTab />}
              {activeTab === "performance" && <PerformanceTab />}
              {activeTab === "impostos" && <ImpostosTab />}
              {activeTab === "despesas" && <DespesasTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
