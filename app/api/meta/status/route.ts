import { NextResponse } from "next/server"
import { getMetaIntegration } from "@/lib/meta/integration"
import { MetaApiError } from "@/lib/meta/api"

// Conta de anúncios conhecida — chamamos diretamente para evitar /me/adaccounts,
// que falha com tokens de longa duração.
const KNOWN_AD_ACCOUNT_ID = "act_1336684461550331"

export async function GET() {
  const integration = await getMetaIntegration()
  if (!integration) {
    return NextResponse.json({ connected: false })
  }

  const expiresAt = integration.expiresAt
  const daysUntilExpiry =
    expiresAt != null
      ? Math.floor((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null
  const expired = daysUntilExpiry != null && daysUntilExpiry < 0

  try {
    const url = `https://graph.facebook.com/v20.0/${KNOWN_AD_ACCOUNT_ID}?fields=id,name,currency,account_status&access_token=${encodeURIComponent(integration.token)}`
    const res = await fetch(url, { cache: "no-store" })
    const json = await res.json()
    if (!res.ok || json.error) {
      throw new MetaApiError(json.error?.message || "Erro ao validar token", res.status, json.error?.code)
    }
    // Normaliza para o formato esperado pelo frontend (account_id sem o prefixo act_)
    const accounts = [
      {
        id: json.id as string,
        account_id: String(json.id).replace(/^act_/, ""),
        name: json.name as string,
        currency: json.currency as string | undefined,
        account_status: json.account_status as number | undefined,
      },
    ]
    return NextResponse.json({
      connected: true,
      tokenValid: !expired,
      accountId: integration.accountId,
      updatedAt: integration.updatedAt,
      expiresAt,
      daysUntilExpiry,
      expired,
      accounts,
    })
  } catch (error) {
    const message = error instanceof MetaApiError ? error.message : "Erro ao validar token"
    return NextResponse.json({
      connected: true,
      tokenValid: false,
      accountId: integration.accountId,
      updatedAt: integration.updatedAt,
      expiresAt,
      daysUntilExpiry,
      expired,
      error: message,
    })
  }
}
