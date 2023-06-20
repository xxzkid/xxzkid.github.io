self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('cache_static').then((cache) => {
      
    }).then(() => {
      self.skipWaiting();
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (
    /.*\.mp3/.test(event.request.url)
  ) {
    var request = event.request;
    event.respondWith(firstCache(request, 'cache_music'));
  }
});

function firstCache(request, cacheName) {
  return caches.match(request).then((cache) => {
    if (cache) {
      return cache;
    }
    var requestCopy = request.clone();
    return fetch(requestCopy).then((response) => {
      var responseCopy = response.clone();
      caches.open(cacheName).then((cache) => {
        cache.put(requestCopy, responseCopy);
      });
      return response;
    });
  });
}
