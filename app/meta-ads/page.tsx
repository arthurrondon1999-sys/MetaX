"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Settings2, Upload, BarChart3, CheckCircle2, Search, AlertTriangle, PlugZap } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/shared/sidebar"
import { PageHeader } from "@/components/shared/page-header"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { ColumnSelectorModal } from "@/components/shared/column-selector-modal"
import { DashboardBackground } from "@/components/dashboard/background"
import { InfoIcon } from "@/components/shared/info-icon"
import { Skeleton } from "@/components/shared/skeleton"
import { useMetaStatus, useMetaCampaigns } from "@/hooks/use-meta"
import { useAutoRefresh, formatCountdown, formatLastRefreshed } from "@/hooks/use-auto-refresh"
import { useCurrency } from "@/lib/currency/currency-context"
import {
  deriveCampaignMetrics,
  formatNumber,
  formatPercent,
  formatDecimal,
  statusLabel,
  roiColor,
  roasColor,
  cpaColor,
  ctrColor,
  salesColor,
  COLOR_NA,
  COLOR_NEUTRAL,
  type CampaignMetrics,
} from "@/lib/meta/metrics"
import { cn } from "@/lib/utils"

const TABS = ["Contas", "Campanhas", "Conjuntos", "Anúncios"]

const ALL_COLUMNS = [
  "STATUS",
  "CAMPANHA",
  "VEICULAÇÃO",
  "ORÇAMENTO",
  "GASTOS",
  "VENDAS",
  "ROI",
  "CPA",
  "ROAS",
  "IMPRESSÕES",
  "CPM",
  "CTR",
  "CPC",
  "FREQUÊNCIA",
  "ALCANCE",
  "CLIQUES",
  "CONVERSÕES",
  "CUSTO POR CONVERSÃO",
]

const DEFAULT_COLUMNS = [
  "STATUS",
  "CAMPANHA",
  "VEICULAÇÃO",
  "ORÇAMENTO",
  "GASTOS",
  "VENDAS",
  "ROI",
  "CPA",
  "IMPRESSÕES",
  "CPM",
  "FREQUÊNCIA",
]

const INFO_COLS = new Set(["VEICULAÇÃO", "ROI", "CPA", "CPM", "FREQUÊNCIA"])

const PERIOD_TO_PRESET: Record<string, string> = {
  Hoje: "today",
  "Essa semana": "this_week_mon_today",
  "Esse mês": "this_month",
  "Últimos 7 dias": "last_7d",
  "Últimos 30 dias": "last_30d",
}

const STATUS_FILTER_MAP: Record<string, string> = {
  Ativa: "ACTIVE",
  Pausada: "PAUSED",
  Encerrada: "ARCHIVED",
}

type Cell = { value: string; color: string }

function cellData(col: string, m: CampaignMetrics, money: (v: number) => string): Cell {
  switch (col) {
    case "VEICULAÇÃO":
      return { value: statusLabel(m.status), color: COLOR_NEUTRAL }
    case "ORÇAMENTO":
      return { value: "N/A", color: COLOR_NA }
    case "GASTOS":
      return { value: money(m.spend), color: COLOR_NEUTRAL }
    case "VENDAS":
      return { value: formatNumber(m.purchases), color: salesColor(m.purchases) }
    case "ROI": {
      const roi = m.spend > 0 ? ((m.revenue - m.spend) / m.spend) * 100 : 0
      return m.spend > 0
        ? { value: formatPercent(roi), color: roiColor(roi) }
        : { value: "N/A", color: COLOR_NA }
    }
    case "CPA":
      return m.cpa > 0 ? { value: money(m.cpa), color: cpaColor(m.cpa) } : { value: "N/A", color: COLOR_NA }
    case "ROAS":
      return m.roas > 0
        ? { value: `${formatDecimal(m.roas)}x`, color: roasColor(m.roas) }
        : { value: "N/A", color: COLOR_NA }
    case "IMPRESSÕES":
      return { value: formatNumber(m.impressions), color: COLOR_NEUTRAL }
    case "CPM":
      return { value: money(m.cpm), color: COLOR_NEUTRAL }
    case "CTR":
      return m.ctr > 0 ? { value: formatPercent(m.ctr), color: ctrColor(m.ctr) } : { value: "N/A", color: COLOR_NA }
    case "CPC":
      return m.cpc > 0 ? { value: money(m.cpc), color: COLOR_NEUTRAL } : { value: "N/A", color: COLOR_NA }
    case "FREQUÊNCIA":
      return m.impressions > 0
        ? { value: formatDecimal(m.impressions / Math.max(m.reach, 1)), color: COLOR_NEUTRAL }
        : { value: "N/A", color: COLOR_NA }
    case "ALCANCE":
      return { value: formatNumber(m.reach), color: COLOR_NEUTRAL }
    case "CLIQUES":
      return { value: formatNumber(m.clicks), color: COLOR_NEUTRAL }
    case "CONVERSÕES":
      return { value: formatNumber(m.purchases), color: salesColor(m.purchases) }
    case "CUSTO POR CONVERSÃO":
      return m.cpa > 0 ? { value: money(m.cpa), color: cpaColor(m.cpa) } : { value: "N/A", color: COLOR_NA }
    default:
      return { value: "N/A", color: COLOR_NA }
  }
}

