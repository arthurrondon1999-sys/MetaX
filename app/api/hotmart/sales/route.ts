import { NextResponse } from "next/server"
import { getHotmartIntegration } from "@/lib/meta/integration"
import { getHotmartToken, fetchHotmartSales } from "@/lib/hotmart/api"
import { presetToRange } from "@/lib/date-range"

export async function GET(request: Request) {
  const integration = await getHotmartIntegration()
  if (!integration) {
    return NextResponse.json({ error: "Integração não conectada" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const datePreset = searchParams.get("date_preset") || "last_30d"
  const { start, end } = presetToRange(datePreset)

  const tokenResult = await getHotmartToken(integration.basicCredential)
  if (!tokenResult.ok || !tokenResult.token) {
    return NextResponse.json({ error: tokenResult.error || "Token Hotmart inválido" }, { status: 502 })
  }

  try {
    const sales = await fetchHotmartSales(tokenResult.token, start, end)
    return NextResponse.json({ sales, range: { start, end } })
  } catch {
    return NextResponse.json({ error: "Erro ao buscar vendas na Hotmart" }, { status: 502 })
  }
}
