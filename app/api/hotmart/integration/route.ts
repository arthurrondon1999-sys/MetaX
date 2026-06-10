import { NextResponse } from "next/server"
import { getAuthedUser } from "@/lib/meta/integration"
import { getHotmartToken } from "@/lib/hotmart/api"

// Salvar ou atualizar a credencial Basic da Hotmart
export async function POST(request: Request) {
  const { supabase, user } = await getAuthedUser()
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  let basicCredential: string | undefined = body.basic_credential
  const clientId: string | undefined = body.client_id
  const clientSecret: string | undefined = body.client_secret

  // Permite informar client_id + client_secret e montar o Basic, ou o Basic direto
  if (!basicCredential && clientId && clientSecret) {
    basicCredential = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  }

  if (!basicCredential) {
    return NextResponse.json({ error: "Informe a credencial da Hotmart" }, { status: 400 })
  }

  // Valida a credencial antes de salvar
  const result = await getHotmartToken(basicCredential)
  if (!result.ok) {
    return NextResponse.json({ error: result.error || "Credencial inválida" }, { status: 400 })
  }

  // account_id guarda o client_id (extraído do Basic) para exibição
  let storedClientId = clientId ?? null
  if (!storedClientId) {
    try {
      storedClientId = Buffer.from(basicCredential, "base64").toString("utf-8").split(":")[0] ?? null
    } catch {
      storedClientId = null
    }
  }

  const { error } = await supabase.from("integrations").upsert(
    {
      user_id: user.id,
      platform: "hotmart",
      access_token: basicCredential,
      account_id: storedClientId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,platform" },
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

// Desconectar
export async function DELETE() {
  const { supabase, user } = await getAuthedUser()
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const { error } = await supabase
    .from("integrations")
    .delete()
    .eq("user_id", user.id)
    .eq("platform", "hotmart")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
