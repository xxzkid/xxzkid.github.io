importScripts('https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js');
if (workbox) {
  workbox.setConfig({
    modulePathPrefix: 'https://g.alicdn.com/kg/workbox/3.3.0/'
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
} else {
  console.log('workbox did not load');
}
