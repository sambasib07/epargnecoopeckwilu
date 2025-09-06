/* Coopec Kwilu PWA Service Worker */
const VERSION = 'v1.0.0';
const APP_SHELL = [
  '/',
  '/indexo.html',
  '/manifest.json',
  '/offline.html',
  '/icons/icôn-96.png',
  '/icons/icon-256.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('ck-cache-' + VERSION).then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => !k.includes(VERSION)).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Network-first for API calls to Google Apps Script; cache-first for same-origin shell/assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Bypass non-GET & third-party opaque requests
  if (req.method !== 'GET') return;

  // Network-first for Apps Script and JSON
  if (url.hostname.endsWith('script.google.com') || req.headers.get('accept')?.includes('application/json')) {
    event.respondWith(
      fetch(req).then(res => {
        const resClone = res.clone();
        caches.open('ck-dynamic-' + VERSION).then(cache => cache.put(req, resClone));
        return res;
      }).catch(() => caches.match(req).then(r => r || new Response(JSON.stringify({error:'offline'}), {status:503})))
    );
    return;
  }

  // Cache-first for same-origin assets
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then(cached => {
        const fetchPromise = fetch(req).then(networkRes => {
          caches.open('ck-dynamic-' + VERSION).then(cache => cache.put(req, networkRes.clone()));
          return networkRes;
        }).catch(() => cached || (req.mode === 'navigate' ? caches.match('/offline.html') : undefined));
        return cached || fetchPromise;
      })
    );
    return;
  }

  // For cross-origin assets (CDNs), use stale-while-revalidate
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(networkRes => {
        caches.open('ck-cdn-' + VERSION).then(cache => cache.put(req, networkRes.clone()));
        return networkRes;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
