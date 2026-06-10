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
  video_avg_time_watched_actions?: { action_type: string; value: string }[]
  video_p25_watched_actions?: { action_type: string; value: string }[]
  video_p50_watched_actions?: { action_type: string; value: string }[]
  video_p75_watched_actions?: { action_type: string; value: string }[]
  video_p100_watched_actions?: { action_type: string; value: string }[]
  video_thruplay_watched_actions?: { action_type: string; value: string }[]
  video_play_actions?: { action_type: string; value: string }[]
}

export type MetaCampaign = {
  id: string
  name: string
  status: string
  objective?: string
  daily_budget?: string
  lifetime_budget?: string
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
const META_APP_SECRET = "c7c3d757443525b543f6e011476e0ed4"

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
export async function exchangeForLongLivedToken(token: string): Promise<LongLivedToken> {
  console.log("[v0] exchange: token sendo enviado (curta duração):", token)

  const url = `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=1019158334133108&client_secret=c7c3d757443525b543f6e011476e0ed4&fb_exchange_token=${encodeURIComponent(token)}`

  const res = await fetch(url, { cache: "no-store" })
  const data = (await res.json()) as {
    access_token?: string
    expires_in?: number
    token_type?: string
    error?: { message?: string; code?: number }
  }
  console.log("[v0] exchange: resposta completa do Facebook:", JSON.stringify(data))

  if (!res.ok || data.error || !data.access_token) {
    throw new MetaApiError(
      data.error?.message || `Falha ao trocar pelo token de longa duração (${res.status})`,
      res.status,
      data.error?.code,
    )
  }

  const expiresAt =
    typeof data.expires_in === "number" && data.expires_in > 0
      ? new Date(Date.now() + data.expires_in * 1000).toISOString()
      : null

  console.log(
    "[v0] exchange: token de longa duração recebido?",
    data.access_token !== token,
    "| expiresAt:",
    expiresAt,
  )

  return { token: data.access_token, expiresAt }
}

export async function getAdAccounts(token: string): Promise<MetaAccount[]> {
  const data = await metaFetch<{ data: MetaAccount[] }>("me/adaccounts", token, {
    fields: "id,account_id,name,currency,account_status",
    limit: "100",
  })
  return data.data ?? []
}

/**
 * Spec de período aceito pelos endpoints de insights: ou um `date_preset`
 * (string) ou um intervalo customizado `{ since, until }` em "YYYY-MM-DD".
 */
export type DateSpec = string | { since: string; until: string }

/** Gera o trecho `.date_preset(...)` ou `.time_range(...)` para os insights. */
function insightsDateModifier(spec: DateSpec): string {
  if (typeof spec === "string") return `.date_preset(${spec})`
  return `.time_range({'since':'${spec.since}','until':'${spec.until}'})`
}

export async function getCampaigns(
  accountId: string,
  token: string,
  date: DateSpec = "last_30d",
): Promise<MetaCampaign[]> {
  const normalizedId = accountId.startsWith("act_") ? accountId : `act_${accountId}`
  const insightsFields =
    "spend,impressions,clicks,cpc,cpm,ctr,reach,frequency,actions,action_values,cost_per_action_type,purchase_roas"
  const data = await metaFetch<{ data: MetaCampaign[] }>(`${normalizedId}/campaigns`, token, {
    fields: `id,name,status,objective,daily_budget,lifetime_budget,insights${insightsDateModifier(date)}{${insightsFields}}`,
    limit: "200",
  })
  // insights vem como { data: [insight] } — normalizamos para objeto único
  const campaigns = (data.data ?? []).map((c) => {
    const raw = c.insights as unknown as { data?: MetaInsight[] } | undefined
    return { ...c, insights: raw?.data?.[0] }
  })
  console.log(
    "[v0] Campaign spend breakdown:",
    campaigns.map((c) => ({ name: c.name, spend: c.insights?.spend || 0 })),
  )
  return campaigns
}

/** Soma duas listas de actions (action_type -> value) acumulando valores. */
function mergeActions(
  acc: Map<string, number>,
  list: { action_type: string; value: string }[] | undefined,
) {
  if (!list) return
  for (const a of list) {
    acc.set(a.action_type, (acc.get(a.action_type) ?? 0) + Number.parseFloat(a.value || "0"))
  }
}

function mapToActions(map: Map<string, number>): { action_type: string; value: string }[] {
  return Array.from(map.entries()).map(([action_type, value]) => ({ action_type, value: String(value) }))
}

/**
 * Insights agregados no nível da conta SEM exigir a permissão `read_insights`.
 * Em vez de chamar `act_X/insights`, busca as campanhas com insights aninhados
 * (`getCampaigns`) e soma os valores. cpc/cpm/ctr/frequency são recalculados a
 * partir dos totais agregados.
 */
export async function getAccountInsights(
  accountId: string,
  token: string,
  date: DateSpec = "last_30d",
): Promise<MetaInsight | null> {
  const campaigns = await getCampaigns(accountId, token, date)
  if (campaigns.length === 0) return null

  let spend = 0
  let impressions = 0
  let clicks = 0
  let reach = 0
  const actions = new Map<string, number>()
  const actionValues = new Map<string, number>()
  const costPerAction = new Map<string, number>()
  let hasData = false

  for (const c of campaigns) {
    const i = c.insights
    if (!i) continue
    hasData = true
    spend += Number.parseFloat(i.spend || "0")
    impressions += Number.parseInt(i.impressions || "0", 10)
    clicks += Number.parseInt(i.clicks || "0", 10)
    reach += Number.parseInt(i.reach || "0", 10)
    mergeActions(actions, i.actions)
    mergeActions(actionValues, i.action_values)
  }

  if (!hasData) return null

  // Recalcula custo por ação a partir dos totais (spend / nº de ações)
  for (const [type, count] of actions.entries()) {
    if (count > 0) costPerAction.set(type, spend / count)
  }

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
  const cpc = clicks > 0 ? spend / clicks : 0
  const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0
  const frequency = reach > 0 ? impressions / reach : 0

  return {
    spend: String(spend),
    impressions: String(impressions),
    clicks: String(clicks),
    reach: String(reach),
    ctr: String(ctr),
    cpc: String(cpc),
    cpm: String(cpm),
    frequency: String(frequency),
    actions: mapToActions(actions),
    action_values: mapToActions(actionValues),
    cost_per_action_type: mapToActions(costPerAction),
  }
}

export type MetaDailyInsight = MetaInsight & { date_start: string; date_stop: string }

/**
 * Insights com quebra diária SEM exigir `read_insights`. Busca campanhas com
 * insights aninhados em `time_increment(1)` e agrega o gasto/ações por dia.
 */
export async function getDailyInsights(
  accountId: string,
  token: string,
  datePreset = "last_30d",
): Promise<MetaDailyInsight[]> {
  const normalizedId = accountId.startsWith("act_") ? accountId : `act_${accountId}`
  const insightsFields = "spend,impressions,clicks,actions,action_values"
  const data = await metaFetch<{
    data: { insights?: { data?: MetaDailyInsight[] } }[]
  }>(`${normalizedId}/campaigns`, token, {
    fields: `id,name,status,insights.date_preset(${datePreset}).time_increment(1){${insightsFields}}`,
    limit: "200",
  })

  // Agrega por data (date_start) somando entre todas as campanhas
  const byDay = new Map<
    string,
    { spend: number; impressions: number; clicks: number; actions: Map<string, number>; actionValues: Map<string, number> }
  >()

  for (const campaign of data.data ?? []) {
    const rows = campaign.insights?.data ?? []
    for (const row of rows) {
      const key = row.date_start
      const entry =
        byDay.get(key) ??
        { spend: 0, impressions: 0, clicks: 0, actions: new Map<string, number>(), actionValues: new Map<string, number>() }
      entry.spend += Number.parseFloat(row.spend || "0")
      entry.impressions += Number.parseInt(row.impressions || "0", 10)
      entry.clicks += Number.parseInt(row.clicks || "0", 10)
      mergeActions(entry.actions, row.actions)
      mergeActions(entry.actionValues, row.action_values)
      byDay.set(key, entry)
    }
  }

  return Array.from(byDay.entries())
    .map(([date, e]) => ({
      date_start: date,
      date_stop: date,
      spend: String(e.spend),
      impressions: String(e.impressions),
      clicks: String(e.clicks),
      actions: mapToActions(e.actions),
      action_values: mapToActions(e.actionValues),
    }))
    .sort((a, b) => a.date_start.localeCompare(b.date_start))
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
