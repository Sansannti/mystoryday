const VERSION = 'v1.0.1';
const BASE_PATH = '/mystoryday';

const APP_CACHE = `mystoryday-app-${VERSION}`;
const API_CACHE = `mystoryday-api-${VERSION}`;
const IMAGE_CACHE = `mystoryday-images-${VERSION}`;

/* ================================
   FILE YANG DICACHE SAAT INSTALL
   ================================ */
const APP_SHELL = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icon-96x96.png`,
  `${BASE_PATH}/icon-192x192.png`,
  `${BASE_PATH}/icon-512x512.png`,
];

/* ================================
   INSTALL
   ================================ */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', VERSION);
  event.waitUntil(
    caches.open(APP_CACHE)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(APP_SHELL);
      })
      .then(() => {
        console.log('[SW] App shell cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Cache failed:', error);
      })
  );
});

/* ================================
   ACTIVATE
   ================================ */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version:', VERSION);
  event.waitUntil(
    caches.keys().then((keys) => {
      console.log('[SW] Existing caches:', keys);
      return Promise.all(
        keys.map((key) => {
          if (![APP_CACHE, API_CACHE, IMAGE_CACHE].includes(key)) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.claim();
    })
  );
});

/* ================================
   FETCH STRATEGIES
   ================================ */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip chrome extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  /* -------------------------------
     API: Network First with Cache Fallback
     ------------------------------- */
  if (url.origin === 'https://story-api.dicoding.dev') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache GET requests
          if (request.method === 'GET' && response.status === 200) {
            const clone = response.clone();
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, clone);
              console.log('[SW] Cached API response:', request.url);
            });
          }
          return response;
        })
        .catch(() => {
          console.log('[SW] Network failed, trying cache for:', request.url);
          return caches.match(request).then((cached) => {
            if (cached) {
              console.log('[SW] Serving from cache:', request.url);
              return cached;
            }
            // Return a basic offline response for API calls
            return new Response(
              JSON.stringify({
                error: true,
                message: 'Offline - No cached data available'
              }),
              {
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        })
    );
    return;
  }

  /* -------------------------------
     IMAGE: Cache First with Network Fallback
     ------------------------------- */
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          console.log('[SW] Serving image from cache:', request.url);
          return cached;
        }
        
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => {
              cache.put(request, clone);
              console.log('[SW] Cached image:', request.url);
            });
          }
          return response;
        }).catch(() => {
          console.log('[SW] Image fetch failed:', request.url);
          // Return placeholder or error image if needed
        });
      })
    );
    return;
  }

  /* -------------------------------
     NAVIGATION: Network First with Offline Fallback
     ------------------------------- */
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          console.log('[SW] Navigation fetch success:', request.url);
          return response;
        })
        .catch(() => {
          console.log('[SW] Navigation offline, serving cached index');
          return caches.match(`${BASE_PATH}/index.html`).then((cached) => {
            if (cached) {
              return cached;
            }
            return caches.match(`${BASE_PATH}/`);
          });
        })
    );
    return;
  }

  /* -------------------------------
     DEFAULT: Cache First with Network Fallback
     ------------------------------- */
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        console.log('[SW] Serving from cache:', request.url);
        return cached;
      }
      
      console.log('[SW] Fetching from network:', request.url);
      return fetch(request).then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(APP_CACHE).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      });
    })
  );
});

/* ================================
   PUSH NOTIFICATION
   ================================ */
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
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
      console.log('[SW] Push data:', json);
      data = {
        ...data,
        ...json,
        icon: json.icon || `${BASE_PATH}/icon-192x192.png`,
        badge: json.badge || `${BASE_PATH}/icon-96x96.png`,
        data: {
          url: json.url || `${BASE_PATH}/#/stories`,
          storyId: json.storyId,
        },
      };
    } catch (e) {
      console.error('[SW] Push parse error:', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      vibrate: [200, 100, 200],
      data: data.data,
      actions: [
        {
          action: 'open',
          title: 'Lihat Cerita'
        },
        {
          action: 'close',
          title: 'Tutup'
        }
      ]
    })
  );
});

/* ================================
   NOTIFICATION CLICK
   ================================ */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  event.notification.close();

  // ✅ Handle close action
  if (event.action === 'close') {
    return;
  }

  // ✅ Handle view action untuk favorite notifications
  if (event.action === 'view' && event.notification.data?.url) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientsArr) => {
          // Check if there's already a window open
          for (const client of clientsArr) {
            if (client.url.includes(BASE_PATH) && 'focus' in client) {
              console.log('[SW] Focusing existing window and navigating');
              return client.focus().then(() => {
                return client.navigate(event.notification.data.url);
              });
            }
          }
          // Open new window if none exists
          console.log('[SW] Opening new window');
          return clients.openWindow(event.notification.data.url);
        })
    );
    return;
  }

  // ✅ Default action (click body notification)
  const targetUrl = event.notification.data?.url || `${BASE_PATH}/`;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientsArr) => {
        // Check if there's already a window open
        for (const client of clientsArr) {
          if (client.url.includes(BASE_PATH) && 'focus' in client) {
            console.log('[SW] Focusing existing window');
            return client.focus().then(() => {
              return client.navigate(targetUrl);
            });
          }
        }
        // Open new window if none exists
        console.log('[SW] Opening new window');
        return clients.openWindow(targetUrl);
      })
  );
});

/* ================================
   MESSAGE (untuk sync manual)
   ================================ */
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(APP_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});