// Custom service worker template
// This will be processed by Workbox to add caching strategies

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Precache all static assets
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old caches
cleanupOutdatedCaches();

// Handle offline page
const OFFLINE_PAGE = '/offline.html';
const CACHE_NAME = 'offline-page';

// Cache the offline page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add(OFFLINE_PAGE);
    })
  );
});

// Serve offline page when network fails
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_PAGE);
      })
    );
  }
});

// Background sync for URL additions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-urls') {
    event.waitUntil(syncUrls());
  }
});

async function syncUrls() {
  try {
    // Get pending URLs from IndexedDB
    const pendingUrls = await getPendingUrls();
    
    for (const url of pendingUrls) {
      try {
        // Attempt to sync with server
        await fetch('/api/urls', {
          method: 'POST',
          body: JSON.stringify(url),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // Remove from pending if successful
        await removePendingUrl(url.id);
      } catch (error) {
        console.log('Failed to sync URL:', url, error);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Helper functions for IndexedDB operations
async function getPendingUrls() {
  // Implementation would use IndexedDB
  return [];
}

async function removePendingUrl(id) {
  // Implementation would use IndexedDB
  return Promise.resolve();
}

// Handle install prompt events
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notification handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Share target handling
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle share target
  if (url.searchParams.has('url') && url.searchParams.has('title')) {
    event.respondWith(
      fetch('/').then((response) => {
        return response;
      })
    );
  }
});

// Enhanced caching strategies (Workbox will inject these)
// The actual caching rules are defined in workbox_config.js

console.log('Service Worker loaded with enhanced PWA features');