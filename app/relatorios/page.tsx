"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/shared/sidebar"
import { MobileNav } from "@/components/shared/mobile-nav"
import { DashboardBackground } from "@/components/dashboard/background"
import { PageHeader } from "@/components/shared/page-header"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { ColumnSelectorModal } from "@/components/shared/column-selector-modal"
import { InfoIcon } from "@/components/shared/info-icon"
import { Settings2, Upload } from "lucide-react"
import { useDespesas, formatBRL } from "@/hooks/use-despesas"
import { useDailyReport, type DailyReportRow } from "@/hooks/use-hotmart"
import { useCurrency } from "@/lib/currency/currency-context"
import { useAutoRefresh, formatCountdown, formatLastRefreshed } from "@/hooks/use-auto-refresh"
import {
  positiveNegativeColor,
  roiColor,
  cpaColor,
  roasColor,
  salesColor,
  COLOR_NEUTRAL,
  COLOR_NA,
} from "@/lib/meta/metrics"

const ALL_COLUMNS = [
  "DATA",
  "DIA",
  "VENDAS",
  "CPA",
  "GASTOS",
  "DESPESAS",
  "FATURAMENTO",
  "LUCRO",
  "ROAS",
  "MARGEM",
  "ROI",
  "TICKET MÉDIO",
  "APROVAÇÕES",
  "REEMBOLSOS",
]

const DEFAULT_COLUMNS = [
  "DATA",
  "DIA",
  "VENDAS",
  "CPA",
  "GASTOS",
  "DESPESAS",
  "FATURAMENTO",
  "LUCRO",
  "ROAS",
  "MARGEM",
  "ROI",
]

const INFO_COLS = new Set(["CPA", "DESPESAS", "FATURAMENTO", "LUCRO", "ROAS", "MARGEM", "ROI"])

