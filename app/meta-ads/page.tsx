"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Settings2, Upload, BarChart3, CheckCircle2, Search, AlertTriangle, PlugZap } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Sidebar } from "@/components/shared/sidebar"
import { PageHeader } from "@/components/shared/page-header"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { DateRangePicker, type DateRange } from "@/components/shared/date-range-picker"
import { ColumnVisibilityModal } from "@/components/meta-ads/column-visibility-modal"
import { CampaignsDataTable } from "@/components/meta-ads/campaigns-data-table"
import { DashboardBackground } from "@/components/dashboard/background"
import { InfoIcon } from "@/components/shared/info-icon"
import { useMetaStatus, useMetaCampaigns } from "@/hooks/use-meta"
import { useMetaColumns } from "@/hooks/use-meta-columns"
import { useAutoRefresh, formatCountdown, formatLastRefreshed } from "@/hooks/use-auto-refresh"
import { useCurrency } from "@/lib/currency/currency-context"
import { deriveCampaignMetrics, type CampaignMetrics } from "@/lib/meta/metrics"
import { totalCellFor, type CampaignTotals } from "@/lib/meta/columns"

const TABS = ["Contas", "Campanhas", "Conjuntos", "Anúncios"]

const PERIOD_TO_PRESET: Record<string, string> = {
  Hoje: "today",
  Ontem: "yesterday",
  "Últimos 7 dias": "last_7d",
  "Últimos 30 dias": "last_30d",
  "Este mês": "this_month",
}

const PERIOD_OPTIONS = ["Hoje", "Ontem", "Últimos 7 dias", "Últimos 30 dias", "Este mês", "Personalizado"]

const STATUS_FILTER_MAP: Record<string, string> = {
  Ativa: "ACTIVE",
  Pausada: "PAUSED",
  Encerrada: "ARCHIVED",
}

