import { NextResponse } from "next/server"
import { getMetaIntegration } from "@/lib/meta/integration"
import { getAdAccounts, MetaApiError } from "@/lib/meta/api"

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
    const accounts = await getAdAccounts(integration.token)
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
