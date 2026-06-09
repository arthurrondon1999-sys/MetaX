"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ArrowUpDown, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { StatCard, type StatCardData } from "./stat-card"

const summaryCards: StatCardData[] = [
  { title: "Faturamento Total", value: "R$ 284.920,00", trend: { value: "+18,4%", positive: true } },
  { title: "Lucro Líquido", value: "R$ 231.408,00", trend: { value: "+21,2%", positive: true } },
  { title: "Total de Vendas", value: "1.847 pedidos", trend: { value: "+15,7%", positive: true } },
  { title: "Ticket Médio", value: "R$ 154,30", trend: { value: "+2,3%", positive: true } },
]

// 30 days of financial evolution data
const chartData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  const base = 6000 + Math.sin(i / 3) * 2500 + i * 180
  const faturamento = Math.round(base + Math.random() * 1500)
  const gastos = Math.round(faturamento * (0.16 + Math.random() * 0.04))
  const lucro = faturamento - gastos - Math.round(faturamento * 0.08)
  return { day: `${day}`, faturamento, lucro, gastos }
})

const periodTabs = ["7 dias", "30 dias", "3 meses", "12 meses", "Personalizado"]

interface FinanceRow {
  data: string
  plataforma: string
  produto: string
  pedidos: number
  bruto: string
  descontos: string
  liquido: string
  custoAds: string
  lucro: string
  margem: number
}

const rows: FinanceRow[] = [
  { data: "09/06", plataforma: "Hotmart", produto: "Curso de Tráfego Pro", pedidos: 47, bruto: "R$ 14.053,00", descontos: "R$ 0,00", liquido: "R$ 14.053,00", custoAds: "R$ 2.840,00", lucro: "R$ 11.213,00", margem: 79.8 },
  { data: "08/06", plataforma: "Hotmart", produto: "Curso de Tráfego Pro", pedidos: 39, bruto: "R$ 11.661,00", descontos: "R$ 200,00", liquido: "R$ 11.461,00", custoAds: "R$ 2.120,00", lucro: "R$ 9.341,00", margem: 81.5 },
  { data: "07/06", plataforma: "Kiwify", produto: "Mentoria VIP", pedidos: 12, bruto: "R$ 11.940,00", descontos: "R$ 0,00", liquido: "R$ 11.940,00", custoAds: "R$ 1.890,00", lucro: "R$ 10.050,00", margem: 84.2 },
  { data: "06/06", plataforma: "Hotmart", produto: "Curso de Tráfego Pro", pedidos: 51, bruto: "R$ 15.249,00", descontos: "R$ 500,00", liquido: "R$ 14.749,00", custoAds: "R$ 3.100,00", lucro: "R$ 11.649,00", margem: 79.0 },
  { data: "05/06", plataforma: "Hotmart", produto: "Ebook Avançado", pedidos: 28, bruto: "R$ 2.772,00", descontos: "R$ 0,00", liquido: "R$ 2.772,00", custoAds: "R$ 490,00", lucro: "R$ 2.282,00", margem: 82.3 },
  { data: "04/06", plataforma: "Kiwify", produto: "Mentoria VIP", pedidos: 8, bruto: "R$ 7.960,00", descontos: "R$ 0,00", liquido: "R$ 7.960,00", custoAds: "R$ 1.200,00", lucro: "R$ 6.760,00", margem: 84.9 },
  { data: "03/06", plataforma: "Hotmart", produto: "Curso de Tráfego Pro", pedidos: 44, bruto: "R$ 13.156,00", descontos: "R$ 300,00", liquido: "R$ 12.856,00", custoAds: "R$ 2.540,00", lucro: "R$ 10.316,00", margem: 80.2 },
  { data: "02/06", plataforma: "Hotmart", produto: "Curso de Tráfego Pro", pedidos: 36, bruto: "R$ 10.764,00", descontos: "R$ 0,00", liquido: "R$ 10.764,00", custoAds: "R$ 1.980,00", lucro: "R$ 8.784,00", margem: 81.6 },
]

const columns = [
  "Data", "Plataforma", "Produto", "Pedidos", "Fat. Bruto", "Descontos", "Fat. Líquido", "Custo Ads", "Lucro", "Margem %",
]

function getMargemColor(m: number) {
  if (m >= 80) return "text-green-500"
  if (m >= 70) return "text-yellow-500"
  return "text-red-500"
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-background/95 backdrop-blur-xl border border-cyan/30 rounded-lg p-3 shadow-xl">
      <p className="text-xs text-muted-foreground mb-2">Dia {label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-medium text-white">
            R$ {p.value.toLocaleString("pt-BR")}
          </span>
        </div>
      ))}
    </div>
  )
}

export function FinanceiroTab() {
  const [activePeriod, setActivePeriod] = useState("30 dias")

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <StatCard key={card.title} card={card} index={i} />
        ))}
      </div>

      {/* Main chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-card/30 backdrop-blur-xl border border-border rounded-xl p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h3 className="text-base font-semibold text-white">
            Evolução Financeira — Últimos 30 dias
          </h3>
          <div className="flex items-center gap-1 p-1 bg-background/50 border border-border rounded-lg">
            {periodTabs.map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium transition-all",
                  activePeriod === p
                    ? "bg-gradient-to-r from-electric-blue to-neon-purple text-white"
                    : "text-muted-foreground hover:text-white"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradFat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradLucro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B00FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8B00FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="faturamento" name="Faturamento" stroke="#00D4FF" strokeWidth={2} fill="url(#gradFat)" />
              <Area type="monotone" dataKey="lucro" name="Lucro" stroke="#22C55E" strokeWidth={2} fill="url(#gradLucro)" />
              <Area type="monotone" dataKey="gastos" name="Gastos com Ads" stroke="#8B00FF" strokeWidth={2} fill="url(#gradGastos)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
          {[
            { label: "Faturamento", color: "#00D4FF" },
            { label: "Lucro", color: "#22C55E" },
            { label: "Gastos com Ads", color: "#8B00FF" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Detailed table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-card/30 backdrop-blur-xl border border-border rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-white">Extrato Financeiro Detalhado</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
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
                  key={row.data}
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
                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{row.plataforma}</td>
                  <td className="px-4 py-3 text-sm text-white whitespace-nowrap">{row.produto}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{row.pedidos}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{row.bruto}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{row.descontos}</td>
                  <td className="px-4 py-3 text-sm text-white whitespace-nowrap">{row.liquido}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{row.custoAds}</td>
                  <td className="px-4 py-3 text-sm font-medium text-green-500 whitespace-nowrap">{row.lucro}</td>
                  <td className={cn("px-4 py-3 text-sm font-bold", getMargemColor(row.margem))}>
                    {row.margem.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}%
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-border">
          <span className="text-xs text-muted-foreground">Mostrando 8 de 30 dias</span>
          <div className="flex items-center gap-3">
            <button className="text-xs text-cyan hover:text-white transition-colors">Ver todos</button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-cyan/20 hover:border-cyan/40 text-xs text-white transition-all">
              <Download className="w-3.5 h-3.5 text-cyan" />
              Exportar CSV
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
