var prefix = '/public';
importScripts(prefix + '/workbox-v6.4.1/workbox-sw.js');

if (workbox) {
  workbox.setConfig({
    modulePathPrefix: prefix + '/workbox-v6.4.1/',
  });

  var prefix = 'app';
  var suffix = 'v2';
  workbox.core.setCacheNameDetails({
    prefix: prefix,
    suffix: suffix,
    precache: 'precache',
    runtime: 'runtime'
  });
  self.registration['details'] = {
    prefix: prefix,
    suffix: suffix,
  };
  
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

  var MusicLog = function () {
    this.handlerDidComplete = function(options) {
      var event = options.event;
      var request = options.request;
      var response = options.response;
      var error = options.error;
      event.target.clients.get(event.clientId).then((c) => {
        var text = decodeURI(request.url);
        c.postMessage({type: 'LOG', text: text});
      });
      return response;
    };
  };
  
  workbox.routing.registerRoute(
    ({request}) => {
      const {destination} = request;
      return destination === 'video' || destination === 'audio'
    },
    new workbox.strategies.CacheFirst({
      cacheName: 'cache-music',
      matchOptions: {
        ignoreSearch: true
      },
      plugins: [
        new MusicLog(),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [200]
        }),
        new workbox.rangeRequests.RangeRequestsPlugin()
      ]
    })
  );

  workbox.core.skipWaiting();
  workbox.core.clientsClaim();
} else {
  console.log('workbox did not load');
}
