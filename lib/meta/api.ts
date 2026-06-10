const GRAPH_VERSION = "v21.0"
const BASE_URL = `https://graph.facebook.com/${GRAPH_VERSION}`

export type MetaInsight = {
  spend?: string
  impressions?: string
  clicks?: string
  cpc?: string
  cpm?: string
  ctr?: string
  reach?: string
  frequency?: string
  actions?: { action_type: string; value: string }[]
  action_values?: { action_type: string; value: string }[]
  cost_per_action_type?: { action_type: string; value: string }[]
}

export type MetaCampaign = {
  id: string
  name: string
  status: string
  objective?: string
  insights?: MetaInsight
}

export type MetaAccount = {
  id: string
  account_id: string
  name: string
  currency?: string
  account_status?: number
}

export class MetaApiError extends Error {
  status: number
  code?: number
  constructor(message: string, status: number, code?: number) {
    super(message)
    this.status = status
    this.code = code
  }
}

async function metaFetch<T>(path: string, token: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}/${path}`)
  url.searchParams.set("access_token", token)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url.toString(), { cache: "no-store" })
  const json = await res.json()

  if (!res.ok || json.error) {
    const err = json.error || {}
    throw new MetaApiError(
      err.message || `Erro na requisição à Meta (${res.status})`,
      res.status,
      err.code,
    )
  }

  return json as T
}

const META_APP_ID = "1019158334133108"
const META_APP_SECRET = "FG43jWZwHLVcVEcGoKRt3Pvhrko"

export type LongLivedToken = {
  token: string
  /** Data de expiração em ISO, ou null se não informada (tokens "permanentes"). */
  expiresAt: string | null
}

/**
 * Troca um token de curta duração (ex.: do Graph API Explorer, ~1h) por um
 * token de longa duração (~60 dias). Se a Meta não retornar `expires_in`
 * (caso de System User tokens), `expiresAt` volta como null.
 */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<LongLivedToken> {
  const data = await metaFetch<{ access_token: string; expires_in?: number; token_type?: string }>(
    "oauth/access_token",
    shortLivedToken,
    {
      grant_type: "fb_exchange_token",
      client_id: META_APP_ID,
      client_secret: META_APP_SECRET,
    },
  )

  const expiresAt =
    typeof data.expires_in === "number" && data.expires_in > 0
      ? new Date(Date.now() + data.expires_in * 1000).toISOString()
      : null

  return { token: data.access_token, expiresAt }
}

export async function getAdAccounts(token: string): Promise<MetaAccount[]> {
  const data = await metaFetch<{ data: MetaAccount[] }>("me/adaccounts", token, {
    fields: "id,account_id,name,currency,account_status",
    limit: "100",
  })
  return data.data ?? []
}

export async function getCampaigns(
  accountId: string,
  token: string,
  datePreset = "last_30d",
): Promise<MetaCampaign[]> {
  const normalizedId = accountId.startsWith("act_") ? accountId : `act_${accountId}`
  const insightsFields =
    "spend,impressions,clicks,cpc,cpm,ctr,reach,frequency,actions,action_values,cost_per_action_type"
  const data = await metaFetch<{ data: MetaCampaign[] }>(`${normalizedId}/campaigns`, token, {
    fields: `id,name,status,objective,insights.date_preset(${datePreset}){${insightsFields}}`,
    limit: "200",
  })
  // insights vem como { data: [insight] } — normalizamos para objeto único
  return (data.data ?? []).map((c) => {
    const raw = c.insights as unknown as { data?: MetaInsight[] } | undefined
    return { ...c, insights: raw?.data?.[0] }
  })
}

export async function getAccountInsights(
  accountId: string,
  token: string,
  datePreset = "last_30d",
): Promise<MetaInsight | null> {
  const normalizedId = accountId.startsWith("act_") ? accountId : `act_${accountId}`
  const fields =
    "spend,impressions,clicks,cpc,cpm,ctr,reach,frequency,actions,action_values,cost_per_action_type"
  const data = await metaFetch<{ data: MetaInsight[] }>(`${normalizedId}/insights`, token, {
    fields,
    date_preset: datePreset,
  })
  return data.data?.[0] ?? null
}

export type MetaDailyInsight = MetaInsight & { date_start: string; date_stop: string }

/** Insights do Meta com quebra diária (time_increment=1). */
export async function getDailyInsights(
  accountId: string,
  token: string,
  datePreset = "last_30d",
): Promise<MetaDailyInsight[]> {
  const normalizedId = accountId.startsWith("act_") ? accountId : `act_${accountId}`
  const fields = "spend,impressions,clicks,actions,action_values"
  const data = await metaFetch<{ data: MetaDailyInsight[] }>(`${normalizedId}/insights`, token, {
    fields,
    date_preset: datePreset,
    time_increment: "1",
    limit: "365",
  })
  return data.data ?? []
}

// Helpers para extrair valores de actions
export function findActionValue(
  list: { action_type: string; value: string }[] | undefined,
  type: string,
): number {
  if (!list) return 0
  const item = list.find((a) => a.action_type === type)
  return item ? Number.parseFloat(item.value) : 0
}
