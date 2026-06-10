import {
  formatNumber,
  formatPercent,
  formatDecimal,
  roasColor,
  cpaColor,
  ctrColor,
  salesColor,
  COLOR_NA,
  COLOR_NEUTRAL,
  type CampaignMetrics,
} from "@/lib/meta/metrics"

export type MoneyFn = (v: number) => string

export type Cell = { value: string; color: string }

export type ColumnDef = {
  /** Identificador estável (usado em localStorage e drag-and-drop) */
  id: string
  /** Rótulo exibido no cabeçalho */
  label: string
  /** Mostra ícone de informação no cabeçalho */
  info?: boolean
  /** Coluna especial renderizada de forma customizada (status, campanha) */
  special?: "status" | "name"
  /** Calcula o conteúdo da célula para uma campanha */
  cell?: (m: CampaignMetrics, money: MoneyFn) => Cell
}

const na: Cell = { value: "N/A", color: COLOR_NA }
const neutral = (value: string): Cell => ({ value, color: COLOR_NEUTRAL })

export const COLUMN_DEFS: ColumnDef[] = [
  { id: "status", label: "Status", special: "status" },
  { id: "name", label: "Campanha", special: "name" },
  {
    id: "delivery",
    label: "Veiculação",
    cell: (m) => neutral(m.status === "ACTIVE" ? "Ativa" : m.status === "PAUSED" ? "Pausada" : "Inativa"),
  },
  {
    id: "budget",
    label: "Orçamento",
    cell: (m, money) =>
      m.dailyBudget > 0
        ? { value: `${money(m.dailyBudget)}/dia`, color: COLOR_NEUTRAL }
        : m.lifetimeBudget > 0
          ? { value: money(m.lifetimeBudget), color: COLOR_NEUTRAL }
          : na,
  },
  { id: "spend", label: "Valor Usado", cell: (m, money) => neutral(money(m.spend)) },
  {
    id: "conversionValue",
    label: "Valor de Conversão",
    info: true,
    cell: (m, money) => (m.revenue > 0 ? neutral(money(m.revenue)) : na),
  },
  {
    id: "roas",
    label: "ROAS",
    info: true,
    cell: (m) => (m.roas > 0 ? { value: `${formatDecimal(m.roas)}x`, color: roasColor(m.roas) } : na),
  },
  { id: "purchases", label: "Compras", cell: (m) => ({ value: formatNumber(m.purchases), color: salesColor(m.purchases) }) },
  {
    id: "cpa",
    label: "Custo por Compra",
    info: true,
    cell: (m, money) => (m.cpa > 0 ? { value: money(m.cpa), color: cpaColor(m.cpa) } : na),
  },
  { id: "impressions", label: "Impressões", cell: (m) => neutral(formatNumber(m.impressions)) },
  { id: "cpm", label: "CPM", info: true, cell: (m, money) => neutral(money(m.cpm)) },
  { id: "reach", label: "Alcance", cell: (m) => neutral(formatNumber(m.reach)) },
  {
    id: "frequency",
    label: "Frequência",
    info: true,
    cell: (m) => (m.frequency > 0 ? neutral(formatDecimal(m.frequency)) : na),
  },
  {
    id: "hookRate",
    label: "Hook Rate",
    info: true,
    cell: (m) => (m.hookRate > 0 ? neutral(formatPercent(m.hookRate)) : na),
  },
  {
    id: "holdRate",
    label: "Hold Rate",
    info: true,
    cell: (m) => (m.holdRate > 0 ? neutral(formatPercent(m.holdRate)) : na),
  },
  { id: "linkClicks", label: "Cliques no Link", cell: (m) => neutral(formatNumber(m.linkClicks)) },
  { id: "uniqueLinkClicks", label: "Cliques no Link Únicos", cell: (m) => neutral(formatNumber(m.uniqueLinkClicks)) },
  { id: "landingPageViews", label: "Visualizações da Página", cell: (m) => neutral(formatNumber(m.landingPageViews)) },
  {
    id: "cpc",
    label: "CPC",
    info: true,
    cell: (m, money) => (m.cpc > 0 ? neutral(money(m.cpc)) : na),
  },
  {
    id: "costPerLinkClick",
    label: "Custo por Clique no Link",
    cell: (m, money) => (m.costPerLinkClick > 0 ? neutral(money(m.costPerLinkClick)) : na),
  },
  {
    id: "ctr",
    label: "CTR",
    info: true,
    cell: (m) => (m.ctr > 0 ? { value: formatPercent(m.ctr), color: ctrColor(m.ctr) } : na),
  },
  {
    id: "uniqueCtr",
    label: "CTR Único",
    cell: (m) => (m.uniqueCtr > 0 ? { value: formatPercent(m.uniqueCtr), color: ctrColor(m.uniqueCtr) } : na),
  },
  {
    id: "initiateCheckout",
    label: "Finalizações de Compra",
    cell: (m) => neutral(formatNumber(m.initiateCheckout)),
  },
  {
    id: "costPerCheckout",
    label: "Custo por Finalização",
    cell: (m, money) => (m.costPerCheckout > 0 ? neutral(money(m.costPerCheckout)) : na),
  },
  {
    id: "checkoutConvRate",
    label: "Conv Checkout",
    info: true,
    cell: (m) => (m.checkoutConvRate > 0 ? neutral(formatPercent(m.checkoutConvRate)) : na),
  },
  { id: "videoThruPlays", label: "Reproduções de Vídeo", cell: (m) => neutral(formatNumber(m.videoThruPlays)) },
  {
    id: "videoAvgTime",
    label: "Tempo Médio de Reprodução",
    cell: (m) => (m.videoAvgTime > 0 ? neutral(`${formatDecimal(m.videoAvgTime)}s`) : na),
  },
  { id: "videoP25", label: "Reproduções 25%", cell: (m) => neutral(formatNumber(m.videoP25)) },
  { id: "videoP50", label: "Reproduções 50%", cell: (m) => neutral(formatNumber(m.videoP50)) },
  { id: "videoP75", label: "Reproduções 75%", cell: (m) => neutral(formatNumber(m.videoP75)) },
  { id: "videoP100", label: "Reproduções 100%", cell: (m) => neutral(formatNumber(m.videoP100)) },
]

