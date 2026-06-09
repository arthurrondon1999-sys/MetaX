"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings2, Upload, BarChart3, CheckCircle2, Search } from "lucide-react"
import { Sidebar } from "@/components/shared/sidebar"
import { PageHeader } from "@/components/shared/page-header"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { ColumnSelectorModal } from "@/components/shared/column-selector-modal"
import { DashboardBackground } from "@/components/dashboard/background"
import { InfoIcon } from "@/components/shared/info-icon"

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

const TOTAL_VALUES: Record<string, string> = {
  STATUS: "N/A",
  CAMPANHA: "0 CAMPANHAS",
  VEICULAÇÃO: "N/A",
  ORÇAMENTO: "N/A",
  GASTOS: "R$ 0,00",
  VENDAS: "0",
  ROI: "N/A",
  CPA: "N/A",
  ROAS: "N/A",
  IMPRESSÕES: "0",
  CPM: "R$ 0,00",
  CTR: "N/A",
  CPC: "N/A",
  FREQUÊNCIA: "N/A",
  ALCANCE: "0",
  CLIQUES: "0",
  CONVERSÕES: "0",
  "CUSTO POR CONVERSÃO": "N/A",
}

export default function MetaAdsPage() {
  const [activeTab, setActiveTab] = useState("Campanhas")
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [columns, setColumns] = useState<string[]>(DEFAULT_COLUMNS)
  const [nome, setNome] = useState("")
  const [status, setStatus] = useState("Qualquer")
  const [periodo, setPeriodo] = useState("Hoje")
  const [conta, setConta] = useState("Qualquer")
  const [produto, setProduto] = useState("Qualquer")

  const visibleCols = ALL_COLUMNS.filter((c) => columns.includes(c))

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
        updatedLabel="Atualizado agora mesmo"
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
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-electric-blue/40 transition-colors"
              title="Personalizar colunas"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-electric-blue/40 transition-colors"
              title="Exportar"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-electric-blue/40 transition-colors"
              title="Métricas"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <span className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Todas as vendas trackeadas
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-1.5 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground">Nome da Campanha</label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus-within:border-electric-blue/40 transition-colors">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Filtrar por nome"
                  className="bg-transparent text-sm text-white placeholder:text-muted-foreground outline-none w-full"
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
            <FilterDropdown
              label="Produto"
              value={produto}
              onChange={setProduto}
              options={["Qualquer"]}
            />
          </div>

          {/* Table */}
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
                        className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap"
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
                  <tr className="border-b border-white/10 font-semibold">
                    <td className="px-4 py-3" />
                    {visibleCols.map((col) => (
                      <td key={col} className="px-4 py-3 text-white whitespace-nowrap">
                        {TOTAL_VALUES[col] ?? "N/A"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Empty state */}
            <div className="px-4 py-10 text-center">
              <button className="inline-flex items-center gap-1.5 text-sm text-cyan hover:underline">
                Por que as campanhas não estão aparecendo?
                <InfoIcon />
              </button>
            </div>
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
