import { NextResponse } from "next/server"
import { getMetaIntegration } from "@/lib/meta/integration"
import { getAdAccounts, getCampaigns, MetaApiError } from "@/lib/meta/api"

export async function GET(request: Request) {
  const integration = await getMetaIntegration()
  if (!integration) {
    return NextResponse.json({ error: "Integração não conectada" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const datePreset = searchParams.get("date_preset") || "last_30d"
  let accountId = searchParams.get("account_id") || integration.accountId

  try {
    // Se nenhuma conta definida, usa a primeira conta disponível
    if (!accountId) {
      const accounts = await getAdAccounts(integration.token)
      if (accounts.length === 0) {
        return NextResponse.json({ campaigns: [], accountId: null })
      }
      accountId = accounts[0].account_id
    }

    const campaigns = await getCampaigns(accountId, integration.token, datePreset)
    return NextResponse.json({ campaigns, accountId })
  } catch (error) {
    const status = error instanceof MetaApiError ? error.status : 500
    const message = error instanceof MetaApiError ? error.message : "Erro ao buscar campanhas"
    return NextResponse.json({ error: message }, { status })
  }
}
