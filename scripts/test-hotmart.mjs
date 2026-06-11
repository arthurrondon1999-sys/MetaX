const AUTH = "https://api-sec-vlc.hotmart.com/security/oauth/token"
const BASE = "https://developers.hotmart.com/payments/api/v1"
const basic = process.env.HM_BASIC
const BRT_OFFSET = "-03:00"
function brtMidnight(d) { return new Date(`${d}T00:00:00${BRT_OFFSET}`).getTime() }

async function getToken() {
  const decoded = Buffer.from(basic, "base64").toString("utf-8")
  const [id, sec] = decoded.split(":")
  const url = `${AUTH}?grant_type=client_credentials&client_id=${encodeURIComponent(id)}&client_secret=${encodeURIComponent(sec)}`
  const res = await fetch(url, { method: "POST", headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/json" } })
  return (await res.json()).access_token
}
async function fetchAll(token, endpoint, params) {
  const all = []; let pt = null
  for (let i = 0; i < 20; i++) {
    const s = new URLSearchParams({ ...params, max_results: "100" })
    if (pt) s.set("page_token", pt)
    const res = await fetch(`${BASE}/${endpoint}?${s}`, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) break
    const j = await res.json(); all.push(...(j.items || []))
    pt = j.page_info?.next_page_token; if (!pt) break
  }
  return all
}
async function main() {
  const token = await getToken()
  const now = new Date()
  const todayStr = now.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
  const start = brtMidnight(todayStr), end = now.getTime()
  const history = await fetchAll(token, "sales/history", { start_date: String(start), end_date: String(end) })
  const commissions = await fetchAll(token, "sales/commissions", { start_date: String(start), end_date: String(end) })

  const cmap = new Map()
  for (const c of commissions) {
    const p = c.commissions?.find(x => x.source === "PRODUCER") ?? c.commissions?.[0]
    if (p?.commission?.value != null) cmap.set(c.transaction, p.commission.value)
  }
  const APPROVED = new Set(["APPROVED", "COMPLETE"])
  let revenue = 0, approved = 0, matched = 0, fallback = 0
  for (const it of history) {
    const pu = it.purchase ?? {}
    if (!APPROVED.has(pu.status)) continue
    approved++
    const c = cmap.get(pu.transaction)
    let v
    if (c != null && c > 0) { v = c; matched++ } else { v = pu.price?.value ?? 0; fallback++ }
    revenue += v
  }
  console.log("history:", history.length, "commissions:", commissions.length)
  console.log("vendas aprovadas:", approved, "| comissão casada:", matched, "| fallback:", fallback)
  console.log("FATURAMENTO calculado:", revenue.toFixed(2))
  console.log("primeira commission tx:", commissions[0]?.transaction, "| primeira history tx:", history[0]?.purchase?.transaction)
}
main()
