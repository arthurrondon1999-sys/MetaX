import { NextResponse } from "next/server"
import { getAuthedUser } from "@/lib/meta/integration"
import { getAdAccounts, exchangeForLongLivedToken, MetaApiError } from "@/lib/meta/api"

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

  // Token de longa duração resultante da troca (60 dias) e sua expiração
  let longLivedToken: string | undefined
  let expiresAt: string | null = null

  // Se um token foi enviado, troca por um de longa duração e valida antes de salvar
  if (accessToken) {
    try {
      // 1) Troca o token de curta duração por um de longa duração (~60 dias)
      const exchanged = await exchangeForLongLivedToken(accessToken)
      longLivedToken = exchanged.token
      expiresAt = exchanged.expiresAt
    } catch (error) {
      // Se a troca falhar (ex.: token já inválido), usa o token original
      // e deixa a validação abaixo retornar o erro adequado.
      longLivedToken = accessToken
    }

    try {
      // 2) Valida o token (de longa duração) consultando as contas
      await getAdAccounts(longLivedToken)
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
  if (longLivedToken) {
    payload.access_token = longLivedToken
    payload.expires_at = expiresAt
  }
  if (accountId !== undefined) payload.account_id = accountId

  // Upsert mantendo o token existente se só a conta mudou
  if (longLivedToken) {
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
