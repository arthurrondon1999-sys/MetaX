import { NextResponse } from "next/server"
import { getMetaIntegration, getHotmartIntegration } from "@/lib/meta/integration"
import { getAdAccounts, getAccountInsights, findActionValue } from "@/lib/meta/api"
import { getHotmartToken, fetchHotmartSales } from "@/lib/hotmart/api"
import { summarizeHotmart } from "@/lib/hotmart/metrics"
import { presetToRange, presetToMetaDateSpec } from "@/lib/date-range"

/**
 * Resumo combinado: gastos com anúncios (Meta) + faturamento e vendas reais (Hotmart).
 * Ambas as fontes operam em USD, então o cruzamento de ROAS/ROI/CPA é consistente.
 */

// A busca da Hotmart pagina histórico + comissões (dezenas de chamadas
// sequenciais). Em produção o timeout padrão da função é curto e abortava o
// fluxo, zerando o faturamento. Damos margem suficiente e forçamos execução
// dinâmica (sem cache de rota).
export const maxDuration = 60
export const dynamic = "force-dynamic"

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
        const metaSpec = presetToMetaDateSpec(datePreset)
        if (typeof metaSpec === "object") {
          console.log(`[v0] Meta custom range: since=${metaSpec.since} until=${metaSpec.until}`)
        }
        const insights = await getAccountInsights(accountId, metaIntegration.token, metaSpec)
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

  console.log("[v0] summary: Hotmart token found:", hotmartIntegration ? "yes" : "no")

  if (hotmartIntegration) {
    const tokenResult = await getHotmartToken(hotmartIntegration.basicCredential)
    console.log("[v0] summary: Hotmart access token obtido:", tokenResult.ok && tokenResult.token ? "yes" : "no")
    if (tokenResult.ok && tokenResult.token) {
      hotmartConnected = true
      try {
        const { start, end } = presetToRange(datePreset)
        if (datePreset.startsWith("custom:")) {
          const fmt = (ms: number) =>
            new Date(ms).toLocaleString("en-CA", { timeZone: "America/Sao_Paulo" })
          console.log(
            `[v0] Hotmart custom range: start=${start} (${fmt(start)} BRT) end=${end} (${fmt(end)} BRT)`,
          )
        }
        const sales = await fetchHotmartSales(tokenResult.token, start, end)
        hotmart = summarizeHotmart(sales)
      } catch (e) {
        console.log("[v0] summary: erro ao buscar vendas Hotmart ->", e instanceof Error ? e.message : e)
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
  // IOF de 3,5% incide sobre os gastos com anúncios (cobrança em cartão internacional)
  const iof = spend * 0.035
  const profit = revenue - spend - iof

  const summary = {
    spend,
    iof,
    revenue,
    profit,
    sales,
    roas: spend > 0 ? revenue / spend : 0,
    // ROI em formato multiplicador: faturamento ÷ gastos (ex.: 2.00x)
    roi: spend > 0 ? revenue / spend : 0,
    cpa: sales > 0 ? spend / sales : 0,
    averageTicket: hotmart ? hotmart.averageTicket : sales > 0 ? revenue / sales : 0,
    margin: revenue > 0 ? (profit / revenue) * 100 : 0,
    refunds: hotmart?.refunds ?? 0,
    approvalRates: hotmart?.approvalRates ?? [],
  }

  return NextResponse.json(
    {
      summary,
      sources: {
        meta: { connected: metaConnected, error: metaError },
        hotmart: { connected: hotmartConnected, error: hotmartError, hasData: Boolean(hotmart) },
      },
    },
    {
      // Impede que o CDN/navegador sirva uma resposta antiga em cache em
      // produção (causa de faturamento "congelado" em zero fora do preview).
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    },
  )
}
