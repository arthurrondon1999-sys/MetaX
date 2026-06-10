"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PlugZap } from "lucide-react"
import { Sidebar } from "@/components/shared/sidebar"
import { PageHeader } from "@/components/shared/page-header"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { MetricsGrid } from "@/components/dashboard/metrics-grid"
import { DashboardBackground } from "@/components/dashboard/background"
import { useCombinedSummary } from "@/hooks/use-hotmart"
import { useAutoRefresh, formatCountdown, formatLastRefreshed } from "@/hooks/use-auto-refresh"

const PERIOD_TO_PRESET: Record<string, string> = {
  Hoje: "today",
  "Essa semana": "this_week_mon_today",
  "Esse mês": "this_month",
  "Últimos 7 dias": "last_7d",
  "Últimos 30 dias": "last_30d",
}

export default function DashboardPage() {
  const [periodo, setPeriodo] = useState("Últimos 30 dias")
  const [conta, setConta] = useState("Qualquer")
  const [fonte, setFonte] = useState("Qualquer")
  const [plataforma, setPlataforma] = useState("Qualquer")
  const [produto, setProduto] = useState("Qualquer")

  const datePreset = PERIOD_TO_PRESET[periodo] || "last_30d"

  const { summary, sources, isLoading: summaryLoading, mutate } = useCombinedSummary(datePreset)

  const { secondsLeft, refreshing, lastRefreshed, refreshNow } = useAutoRefresh({
    onRefresh: () => mutate(),
    enabled: true,
  })

  // Dispara o flash verde quando novos dados chegam
  const [flash, setFlash] = useState(false)
  useEffect(() => {
    if (summary) {
      setFlash(true)
      const id = setTimeout(() => setFlash(false), 1300)
      return () => clearTimeout(id)
    }
  }, [lastRefreshed, summary])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardBackground />
      <Sidebar activePage="dashboard" />
      <PageHeader
        title="Resumo"
        updatedLabel={formatLastRefreshed(lastRefreshed)}
        countdownLabel={`Próxima atualização em ${formatCountdown(secondsLeft)}`}
        refreshing={refreshing}
        onRefresh={refreshNow}
      />

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
            <FilterDropdown label="Produto" value={produto} onChange={setProduto} options={["Qualquer"]} />
          </div>

          {/* Debug temporário: valores brutos recebidos do /api/summary */}
          <p className="text-xs text-muted-foreground font-mono">
            {summaryLoading
              ? "Debug: carregando…"
              : `Debug: hotmart_revenue=${summary?.revenue ?? "undefined"}, hotmart_sales=${summary?.sales ?? "undefined"}, meta_spend=${summary?.spend ?? "undefined"}`}
          </p>

          {/* Connection banner */}
          {sources && (!sources.meta.connected || !sources.hotmart.connected) && (
            <Link
              href="/integracoes"
              className="flex items-center gap-3 rounded-xl bg-electric-blue/10 border border-electric-blue/30 px-4 py-3 hover:bg-electric-blue/15 transition-colors"
            >
              <PlugZap className="w-5 h-5 text-electric-blue shrink-0" />
              <span className="text-sm text-white">
                {!sources.meta.connected && !sources.hotmart.connected
                  ? "Conecte Meta Ads e Hotmart para ver suas métricas reais e o ROI cruzado."
                  : !sources.meta.connected
                    ? "Conecte sua conta do Meta Ads para calcular gastos, ROI e CPA."
                    : "Conecte sua conta da Hotmart para ver faturamento, vendas e aprovações."}
              </span>
            </Link>
          )}

          {/* Metrics */}
          <MetricsGrid summary={summary} loading={summaryLoading} flash={flash} />
        </div>
      </main>
    </div>
  )
}
