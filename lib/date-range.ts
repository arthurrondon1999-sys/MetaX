/**
 * Converte os date_presets usados pela API do Meta em um intervalo de datas
 * (epoch em milissegundos), para que possamos consultar a Hotmart no mesmo
 * período e cruzar os dados.
 */
export function presetToRange(preset: string): { start: number; end: number } {
  const now = new Date()
  const end = now.getTime()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

  const daysAgo = (d: number) => startOfToday - d * 24 * 60 * 60 * 1000

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
    case "this_month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
      return { start, end }
    }
    case "last_month": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime()
      const lastEnd = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
      return { start, end: lastEnd }
    }
    case "maximum":
      return { start: daysAgo(365), end }
    default:
      return { start: daysAgo(30), end }
  }
}
