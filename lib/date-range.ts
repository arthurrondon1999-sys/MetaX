/**
 * Converte os date_presets usados pela API do Meta em um intervalo de datas
 * (epoch em milissegundos), para que possamos consultar a Hotmart no mesmo
 * período e cruzar os dados.
 *
 * Todos os limites de "dia" são calculados no fuso do Brasil (America/Sao_Paulo,
 * UTC-3). A Hotmart usa timestamps UTC em ms, então "hoje" no Brasil começa às
 * 03:00 UTC — não à meia-noite UTC. Calcular no fuso do servidor (UTC) faria
 * as vendas da madrugada brasileira caírem no dia anterior/seguinte.
 */
const BRT_OFFSET = "-03:00"
const DAY_MS = 24 * 60 * 60 * 1000

/** Retorna "YYYY-MM-DD" do dia atual no fuso do Brasil. */
function brtDateString(now: Date): string {
  return now.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
}

/** Epoch (ms) da meia-noite (00:00 BRT) de uma data "YYYY-MM-DD". */
function brtMidnight(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00${BRT_OFFSET}`).getTime()
}

export function presetToRange(preset: string): { start: number; end: number } {
  const now = new Date()
  const end = now.getTime()

  // Meia-noite de hoje no fuso do Brasil
  const todayStr = brtDateString(now)
  const startOfToday = brtMidnight(todayStr)

  const daysAgo = (d: number) => startOfToday - d * DAY_MS

  // Primeiro dia do mês (BRT) com offset opcional de meses
  const firstOfMonthBRT = (monthOffset: number) => {
    const [y, m] = todayStr.split("-").map(Number)
    // Constrói "YYYY-MM-01" ajustando ano/mês manualmente
    const totalMonth = m - 1 + monthOffset
    const year = y + Math.floor(totalMonth / 12)
    const month = ((totalMonth % 12) + 12) % 12
    const mm = String(month + 1).padStart(2, "0")
    return brtMidnight(`${year}-${mm}-01`)
  }

  switch (preset) {
    case "today":
      return { start: startOfToday, end }
    case "yesterday":
      return { start: daysAgo(1), end: startOfToday }
    case "last_7d":
      return { start: daysAgo(7), end }
    case "last_14d":
      return { start: daysAgo(14), end }
    case "last_30d":
      return { start: daysAgo(30), end }
    case "last_90d":
      return { start: daysAgo(90), end }
    case "this_month":
      return { start: firstOfMonthBRT(0), end }
    case "this_week_mon_today": {
      // Início da semana (segunda-feira, BRT) até agora
      const dow = new Date(`${todayStr}T12:00:00${BRT_OFFSET}`).getUTCDay() // 0=Dom, 1=Seg...
      const diffToMonday = dow === 0 ? 6 : dow - 1
      return { start: startOfToday - diffToMonday * DAY_MS, end }
    }
    case "last_month":
      return { start: firstOfMonthBRT(-1), end: firstOfMonthBRT(0) }
    case "maximum":
      return { start: daysAgo(365), end }
    default:
      return { start: daysAgo(30), end }
  }
}