export const COLUMN_MAP: Record<string, ColumnDef> = Object.fromEntries(COLUMN_DEFS.map((c) => [c.id, c]))

export const ALL_COLUMN_IDS = COLUMN_DEFS.map((c) => c.id)

/** Ordem e visibilidade padrão (todas as 31 colunas visíveis na ordem especificada). */
export const DEFAULT_VISIBLE_IDS = [...ALL_COLUMN_IDS]

export type CampaignTotals = {
  count: number
  spend: number
  revenue: number
  purchases: number
  impressions: number
  clicks: number
  reach: number
  linkClicks: number
  landingPageViews: number
  initiateCheckout: number
  video3sec: number
  videoThruPlays: number
  videoP25: number
  videoP50: number
  videoP75: number
  videoP100: number
}

/** Calcula a célula de totais (linha de resumo) para uma coluna. */
export function totalCellFor(id: string, t: CampaignTotals, money: MoneyFn): Cell {
  switch (id) {
    case "name":
      return neutral(`${t.count} CAMPANHAS`)
    case "spend":
      return neutral(money(t.spend))
    case "conversionValue":
      return t.revenue > 0 ? neutral(money(t.revenue)) : na
    case "roas": {
      const roas = t.spend > 0 ? t.revenue / t.spend : 0
      return roas > 0 ? { value: `${formatDecimal(roas)}x`, color: roasColor(roas) } : na
    }
    case "purchases":
      return { value: formatNumber(t.purchases), color: salesColor(t.purchases) }
    case "cpa": {
      const cpa = t.purchases > 0 ? t.spend / t.purchases : 0
      return cpa > 0 ? { value: money(cpa), color: cpaColor(cpa) } : na
    }
    case "impressions":
      return neutral(formatNumber(t.impressions))
    case "cpm":
      return neutral(t.impressions > 0 ? money((t.spend / t.impressions) * 1000) : money(0))
    case "reach":
      return neutral(formatNumber(t.reach))
    case "frequency":
      return t.reach > 0 ? neutral(formatDecimal(t.impressions / t.reach)) : na
    case "hookRate":
      return t.impressions > 0 ? neutral(formatPercent((t.video3sec / t.impressions) * 100)) : na
    case "holdRate":
      return t.video3sec > 0 ? neutral(formatPercent((t.videoP100 / t.video3sec) * 100)) : na
    case "linkClicks":
      return neutral(formatNumber(t.linkClicks))
    case "uniqueLinkClicks":
      return neutral(formatNumber(t.linkClicks))
    case "landingPageViews":
      return neutral(formatNumber(t.landingPageViews))
    case "cpc":
      return t.clicks > 0 ? neutral(money(t.spend / t.clicks)) : na
    case "costPerLinkClick":
      return t.linkClicks > 0 ? neutral(money(t.spend / t.linkClicks)) : na
    case "ctr": {
      const ctr = t.impressions > 0 ? (t.clicks / t.impressions) * 100 : 0
      return ctr > 0 ? { value: formatPercent(ctr), color: ctrColor(ctr) } : na
    }
    case "uniqueCtr": {
      const ctr = t.impressions > 0 ? (t.linkClicks / t.impressions) * 100 : 0
      return ctr > 0 ? { value: formatPercent(ctr), color: ctrColor(ctr) } : na
    }
    case "initiateCheckout":
      return neutral(formatNumber(t.initiateCheckout))
    case "costPerCheckout":
      return t.initiateCheckout > 0 ? neutral(money(t.spend / t.initiateCheckout)) : na
    case "checkoutConvRate":
      return t.initiateCheckout > 0 ? neutral(formatPercent((t.purchases / t.initiateCheckout) * 100)) : na
    case "videoThruPlays":
      return neutral(formatNumber(t.videoThruPlays))
    case "videoP25":
      return neutral(formatNumber(t.videoP25))
    case "videoP50":
      return neutral(formatNumber(t.videoP50))
    case "videoP75":
      return neutral(formatNumber(t.videoP75))
    case "videoP100":
      return neutral(formatNumber(t.videoP100))
    default:
      return na
  }
}
