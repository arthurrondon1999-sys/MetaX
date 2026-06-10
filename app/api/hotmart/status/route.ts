import { NextResponse } from "next/server"
import { getHotmartIntegration } from "@/lib/meta/integration"
import { getHotmartToken } from "@/lib/hotmart/api"

export async function GET() {
  const integration = await getHotmartIntegration()
  if (!integration) {
    return NextResponse.json({ connected: false })
  }

  const result = await getHotmartToken(integration.basicCredential)

  return NextResponse.json({
    connected: true,
    tokenValid: result.ok,
    clientId: integration.clientId,
    updatedAt: integration.updatedAt,
    error: result.ok ? undefined : result.error,
  })
}
