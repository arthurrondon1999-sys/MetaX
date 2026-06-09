"use client"

import { useState } from "react"
import { Sidebar } from "@/components/shared/sidebar"
import { PageHeader } from "@/components/shared/page-header"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { MetricsGrid } from "@/components/dashboard/metrics-grid"
import { DashboardBackground } from "@/components/dashboard/background"

export default function DashboardPage() {
  const [periodo, setPeriodo] = useState("Hoje")
  const [conta, setConta] = useState("Qualquer")
  const [fonte, setFonte] = useState("Qualquer")
  const [plataforma, setPlataforma] = useState("Qualquer")
  const [produto, setProduto] = useState("Qualquer")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardBackground />
      <Sidebar activePage="dashboard" />
      <PageHeader title="Resumo" updatedLabel="Atualizado há 2 minutos" />

      <main className="ml-60 pt-20">
        <div className="p-6 space-y-6 max-w-7xl">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <FilterDropdown
              label="Período de Visualização"
              value={periodo}
              onChange={setPeriodo}
              options={["Hoje", "Essa semana", "Esse mês", "Últimos 7 dias", "Últimos 30 dias"]}
            />
            <FilterDropdown
              label="Conta de Anúncio"
              value={conta}
              onChange={setConta}
              options={["Qualquer", "Conta principal", "Conta secundária"]}
            />
            <FilterDropdown
              label="Fonte de Tráfego"
              value={fonte}
              onChange={setFonte}
              options={["Qualquer", "Meta Ads", "Google Ads", "TikTok Ads"]}
            />
            <FilterDropdown
              label="Plataforma"
              value={plataforma}
              onChange={setPlataforma}
              options={["Qualquer", "Hotmart", "Kiwify", "Perfect Pay", "Digistore", "Cakto"]}
            />
            <FilterDropdown
              label="Produto"
              value={produto}
              onChange={setProduto}
              options={["Qualquer"]}
            />
          </div>

          {/* Metrics */}
          <MetricsGrid />
        </div>
      </main>
    </div>
  )
}
