import { NextResponse } from "next/server"
import { getMetaIntegration, getHotmartIntegration } from "@/lib/meta/integration"
import { getAdAccounts, getDailyInsights, findActionValue } from "@/lib/meta/api"
import { getHotmartToken, fetchHotmartSales } from "@/lib/hotmart/api"
import { dailyHotmart } from "@/lib/hotmart/metrics"
import { presetToRange } from "@/lib/date-range"

export interface DailyReportRow {
  date: string
  sales: number
  spend: number
  revenue: number
  profit: number
  roas: number
  roi: number
  cpa: number
  averageTicket: number
  margin: number
  refunds: number
}

/**
 * Relatório diário combinado: gastos do Meta por dia + vendas/faturamento da Hotmart por dia.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const datePreset = searchParams.get("date_preset") || "last_7d"

  const [metaIntegration, hotmartIntegration] = await Promise.all([
    getMetaIntegration(),
    getHotmartIntegration(),
  ])

  // Mapa dia -> { spend }
  const spendByDay = new Map<string, number>()
  let metaConnected = false
  let metaError: string | undefined

  if (metaIntegration) {
    try {
      let accountId = metaIntegration.accountId
      if (!accountId) {
        const accounts = await getAdAccounts(metaIntegration.token)
        accountId = accounts[0]?.account_id ?? null
      }
      if (accountId) {
        const daily = await getDailyInsights(accountId, metaIntegration.token, datePreset)
        for (const d of daily) {
          spendByDay.set(d.date_start, Number.parseFloat(d.spend || "0"))
        }
        metaConnected = true
      }
    } catch (e) {
      metaError = e instanceof Error ? e.message : "Erro ao buscar dados do Meta"
    }
  }

  // Mapa dia -> { sales, revenue, refunds }
  const salesByDay = new Map<string, { sales: number; revenue: number; refunds: number }>()
  let hotmartConnected = false
  let hotmartError: string | undefined

  if (hotmartIntegration) {
    const tokenResult = await getHotmartToken(hotmartIntegration.basicCredential)
    if (tokenResult.ok && tokenResult.token) {
      hotmartConnected = true
      try {
        const { start, end } = presetToRange(datePreset)
        const sales = await fetchHotmartSales(tokenResult.token, start, end)
        for (const row of dailyHotmart(sales)) {
          salesByDay.set(row.date, { sales: row.sales, revenue: row.revenue, refunds: row.refunds })
        }
      } catch {
        hotmartError = "Erro ao buscar vendas na Hotmart"
      }
    } else {
      hotmartError = tokenResult.error
    }
  }

  // União de todas as datas
  const allDates = new Set<string>([...spendByDay.keys(), ...salesByDay.keys()])
  const rows: DailyReportRow[] = Array.from(allDates)
    .sort((a, b) => b.localeCompare(a))
    .map((date) => {
      const spend = spendByDay.get(date) ?? 0
      const h = salesByDay.get(date) ?? { sales: 0, revenue: 0, refunds: 0 }
      const profit = h.revenue - spend
      return {
        date,
        sales: h.sales,
        spend,
        revenue: h.revenue,
        profit,
        roas: spend > 0 ? h.revenue / spend : 0,
        roi: spend > 0 ? ((h.revenue - spend) / spend) * 100 : 0,
        cpa: h.sales > 0 ? spend / h.sales : 0,
        averageTicket: h.sales > 0 ? h.revenue / h.sales : 0,
        margin: h.revenue > 0 ? (profit / h.revenue) * 100 : 0,
        refunds: h.refunds,
      }
    })

  return NextResponse.json({
    rows,
    sources: {
      meta: { connected: metaConnected, error: metaError },
      hotmart: { connected: hotmartConnected, error: hotmartError },
    },
  })
}
