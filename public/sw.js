var prefix = '/public';
importScripts(prefix + '/workbox-v6.4.1/workbox-sw.js');

if (workbox) {
  workbox.setConfig({
    modulePathPrefix: prefix + '/workbox-v6.4.1/',
  });
  
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
    new workbox.strategies.CacheOnly({
      cacheName: 'cache-music',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [200]
        }),
        new workbox.rangeRequests.RangeRequestsPlugin()
      ]
    })
  );
} else {
  console.log('workbox did not load');
}
