"use client"

import { useState } from "react"
import { Sidebar } from "@/components/shared/sidebar"
import { DashboardBackground } from "@/components/dashboard/background"
import { PageHeader } from "@/components/shared/page-header"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { ColumnSelectorModal } from "@/components/shared/column-selector-modal"
import { InfoIcon } from "@/components/shared/info-icon"
import { Settings2, Upload } from "lucide-react"
import { useDespesas, formatBRL } from "@/hooks/use-despesas"

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

const INFO_COLS = new Set([
  "CPA",
  "DESPESAS",
  "FATURAMENTO",
  "LUCRO",
  "ROAS",
  "MARGEM",
  "ROI",
])

export default function RelatoriosPage() {
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [columns, setColumns] = useState<string[]>(DEFAULT_COLUMNS)
  const [agrupar, setAgrupar] = useState("Por dia")
  const [periodo, setPeriodo] = useState("Hoje")
  const [conta, setConta] = useState("Todas")
  const [produto, setProduto] = useState("Qualquer")

  const { total: totalDespesas } = useDespesas()

  const visibleCols = ALL_COLUMNS.filter((c) => columns.includes(c))

  const totalValue = (col: string): string => {
    switch (col) {
      case "DATA":
        return "7 DIAS"
      case "DIA":
        return "N/A"
      case "VENDAS":
        return "0"
      case "GASTOS":
      case "FATURAMENTO":
      case "LUCRO":
        return "R$ 0,00"
      case "DESPESAS":
        return formatBRL(totalDespesas)
      case "REEMBOLSOS":
        return "R$ 0,00"
      case "APROVAÇÕES":
        return "0"
      case "TICKET MÉDIO":
        return "R$ 0,00"
      default:
        return "N/A"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardBackground />
      <Sidebar activePage="relatorios" />
      <PageHeader
        title="Relatórios"
        subtitle="Use essa tela para visualizar relatórios diários."
        updatedLabel=""
        actions={
          <button className="px-4 py-2 rounded-lg text-sm font-medium border border-white/15 text-white hover:bg-white/5 transition-colors">
            Exportar
          </button>
        }
      />

      <main className="ml-60 pt-20">
        <div className="p-6 space-y-5 max-w-[1400px]">
          {/* Toolbar */}
          <div className="flex items-center gap-2">
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
              options={[
                "Hoje",
                "Essa semana",
                "Esse mês",
                "Últimos 7 dias",
                "Últimos 30 dias",
                "Personalizado",
              ]}
            />
            <FilterDropdown
              label="Conta de Anúncio"
              value={conta}
              onChange={setConta}
              options={["Todas", "Conta principal", "Conta secundária"]}
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
                    {visibleCols.map((col) => (
                      <td key={col} className="px-4 py-3 text-white whitespace-nowrap">
                        {totalValue(col)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Empty state */}
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              Nenhum dado para o período selecionado.
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
