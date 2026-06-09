import { NextResponse } from "next/server"
import { getMetaIntegration } from "@/lib/meta/integration"
import { getAdAccounts, getAccountInsights, findActionValue, MetaApiError } from "@/lib/meta/api"

export async function GET(request: Request) {
  const integration = await getMetaIntegration()
  if (!integration) {
    return NextResponse.json({ error: "Integração não conectada" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const datePreset = searchParams.get("date_preset") || "last_30d"
  let accountId = searchParams.get("account_id") || integration.accountId

  try {
    if (!accountId) {
      const accounts = await getAdAccounts(integration.token)
      if (accounts.length === 0) {
        return NextResponse.json({ summary: null, accountId: null })
      }
      accountId = accounts[0].account_id
    }

    const insights = await getAccountInsights(accountId, integration.token, datePreset)

    if (!insights) {
      return NextResponse.json({ summary: null, accountId })
    }

    const spend = Number.parseFloat(insights.spend || "0")
    const impressions = Number.parseInt(insights.impressions || "0", 10)
    const clicks = Number.parseInt(insights.clicks || "0", 10)
    const reach = Number.parseInt(insights.reach || "0", 10)
    const purchases = findActionValue(insights.actions, "purchase")
    const revenue = findActionValue(insights.action_values, "purchase")
    const leads = findActionValue(insights.actions, "lead")

    const summary = {
      spend,
      impressions,
      clicks,
      reach,
      cpc: Number.parseFloat(insights.cpc || "0"),
      cpm: Number.parseFloat(insights.cpm || "0"),
      ctr: Number.parseFloat(insights.ctr || "0"),
      frequency: Number.parseFloat(insights.frequency || "0"),
      purchases,
      revenue,
      leads,
      roas: spend > 0 ? revenue / spend : 0,
      cpa: purchases > 0 ? spend / purchases : 0,
    }

    return NextResponse.json({ summary, accountId })
  } catch (error) {
    const status = error instanceof MetaApiError ? error.status : 500
    const message = error instanceof MetaApiError ? error.message : "Erro ao buscar resumo"
    return NextResponse.json({ error: message }, { status })
  }
}
