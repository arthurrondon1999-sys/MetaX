"use client"

import { motion } from "framer-motion"
import { InfoIcon } from "@/components/shared/info-icon"
import { Skeleton } from "@/components/shared/skeleton"
import { cn } from "@/lib/utils"
import { useCurrency } from "@/lib/currency/currency-context"
import {
  formatDecimal,
  positiveNegativeColor,
  roiColor,
  roasColor,
  cpaColor,
  COLOR_NA,
  COLOR_NEUTRAL,
} from "@/lib/meta/metrics"

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
  flash?: boolean
}

function MetricCard({ label, value, tip, className, delay = 0, accent, loading, flash }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "group relative rounded-xl bg-white/[0.03] border border-white/10 p-5 overflow-hidden hover:border-electric-blue/30 transition-all duration-300",
        flash && !loading && "animate-data-flash",
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,102,255,0.08), transparent 70%)" }}
      />
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-[#E5E7EB]">{label}</span>
        <InfoIcon tip={tip} />
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-7 w-3/4" />
      ) : (
        <p className={cn("mt-3 text-2xl font-bold tracking-tight", accent ?? COLOR_NEUTRAL)}>{value}</p>
      )}
    </motion.div>
  )
}

interface MetricsGridProps {
  summary?: MetaSummary | null
  loading?: boolean
  /** Dispara o flash verde nos cards quando os dados são atualizados */
  flash?: boolean
}

export function MetricsGrid({ summary, loading = false, flash = false }: MetricsGridProps) {
  const { formatMoney } = useCurrency()

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
  const money = (v: number) => (has ? formatMoney(v) : formatMoney(0))
  const naDecimal = (v: number, suffix = "") => (has && v ? `${formatDecimal(v)}${suffix}` : "N/A")
  const naPercent = (v: number) => (has && v ? `${formatDecimal(v)}%` : "N/A")

  return (
    <div className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Faturamento Líquido"
          value={money(revenue)}
          tip="Receita de compras rastreadas pelo Meta"
          delay={0}
          accent={positiveNegativeColor(revenue, has)}
          loading={loading}
          flash={flash}
        />
        <MetricCard
          label="Gastos com Anúncios"
          value={money(spend)}
          tip="Total gasto em anúncios no Meta"
          delay={0.05}
          loading={loading}
          flash={flash}
        />
        <MetricCard
          label="Lucro"
          value={money(profit)}
          tip="Receita menos gastos com anúncios"
          delay={0.1}
          accent={positiveNegativeColor(profit, has)}
          loading={loading}
          flash={flash}
        />
        <MetricCard
          label="ROAS"
          value={naDecimal(roas, "x")}
          tip="Return on Ad Spend"
          delay={0.15}
          accent={has && roas ? roasColor(roas) : COLOR_NA}
          loading={loading}
          flash={flash}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Faturamento Bruto"
          value={money(revenue)}
          tip="Receita bruta de compras rastreadas"
          delay={0.2}
          accent={positiveNegativeColor(revenue, has)}
          loading={loading}
          flash={flash}
        />
        <MetricCard label="ARPU" value={money(arpu)} tip="Receita média por venda" delay={0.25} loading={loading} flash={flash} />
        <MetricCard
          label="Vendas"
          value={has ? String(purchases) : "0"}
          tip="Total de compras rastreadas"
          delay={0.3}
          accent={positiveNegativeColor(purchases, has)}
          loading={loading}
          flash={flash}
        />
        <MetricCard
          label="ROI"
          value={naPercent(roi)}
          tip="Return on Investment"
          delay={0.35}
          accent={has && roi ? roiColor(roi) : COLOR_NA}
          loading={loading}
          flash={flash}
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <MetricCard
          label="CPA"
          value={has && cpa ? money(cpa) : money(0)}
          tip="Custo por aquisição"
          delay={0.4}
          className="lg:col-span-1"
          accent={has && cpa ? cpaColor(cpa) : COLOR_NA}
          loading={loading}
          flash={flash}
        />

        {/* Taxa de Aprovação (large) — depende de plataforma de vendas, não integrada */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="group relative rounded-xl bg-white/[0.03] border border-white/10 p-5 overflow-hidden hover:border-electric-blue/30 transition-all duration-300 lg:col-span-2"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-medium text-[#E5E7EB]">Taxa de Aprovação</span>
            <InfoIcon tip="Taxa de aprovação por método de pagamento (requer plataforma de vendas)" />
          </div>
          <div className="mt-4 space-y-2.5">
            {[
              { method: "Cartão", value: "N/A" },
              { method: "Pix", value: "N/A" },
              { method: "Boleto", value: "N/A" },
            ].map((row) => (
              <div key={row.method} className="flex items-center justify-between">
                <span className="text-sm text-white/80">{row.method}</span>
                <div className="flex items-center gap-3 flex-1 mx-4">
                  <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-0 bg-gradient-to-r from-electric-blue to-neon-purple rounded-full" />
                  </div>
                </div>
                <span className={cn("text-sm font-medium", COLOR_NA)}>{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <MetricCard
          label="Margem"
          value={naPercent(margin)}
          tip="Margem de lucro"
          delay={0.5}
          className="lg:col-span-1"
          accent={has && margin ? roiColor(margin) : COLOR_NA}
          loading={loading}
          flash={flash}
        />
      </div>
    </div>
  )
}
