module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{js,css,html,png,jpg,jpeg,svg,ico,json,txt,woff,woff2,ttf,eot}'
  ],
  swDest: 'build/service-worker.js',
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
  sourcemap: false,
  
  // Runtime caching strategies
  runtimeCaching: [
    // Google Fonts
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365,
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
          maxAgeSeconds: 60 * 60 * 24 * 365,
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
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    
    // Static assets
    {
      urlPattern: /\.(?:png|gif|jpg|jpeg|svg|ico|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    
    // JS and CSS
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
      },
    },
  ],
  
  // Offline fallback
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
};