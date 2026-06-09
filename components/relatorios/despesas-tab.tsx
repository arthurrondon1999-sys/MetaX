"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Plus, Download, ArrowUpDown, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { StatCard, type StatCardData } from "./stat-card"

const summaryCards: StatCardData[] = [
  { title: "Total Despesas (mês)", value: "R$ 14.830,00", subtitle: "Junho/2025" },
  { title: "Maior categoria", value: "Ferramentas", subtitle: "R$ 4.200,00" },
  { title: "Despesas vs Faturamento", value: "5,2%", subtitle: "Saudável" },
]

const donutData = [
  { name: "Ferramentas & Software", value: 28, color: "#00D4FF" },
  { name: "Tráfego Pago", value: 18, color: "#8B00FF" },
  { name: "Equipe & Freelancers", value: 24, color: "#0066FF" },
  { name: "Infraestrutura", value: 14, color: "#22C55E" },
  { name: "Marketing & Criativo", value: 10, color: "#EAB308" },
  { name: "Outros", value: 6, color: "#6B7280" },
]

interface ExpenseRow {
  data: string
  descricao: string
  categoria: string
  valor: string
  recorrente: boolean
}

const rows: ExpenseRow[] = [
  { data: "01/06", descricao: "MetaX Pro Plan", categoria: "Ferramentas", valor: "R$ 497,00", recorrente: true },
  { data: "01/06", descricao: "Equipe de Criativos", categoria: "Equipe", valor: "R$ 3.200,00", recorrente: true },
  { data: "05/06", descricao: "Servidor AWS", categoria: "Infraestrutura", valor: "R$ 890,00", recorrente: true },
  { data: "10/06", descricao: "Designer Freelancer", categoria: "Equipe", valor: "R$ 1.500,00", recorrente: false },
  { data: "12/06", descricao: "ActiveCampaign", categoria: "Ferramentas", valor: "R$ 320,00", recorrente: true },
  { data: "15/06", descricao: "Produção de Vídeo", categoria: "Marketing", valor: "R$ 2.800,00", recorrente: false },
]

const columns = ["Data", "Descrição", "Categoria", "Valor", "Recorrente"]

function DonutTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-background/95 backdrop-blur-xl border border-cyan/30 rounded-lg p-2.5 shadow-xl">
      <div className="flex items-center gap-2 text-xs">
        <span className="w-2 h-2 rounded-full" style={{ background: item.payload.color }} />
        <span className="text-white font-medium">{item.name}</span>
        <span className="text-muted-foreground">{item.value}%</span>
      </div>
    </div>
  )
}

export function DespesasTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          {summaryCards.map((card, i) => (
            <StatCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-electric-blue to-neon-purple text-xs font-medium text-white transition-all hover:opacity-90">
          <Plus className="w-3.5 h-3.5" />
          Adicionar Despesa
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Donut chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="lg:col-span-2 bg-card/30 backdrop-blur-xl border border-border rounded-xl p-5"
        >
          <h3 className="text-base font-semibold text-white mb-4">Despesas por Categoria</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-xs font-medium text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Expenses table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="lg:col-span-3 bg-card/30 backdrop-blur-xl border border-border rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-base font-semibold text-white">Lançamentos de Despesas</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-cyan/20 hover:border-cyan/40 text-xs text-white transition-all">
              <Download className="w-3.5 h-3.5 text-cyan" />
              CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
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
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                    className={cn(
                      "border-b border-border/50 transition-all duration-200 hover:bg-gradient-to-r hover:from-electric-blue/5 hover:to-neon-purple/5 group",
                      index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                    )}
                  >
                    <td className="px-4 py-3 text-sm text-white sticky left-0 bg-background/40 backdrop-blur-sm group-hover:bg-transparent whitespace-nowrap">
                      {row.data}
                    </td>
                    <td className="px-4 py-3 text-sm text-white whitespace-nowrap">{row.descricao}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{row.categoria}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium whitespace-nowrap">{row.valor}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.recorrente ? (
                        <span className="flex items-center gap-1.5 text-xs text-green-500">
                          <Check className="w-3.5 h-3.5" />
                          Mensal
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <X className="w-3.5 h-3.5" />
                          Único
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
    </div>
  )
}
