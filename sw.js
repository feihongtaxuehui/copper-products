const VERSION = "copperpro-github-v2.3";
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

/*
 * 网络优先：
 * 每次打开页面优先获取最新文件。
 * 网络失败时才读取离线缓存。
 */
self.addEventListener("fetch", event => {
    const request = event.request;

    if (request.method !== "GET") return;

    const url = new URL(request.url);
    const scope = new URL(self.registration.scope);

    // 只处理当前项目的资源
    if (url.origin !== scope.origin ||
        !url.pathname.startsWith(scope.pathname)) {
        return;
    }

    event.respondWith((async () => {
        const cache = await caches.open(CACHE);

        try {
            // 禁止使用浏览器旧 HTTP 缓存
            const response = await fetch(request, {
                cache: "no-store"
            });

            if (response.ok) {
                await cache.put(
                    request,
                    response.clone()
                );
            }

            return response;

        } catch (error) {
            // 断网时使用离线缓存
            const cached = await cache.match(request);

            if (cached) return cached;

            if (request.mode === "navigate") {
                const home = await cache.match("./index.html");
                if (home) return home;
            }

            return Response.error();
        }
    })());
});
