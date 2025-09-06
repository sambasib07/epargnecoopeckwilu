const CACHE_NAME = 'coopec-kwilu-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/sw.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // For navigation requests, serve the app shell (index.html)
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      caches.match('/index.html').then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          // cache a fresh copy for next time
          return caches.open(CACHE_NAME).then((cache) => {
            try { cache.put('/index.html', response.clone()); } catch(e) {}
            return response;
          });
        }).catch(() => caches.match('/index.html'));
      })
    );
    return;
  }

  // Try cache first, then network, then fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Some responses (like opaque) can't be cached properly
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        caches.open(CACHE_NAME).then((cache) => {
          try { cache.put(event.request, response.clone()); } catch(e) {}
        });
        return response;
      }).catch(() => {
        // If request is for an image, return a fallback icon
        if (event.request.destination === 'image') {
          return caches.match('/icons/icon-192.png');
        }
      });
    })
  );
});
