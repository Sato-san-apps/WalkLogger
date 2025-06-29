self.addEventListener('install', function(event) {
  console.log('Service Worker installing.');
  // キャッシュ操作など
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating.');
  // クリーンアップなど
});

self.addEventListener('fetch', function(event) {
  console.log('Service Worker fetching.', event.request.url);
  // ネットワークリクエストのキャッシュ処理など
});