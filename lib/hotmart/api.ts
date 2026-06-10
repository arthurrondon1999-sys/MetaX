const HOTMART_AUTH_URL = "https://api-sec-vlc.hotmart.com/security/oauth/token"
const HOTMART_API_BASE = "https://developers.hotmart.com/payments/api/v1"

export interface HotmartSale {
  transaction: string
  productName: string
  productId: string
  buyerName: string
  value: number // valor bruto na moeda original
  currency: string
  commissionValue: number // comissão do produtor (normalizada em USD)
  status: string
  paymentType: string
  purchaseDate: string | null // ISO
}

export interface HotmartTokenResult {
  token: string | null
  ok: boolean
  error?: string
}

/**
 * Obtém um access token OAuth da Hotmart a partir da credencial Basic
 * (base64 de client_id:client_secret).
 */
export async function getHotmartToken(basicCredential: string): Promise<HotmartTokenResult> {
  let clientId = ""
  let clientSecret = ""
  try {
    const decoded = Buffer.from(basicCredential, "base64").toString("utf-8")
    const [id, secret] = decoded.split(":")
    clientId = id ?? ""
    clientSecret = secret ?? ""
  } catch {
    return { token: null, ok: false, error: "Credencial Hotmart inválida." }
  }

  if (!clientId || !clientSecret) {
    return { token: null, ok: false, error: "Credencial Hotmart incompleta." }
  }

  const url = `${HOTMART_AUTH_URL}?grant_type=client_credentials&client_id=${encodeURIComponent(
    clientId,
  )}&client_secret=${encodeURIComponent(clientSecret)}`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicCredential}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
    const data = await res.json()
    if (!res.ok || !data.access_token) {
      return {
        token: null,
        ok: false,
        error: data?.error_description || data?.error || "Falha na autenticação com a Hotmart.",
      }
    }
    return { token: data.access_token, ok: true }
  } catch (err) {
    return { token: null, ok: false, error: "Erro de conexão com a Hotmart." }
  }
}

interface HotmartHistoryItem {
  buyer?: { name?: string }
  product?: { name?: string; id?: number }
  purchase?: {
    price?: { value?: number; currency_code?: string }
    payment?: { type?: string }
    transaction?: string
    status?: string
    order_date?: number
    approved_date?: number
  }
}

interface HotmartCommissionItem {
  transaction: string
  commissions?: Array<{
    source?: string
    commission?: { value?: number; currency_code?: string }
  }>
}

async function fetchAllPages<T>(
  token: string,
  endpoint: string,
  params: Record<string, string>,
  extract: (json: any) => { items: T[]; next: string | null },
  maxPages = 20,
): Promise<T[]> {
  const all: T[] = []
  let pageToken: string | null = null
  for (let i = 0; i < maxPages; i++) {
    const search = new URLSearchParams({ ...params, max_results: "100" })
    if (pageToken) search.set("page_token", pageToken)
    const res = await fetch(`${HOTMART_API_BASE}/${endpoint}?${search.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!res.ok) break
    const json = await res.json()
    const { items, next } = extract(json)
    all.push(...items)
    if (!next) break
    pageToken = next
  }
  return all
}

/**
 * Busca as vendas da Hotmart em um intervalo de datas (ms epoch) e mescla
 * com as comissões do produtor (em USD) por transação.
 */
export async function fetchHotmartSales(
  token: string,
  startDate: number,
  endDate: number,
): Promise<HotmartSale[]> {
  const baseParams = {
    start_date: String(startDate),
    end_date: String(endDate),
  }

  const [history, commissions] = await Promise.all([
    fetchAllPages<HotmartHistoryItem>(token, "sales/history", baseParams, (json) => ({
      items: json.items ?? [],
      next: json.page_info?.next_page_token ?? null,
    })),
    fetchAllPages<HotmartCommissionItem>(token, "sales/commissions", baseParams, (json) => ({
      items: json.items ?? [],
      next: json.page_info?.next_page_token ?? null,
    })),
  ])

  // Mapa transação -> comissão do produtor (em USD/payout)
  const commissionMap = new Map<string, number>()
  for (const c of commissions) {
    const producer = c.commissions?.find((x) => x.source === "PRODUCER") ?? c.commissions?.[0]
    if (producer?.commission?.value != null) {
      commissionMap.set(c.transaction, producer.commission.value)
    }
  }

  return history.map((item) => {
    const p = item.purchase ?? {}
    const transaction = p.transaction ?? ""
    return {
      transaction,
      productName: item.product?.name ?? "Produto",
      productId: item.product?.id != null ? String(item.product.id) : "",
      buyerName: item.buyer?.name?.trim() ?? "",
      value: p.price?.value ?? 0,
      currency: p.price?.currency_code ?? "USD",
      commissionValue: commissionMap.get(transaction) ?? 0,
      status: p.status ?? "UNKNOWN",
      paymentType: p.payment?.type ?? "",
      purchaseDate: p.order_date ? new Date(p.order_date).toISOString() : null,
    }
  })
}
