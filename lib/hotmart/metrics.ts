import type { HotmartSale } from "./api"

/** Status considerados como venda aprovada/efetivada */
export const APPROVED_STATUSES = new Set(["APPROVED", "COMPLETE"])
/** Status de reembolso/estorno */
export const REFUND_STATUSES = new Set(["REFUNDED", "CHARGEBACK"])

/** Agrupa métodos de pagamento da Hotmart em categorias amigáveis (PT-BR) */
export function paymentGroup(paymentType: string): "Cartão" | "Pix" | "Boleto" | "Outros" {
  const t = (paymentType || "").toUpperCase()
  if (t.includes("CREDIT") || t.includes("CARD") || t === "PAYPAL") return "Cartão"
  if (t.includes("PIX")) return "Pix"
  if (t.includes("BILLET") || t.includes("BOLETO") || t.includes("BANK_SLIP")) return "Boleto"
  return "Outros"
}

export interface ApprovalRate {
  method: string
  approved: number
  total: number
  rate: number // 0-100
}

export interface HotmartSummary {
  revenue: number // faturamento (comissão líquida do produtor, USD)
  sales: number // vendas aprovadas
  totalTransactions: number // todas as transações no período
  refunds: number // qtd de reembolsos/estornos
  refundValue: number // valor estimado reembolsado (USD)
  averageTicket: number // ticket médio (USD) das vendas aprovadas
  approvalRates: ApprovalRate[]
}

export interface HotmartDailyRow {
  date: string // YYYY-MM-DD
  sales: number
  revenue: number
  refunds: number
}

/** Calcula o resumo agregado das vendas Hotmart de um período. */
export function summarizeHotmart(sales: HotmartSale[]): HotmartSummary {
  let revenue = 0
  let approved = 0
  let refunds = 0
  let refundValue = 0

  // Aprovação por grupo de pagamento
  const groups: Record<string, { approved: number; total: number }> = {
    Cartão: { approved: 0, total: 0 },
    Pix: { approved: 0, total: 0 },
    Boleto: { approved: 0, total: 0 },
  }

  for (const s of sales) {
    const isApproved = APPROVED_STATUSES.has(s.status)
    const isRefund = REFUND_STATUSES.has(s.status)
    const group = paymentGroup(s.paymentType)

    if (groups[group]) {
      groups[group].total += 1
      if (isApproved) groups[group].approved += 1
    }

    if (isApproved) {
      approved += 1
      revenue += s.commissionValue
    }
    if (isRefund) {
      refunds += 1
      refundValue += s.commissionValue
    }
  }

  const approvalRates: ApprovalRate[] = (["Cartão", "Pix", "Boleto"] as const).map((method) => {
    const g = groups[method]
    return {
      method,
      approved: g.approved,
      total: g.total,
      rate: g.total > 0 ? (g.approved / g.total) * 100 : 0,
    }
  })

  return {
    revenue,
    sales: approved,
    totalTransactions: sales.length,
    refunds,
    refundValue,
    averageTicket: approved > 0 ? revenue / approved : 0,
    approvalRates,
  }
}

/** Agrupa as vendas aprovadas por dia (YYYY-MM-DD). */
export function dailyHotmart(sales: HotmartSale[]): HotmartDailyRow[] {
  const map = new Map<string, HotmartDailyRow>()

  for (const s of sales) {
    if (!s.purchaseDate) continue
    const date = s.purchaseDate.slice(0, 10)
    const row = map.get(date) ?? { date, sales: 0, revenue: 0, refunds: 0 }
    if (APPROVED_STATUSES.has(s.status)) {
      row.sales += 1
      row.revenue += s.commissionValue
    }
    if (REFUND_STATUSES.has(s.status)) {
      row.refunds += 1
    }
    map.set(date, row)
  }

  return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date))
}
