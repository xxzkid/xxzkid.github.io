var CACHE_VERSION = 2;
var CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v' + CACHE_VERSION
};

self.addEventListener('install', function(event) {
  var urlsToPrefetch = [
  ];
  // All of these logging statements should be visible via the "Inspect" interface
  // for the relevant SW accessed via chrome://serviceworker-internals
  console.log('Handling install event. Resources to prefetch:', urlsToPrefetch);
  
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
      return cache.addAll(urlsToPrefetch);
    })
  );
});

self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
        );
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (
    /.*\.mp3/.test(event.request.url)
  ) {
    if (event.request.headers.get('range')) {
      var pos =
      Number(/^bytes\=(\d+)\-$/g.exec(event.request.headers.get('range'))[1]);
      console.log('Range request for', event.request.url, ', starting position:', pos);
      event.respondWith(
        caches.open(CURRENT_CACHES.prefetch)
        .then(function(cache) {
          return cache.match(event.request.url);
        }).then(function(res) {
          if (!res) {
            return fetch(event.request)
            .then(res => {
              return res.arrayBuffer();
            });
          }
          return res.arrayBuffer();
        }).then(function(ab) {
          return new Response(
            ab.slice(pos),
            {
              status: 206,
              statusText: 'Partial Content',
              headers: [
                ['Content-Range', 'bytes ' + pos + '-' + (ab.byteLength - 1) + '/' + ab.byteLength]]
            });
        }));
    }
    // var request = event.request;
    // event.respondWith(firstCache(request, 'cache_music'));
  }
});

function firstCache(request, cacheName) {
  return caches.match(request).then((cache) => {
    if (cache) {
      console.log('cached : ', request.url);
      document.getElementById('m-cached-text').innerHTML = request.url;
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
