"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { InfoIcon } from "@/components/shared/info-icon"
import { cn } from "@/lib/utils"
import { formatCurrency, formatDecimal } from "@/lib/meta/metrics"

export interface MetaSummary {
  spend: number
  impressions: number
  clicks: number
  reach: number
  cpc: number
  cpm: number
  ctr: number
  frequency: number
  purchases: number
  revenue: number
  leads: number
  roas: number
  cpa: number
}

interface MetricCardProps {
  label: string
  value: string
  tip?: string
  className?: string
  delay?: number
  accent?: string
  loading?: boolean
}

function MetricCard({ label, value, tip, className, delay = 0, accent, loading }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "group relative rounded-xl bg-white/[0.03] border border-white/10 p-5 overflow-hidden hover:border-electric-blue/30 transition-all duration-300",
        className,
      )}
    >
      {/* hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,102,255,0.08), transparent 70%)" }}
      />
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <InfoIcon tip={tip} />
      </div>
      {loading ? (
        <Loader2 className="mt-3 w-5 h-5 text-muted-foreground animate-spin" />
      ) : (
        <p className={cn("mt-3 text-2xl font-bold tracking-tight", accent ?? "text-white")}>{value}</p>
      )}
    </motion.div>
  )
}

interface MetricsGridProps {
  summary?: MetaSummary | null
  loading?: boolean
}

export function MetricsGrid({ summary, loading = false }: MetricsGridProps) {
  // Receita/vendas vêm das ações de compra rastreadas pelo Meta.
  const revenue = summary?.revenue ?? 0
  const spend = summary?.spend ?? 0
  const profit = revenue - spend
  const roas = summary?.roas ?? 0
  const cpa = summary?.cpa ?? 0
  const purchases = summary?.purchases ?? 0
  const arpu = purchases > 0 ? revenue / purchases : 0
  const roi = spend > 0 ? ((revenue - spend) / spend) * 100 : 0
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0

  const has = Boolean(summary)
  const money = (v: number) => (has ? formatCurrency(v) : "R$ 0,00")
  const naDecimal = (v: number, suffix = "") => (has && v ? `${formatDecimal(v)}${suffix}` : "N/A")
  const naPercent = (v: number) => (has && v ? `${formatDecimal(v)}%` : "N/A")

  return (
    <div className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Faturamento Líquido" value={money(revenue)} tip="Receita de compras rastreadas pelo Meta" delay={0} loading={loading} />
        <MetricCard label="Gastos com Anúncios" value={money(spend)} tip="Total gasto em anúncios no Meta" delay={0.05} loading={loading} />
        <MetricCard label="Lucro" value={money(profit)} tip="Receita menos gastos com anúncios" delay={0.1} accent={profit >= 0 ? "text-emerald-400" : "text-red-400"} loading={loading} />
        <MetricCard label="ROAS" value={naDecimal(roas, "x")} tip="Return on Ad Spend" delay={0.15} accent="text-cyan" loading={loading} />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Faturamento Bruto" value={money(revenue)} tip="Receita bruta de compras rastreadas" delay={0.2} loading={loading} />
        <MetricCard label="ARPU" value={money(arpu)} tip="Receita média por venda" delay={0.25} loading={loading} />
        <MetricCard label="Vendas" value={has ? String(purchases) : "0"} tip="Total de compras rastreadas" delay={0.3} loading={loading} />
        <MetricCard label="ROI" value={naPercent(roi)} tip="Return on Investment" delay={0.35} accent="text-cyan" loading={loading} />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <MetricCard label="CPA" value={has && cpa ? money(cpa) : "R$ 0,00"} tip="Custo por aquisição" delay={0.4} className="lg:col-span-1" loading={loading} />

        {/* Taxa de Aprovação (large) — depende de plataforma de vendas, não integrada */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="group relative rounded-xl bg-white/[0.03] border border-white/10 p-5 overflow-hidden hover:border-electric-blue/30 transition-all duration-300 lg:col-span-2"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">Taxa de Aprovação</span>
            <InfoIcon tip="Taxa de aprovação por método de pagamento (requer plataforma de vendas)" />
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

        <MetricCard label="Margem" value={naPercent(margin)} tip="Margem de lucro" delay={0.5} className="lg:col-span-1" accent="text-cyan" loading={loading} />
      </div>
    </div>
  )
}
