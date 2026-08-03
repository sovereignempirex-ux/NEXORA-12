/* ===================== NEXORA SERVICE WORKER =====================
 * PWA Offline Support
 * ================================================================ */

const CACHE_NAME = 'nexora-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/db.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Install
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                // Return cached or fetch from network
                if (cached) {
                    // Update cache in background
                    fetch(event.request)
                        .then(response => {
                            caches.open(CACHE_NAME)
                                .then(cache => cache.put(event.request, response));
                        })
                        .catch(() => {});
                    return cached;
                }

                return fetch(event.request)
                    .then(response => {
                        // Cache new requests
                        if (response.status === 200 && response.type === 'basic') {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => cache.put(event.request, responseClone));
                        }
                        return response;
                    })
                    .catch(() => {
                        // Offline fallback
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        return new Response('Offline - NEXORA', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-contacts') {
        event.waitUntil(syncContacts());
    }
});

async function syncContacts() {
    // Sync pending contacts when back online
    console.log('[SW] Syncing contacts...');
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    event.waitUntil(
        self.registration.showNotification(data.title || 'NEXORA', {
            body: data.body || 'إشعار جديد من NEXORA',
            icon: '/images/icon-192.png',
            badge: '/images/icon-72.png',
            tag: data.tag || 'nexora-notification',
            requireInteraction: true,
            actions: [
                { action: 'open', title: 'فتح' },
                { action: 'close', title: 'إغلاق' }
            ]
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'open' || !event.action) {
        event.waitUntil(clients.openWindow('/'));
    }
});
