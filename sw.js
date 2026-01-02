const VERSION = 'v1';
const BASE_PATH = '/mystoryday';

const APP_CACHE = `mystoryday-app-${VERSION}`;
const API_CACHE = `mystoryday-api-${VERSION}`;
const IMAGE_CACHE = `mystoryday-images-${VERSION}`;

/* ================================
   FILE YANG DICACHE SAAT INSTALL
   (JANGAN cache file JS hasil build)
   ================================ */
const APP_SHELL = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icon-192x192.png`,
  `${BASE_PATH}/icon-512x512.png`,
];

/* ================================
   INSTALL
   ================================ */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(APP_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

/* ================================
   ACTIVATE
   ================================ */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (![APP_CACHE, API_CACHE, IMAGE_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

/* ================================
   FETCH STRATEGIES
   ================================ */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* -------------------------------
     API: Network First
     ------------------------------- */
  if (url.origin === 'https://story-api.dicoding.dev') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (request.method === 'GET') {
            const clone = response.clone();
            caches.open(API_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  /* -------------------------------
     IMAGE: Cache First
     ------------------------------- */
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => cache.put(request, clone));
            return response;
          })
        );
      })
    );
    return;
  }

  /* -------------------------------
     NAVIGATION (SPA OFFLINE)
     ------------------------------- */
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(`${BASE_PATH}/index.html`)
      )
    );
    return;
  }

  /* -------------------------------
     DEFAULT: Cache First
     ------------------------------- */
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

/* ================================
   PUSH NOTIFICATION
   ================================ */
self.addEventListener('push', (event) => {
  let data = {
    title: 'MyStoryDay',
    body: 'Ada cerita baru!',
    icon: `${BASE_PATH}/icon-192x192.png`,
    badge: `${BASE_PATH}/icon-96x96.png`,
    data: {
      url: `${BASE_PATH}/#/stories`,
    },
  };

  if (event.data) {
    try {
      const json = event.data.json();
      data = {
        ...data,
        ...json,
        data: {
          url: json.url || `${BASE_PATH}/#/stories`,
          storyId: json.storyId,
        },
      };
    } catch (e) {
      console.error('[SW] Push parse error', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, data)
  );
});

/* ================================
   NOTIFICATION CLICK
   ================================ */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || `${BASE_PATH}/`;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientsArr) => {
        for (const client of clientsArr) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(targetUrl);
      })
  );
});
