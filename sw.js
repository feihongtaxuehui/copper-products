const VERSION = "copperpro-github-v2.2";
const CACHE = VERSION;

// 全部使用相对路径，兼容 https://用户名.github.io/仓库名/
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./config.js",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        if(response && response.ok){
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(()=>{});
        }
        return response;
      }).catch(() => null);

      if(cached){
        network.catch(()=>{});
        return cached;
      }

      return network.then(response => response || caches.match("./index.html"));
    })
  );
});
