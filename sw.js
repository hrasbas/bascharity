 // Cache Name & Versioning
const CACHE_NAME = 'bas-charity-v1';

// ഓഫ്ലൈനിൽ ലഭിക്കേണ്ട പ്രധാന ഫയലുകൾ
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png'
];

// 1. Install Event: ഫയലുകൾ ക്യാഷ് ചെയ്യുന്നു
self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: പഴയ ക്യാഷുകൾ (Old Cache Versions) നീക്കം ചെയ്യുന്നു
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: നെറ്റ്‌വർക്കിൽ നിന്ന് എടുക്കുക, ഓഫ്ലൈനാണെങ്കിൽ ക്യാഷിൽ നിന്ന് നൽകുക
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
