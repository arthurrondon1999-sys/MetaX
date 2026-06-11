// MetaX Service Worker — app shell + assets estáticos com suporte offline.
// As chamadas de API NÃO são cacheadas (sempre network-only), para evitar que
// dados financeiros (faturamento/vendas) fiquem congelados em cache.
const VERSION = "metax-v3"
const SHELL_CACHE = `${VERSION}-shell`
const STATIC_CACHE = `${VERSION}-static`

const SHELL_ASSETS = ["/dashboard", "/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS).catch(() => undefined))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  )
})

function isStaticAsset(url) {
  return url.pathname.startsWith("/_next/static") || url.pathname.startsWith("/icons/") || /\.(css|js|woff2?|png|jpg|jpeg|svg|webp)$/.test(url.pathname)
}

// Cache-first para assets estáticos
async function handleStatic(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

// Network-first para navegação (HTML), com fallback ao shell
async function handleNavigate(request) {
  const cache = await caches.open(SHELL_CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch (err) {
    const cached = (await cache.match(request)) || (await cache.match("/dashboard"))
    if (cached) return cached
    throw err
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // BYPASS TOTAL para qualquer rota de API: o Service Worker nunca intercepta,
  // cacheia ou modifica requisições que contenham "/api/". Elas vão sempre
  // direto para a rede (network-only), preservando cookies/headers de auth e
  // garantindo dados financeiros sempre frescos. Este check vem ANTES de
  // qualquer outra verificação para não haver exceção.
  if (url.pathname.startsWith("/api/") || url.pathname.includes("/api/")) {
    return
  }

  if (request.method !== "GET") return
  if (url.origin !== self.location.origin) return

  if (request.mode === "navigate") {
    event.respondWith(handleNavigate(request))
  } else if (isStaticAsset(url)) {
    event.respondWith(handleStatic(request))
  }
})