export default function MetaAdsPage() {
  const [activeTab, setActiveTab] = useState("Campanhas")
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [nome, setNome] = useState("")
  const [status, setStatus] = useState("Qualquer")
  const [periodo, setPeriodo] = useState("Últimos 30 dias")
  const [produto, setProduto] = useState("Qualquer")
  const [customRange, setCustomRange] = useState<DateRange | undefined>()

  const { formatMoney } = useCurrency()
  const { visible, visibleOrdered, order, setOrder, setVisible, reset } = useMetaColumns()
  const { status: metaStatus, isLoading: statusLoading } = useMetaStatus()
  const connected = metaStatus?.connected && metaStatus?.tokenValid

  const datePreset = useMemo(() => {
    if (periodo === "Personalizado") {
      if (customRange?.from && customRange?.to) {
        return `custom:${format(customRange.from, "yyyy-MM-dd")}:${format(customRange.to, "yyyy-MM-dd")}`
      }
      return "last_30d"
    }
    return PERIOD_TO_PRESET[periodo] || "last_30d"
  }, [periodo, customRange])

  const {
    campaigns: rawCampaigns,
    isLoading: campaignsLoading,
    error: campaignsError,
    mutate,
  } = useMetaCampaigns(datePreset, Boolean(connected))

  const { secondsLeft, refreshing, lastRefreshed, refreshNow } = useAutoRefresh({
    onRefresh: () => mutate(),
    enabled: Boolean(connected),
  })

  const metrics = useMemo(() => {
    let list: CampaignMetrics[] = rawCampaigns.map(deriveCampaignMetrics)
    if (nome.trim()) {
      list = list.filter((m) => m.name.toLowerCase().includes(nome.trim().toLowerCase()))
    }
    if (status !== "Qualquer" && STATUS_FILTER_MAP[status]) {
      list = list.filter((m) => m.status === STATUS_FILTER_MAP[status])
    }
    return list
  }, [rawCampaigns, nome, status])

  const totals = useMemo<CampaignTotals>(() => {
    return metrics.reduce<CampaignTotals>(
      (acc, m) => {
        acc.count += 1
        acc.spend += m.spend
        acc.revenue += m.revenue
        acc.purchases += m.purchases
        acc.impressions += m.impressions
        acc.clicks += m.clicks
        acc.reach += m.reach
        acc.linkClicks += m.linkClicks
        acc.landingPageViews += m.landingPageViews
        acc.initiateCheckout += m.initiateCheckout
        acc.video3sec += m.video3sec
        acc.videoThruPlays += m.videoThruPlays
        acc.videoP25 += m.videoP25
        acc.videoP50 += m.videoP50
        acc.videoP75 += m.videoP75
        acc.videoP100 += m.videoP100
        return acc
      },
      {
        count: 0,
        spend: 0,
        revenue: 0,
        purchases: 0,
        impressions: 0,
        clicks: 0,
        reach: 0,
        linkClicks: 0,
        landingPageViews: 0,
        initiateCheckout: 0,
        video3sec: 0,
        videoThruPlays: 0,
        videoP25: 0,
        videoP50: 0,
        videoP75: 0,
        videoP100: 0,
      },
    )
  }, [metrics])

  const loading = statusLoading || (connected && campaignsLoading)

  // Flash verde ao atualizar dados
  const [flash, setFlash] = useState(false)
  useEffect(() => {
    if (connected && rawCampaigns.length) {
      setFlash(true)
      const id = setTimeout(() => setFlash(false), 1300)
      return () => clearTimeout(id)
    }
  }, [lastRefreshed, connected, rawCampaigns.length])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardBackground />
      <Sidebar activePage="meta-ads" />
      <PageHeader
        title="Meta"
        titleIcon={
          <span className="w-7 h-7 rounded-lg bg-[#0866FF] flex items-center justify-center text-white font-bold text-sm">
            f
          </span>
        }
        updatedLabel={formatLastRefreshed(lastRefreshed)}
        countdownLabel={connected ? `Próxima atualização em ${formatCountdown(secondsLeft)}` : undefined}
        refreshing={refreshing}
        onRefresh={refreshNow}
      />

      <main className="ml-60 pt-20">
        <div className="p-6 space-y-5 max-w-[1400px]">
          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-white/10">
            {TABS.map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative pb-3 text-sm font-medium transition-colors"
                  style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.5)" }}
                >
                  {tab}
                  {isActive && (
                    <motion.div
                      layoutId="metaTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: "#0066FF" }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setColumnsOpen(true)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white hover:border-electric-blue/40 transition-colors"
              title="Personalizar colunas"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white hover:border-electric-blue/40 transition-colors"
              title="Exportar"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white hover:border-electric-blue/40 transition-colors"
              title="Métricas"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <span className="hidden md:inline text-xs text-[#94A3B8] ml-1">
              Arraste os cabeçalhos para reordenar as colunas
            </span>
            {connected && (
              <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Conectado ao Meta Ads
              </span>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-start gap-3">
            <div className="flex flex-col gap-1.5 min-w-[200px]">
              <label className="text-xs font-medium text-white">Nome da Campanha</label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus-within:border-electric-blue/40 transition-colors">
                <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Filtrar por nome"
                  className="bg-transparent text-sm text-white placeholder:text-[#94A3B8] outline-none w-full"
                />
              </div>
            </div>
            <FilterDropdown
              label="Status da Campanha"
              value={status}
              onChange={setStatus}
              options={["Qualquer", "Ativa", "Pausada", "Encerrada"]}
            />
            <FilterDropdown
              label="Período de Visualização"
              value={periodo}
              onChange={setPeriodo}
              options={PERIOD_OPTIONS}
            />
            {periodo === "Personalizado" && <DateRangePicker range={customRange} onChange={setCustomRange} />}
            <FilterDropdown label="Produto" value={produto} onChange={setProduto} options={["Qualquer"]} />
          </div>

          {/* Not connected */}
          {!statusLoading && !connected && (
            <div className="rounded-xl bg-white/[0.03] border border-white/10 px-6 py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-electric-blue/15 flex items-center justify-center mx-auto mb-4">
                <PlugZap className="w-6 h-6 text-electric-blue" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">
                {metaStatus?.connected ? "Token do Meta expirado ou inválido" : "Conta do Meta não conectada"}
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {metaStatus?.error || "Conecte sua conta do Meta Ads para visualizar suas campanhas."}
              </p>
              <Link
                href="/integracoes"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-electric-blue text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Ir para Integrações
              </Link>
            </div>
          )}

          {/* Table */}
          {connected && (
            <div className="space-y-0">
              <CampaignsDataTable
                metrics={metrics}
                order={order}
                visibleOrdered={visibleOrdered}
                money={formatMoney}
                loading={Boolean(loading)}
                flash={flash}
                totalCell={(id) => totalCellFor(id, totals, formatMoney)}
                onReorder={setOrder}
              />

              {/* Error */}
              {!loading && campaignsError && (
                <div className="mt-3 rounded-xl bg-white/[0.03] border border-white/10 px-4 py-12 text-center">
                  <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm text-amber-400">{campaignsError.message}</p>
                </div>
              )}

              {/* Empty */}
              {!loading && !campaignsError && metrics.length === 0 && (
                <div className="mt-3 rounded-xl bg-white/[0.03] border border-white/10 px-4 py-10 text-center">
                  <p className="text-sm text-[#94A3B8] mb-1">Nenhuma campanha encontrada para este período.</p>
                  <button className="inline-flex items-center gap-1.5 text-sm text-cyan hover:underline">
                    Por que as campanhas não estão aparecendo?
                    <InfoIcon />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <ColumnVisibilityModal
        open={columnsOpen}
        onClose={() => setColumnsOpen(false)}
        visible={visible}
        onApply={setVisible}
        onReset={reset}
      />
    </div>
  )
}
