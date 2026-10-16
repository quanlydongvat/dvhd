/**
 * Service Worker for "Quản lý Động vật hoang dã - Hạt Kiểm lâm khu vực Krông Bông"
 * Provides PWA offline app shell caching and offline lookup support.
 */

const CACHE_NAME = 'dvhd-krongbong-v2026.1';

// Core assets required to run the application shell offline
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './app.json',
  './pwa-192x192.png',
  './pwa-512x512.png',
  './apple-touch-icon.png',
  './favicon.svg',
  './images/logo_kiem_lam.png',
  './images/logo.jpg',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

// Install: Pre-cache core application shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching core PWA application assets...');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Some precache assets failed to cache:', err);
      });
    })
  );
});

// Activate: Clean up old cache versions and claim immediate control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache version:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy for offline resiliency
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Skip non-GET requests and non-http(s) schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 2. Skip Firebase API & Analytics requests (they handle their own offline states)
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('google-analytics.com')
  ) {
    return;
  }

  // 3. Navigation requests (HTML document): Network-first with offline cache fallback
  if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Device is offline or weak signal in remote buôn/thôn: serve cached index.html
          const cache = await caches.open(CACHE_NAME);
          const cachedIndex = (await cache.match(request)) || (await cache.match('./index.html')) || (await cache.match('./'));
          if (cachedIndex) return cachedIndex;
          return new Response(
            '<html><body><h2>Hệ thống đang hoạt động Ngoại tuyến (Offline).</h2><p>Vui lòng mở lại trang từ Màn hình chính.</p></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 4. Static assets (Bundled JS/CSS, images, fonts, icons): Cache-first with background network update
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache for next load
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {
            // Ignore background fetch error when offline
          });
        return cachedResponse;
      }

      // If not in cache, fetch from network and store in cache
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          // If offline and request is an image, fallback gracefully
          if (request.destination === 'image') {
            return caches.match('./pwa-192x192.png');
          }
          throw err;
        });
    })
  );
});

// Message listener
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
