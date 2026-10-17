/**
 * Service Worker for "Quản lý Động vật hoang dã - Hạt Kiểm lâm khu vực Krông Bông"
 * Provides PWA offline app shell caching and offline lookup support.
 */

const CACHE_NAME = 'dvhd-krongbong-v2026.4-stable';

// Core assets required to run the application shell offline
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png',
  '/favicon.svg',
  '/images/logo.jpg',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

// Install: Pre-cache core application shell & force skip waiting
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

// Activate: Clean up ALL older cache versions and claim immediate control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging old cache version:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Resilient strategy for offline support and dynamic updates
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Skip non-GET requests and non-http(s) schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 2. Skip Firebase API & Analytics requests (they handle their own offline state)
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
              cache.put('/', response.clone());
              cache.put('/index.html', response.clone());
            });
          }
          return response;
        })
        .catch(async () => {
          // Device is offline or weak signal: serve cached index.html
          const cache = await caches.open(CACHE_NAME);
          const cachedIndex = (await cache.match(request)) || (await cache.match('/index.html')) || (await cache.match('/'));
          if (cachedIndex) return cachedIndex;
          return new Response(
            '<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><title>Chế độ Ngoại Tuyến</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="background:#064e3b;color:white;font-family:sans-serif;text-align:center;padding:40px 20px;"><h2>🌲 Hệ Thống Đang Hoạt Động Ngoại Tuyến</h2><p>Vui lòng kết nối Internet hoặc mở lại ứng dụng từ màn hình chính.</p><a href="/" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#10b981;color:#022c22;text-decoration:none;font-weight:bold;border-radius:10px;">Thử lại</a></body></html>',
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
          .catch(() => {});
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
          // Fallback for missing images when offline
          if (request.destination === 'image') {
            return caches.match('/pwa-192x192.png');
          }
          throw err;
        });
    })
  );
});

// Skip waiting message listener
self.addEventListener('message', (event) => {
  if (event.data && (event.data.type === 'SKIP_WAITING' || event.data === 'skipWaiting')) {
    self.skipWaiting();
  }
});
