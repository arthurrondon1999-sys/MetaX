import { NextResponse } from "next/server"
import { getMetaIntegration } from "@/lib/meta/integration"
import { getAdAccounts, MetaApiError } from "@/lib/meta/api"

export async function GET() {
  const integration = await getMetaIntegration()
  if (!integration) {
    return NextResponse.json({ connected: false })
  }

  try {
    const accounts = await getAdAccounts(integration.token)
    return NextResponse.json({
      connected: true,
      tokenValid: true,
      accountId: integration.accountId,
      updatedAt: integration.updatedAt,
      accounts,
    })
  } catch (error) {
    const message = error instanceof MetaApiError ? error.message : "Erro ao validar token"
    return NextResponse.json({
      connected: true,
      tokenValid: false,
      accountId: integration.accountId,
      updatedAt: integration.updatedAt,
      error: message,
    })
  }
}
