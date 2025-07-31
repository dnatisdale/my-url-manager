module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{js,css,html,png,jpg,jpeg,svg,ico,json,txt}'
  ],
  swDest: 'build/service-worker.js',
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
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
    {
      urlPattern: /^https:\/\/api\.qrserver\.com\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'qr-code-api',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
        },
      },
    },
  ],
};