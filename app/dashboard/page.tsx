"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { PlugZap } from "lucide-react"
import { format } from "date-fns"
import { Sidebar } from "@/components/shared/sidebar"
import { PageHeader } from "@/components/shared/page-header"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { DateRangePicker, type DateRange } from "@/components/shared/date-range-picker"
import { MetricsGrid } from "@/components/dashboard/metrics-grid"
import { DashboardBackground } from "@/components/dashboard/background"
import { useCombinedSummary } from "@/hooks/use-hotmart"
import { useAutoRefresh, formatLastRefreshed } from "@/hooks/use-auto-refresh"

const PERIOD_TO_PRESET: Record<string, string> = {
  Hoje: "today",
  Ontem: "yesterday",
  "Últimos 7 dias": "last_7d",
  "Últimos 30 dias": "last_30d",
  "Este mês": "this_month",
}

const PERIOD_OPTIONS = ["Hoje", "Ontem", "Últimos 7 dias", "Últimos 30 dias", "Este mês", "Personalizado"]

export default function DashboardPage() {
  const [periodo, setPeriodo] = useState("Últimos 30 dias")
  const [plataforma, setPlataforma] = useState("Qualquer")
  const [produto, setProduto] = useState("Qualquer")
  const [customRange, setCustomRange] = useState<DateRange | undefined>()

  // Monta o date_preset: presets nativos ou "custom:YYYY-MM-DD:YYYY-MM-DD"
  const datePreset = useMemo(() => {
    if (periodo === "Personalizado") {
      if (customRange?.from && customRange?.to) {
        return `custom:${format(customRange.from, "yyyy-MM-dd")}:${format(customRange.to, "yyyy-MM-dd")}`
      }
      return "last_30d"
    }
    return PERIOD_TO_PRESET[periodo] || "last_30d"
  }, [periodo, customRange])

  const { summary, sources, isLoading: summaryLoading, mutate } = useCombinedSummary(datePreset)

  const { refreshing, lastRefreshed, refreshNow } = useAutoRefresh({
    onRefresh: () => mutate(),
    enabled: false,
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
        refreshing={refreshing}
        onRefresh={refreshNow}
      />

      <main className="ml-60 pt-20">
        <div className="p-6 space-y-6 max-w-7xl">
          {/* Filters */}
          <div className="flex flex-wrap items-start gap-3">
            <FilterDropdown
              label="Período de Visualização"
              value={periodo}
              onChange={setPeriodo}
              options={PERIOD_OPTIONS}
            />
            {periodo === "Personalizado" && (
              <DateRangePicker range={customRange} onChange={setCustomRange} />
            )}
            <FilterDropdown
              label="Plataforma"
              value={plataforma}
              onChange={setPlataforma}
              options={["Qualquer", "Hotmart", "Kiwify", "Perfect Pay", "Digistore", "Cakto"]}
            />
            <FilterDropdown label="Produto" value={produto} onChange={setProduto} options={["Qualquer"]} />
          </div>

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
