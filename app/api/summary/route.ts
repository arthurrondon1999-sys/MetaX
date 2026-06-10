import { NextResponse } from "next/server"
import { getMetaIntegration, getHotmartIntegration } from "@/lib/meta/integration"
import { getAdAccounts, getAccountInsights, findActionValue } from "@/lib/meta/api"
import { getHotmartToken, fetchHotmartSales } from "@/lib/hotmart/api"
import { summarizeHotmart } from "@/lib/hotmart/metrics"
import { presetToRange } from "@/lib/date-range"

/**
 * Resumo combinado: gastos com anúncios (Meta) + faturamento e vendas reais (Hotmart).
 * Ambas as fontes operam em USD, então o cruzamento de ROAS/ROI/CPA é consistente.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const datePreset = searchParams.get("date_preset") || "last_30d"

  const [metaIntegration, hotmartIntegration] = await Promise.all([
    getMetaIntegration(),
    getHotmartIntegration(),
  ])

  // ---------- Meta (gastos) ----------
  let spend = 0
  let metaPurchases = 0
  let metaRevenue = 0
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
        const insights = await getAccountInsights(accountId, metaIntegration.token, datePreset)
        if (insights) {
          spend = Number.parseFloat(insights.spend || "0")
          metaPurchases = findActionValue(insights.actions, "purchase")
          metaRevenue = findActionValue(insights.action_values, "purchase")
          metaConnected = true
        } else {
          metaConnected = true
        }
      }
    } catch (e) {
      metaError = e instanceof Error ? e.message : "Erro ao buscar dados do Meta"
    }
  }

  // ---------- Hotmart (faturamento/vendas) ----------
  let hotmart = null as ReturnType<typeof summarizeHotmart> | null
  let hotmartConnected = false
  let hotmartError: string | undefined

  console.log("[v0] summary: hotmartIntegration present?", Boolean(hotmartIntegration))
  if (hotmartIntegration) {
    const tokenResult = await getHotmartToken(hotmartIntegration.basicCredential)
    console.log("[v0] summary: hotmart token result ->", { ok: tokenResult.ok, error: tokenResult.error })
    if (tokenResult.ok && tokenResult.token) {
      hotmartConnected = true
      try {
        const { start, end } = presetToRange(datePreset)
        console.log("[v0] summary: hotmart range (ms) ->", { start, end, datePreset })
        const sales = await fetchHotmartSales(tokenResult.token, start, end)
        console.log("[v0] summary: hotmart sales fetched ->", sales.length)
        hotmart = summarizeHotmart(sales)
        console.log("[v0] summary: hotmart summary ->", {
          revenue: hotmart.revenue,
          sales: hotmart.sales,
          totalTransactions: hotmart.totalTransactions,
        })
      } catch (e) {
        console.log("[v0] summary: hotmart fetch ERROR ->", e instanceof Error ? e.message : e)
        hotmartError = "Erro ao buscar vendas na Hotmart"
      }
    } else {
      hotmartError = tokenResult.error
    }
  }

  // ---------- Combinação ----------
  // Faturamento e vendas priorizam a Hotmart (fonte de verdade de receita);
  // fallback para os dados de compras rastreadas pelo Meta.
  const revenue = hotmart ? hotmart.revenue : metaRevenue
  const sales = hotmart ? hotmart.sales : metaPurchases
  const profit = revenue - spend

  const summary = {
    spend,
    revenue,
    profit,
    sales,
    roas: spend > 0 ? revenue / spend : 0,
    roi: spend > 0 ? ((revenue - spend) / spend) * 100 : 0,
    cpa: sales > 0 ? spend / sales : 0,
    averageTicket: hotmart ? hotmart.averageTicket : sales > 0 ? revenue / sales : 0,
    margin: revenue > 0 ? (profit / revenue) * 100 : 0,
    refunds: hotmart?.refunds ?? 0,
    approvalRates: hotmart?.approvalRates ?? [],
  }

  return NextResponse.json({
    summary,
    sources: {
      meta: { connected: metaConnected, error: metaError },
      hotmart: { connected: hotmartConnected, error: hotmartError, hasData: Boolean(hotmart) },
    },
  })
}
