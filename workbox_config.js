module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{js,css,html,png,jpg,jpeg,svg,ico,json,txt,woff,woff2,ttf,eot}'
  ],
  swDest: 'build/service-worker.js',
  skipWaiting: true,
  clientsClaim: true,
  
  // Enhanced runtime caching strategies
  runtimeCaching: [
    // Google Fonts
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    
    // QR Code API
    {
      urlPattern: /^https:\/\/api\.qrserver\.com\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'qr-code-api',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
        cacheKeyWillBeUsed: async ({request}) => {
          // Create a stable cache key for QR codes
          const url = new URL(request.url);
          return url.origin + url.pathname + '?data=' + url.searchParams.get('data');
        },
      },
    },
    
    // Static assets (images, icons, etc.)
    {
      urlPattern: /\.(?:png|gif|jpg|jpeg|svg|ico|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    
    // JavaScript and CSS files
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
      },
    },
    
    // App shell (HTML documents)
    {
      urlPattern: /^https:\/\/.*\.netlify\.app\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'app-shell',
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
        },
      },
    },
    
    // API calls and external resources
    {
      urlPattern: /^https:\/\/api\./,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5, // 5 minutes
        },
      },
    },
  ],
  
  // Offline fallback
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
  
  // Additional Workbox options
  cleanupOutdatedCaches: true,
  sourcemap: false,
  
  // Custom service worker additions
  swSrc: 'src/sw-template.js',
};