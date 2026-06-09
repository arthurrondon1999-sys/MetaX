"use client"

import { motion } from "framer-motion"
import { ArrowUpDown, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { StatCard, type StatCardData } from "./stat-card"

const summaryCards: StatCardData[] = [
  { title: "ROAS Médio", value: "5,77x", trend: { value: "+8,1%", positive: true } },
  { title: "ROI Médio", value: "377%", trend: { value: "+14,2%", positive: true } },
  { title: "CPA Médio", value: "R$ 18,42", trend: { value: "-5,1%", positive: true } },
  { title: "CTR Médio", value: "4,23%", trend: { value: "+0,8%", positive: true } },
]

interface PerfRow {
  campanha: string
  status: "active" | "test" | "paused"
  investimento: string
  faturamento: string
  roas: number
  roi: number
  cpa: string
  ctr: string
  impressoes: string
  cliques: string
  conversoes: number
}

const rows: PerfRow[] = [
  { campanha: "Black Friday — Escala", status: "active", investimento: "R$ 2.840", faturamento: "R$ 17.608", roas: 6.2, roi: 520, cpa: "R$ 15,19", ctr: "4,47%", impressoes: "412.300", cliques: "18.420", conversoes: 187 },
  { campanha: "Produto Principal — Topo", status: "active", investimento: "R$ 1.920", faturamento: "R$ 11.136", roas: 5.8, roi: 480, cpa: "R$ 15,48", ctr: "3,91%", impressoes: "287.100", cliques: "11.230", conversoes: 124 },
  { campanha: "Retargeting — Quente", status: "active", investimento: "R$ 890", faturamento: "R$ 7.209", roas: 8.1, roi: 710, cpa: "R$ 10,00", ctr: "7,97%", impressoes: "98.400", cliques: "7.840", conversoes: 89 },
  { campanha: "Teste Criativo — V3", status: "test", investimento: "R$ 420", faturamento: "R$ 2.058", roas: 4.9, roi: 390, cpa: "R$ 13,55", ctr: "3,26%", impressoes: "67.200", cliques: "2.190", conversoes: 31 },
  { campanha: "Lookalike — Frio", status: "paused", investimento: "R$ 1.240", faturamento: "R$ 6.324", roas: 5.1, roi: 410, cpa: "R$ 15,90", ctr: "3,18%", impressoes: "198.700", cliques: "6.320", conversoes: 78 },
]

const columns = [
  "Campanha", "Status", "Investimento", "Faturamento Gerado", "ROAS", "ROI", "CPA", "CTR", "Impressões", "Cliques", "Conversões",
]

function getRoasColor(v: number) {
  if (v > 6) return "text-cyan"
  if (v >= 4) return "text-yellow-500"
  return "text-red-500"
}
function getRoiColor(v: number) {
  if (v > 500) return "text-cyan"
  if (v >= 300) return "text-yellow-500"
  return "text-red-500"
}

const statusConfig = {
  active: { label: "Ativo", dot: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]", text: "text-green-500" },
  test: { label: "Teste", dot: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]", text: "text-yellow-500" },
  paused: { label: "Pausado", dot: "bg-gray-500", text: "text-muted-foreground" },
}

export function PerformanceTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <StatCard key={card.title} card={card} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-card/30 backdrop-blur-xl border border-border rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-white">Performance por Campanha — Este Mês</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-cyan/20 hover:border-cyan/40 text-xs text-white transition-all">
            <Download className="w-3.5 h-3.5 text-cyan" />
            Exportar CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="bg-background/50 border-b border-border">
                {columns.map((col, i) => (
                  <th
                    key={col}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-medium text-cyan uppercase tracking-wider whitespace-nowrap",
                      i === 0 && "sticky left-0 bg-background/80 backdrop-blur-sm z-10"
                    )}
                  >
                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                      {col}
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const sc = statusConfig[row.status]
                return (
                  <motion.tr
                    key={row.campanha}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                    className={cn(
                      "border-b border-border/50 transition-all duration-200 hover:bg-gradient-to-r hover:from-electric-blue/5 hover:to-neon-purple/5 group",
                      index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                    )}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-white sticky left-0 bg-background/40 backdrop-blur-sm group-hover:bg-transparent whitespace-nowrap">
                      {row.campanha}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", sc.dot)} />
                        <span className={cn("text-xs font-medium", sc.text)}>{sc.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-white whitespace-nowrap">{row.investimento}</td>
                    <td className="px-4 py-3 text-sm text-green-500 font-medium whitespace-nowrap">{row.faturamento}</td>
                    <td className={cn("px-4 py-3 text-sm font-bold", getRoasColor(row.roas))}>
                      {row.roas.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}x
                    </td>
                    <td className={cn("px-4 py-3 text-sm font-bold", getRoiColor(row.roi))}>{row.roi}%</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{row.cpa}</td>
                    <td className="px-4 py-3 text-sm text-white">{row.ctr}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{row.impressoes}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{row.cliques}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium">{row.conversoes}</td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
