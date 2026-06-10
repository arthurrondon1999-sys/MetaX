import type { MetaCampaign, MetaInsight } from "@/lib/meta/api"

export function findAction(
  list: { action_type: string; value: string }[] | undefined,
  type: string,
): number {
  if (!list) return 0
  const item = list.find((a) => a.action_type === type)
  return item ? Number.parseFloat(item.value) : 0
}

export type CampaignMetrics = {
  id: string
  name: string
  status: string
  objective?: string
  dailyBudget: number
  lifetimeBudget: number
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  cpm: number
  reach: number
  frequency: number
  purchases: number
  revenue: number
  roas: number
  cpa: number
  // Link / engajamento
  linkClicks: number
  uniqueLinkClicks: number
  landingPageViews: number
  costPerLinkClick: number
  uniqueCtr: number
  initiateCheckout: number
  costPerCheckout: number
  checkoutConvRate: number
  // Vídeo
  videoThruPlays: number
  videoAvgTime: number
  video3sec: number
  videoP25: number
  videoP50: number
  videoP75: number
  videoP100: number
  hookRate: number
  holdRate: number
}

export function deriveCampaignMetrics(campaign: MetaCampaign): CampaignMetrics {
  const i: MetaInsight = campaign.insights ?? {}
  const spend = Number.parseFloat(i.spend || "0")
  const impressions = Number.parseInt(i.impressions || "0", 10)
  const reach = Number.parseInt(i.reach || "0", 10)
  const purchases = findAction(i.actions, "purchase")
  const revenue = findAction(i.action_values, "purchase")

  const linkClicks = findAction(i.actions, "link_click")
  const landingPageViews = findAction(i.actions, "landing_page_view")
  const initiateCheckout =
    findAction(i.actions, "initiate_checkout") || findAction(i.actions, "omni_initiated_checkout")
  const costPerLinkClick = findAction(i.cost_per_action_type, "link_click")
  const costPerCheckout =
    findAction(i.cost_per_action_type, "initiate_checkout") ||
    findAction(i.cost_per_action_type, "omni_initiated_checkout")

  // Vídeo
  const video3sec = findAction(i.video_play_actions, "video_view")
  const videoThruPlays = findAction(i.video_thruplay_watched_actions, "video_view")
  const videoAvgTime = findAction(i.video_avg_time_watched_actions, "video_view")
  const videoP25 = findAction(i.video_p25_watched_actions, "video_view")
  const videoP50 = findAction(i.video_p50_watched_actions, "video_view")
  const videoP75 = findAction(i.video_p75_watched_actions, "video_view")
  const videoP100 = findAction(i.video_p100_watched_actions, "video_view")

  const frequency = reach > 0 ? impressions / reach : 0

  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    objective: campaign.objective,
    dailyBudget: Number.parseFloat(campaign.daily_budget || "0") / 100,
    lifetimeBudget: Number.parseFloat(campaign.lifetime_budget || "0") / 100,
    spend,
    impressions,
    clicks: Number.parseInt(i.clicks || "0", 10),
    ctr: Number.parseFloat(i.ctr || "0"),
    cpc: Number.parseFloat(i.cpc || "0"),
    cpm: Number.parseFloat(i.cpm || "0"),
    reach,
    frequency,
    purchases,
    revenue,
    roas: spend > 0 ? revenue / spend : 0,
    cpa: purchases > 0 ? spend / purchases : 0,
    linkClicks,
    // Sem dados de unique_actions na API atual — aproxima pelos cliques no link
    uniqueLinkClicks: linkClicks,
    landingPageViews,
    costPerLinkClick: costPerLinkClick || (linkClicks > 0 ? spend / linkClicks : 0),
    uniqueCtr: impressions > 0 ? (linkClicks / impressions) * 100 : 0,
    initiateCheckout,
    costPerCheckout: costPerCheckout || (initiateCheckout > 0 ? spend / initiateCheckout : 0),
    checkoutConvRate: initiateCheckout > 0 ? (purchases / initiateCheckout) * 100 : 0,
    videoThruPlays,
    videoAvgTime,
    video3sec,
    videoP25,
    videoP50,
    videoP75,
    videoP100,
    hookRate: impressions > 0 ? (video3sec / impressions) * 100 : 0,
    holdRate: video3sec > 0 ? (videoP100 / video3sec) * 100 : 0,
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value || 0)
}

export function formatPercent(value: number): string {
  return `${(value || 0).toFixed(2)}%`
}

export function formatDecimal(value: number, digits = 2): string {
  return (value || 0).toFixed(digits)
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Ativa",
  PAUSED: "Pausada",
  DELETED: "Excluída",
  ARCHIVED: "Arquivada",
  CAMPAIGN_PAUSED: "Pausada",
  IN_PROCESS: "Em processo",
  WITH_ISSUES: "Com problemas",
}

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status
}

/* ---------- Color coding ---------- */

export const COLOR_POSITIVE = "text-[#00FF88]"
export const COLOR_NEGATIVE = "text-[#FF4444]"
export const COLOR_WARNING = "text-[#FFB020]"
export const COLOR_NEUTRAL = "text-white"
export const COLOR_NA = "text-[#94A3B8]"

/** Valores tipo Faturamento, Lucro, ROI, ROAS: positivo = verde, <=0 = vermelho */
export function positiveNegativeColor(value: number, hasData = true): string {
  if (!hasData) return COLOR_NA
  return value > 0 ? COLOR_POSITIVE : COLOR_NEGATIVE
}

/** ROI/percent em geral: >0 verde, <0 vermelho, 0 neutro/N/A */
export function roiColor(value: number, hasData = true): string {
  if (!hasData) return COLOR_NA
  if (value > 0) return COLOR_POSITIVE
  if (value < 0) return COLOR_NEGATIVE
  return COLOR_NA
}

/** ROI multiplicador (ex.: 2.00x): >1 verde, <1 vermelho, =1 cinza */
export function roiMultiplierColor(value: number, hasData = true): string {
  if (!hasData || !value) return COLOR_NA
  if (value > 1) return COLOR_POSITIVE
  if (value < 1) return COLOR_NEGATIVE
  return COLOR_NEUTRAL
}

/** CPA: menor é melhor. <15 verde, 15-25 amarelo, >25 vermelho */
export function cpaColor(value: number): string {
  if (!value) return COLOR_NA
  if (value < 15) return COLOR_POSITIVE
  if (value <= 25) return COLOR_WARNING
  return COLOR_NEGATIVE
}

/** ROAS: >3x verde, 1-3x amarelo, <1x vermelho */
export function roasColor(value: number): string {
  if (!value) return COLOR_NA
  if (value > 3) return COLOR_POSITIVE
  if (value >= 1) return COLOR_WARNING
  return COLOR_NEGATIVE
}

/** CTR: >3% verde, 1-3% amarelo, <1% vermelho */
export function ctrColor(value: number): string {
  if (!value) return COLOR_NA
  if (value > 3) return COLOR_POSITIVE
  if (value >= 1) return COLOR_WARNING
  return COLOR_NEGATIVE
}

/** VENDAS: >0 verde */
export function salesColor(value: number): string {
  return value > 0 ? COLOR_POSITIVE : COLOR_NA
}
