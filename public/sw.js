importScripts('./workbox-sw.js');
workbox.setConfig({
  modulePathPrefix: './'
});

workbox.precaching([
  // 注册成功后要立即缓存的资源列表
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
