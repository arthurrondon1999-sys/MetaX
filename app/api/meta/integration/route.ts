import { NextResponse } from "next/server"
import { getAuthedUser } from "@/lib/meta/integration"
import { getAdAccounts, MetaApiError } from "@/lib/meta/api"

// Salvar ou atualizar token / conta selecionada
export async function POST(request: Request) {
  const { supabase, user } = await getAuthedUser()
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const accessToken: string | undefined = body.access_token
  const accountId: string | undefined = body.account_id

  if (!accessToken && !accountId) {
    return NextResponse.json({ error: "Informe um token ou conta" }, { status: 400 })
  }

  // Se um token foi enviado, valida antes de salvar
  if (accessToken) {
    try {
      await getAdAccounts(accessToken)
    } catch (error) {
      const message = error instanceof MetaApiError ? error.message : "Token inválido"
      return NextResponse.json({ error: message }, { status: 400 })
    }
  }

  const payload: Record<string, unknown> = {
    user_id: user.id,
    platform: "meta",
    updated_at: new Date().toISOString(),
  }
  if (accessToken) payload.access_token = accessToken
  if (accountId !== undefined) payload.account_id = accountId

  // Upsert mantendo o token existente se só a conta mudou
  if (accessToken) {
    const { error } = await supabase.from("integrations").upsert(payload, { onConflict: "user_id,platform" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { error } = await supabase
      .from("integrations")
      .update({ account_id: accountId, updated_at: payload.updated_at })
      .eq("user_id", user.id)
      .eq("platform", "meta")
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

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
    .eq("platform", "meta")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
