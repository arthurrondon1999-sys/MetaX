const AUTH = "https://api-sec-vlc.hotmart.com/security/oauth/token"
const BASE = "https://developers.hotmart.com/payments/api/v1"
const basic = process.env.HM_BASIC
const BRT_OFFSET = "-03:00"
const DAY = 24 * 60 * 60 * 1000
function brtMidnight(d) { return new Date(`${d}T00:00:00${BRT_OFFSET}`).getTime() }

async function getToken() {
  const decoded = Buffer.from(basic, "base64").toString("utf-8")
  const [id, sec] = decoded.split(":")
  const url = `${AUTH}?grant_type=client_credentials&client_id=${encodeURIComponent(id)}&client_secret=${encodeURIComponent(sec)}`
  const res = await fetch(url, { method: "POST", headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/json" } })
  return (await res.json()).access_token
}
async function hist(token, start, end, label) {
  const s = new URLSearchParams({ start_date: String(start), end_date: String(end), max_results: "100" })
  const res = await fetch(`${BASE}/sales/history?${s}`, { headers: { Authorization: `Bearer ${token}` } })
  const j = await res.json()
  const items = j.items ?? []
  console.log(`\n[${label}]`)
  console.log(`  start=${start} (${new Date(start).toISOString()})`)
  console.log(`  end=${end} (${new Date(end).toISOString()})`)
  console.log(`  HTTP ${res.status} | items=${items.length}`)
  for (const it of items.slice(0, 8)) {
    const od = it.purchase?.order_date
    console.log(`   - ${it.purchase?.transaction} status=${it.purchase?.status} order_date=${od} (${od ? new Date(od).toISOString() : "?"})`)
  }
  return items
}
async function main() {
  const token = await getToken()
  console.log("token ok:", Boolean(token))
  const now = new Date()
  console.log("agora UTC:", now.toISOString())
  const todayStr = now.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
  console.log("hoje (BRT):", todayStr)
  const startToday = brtMidnight(todayStr)
  const end = now.getTime()
  await hist(token, startToday, end, "TODAY (presetToRange)")
  await hist(token, end - 30 * DAY, end, "LAST_30D")
  // Teste: e se a API quiser segundos em vez de ms?
  await hist(token, Math.floor(startToday / 1000), Math.floor(end / 1000), "TODAY em SEGUNDOS")
}
main()
