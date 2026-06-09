"use client"

import { motion } from "framer-motion"
import { InfoIcon } from "@/components/shared/info-icon"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: string
  tip?: string
  className?: string
  delay?: number
  accent?: string
}

function MetricCard({ label, value, tip, className, delay = 0, accent }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "group relative rounded-xl bg-white/[0.03] border border-white/10 p-5 overflow-hidden hover:border-electric-blue/30 transition-all duration-300",
        className
      )}
    >
      {/* hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,102,255,0.08), transparent 70%)" }}
      />
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <InfoIcon tip={tip} />
      </div>
      <p className={cn("mt-3 text-2xl font-bold tracking-tight", accent ?? "text-white")}>{value}</p>
    </motion.div>
  )
}

export function MetricsGrid() {
  return (
    <div className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Faturamento Líquido" value="R$ 0,00" tip="Faturamento líquido no período" delay={0} />
        <MetricCard label="Gastos com Anúncios" value="R$ 0,00" tip="Total gasto em anúncios" delay={0.05} />
        <MetricCard label="Lucro" value="R$ 0,00" tip="Lucro no período" delay={0.1} accent="text-emerald-400" />
        <MetricCard label="ROAS" value="N/A" tip="Return on Ad Spend" delay={0.15} accent="text-cyan" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Faturamento Bruto" value="R$ 0,00" tip="Faturamento bruto no período" delay={0.2} />
        <MetricCard label="ARPU" value="R$ 0,00" tip="Receita média por usuário" delay={0.25} />
        <MetricCard label="Vendas Pendentes" value="R$ 0,00" tip="Vendas aguardando aprovação" delay={0.3} />
        <MetricCard label="ROI" value="N/A" tip="Return on Investment" delay={0.35} accent="text-cyan" />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <MetricCard label="CPA" value="R$ 0,00" tip="Custo por aquisição" delay={0.4} className="lg:col-span-1" />

        {/* Taxa de Aprovação (large) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="group relative rounded-xl bg-white/[0.03] border border-white/10 p-5 overflow-hidden hover:border-electric-blue/30 transition-all duration-300 lg:col-span-2"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">Taxa de Aprovação</span>
            <InfoIcon tip="Taxa de aprovação por método de pagamento" />
          </div>
          <div className="mt-4 space-y-2.5">
            {[
              { method: "Cartão", value: "N/A" },
              { method: "Pix", value: "N/A" },
              { method: "Boleto", value: "N/A" },
            ].map((row) => (
              <div key={row.method} className="flex items-center justify-between">
                <span className="text-sm text-white/70">{row.method}</span>
                <div className="flex items-center gap-3 flex-1 mx-4">
                  <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-0 bg-gradient-to-r from-electric-blue to-neon-purple rounded-full" />
                  </div>
                </div>
                <span className="text-sm font-medium text-white">{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <MetricCard label="Margem" value="N/A" tip="Margem de lucro" delay={0.5} className="lg:col-span-1" accent="text-cyan" />
      </div>
    </div>
  )
}
