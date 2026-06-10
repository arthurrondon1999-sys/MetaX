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
  roiColor,
  roasColor,
  cpaColor,
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

const PAYMENT_LABELS: Record<string, string> = {
  CREDIT_CARD: "Cartão",
  BILLET: "Boleto",
  PIX: "Pix",
  PAYPAL: "PayPal",
  DIRECT_DEBIT: "Débito",
  GOOGLE_PAY: "Google Pay",
  SAMSUNG_PAY: "Samsung Pay",
  WALLET: "Carteira",
}

function paymentLabel(method: string): string {
  return PAYMENT_LABELS[method] ?? method.replace(/_/g, " ")
}

export function MetricsGrid({ summary, loading = false, flash = false }: MetricsGridProps) {
  const { formatMoney } = useCurrency()

  const has = Boolean(summary)
  const spend = summary?.spend ?? 0
  const revenue = summary?.revenue ?? 0
  const profit = summary?.profit ?? 0
  const roas = summary?.roas ?? 0
  const cpa = summary?.cpa ?? 0
  const sales = summary?.sales ?? 0
  const ticket = summary?.averageTicket ?? 0
  const roi = summary?.roi ?? 0
  const margin = summary?.margin ?? 0
  const approvalRates = summary?.approvalRates ?? []

  const money = (v: number) => formatMoney(has ? v : 0)
  const naDecimal = (v: number, suffix = "") => (has && v ? `${formatDecimal(v)}${suffix}` : "N/A")
  const naPercent = (v: number) => (has && v ? `${formatDecimal(v)}%` : "N/A")

  return (
    <div className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Faturamento Líquido"
          value={money(revenue)}
          tip="Comissão líquida do produtor nas vendas aprovadas da Hotmart"
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
          tip="Faturamento líquido menos gastos com anúncios"
          delay={0.1}
          accent={positiveNegativeColor(profit, has)}
          loading={loading}
          flash={flash}
        />
        <MetricCard
          label="ROAS"
          value={naDecimal(roas, "x")}
          tip="Retorno sobre o investimento em anúncios (faturamento ÷ gastos)"
          delay={0.15}
          accent={has && roas ? roasColor(roas) : COLOR_NA}
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
          value={naPercent(roi)}
          tip="Retorno sobre o investimento ((lucro ÷ gastos) × 100)"
          delay={0.35}
          accent={has && roi ? roiColor(roi) : COLOR_NA}
          loading={loading}
          flash={flash}
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Margem"
          value={naPercent(margin)}
          tip="Margem de lucro (lucro ÷ faturamento)"
          delay={0.4}
          className="lg:col-span-1"
          accent={has && margin ? roiColor(margin) : COLOR_NA}
          loading={loading}
          flash={flash}
        />

        {/* Taxa de Aprovação por método de pagamento (vendas reais da Hotmart) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="group relative rounded-xl bg-white/[0.03] border border-white/10 p-5 overflow-hidden hover:border-electric-blue/30 transition-all duration-300 lg:col-span-3"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-medium text-[#E5E7EB]">Taxa de Aprovação</span>
            <InfoIcon tip="Taxa de aprovação por método de pagamento (vendas Hotmart)" />
          </div>
          <div className="mt-4 space-y-2.5">
            {loading ? (
              <>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </>
            ) : approvalRates.length === 0 ? (
              <p className="text-sm text-[#94A3B8]">Conecte a Hotmart para ver as taxas de aprovação.</p>
            ) : (
              approvalRates.map((row) => (
                <div key={row.method} className="flex items-center justify-between">
                  <span className="text-sm text-white/80 w-24 shrink-0">{paymentLabel(row.method)}</span>
                  <div className="flex items-center gap-3 flex-1 mx-4">
                    <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-electric-blue to-neon-purple rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(row.rate, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium tabular-nums w-28 text-right shrink-0",
                      row.rate >= 80 ? "text-[#00FF88]" : row.rate >= 50 ? "text-[#FFB020]" : "text-[#FF4444]",
                    )}
                  >
                    {`${formatDecimal(row.rate)}% (${row.approved}/${row.total})`}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
