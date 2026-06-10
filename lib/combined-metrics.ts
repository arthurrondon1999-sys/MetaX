import type { HotmartSale } from "@/hooks/use-hotmart"
import type { MetaSummary } from "@/components/dashboard/metrics-grid"

const APPROVED_STATUSES = new Set(["COMPLETE", "APPROVED"])

export interface PaymentApproval {
  label: string
  approved: number
  total: number
  rate: number // 0-100
}

export interface CombinedSummary {
  adSpend: number
  netRevenue: number // comissão líquida do produtor (USD)
  approvedSales: number
  totalTransactions: number
  profit: number
  roas: number
  roi: number // %
  margin: number // %
  cpa: number
  ticket: number // ARPU = receita líquida / vendas aprovadas
  approvalByPayment: PaymentApproval[]
  approvalRate: number // geral %
}

const PAYMENT_LABELS: Record<string, string> = {
  CREDIT_CARD: "Cartão",
  BILLET: "Boleto",
  PItX: "Pix",
  PIX: "Pix",
  PAYPAL: "PayPal",
  DIRECT_DEBIT: "Débito",
  GOOGLE_PAY: "Google Pay",
  HYBRID: "Híbrido",
}

function paymentLabel(type: string): string {
  return PAYMENT_LABELS[type] ?? (type ? type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, " ") : "Outro")
}

/**
 * Combina o gasto de anúncios do Meta com as vendas reais da Hotmart.
 * Usa a comissão do produtor (normalizada em USD pela Hotmart) como
 * faturamento líquido, o que é diretamente comparável ao gasto do Meta (USD).
 */
export function combineMetrics(meta: MetaSummary | null, sales: HotmartSale[]): CombinedSummary {
  const adSpend = meta?.spend ?? 0

  const approved = sales.filter((s) => APPROVED_STATUSES.has(s.status))
  const netRevenue = approved.reduce((sum, s) => sum + (s.commissionValue || 0), 0)
  const approvedSales = approved.length
  const totalTransactions = sales.length

  const profit = netRevenue - adSpend
  const roas = adSpend > 0 ? netRevenue / adSpend : 0
  const roi = adSpend > 0 ? ((netRevenue - adSpend) / adSpend) * 100 : 0
  const margin = netRevenue > 0 ? (profit / netRevenue) * 100 : 0
  const cpa = approvedSales > 0 ? adSpend / approvedSales : 0
  const ticket = approvedSales > 0 ? netRevenue / approvedSales : 0

  // Taxa de aprovação por método de pagamento
  const byPayment = new Map<string, { approved: number; total: number }>()
  for (const s of sales) {
    const key = s.paymentType || "OUTRO"
    const entry = byPayment.get(key) ?? { approved: 0, total: 0 }
    entry.total += 1
    if (APPROVED_STATUSES.has(s.status)) entry.approved += 1
    byPayment.set(key, entry)
  }

  const approvalByPayment: PaymentApproval[] = Array.from(byPayment.entries())
    .map(([type, v]) => ({
      label: paymentLabel(type),
      approved: v.approved,
      total: v.total,
      rate: v.total > 0 ? (v.approved / v.total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)

  const approvalRate = totalTransactions > 0 ? (approvedSales / totalTransactions) * 100 : 0

  return {
    adSpend,
    netRevenue,
    approvedSales,
    totalTransactions,
    profit,
    roas,
    roi,
    margin,
    cpa,
    ticket,
    approvalByPayment,
    approvalRate,
  }
}
