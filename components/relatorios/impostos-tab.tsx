"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Plus, ArrowUpDown, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { StatCard, type StatCardData } from "./stat-card"

const summaryCards: StatCardData[] = [
  { title: "Total de Impostos (mês)", value: "R$ 28.492,00", subtitle: "Competência Mai/2025" },
  { title: "Alíquota Média Efetiva", value: "9,8%", subtitle: "Simples Nacional" },
  { title: "Próximo vencimento", value: "20/06/2025", subtitle: "Em 11 dias", warning: true },
]

interface TaxRow {
  competencia: string
  regime: string
  base: string
  aliquota: string
  valor: string
  vencimento: string
  status: "pending" | "paid"
}

const rows: TaxRow[] = [
  { competencia: "Mai/2025", regime: "Simples Nacional", base: "R$ 284.920,00", aliquota: "9,8%", valor: "R$ 27.922,16", vencimento: "20/06/2025", status: "pending" },
  { competencia: "Abr/2025", regime: "Simples Nacional", base: "R$ 241.300,00", aliquota: "9,5%", valor: "R$ 22.923,50", vencimento: "20/05/2025", status: "paid" },
  { competencia: "Mar/2025", regime: "Simples Nacional", base: "R$ 198.750,00", aliquota: "9,5%", valor: "R$ 18.881,25", vencimento: "20/04/2025", status: "paid" },
  { competencia: "Fev/2025", regime: "Simples Nacional", base: "R$ 167.200,00", aliquota: "9,2%", valor: "R$ 15.382,40", vencimento: "20/03/2025", status: "paid" },
]

const columns = ["Competência", "Regime", "Faturamento Base", "Alíquota", "Valor do Imposto", "Vencimento", "Status"]

export function ImpostosTab() {
  return (
    <div className="space-y-6">
      {/* Warning banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 backdrop-blur-xl border border-orange-500/30"
        style={{ boxShadow: "0 0 20px rgba(249,115,22,0.1)" }}
      >
        <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
        <p className="text-sm text-orange-200">
          Você tem <span className="font-semibold">1 imposto com vencimento em 11 dias</span> — R$ 27.922,16
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-white">Impostos por Período</h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-cyan/20 hover:border-cyan/40 text-xs text-white transition-all">
              <Download className="w-3.5 h-3.5 text-cyan" />
              Exportar CSV
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-electric-blue to-neon-purple text-xs font-medium text-white transition-all hover:opacity-90">
              <Plus className="w-3.5 h-3.5" />
              Adicionar Lançamento
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
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
              {rows.map((row, index) => (
                <motion.tr
                  key={row.competencia}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  className={cn(
                    "border-b border-border/50 transition-all duration-200 hover:bg-gradient-to-r hover:from-electric-blue/5 hover:to-neon-purple/5 group",
                    index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                  )}
                >
                  <td className="px-4 py-3 text-sm font-medium text-white sticky left-0 bg-background/40 backdrop-blur-sm group-hover:bg-transparent whitespace-nowrap">
                    {row.competencia}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{row.regime}</td>
                  <td className="px-4 py-3 text-sm text-white whitespace-nowrap">{row.base}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{row.aliquota}</td>
                  <td className="px-4 py-3 text-sm text-white font-medium whitespace-nowrap">{row.valor}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{row.vencimento}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.status === "pending" ? (
                      <span className="px-2.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-xs font-medium text-orange-400">
                        A vencer
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-xs font-medium text-green-500">
                        Pago
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
