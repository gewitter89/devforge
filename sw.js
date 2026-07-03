/* ============================================================
   DevForge — Service Worker (sw.js)
   Enables 100% offline access by caching static shells and assets.
   ============================================================ */

const CACHE_NAME = 'devforge-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './css/main.css',
  './css/extra.css',
  './js/i18n.js',
  './js/sound.js',
  './js/contributors.js',
  './js/app.js',
  './manifest.json',
  
  // Tools scripts
  './tools/ai-assistant.js',
  './tools/json-formatter.js',
  './tools/base64-codec.js',
  './tools/hash-generator.js',
  './tools/url-codec.js',
  './tools/uuid-generator.js',
  './tools/color-converter.js',
  './tools/password-generator.js',
  './tools/timestamp-converter.js',
  './tools/markdown-preview.js',
  './tools/lorem-generator.js',
  './tools/jwt-decoder.js',
  './tools/diff-checker.js',
  './tools/cron-parser.js',
  './tools/image-optimizer.js',
  './tools/knowledge-base.js',
  './tools/smart-transformer.js',
  './tools/ai-packager.js',
  './tools/ai-sanitizer.js',
  './tools/web-terminal.js'
];

// Install Event — cache all core shell assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event — cleanup old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event — Intercept requests and return cached versions offline-first
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Fallback to fetch over network
      return fetch(e.request).then((networkResponse) => {
        // Cache dynamic assets fetched like CDNs (Confetti, fonts)
        if (e.request.url.includes('cdn.jsdelivr.net') || e.request.url.includes('fonts.googleapis.com')) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Offline fallback for html routes
      if (e.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
