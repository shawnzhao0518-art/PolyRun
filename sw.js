const CACHE_NAME = "polytruck-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/three.min.js",
  "/game.js",
  "/manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});
