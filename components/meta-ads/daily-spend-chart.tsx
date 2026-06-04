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
} from "recharts"

const data = [
  { day: "Seg", investimento: 1200, resultados: 28 },
  { day: "Ter", investimento: 1450, resultados: 35 },
  { day: "Qua", investimento: 980, resultados: 22 },
  { day: "Qui", investimento: 1680, resultados: 42 },
  { day: "Sex", investimento: 1520, resultados: 38 },
  { day: "Sáb", investimento: 890, resultados: 18 },
  { day: "Dom", investimento: 571, resultados: 12 },
]

export function DailySpendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="relative bg-card/30 backdrop-blur-xl border border-border rounded-xl p-6 overflow-hidden group"
    >
      {/* Glow effect */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-cyan/0 via-electric-blue/0 to-neon-purple/0 group-hover:from-cyan/10 group-hover:via-electric-blue/10 group-hover:to-neon-purple/10 transition-all duration-300 blur-sm" />

      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-white mb-1">
          Investimento Diário — Últimos 7 dias
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Comparativo de investimento vs resultados
        </p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="investimentoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B00FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B00FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resultadosGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                tickFormatter={(value) => `R$${value}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(5, 8, 24, 0.9)",
                  border: "1px solid rgba(0, 212, 255, 0.2)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                }}
                labelStyle={{ color: "white", fontWeight: "bold" }}
                itemStyle={{ color: "rgba(255,255,255,0.8)" }}
                formatter={(value: number, name: string) => {
                  if (name === "investimento") return [`R$ ${value}`, "Investimento"]
                  return [value, "Resultados"]
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="investimento"
                stroke="#8B00FF"
                strokeWidth={2}
                fill="url(#investimentoGradient)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="resultados"
                stroke="#00D4FF"
                strokeWidth={2}
                fill="url(#resultadosGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-purple" />
            <span className="text-sm text-muted-foreground">Investimento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan" />
            <span className="text-sm text-muted-foreground">Resultados (Compras)</span>
          </div>
        </div>
      </div>

      {/* Border glow */}
      <div className="absolute inset-0 rounded-xl border border-cyan/10 group-hover:border-cyan/30 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  )
}
