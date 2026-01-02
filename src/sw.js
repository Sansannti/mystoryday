const CACHE_NAME = 'mystoryday-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/scripts/index.js',
  '/styles/style.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
];

const API_CACHE_NAME = 'mystoryday-api-v1';
const IMAGE_CACHE_NAME = 'mystoryday-images-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== API_CACHE_NAME && 
              cacheName !== IMAGE_CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests - Network First, fallback to Cache
  if (url.origin === 'https://story-api.dicoding.dev') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response untuk cache
          const responseClone = response.clone();
          
          // Cache GET requests only
          if (request.method === 'GET') {
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          
          return response;
        })
        .catch(() => {
          // Fallback ke cache jika offline
          return caches.match(request);
        })
    );
    return;
  }

  // Image requests - Cache First
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(IMAGE_CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // Static assets - Cache First, fallback to Network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request).catch(() => {
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Push Notification
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  let notificationData = {
    title: 'MyStoryDay',
    body: 'Ada cerita baru!',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    data: {
      url: '/#/stories'
    }
  };

  // Parse data dari push event
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || 'MyStoryDay',
        body: data.body || 'Ada cerita baru!',
        icon: data.icon || '/icon-192x192.png',
        badge: '/icon-96x96.png',
        image: data.image,
        data: {
          url: data.url || '/#/stories',
          storyId: data.storyId
        },
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
      };
    } catch (e) {
      console.error('Error parsing push data:', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data.url || '/#/stories';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Cek apakah ada window yang sudah terbuka
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === self.location.origin + urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Buka window baru jika belum ada
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background Sync
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-stories') {
    event.waitUntil(syncStories());
  }
});

async function syncStories() {
  try {
    const db = await openIndexedDB();
    const pendingStories = await getPendingStories(db);
    
    if (pendingStories.length === 0) {
      return;
    }

    const token = await getTokenFromCache();
    
    for (const story of pendingStories) {
      try {
        const formData = new FormData();
        formData.append('description', story.description);
        formData.append('photo', story.photo);
        if (story.lat && story.lon) {
          formData.append('lat', story.lat);
          formData.append('lon', story.lon);
        }

        const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          await deletePendingStory(db, story.id);
          console.log('[Service Worker] Story synced:', story.id);
        }
      } catch (error) {
        console.error('[Service Worker] Error syncing story:', error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Sync error:', error);
  }
}

// IndexedDB helpers for sync
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyStoryDayDB', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function getPendingStories(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingStories'], 'readonly');
    const store = transaction.objectStore('pendingStories');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function deletePendingStory(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingStories'], 'readwrite');
    const store = transaction.objectStore('pendingStories');
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function getTokenFromCache() {
  const cache = await caches.open(API_CACHE_NAME);
  const keys = await cache.keys();
  
  for (const request of keys) {
    if (request.url.includes('token')) {
      const response = await cache.match(request);
      const data = await response.json();
      return data.token;
    }
  }
  
  return null;
}