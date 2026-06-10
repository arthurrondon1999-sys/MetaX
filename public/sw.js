// MetaX Service Worker — app shell + cache de API (5 min) com suporte offline
const VERSION = "metax-v1"
const SHELL_CACHE = `${VERSION}-shell`
const STATIC_CACHE = `${VERSION}-static`
const API_CACHE = `${VERSION}-api`
const API_TTL = 5 * 60 * 1000 // 5 minutos

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

// Network-first com TTL de 5 min para chamadas de API
async function handleApi(request) {
  const cache = await caches.open(API_CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cloned = response.clone()
      const headers = new Headers(cloned.headers)
      headers.set("x-metax-cached-at", Date.now().toString())
      const body = await cloned.blob()
      await cache.put(request, new Response(body, { status: cloned.status, headers }))
    }
    return response
  } catch (err) {
    const cached = await cache.match(request)
    if (cached) {
      // Marca os clientes como offline para exibir "Dados offline"
      const clients = await self.clients.matchAll()
      clients.forEach((c) => c.postMessage({ type: "metax-offline" }))
      return cached
    }
    throw err
  }
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
  if (request.method !== "GET") return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleApi(request))
  } else if (request.mode === "navigate") {
    event.respondWith(handleNavigate(request))
  } else if (isStaticAsset(url)) {
    event.respondWith(handleStatic(request))
  }
})