const PERIOD_TO_PRESET: Record<string, string> = {
  Hoje: "today",
  "Essa semana": "this_week_mon_today",
  "Esse mês": "this_month",
  "Últimos 7 dias": "last_7d",
  "Últimos 30 dias": "last_30d",
}

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`
}

function weekday(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  return WEEKDAYS[new Date(y, m - 1, d).getDay()]
}

export default function RelatoriosPage() {
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [columns, setColumns] = useState<string[]>(DEFAULT_COLUMNS)
  const [agrupar, setAgrupar] = useState("Por dia")
  const [periodo, setPeriodo] = useState("Últimos 7 dias")
  const [conta, setConta] = useState("Todas")
  const [produto, setProduto] = useState("Qualquer")

  const { formatMoney } = useCurrency()
  const { total: totalDespesas } = useDespesas()

  const datePreset = PERIOD_TO_PRESET[periodo] || "last_7d"
  const { rows, isLoading, mutate } = useDailyReport(datePreset)

  const { secondsLeft, refreshing, lastRefreshed, refreshNow } = useAutoRefresh({
    onRefresh: () => mutate(),
    enabled: true,
  })

  const [flash, setFlash] = useState(false)
  useEffect(() => {
    if (rows.length) {
      setFlash(true)
      const id = setTimeout(() => setFlash(false), 1300)
      return () => clearTimeout(id)
    }
  }, [lastRefreshed, rows.length])

  const visibleCols = ALL_COLUMNS.filter((c) => columns.includes(c))

  // Totais agregados
  const totals = rows.reduce(
    (acc, r) => {
      acc.sales += r.sales
      acc.spend += r.spend
      acc.revenue += r.revenue
      acc.refunds += r.refunds
      return acc
    },
    { sales: 0, spend: 0, revenue: 0, refunds: 0 },
  )
  const totalProfit = totals.revenue - totals.spend
  const totalRoas = totals.spend > 0 ? totals.revenue / totals.spend : 0
  const totalRoi = totals.spend > 0 ? (totalProfit / totals.spend) * 100 : 0
  const totalCpa = totals.sales > 0 ? totals.spend / totals.sales : 0
  const totalTicket = totals.sales > 0 ? totals.revenue / totals.sales : 0
  const totalMargin = totals.revenue > 0 ? (totalProfit / totals.revenue) * 100 : 0

  function cell(col: string, r: DailyReportRow): { text: string; color: string } {
    switch (col) {
      case "DATA":
        return { text: formatDate(r.date), color: COLOR_NEUTRAL }
      case "DIA":
        return { text: weekday(r.date), color: COLOR_NA }
      case "VENDAS":
        return { text: String(r.sales), color: salesColor(r.sales) }
      case "CPA":
        return { text: r.cpa > 0 ? formatMoney(r.cpa) : "—", color: cpaColor(r.cpa) }
      case "GASTOS":
        return { text: formatMoney(r.spend), color: COLOR_NEUTRAL }
      case "DESPESAS":
        return { text: "—", color: COLOR_NA }
      case "FATURAMENTO":
        return { text: formatMoney(r.revenue), color: positiveNegativeColor(r.revenue, r.revenue > 0) }
      case "LUCRO":
        return { text: formatMoney(r.profit), color: positiveNegativeColor(r.profit) }
      case "ROAS":
        return { text: `${r.roas.toFixed(2)}x`, color: roasColor(r.roas) }
      case "MARGEM":
        return { text: `${r.margin.toFixed(1)}%`, color: roiColor(r.margin, r.revenue > 0) }
      case "ROI":
        return { text: `${r.roi.toFixed(1)}%`, color: roiColor(r.roi, r.spend > 0) }
      case "TICKET MÉDIO":
        return { text: r.averageTicket > 0 ? formatMoney(r.averageTicket) : "—", color: COLOR_NA }
      case "APROVAÇÕES":
        return { text: String(r.sales), color: salesColor(r.sales) }
      case "REEMBOLSOS":
        return { text: String(r.refunds), color: r.refunds > 0 ? "text-[#FF4444]" : COLOR_NA }
      default:
        return { text: "—", color: COLOR_NA }
    }
  }

  function totalCell(col: string): { text: string; color: string } {
    switch (col) {
      case "DATA":
        return { text: "TOTAL", color: COLOR_NEUTRAL }
      case "DIA":
        return { text: `${rows.length} dias`, color: COLOR_NA }
      case "VENDAS":
        return { text: String(totals.sales), color: salesColor(totals.sales) }
      case "CPA":
        return { text: totalCpa > 0 ? formatMoney(totalCpa) : "—", color: cpaColor(totalCpa) }
      case "GASTOS":
        return { text: formatMoney(totals.spend), color: COLOR_NEUTRAL }
      case "DESPESAS":
        return { text: formatBRL(totalDespesas), color: totalDespesas > 0 ? "text-[#FF4444]" : COLOR_NA }
      case "FATURAMENTO":
        return { text: formatMoney(totals.revenue), color: positiveNegativeColor(totals.revenue, totals.revenue > 0) }
      case "LUCRO":
        return { text: formatMoney(totalProfit), color: positiveNegativeColor(totalProfit) }
      case "ROAS":
        return { text: `${totalRoas.toFixed(2)}x`, color: roasColor(totalRoas) }
      case "MARGEM":
        return { text: `${totalMargin.toFixed(1)}%`, color: roiColor(totalMargin, totals.revenue > 0) }
      case "ROI":
        return { text: `${totalRoi.toFixed(1)}%`, color: roiColor(totalRoi, totals.spend > 0) }
      case "TICKET MÉDIO":
        return { text: totalTicket > 0 ? formatMoney(totalTicket) : "—", color: COLOR_NA }
      case "APROVAÇÕES":
        return { text: String(totals.sales), color: salesColor(totals.sales) }
      case "REEMBOLSOS":
        return { text: String(totals.refunds), color: totals.refunds > 0 ? "text-[#FF4444]" : COLOR_NA }
      default:
        return { text: "—", color: COLOR_NA }
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardBackground />
      <Sidebar activePage="relatorios" />
      <MobileNav activePage="relatorios" />
      <PageHeader
        title="Relatórios"
        subtitle="Use essa tela para visualizar relatórios diários."
        updatedLabel={formatLastRefreshed(lastRefreshed)}
        countdownLabel={`Próxima atualização em ${formatCountdown(secondsLeft)}`}
        refreshing={refreshing}
        onRefresh={refreshNow}
        actions={
          <button className="px-4 py-2 rounded-lg text-sm font-medium border border-white/15 text-white hover:bg-white/5 transition-colors">
            Exportar
          </button>
        }
      />

      <main className="md:ml-60 pt-20 pb-24 md:pb-0">
        <div className="p-4 md:p-6 space-y-5 max-w-[1400px]">
          {/* Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setColumnsOpen(true)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#E5E7EB] hover:text-white hover:border-electric-blue/40 transition-colors"
              title="Personalizar colunas"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#E5E7EB] hover:text-white hover:border-electric-blue/40 transition-colors"
              title="Exportar"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <FilterDropdown
              label="Agrupar por"
              value={agrupar}
              onChange={setAgrupar}
              options={["Por dia", "Por semana", "Por mês", "Por produto"]}
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
              options={["Todas", "Conta principal", "Conta secundária"]}
            />
            <FilterDropdown label="Produto" value={produto} onChange={setProduto} options={["Qualquer"]} />
          </div>

          {/* Table */}
          <div
            className={`rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden transition-shadow ${
              flash ? "animate-data-flash" : ""
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
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
                  {rows.length > 0 && (
                    <tr className="border-b border-white/10 font-semibold bg-white/[0.02]">
                      {visibleCols.map((col) => {
                        const { text, color } = totalCell(col)
                        return (
                          <td key={col} className={`px-4 py-3 whitespace-nowrap ${color}`}>
                            {text}
                          </td>
                        )
                      })}
                    </tr>
                  )}
                  {/* Daily rows */}
                  {rows.map((r) => (
                    <tr key={r.date} className="border-b border-white/[0.06] hover:bg-white/[0.02]">
                      {visibleCols.map((col) => {
                        const { text, color } = cell(col, r)
                        return (
                          <td key={col} className={`px-4 py-3 whitespace-nowrap ${color}`}>
                            {text}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Loading / Empty state */}
            {isLoading && rows.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-[#94A3B8]">Carregando relatório...</div>
            )}
            {!isLoading && rows.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-[#94A3B8]">
                Nenhum dado para o período selecionado.
              </div>
            )}
          </div>
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
