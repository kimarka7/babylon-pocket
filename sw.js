// App shell only (HTML, JS, CSS, icons) — the data never goes through here: it lives in IndexedDB.
// Network first, so a new version arrives when online; the cache when offline.
const CACHE = 'babylon-pocket-v1'
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html']))) })
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return
  e.respondWith(fetch(e.request).then((res) => {
    const copy = res.clone()
    caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {})
    return res
  }).catch(() => caches.match(e.request).then((hit) => hit || caches.match('./index.html'))))
})
