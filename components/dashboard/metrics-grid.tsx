"use client"

import { motion } from "framer-motion"
import { InfoIcon } from "@/components/shared/info-icon"
import { Skeleton } from "@/components/shared/skeleton"
import { cn } from "@/lib/utils"
import { useCurrency } from "@/lib/currency/currency-context"
import type { CombinedSummary } from "@/hooks/use-hotmart"
import {
  formatDecimal,
  positiveNegativeColor,
  roiMultiplierColor,
  cpaColor,
  COLOR_POSITIVE,
  COLOR_NEGATIVE,
  COLOR_NA,
  COLOR_NEUTRAL,
} from "@/lib/meta/metrics"

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
  /** Resumo combinado Meta (gastos) + Hotmart (faturamento/vendas reais). */
  summary?: CombinedSummary | null
  loading?: boolean
  /** Dispara o flash verde nos cards quando os dados são atualizados. */
  flash?: boolean
}

export function MetricsGrid({ summary, loading = false, flash = false }: MetricsGridProps) {
  const { formatMoney } = useCurrency()

  const has = Boolean(summary)
  const spend = summary?.spend ?? 0
  const iof = summary?.iof ?? 0
  const revenue = summary?.revenue ?? 0
  const profit = summary?.profit ?? 0
  const cpa = summary?.cpa ?? 0
  const sales = summary?.sales ?? 0
  const ticket = summary?.averageTicket ?? 0
  const roi = summary?.roi ?? 0

  const money = (v: number) => formatMoney(has ? v : 0)

  // Faturamento: vermelho se < gastos, verde se >= gastos
  const revenueColor = !has ? COLOR_NA : revenue >= spend ? COLOR_POSITIVE : COLOR_NEGATIVE
  // ROI multiplicador
  const roiText = has && roi ? `${formatDecimal(roi)}x` : "N/A"

  return (
    <div className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Faturamento Líquido"
          value={money(revenue)}
          tip="Comissão líquida do produtor nas vendas aprovadas da Hotmart. Vermelho quando menor que os gastos com anúncios."
          delay={0}
          accent={revenueColor}
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
          label="IOF (3,5%)"
          value={money(iof)}
          tip="Imposto sobre Operações Financeiras: 3,5% sobre os gastos com anúncios (cobrança internacional no cartão)"
          delay={0.1}
          accent={COLOR_NEGATIVE}
          loading={loading}
          flash={flash}
        />
        <MetricCard
          label="Lucro"
          value={money(profit)}
          tip="Faturamento líquido menos gastos com anúncios e IOF"
          delay={0.15}
          accent={positiveNegativeColor(profit, has)}
          loading={loading}
          flash={flash}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Ticket Médio"
          value={money(ticket)}
          tip="Faturamento médio por venda aprovada"
          delay={0.2}
          loading={loading}
          flash={flash}
        />
        <MetricCard
          label="Vendas"
          value={has ? String(sales) : "0"}
          tip="Total de vendas aprovadas na Hotmart"
          delay={0.25}
          accent={positiveNegativeColor(sales, has)}
          loading={loading}
          flash={flash}
        />
        <MetricCard
          label="CPA"
          value={has && cpa ? money(cpa) : money(0)}
          tip="Custo por aquisição (gastos ÷ vendas)"
          delay={0.3}
          accent={has && cpa ? cpaColor(cpa) : COLOR_NA}
          loading={loading}
          flash={flash}
        />
        <MetricCard
          label="ROI"
          value={roiText}
          tip="Retorno sobre investimento (faturamento ÷ gastos). Acima de 1.0x = lucro | Abaixo de 1.0x = prejuízo"
          delay={0.35}
          accent={roiMultiplierColor(roi, has)}
          loading={loading}
          flash={flash}
        />
      </div>
    </div>
  )
}
