const CACHE_NAME = "gastos-v1";
const URLS_TO_CACHE = [
    "/",
    "/index.html",
    "manifest.json",
    "icon-192.PNG",
    "icon-512.PNG"
];

// INSTALACIÓN (cache inicial)
self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

// ACTIVATE (limpia caches viejos)
self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// FETCH (modo offline)
self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(res => {
            return (
                res ||
                fetch(e.request).catch(() =>
                    caches.match("/index.html")
                )
            );
        })
    );
});