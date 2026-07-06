/* ============================================================
   DevForge — Service Worker (sw.js)
   Enables 100% offline access by caching static shells and assets.
   Uses stale-while-revalidate for optimal freshness + offline.
   ============================================================ */

const CACHE_VERSION = 'devforge-sw-v7';
const SHELL_ASSETS = [
  './',
  './index.html',
  './css/main.css?v=2',
  './css/extra.css?v=2',
  './js/i18n.js?v=2',
  './js/lang-selector.js?v=2',
  './js/sound.js?v=2',
  './js/contributors.js?v=2',
  './js/app.js?v=2',
  './manifest.json',
  './i18n/uk.json',
  './i18n/zh.json',
  './i18n/ja.json',
  './i18n/ko.json',
  './i18n/es.json',
  './i18n/pt.json',
  './i18n/de.json',
  './i18n/fr.json',
  './i18n/it.json',
  './i18n/pl.json',
  './i18n/ar.json',
  './i18n/hi.json'
];

const TOOL_ASSETS = [
  './tools/ai-assistant.js?v=2',
  './tools/json-formatter.js?v=2',
  './tools/base64-codec.js?v=2',
  './tools/hash-generator.js?v=2',
  './tools/url-codec.js?v=2',
  './tools/uuid-generator.js?v=2',
  './tools/color-converter.js?v=2',
  './tools/password-generator.js?v=2',
  './tools/timestamp-converter.js?v=2',
  './tools/markdown-preview.js?v=2',
  './tools/lorem-generator.js?v=2',
  './tools/jwt-decoder.js?v=2',
  './tools/diff-checker.js?v=2',
  './tools/cron-parser.js?v=2',
  './tools/image-optimizer.js?v=2',
  './tools/knowledge-base.js?v=2',
  './tools/smart-transformer.js?v=2',
  './tools/ai-packager.js?v=2',
  './tools/ai-sanitizer.js?v=2',
  './tools/web-terminal.js?v=2',
  './tools/opencode-config-generator.js?v=2',
  './tools/ai-agent-config-hub.js?v=2',
  './tools/breach-checker.js?v=2',
  './tools/llm-quality-monitor.js?v=2',
  './tools/multi-provider-router.js?v=2',
  './tools/json-to-typescript.js?v=2',
  './tools/meta-tags-generator.js?v=2',
  './tools/css-box-shadow.js?v=2',
  './tools/regex-tester.js?v=2',
  './tools/qr-generator.js?v=2'
];

const ALL_ASSETS = [...SHELL_ASSETS, ...TOOL_ASSETS];

// Install — cache all core shell + tool assets
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      // Add each asset individually so a 404 on one file doesn't kill the whole install
      const promises = ALL_ASSETS.map(url =>
        cache.add(url).catch(err => {
          console.warn(`[SW] Failed to cache: ${url}`, err);
        })
      );
      return Promise.all(promises);
    })
  );
});

// Activate — cleanup ALL old caches (including devforge-cache-v1)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches
      .keys()
      .then(keys => {
        return Promise.all(
          keys.map(key => {
            if (key !== CACHE_VERSION) {
              console.log(`[SW] Deleting old cache: ${key}`);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch — stale-while-revalidate for HTML/JS/CSS, cache-first for CDN assets
self.addEventListener('fetch', e => {
  const request = e.request;

  // Ignore non-GET requests
  if (request.method !== 'GET') return;

  // CDN assets (fonts, confetti) — cache-first (they're versioned by CDN)
  const isCdnAsset =
    request.url.includes('cdn.jsdelivr.net') ||
    request.url.includes('fonts.googleapis.com') ||
    request.url.includes('fonts.gstatic.com');

  if (isCdnAsset) {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(networkResponse => {
          const clone = networkResponse.clone();
          caches.open(CACHE_VERSION).then(cache => {
            cache.put(request, clone);
          });
          return networkResponse;
        });
      })
    );
    return;
  }

  // Same-origin assets — stale-while-revalidate
  // Return cache immediately IF available, then update cache in background
  e.respondWith(
    caches.match(request).then(cachedResponse => {
      const fetchPromise = fetch(request)
        .then(networkResponse => {
          // Update cache with fresh network copy
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_VERSION).then(cache => {
              cache.put(request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => null);

      // Stale-while-revalidate: return cache hit now, refresh in background
      return (
        cachedResponse ||
        fetchPromise.catch(() => {
          // Offline fallback for navigation
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        })
      );
    })
  );
});

// Listen for "skip and reload" message from the page
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
