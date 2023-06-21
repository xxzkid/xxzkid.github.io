// importScripts('https://cdnjs.cloudflare.com/ajax/libs/workbox-sw/6.4.1/workbox-sw.min.js');
// workbox.setConfig({
//   modulePathPrefix: 'https://cdnjs.cloudflare.com/ajax/libs/workbox-sw/6.4.1/'
// });
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  workbox.loadModule('routing');
  workbox.loadModule('strategies');
  workbox.loadModule('cacheableResponse');
  workbox.loadModule('rangeRequests');
  
  workbox.core.setCacheNameDetails({
    prefix: 'app',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime'
  });
  
  // workbox.routing.precacheAndRoute([
  // ]);
  
  workbox.routing.registerRoute(
    new RegExp('.*\.html'),
    new workbox.strategies.NetworkFirst()
  );
  
  workbox.routing.registerRoute(
    new RegExp('.*\.(?:js|css)'),
    new workbox.strategies.CacheFirst()
  );
  
  workbox.routing.registerRoute(
    ({request}) => {
      const {destination} = request;
      return destination === 'video' || destination === 'audio'
    },
    new workbox.strategies.CacheFirst({
      cacheName: 'cache-music',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [200]
        }),
        new RangeRequestsPlugin()
      ]
    })
  );
} else {
  console.log('workbox did not load');
}
