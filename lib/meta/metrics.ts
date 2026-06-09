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
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  cpm: number
  reach: number
  purchases: number
  revenue: number
  roas: number
  cpa: number
}

export function deriveCampaignMetrics(campaign: MetaCampaign): CampaignMetrics {
  const i: MetaInsight = campaign.insights ?? {}
  const spend = Number.parseFloat(i.spend || "0")
  const purchases = findAction(i.actions, "purchase")
  const revenue = findAction(i.action_values, "purchase")
  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    spend,
    impressions: Number.parseInt(i.impressions || "0", 10),
    clicks: Number.parseInt(i.clicks || "0", 10),
    ctr: Number.parseFloat(i.ctr || "0"),
    cpc: Number.parseFloat(i.cpc || "0"),
    cpm: Number.parseFloat(i.cpm || "0"),
    reach: Number.parseInt(i.reach || "0", 10),
    purchases,
    revenue,
    roas: spend > 0 ? revenue / spend : 0,
    cpa: purchases > 0 ? spend / purchases : 0,
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
