importScripts('https://cdnjs.cloudflare.com/ajax/libs/workbox-sw/7.0.0/workbox-sw.min.js');
workbox.setConfig({
  modulePathPrefix: 'https://cdnjs.cloudflare.com/ajax/libs/workbox-sw/7.0.0/'
});
if (workbox) {
  workbox.core.setCacheNameDetails({
    prefix: 'app',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime'
  });
  
  workbox.routing.precacheAndRoute([
  ]);
  
  workbox.routing.registerRoute(
    new RegExp('.*\.html'),
    workbox.strategies.networkFirst()
  );
  
  workbox.routing.registerRoute(
    new RegExp('.*\.(?:js|css)'),
    workbox.strategies.cacheFirst()
  );
  
  workbox.routing.registerRoute(
    new RegExp('.*\.mp3'),
    workbox.strategies.cacheFirst()
  );
} else {
  console.log('workbox did not load');
}
