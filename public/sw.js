importScripts('https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js');
workbox.setConfig({
  modulePathPrefix: 'https://g.alicdn.com/kg/workbox/3.3.0/'
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
