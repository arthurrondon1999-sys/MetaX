import { NextResponse } from "next/server"
import { getMetaIntegration } from "@/lib/meta/integration"
import { getCampaigns, MetaApiError } from "@/lib/meta/api"
import { presetToMetaDateSpec } from "@/lib/date-range"

// Conta de anúncios conhecida — usada diretamente em vez de /me/adaccounts.
const KNOWN_AD_ACCOUNT_ID = "act_1336684461550331"

export async function GET(request: Request) {
  const integration = await getMetaIntegration()
  if (!integration) {
    return NextResponse.json({ error: "Integração não conectada" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const datePreset = searchParams.get("date_preset") || "last_30d"
  const accountId = searchParams.get("account_id") || integration.accountId || KNOWN_AD_ACCOUNT_ID

  try {
    const campaigns = await getCampaigns(accountId, integration.token, presetToMetaDateSpec(datePreset))
    return NextResponse.json({ campaigns, accountId })
  } catch (error) {
    const status = error instanceof MetaApiError ? error.status : 500
    const message = error instanceof MetaApiError ? error.message : "Erro ao buscar campanhas"
    return NextResponse.json({ error: message }, { status })
  }
}
