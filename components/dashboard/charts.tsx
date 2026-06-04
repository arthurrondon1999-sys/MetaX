"use client"

import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

const revenueVsSpendingData = [
  { hour: "00h", faturamento: 1200, gastos: 320 },
  { hour: "01h", faturamento: 800, gastos: 280 },
  { hour: "02h", faturamento: 600, gastos: 200 },
  { hour: "03h", faturamento: 400, gastos: 150 },
  { hour: "04h", faturamento: 350, gastos: 120 },
  { hour: "05h", faturamento: 500, gastos: 180 },
  { hour: "06h", faturamento: 900, gastos: 300 },
  { hour: "07h", faturamento: 1800, gastos: 450 },
  { hour: "08h", faturamento: 2800, gastos: 580 },
  { hour: "09h", faturamento: 3200, gastos: 620 },
  { hour: "10h", faturamento: 3800, gastos: 680 },
  { hour: "11h", faturamento: 4200, gastos: 750 },
  { hour: "12h", faturamento: 5100, gastos: 820 },
  { hour: "13h", faturamento: 4800, gastos: 780 },
  { hour: "14h", faturamento: 4500, gastos: 720 },
  { hour: "15h", faturamento: 4000, gastos: 680 },
  { hour: "16h", faturamento: 3600, gastos: 620 },
  { hour: "17h", faturamento: 3200, gastos: 580 },
  { hour: "18h", faturamento: 3800, gastos: 650 },
  { hour: "19h", faturamento: 4800, gastos: 780 },
  { hour: "20h", faturamento: 5200, gastos: 850 },
  { hour: "21h", faturamento: 4600, gastos: 720 },
  { hour: "22h", faturamento: 3200, gastos: 520 },
  { hour: "23h", faturamento: 2000, gastos: 380 },
]

const salesByHourData = [
  { hour: "00h", sales: 45 },
  { hour: "01h", sales: 32 },
  { hour: "02h", sales: 18 },
  { hour: "03h", sales: 12 },
  { hour: "04h", sales: 8 },
  { hour: "05h", sales: 15 },
  { hour: "06h", sales: 28 },
  { hour: "07h", sales: 65 },
  { hour: "08h", sales: 98 },
  { hour: "09h", sales: 112 },
  { hour: "10h", sales: 135 },
  { hour: "11h", sales: 148 },
  { hour: "12h", sales: 178 },
  { hour: "13h", sales: 165 },
  { hour: "14h", sales: 142 },
  { hour: "15h", sales: 128 },
  { hour: "16h", sales: 115 },
  { hour: "17h", sales: 102 },
  { hour: "18h", sales: 125 },
  { hour: "19h", sales: 168 },
  { hour: "20h", sales: 185 },
  { hour: "21h", sales: 155 },
  { hour: "22h", sales: 98 },
  { hour: "23h", sales: 62 },
]

const periodTabs = ["Hoje", "7 dias", "30 dias", "Personalizado"]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-xl border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.dataKey === "faturamento" ? "Faturamento" : entry.dataKey === "gastos" ? "Gastos" : "Vendas"}:{" "}
            {entry.dataKey === "sales"
              ? entry.value
              : `R$ ${entry.value.toLocaleString("pt-BR")}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function RevenueChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan" />
          <h3 className="text-lg font-semibold text-white">Faturamento vs Gastos</h3>
        </div>
        <div className="flex items-center gap-2">
          {periodTabs.map((tab, index) => (
            <button
              key={tab}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                index === 0
                  ? "bg-gradient-to-r from-electric-blue/20 to-neon-purple/20 text-white border border-cyan/30"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan" />
          <span className="text-xs text-muted-foreground">Faturamento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neon-purple" />
          <span className="text-xs text-muted-foreground">Gastos</span>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueVsSpendingData}>
            <defs>
              <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B00FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B00FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="hour"
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="faturamento"
              stroke="#00D4FF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorFaturamento)"
            />
            <Area
              type="monotone"
              dataKey="gastos"
              stroke="#8B00FF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGastos)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export function SalesByHourChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-6 h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 rounded-full bg-electric-blue" />
        <h3 className="text-lg font-semibold text-white">Vendas por Horário</h3>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesByHourData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0066FF" />
                <stop offset="100%" stopColor="#8B00FF" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="hour"
              stroke="#6B7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={2}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="sales"
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