export default function MetaAdsPage() {
  const [activeTab, setActiveTab] = useState("Campanhas")
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [columns, setColumns] = useState<string[]>(DEFAULT_COLUMNS)
  const [nome, setNome] = useState("")
  const [status, setStatus] = useState("Qualquer")
  const [periodo, setPeriodo] = useState("Últimos 30 dias")
  const [conta, setConta] = useState("Qualquer")
  const [produto, setProduto] = useState("Qualquer")

  const { formatMoney } = useCurrency()
  const { status: metaStatus, isLoading: statusLoading } = useMetaStatus()
  const connected = metaStatus?.connected && metaStatus?.tokenValid
  const datePreset = PERIOD_TO_PRESET[periodo] || "last_30d"

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

  const visibleCols = ALL_COLUMNS.filter((c) => columns.includes(c))

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

  const totals = useMemo(() => {
    return metrics.reduce(
      (acc, m) => {
        acc.spend += m.spend
        acc.revenue += m.revenue
        acc.purchases += m.purchases
        acc.impressions += m.impressions
        acc.clicks += m.clicks
        acc.reach += m.reach
        return acc
      },
      { spend: 0, revenue: 0, purchases: 0, impressions: 0, clicks: 0, reach: 0 },
    )
  }, [metrics])

  function totalCell(col: string): Cell {
    switch (col) {
      case "CAMPANHA":
        return { value: `${metrics.length} CAMPANHAS`, color: COLOR_NEUTRAL }
      case "GASTOS":
        return { value: formatMoney(totals.spend), color: COLOR_NEUTRAL }
      case "VENDAS":
        return { value: formatNumber(totals.purchases), color: salesColor(totals.purchases) }
      case "ROI": {
        const roi = totals.spend > 0 ? ((totals.revenue - totals.spend) / totals.spend) * 100 : 0
        return totals.spend > 0 ? { value: formatPercent(roi), color: roiColor(roi) } : { value: "N/A", color: COLOR_NA }
      }
      case "CPA": {
        const cpa = totals.purchases > 0 ? totals.spend / totals.purchases : 0
        return cpa > 0 ? { value: formatMoney(cpa), color: cpaColor(cpa) } : { value: "N/A", color: COLOR_NA }
      }
      case "ROAS": {
        const roas = totals.spend > 0 ? totals.revenue / totals.spend : 0
        return roas > 0 ? { value: `${formatDecimal(roas)}x`, color: roasColor(roas) } : { value: "N/A", color: COLOR_NA }
      }
      case "IMPRESSÕES":
        return { value: formatNumber(totals.impressions), color: COLOR_NEUTRAL }
      case "CPM":
        return {
          value: totals.impressions > 0 ? formatMoney((totals.spend / totals.impressions) * 1000) : formatMoney(0),
          color: COLOR_NEUTRAL,
        }
      case "CTR": {
        const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0
        return ctr > 0 ? { value: formatPercent(ctr), color: ctrColor(ctr) } : { value: "N/A", color: COLOR_NA }
      }
      case "CPC":
        return totals.clicks > 0
          ? { value: formatMoney(totals.spend / totals.clicks), color: COLOR_NEUTRAL }
          : { value: "N/A", color: COLOR_NA }
      case "FREQUÊNCIA":
        return totals.reach > 0
          ? { value: formatDecimal(totals.impressions / totals.reach), color: COLOR_NEUTRAL }
          : { value: "N/A", color: COLOR_NA }
      case "ALCANCE":
        return { value: formatNumber(totals.reach), color: COLOR_NEUTRAL }
      case "CLIQUES":
        return { value: formatNumber(totals.clicks), color: COLOR_NEUTRAL }
      case "CONVERSÕES":
        return { value: formatNumber(totals.purchases), color: salesColor(totals.purchases) }
      case "CUSTO POR CONVERSÃO": {
        const cpa = totals.purchases > 0 ? totals.spend / totals.purchases : 0
        return cpa > 0 ? { value: formatMoney(cpa), color: cpaColor(cpa) } : { value: "N/A", color: COLOR_NA }
      }
      default:
        return { value: "N/A", color: COLOR_NA }
    }
  }

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
            {connected && (
              <span className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Conectado ao Meta Ads
              </span>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
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
              options={["Hoje", "Essa semana", "Esse mês", "Últimos 7 dias", "Últimos 30 dias"]}
            />
            <FilterDropdown
              label="Conta de Anúncio"
              value={conta}
              onChange={setConta}
              options={["Qualquer", "Conta principal", "Conta secundária"]}
            />
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
            <div className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="px-4 py-3 text-left w-10">
                        <input type="checkbox" className="accent-electric-blue" />
                      </th>
                      {visibleCols.map((col) => (
                        <th
                          key={col}
                          className="px-4 py-3 text-left text-xs font-semibold text-[#E5E7EB] whitespace-nowrap"
                        >
                          <span className="inline-flex items-center gap-1">
                            {col}
                            {INFO_COLS.has(col) && <InfoIcon />}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Totals row */}
                    {!loading && (
                      <tr className="border-b border-white/10 font-semibold bg-white/[0.02]">
                        <td className="px-4 py-3" />
                        {visibleCols.map((col) => {
                          const cell = totalCell(col)
                          return (
                            <td key={col} className={cn("px-4 py-3 whitespace-nowrap", cell.color)}>
                              {cell.value}
                            </td>
                          )
                        })}
                      </tr>
                    )}

                    {/* Skeleton rows while loading */}
                    {loading &&
                      Array.from({ length: 6 }).map((_, i) => (
                        <tr key={`sk-${i}`} className="border-b border-white/5">
                          <td className="px-4 py-3">
                            <Skeleton className="h-4 w-4" />
                          </td>
                          {visibleCols.map((col) => (
                            <td key={col} className="px-4 py-3">
                              <Skeleton className="h-4 w-20" />
                            </td>
                          ))}
                        </tr>
                      ))}

                    {/* Campaign rows */}
                    {!loading &&
                      metrics.map((m) => (
                        <tr
                          key={m.id}
                          className={cn(
                            "border-b border-white/5 hover:bg-white/[0.02] transition-colors",
                            flash && "animate-data-flash",
                          )}
                        >
                          <td className="px-4 py-3">
                            <input type="checkbox" className="accent-electric-blue" />
                          </td>
                          {visibleCols.map((col) => {
                            if (col === "STATUS") {
                              const active = m.status === "ACTIVE"
                              return (
                                <td key={col} className="px-4 py-3">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${
                                      active
                                        ? "bg-emerald-500/15 text-emerald-400"
                                        : "bg-white/10 text-[#94A3B8]"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-[#94A3B8]"}`}
                                    />
                                    {statusLabel(m.status)}
                                  </span>
                                </td>
                              )
                            }
                            if (col === "CAMPANHA") {
                              return (
                                <td key={col} className="px-4 py-3 text-white max-w-[260px] truncate" title={m.name}>
                                  {m.name}
                                </td>
                              )
                            }
                            const cell = cellData(col, m, formatMoney)
                            return (
                              <td key={col} className={cn("px-4 py-3 whitespace-nowrap", cell.color)}>
                                {cell.value}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Error */}
              {!loading && campaignsError && (
                <div className="px-4 py-12 text-center">
                  <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm text-amber-400">{campaignsError.message}</p>
                </div>
              )}

              {/* Empty */}
              {!loading && !campaignsError && metrics.length === 0 && (
                <div className="px-4 py-10 text-center">
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

      <ColumnSelectorModal
        open={columnsOpen}
        onClose={() => setColumnsOpen(false)}
        columns={ALL_COLUMNS}
        selected={columns}
        onApply={setColumns}
      />
    </div>
  )
}
