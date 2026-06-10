import { createClient } from "@/lib/supabase/server"

export type IntegrationRecord = {
  platform: string
  access_token: string
  account_id: string | null
  updated_at: string
}

/**
 * Retorna o usuário autenticado e o client Supabase server-side.
 * Lança resposta 401 se não autenticado (o caller deve tratar).
 */
export async function getAuthedUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function getMetaIntegration(): Promise<
  { token: string; accountId: string | null; updatedAt: string } | null
> {
  const { supabase, user } = await getAuthedUser()
  if (!user) return null

  const { data } = await supabase
    .from("integrations")
    .select("access_token, account_id, updated_at")
    .eq("user_id", user.id)
    .eq("platform", "meta")
    .maybeSingle()

  if (!data) return null
  return { token: data.access_token, accountId: data.account_id, updatedAt: data.updated_at }
}

export async function getHotmartIntegration(): Promise<
  { basicCredential: string; clientId: string | null; updatedAt: string } | null
> {
  const { supabase, user } = await getAuthedUser()
  if (!user) return null

  const { data } = await supabase
    .from("integrations")
    .select("access_token, account_id, updated_at")
    .eq("user_id", user.id)
    .eq("platform", "hotmart")
    .maybeSingle()

  if (!data) return null
  return { basicCredential: data.access_token, clientId: data.account_id, updatedAt: data.updated_at }
}
