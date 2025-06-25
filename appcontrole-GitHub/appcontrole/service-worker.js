const CACHE_NAME = "app-controle-veiculos-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./manifest.json",
  "./style.css",
  "./icon-192.png",
  "./icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  // adicione outros arquivos estáticos que usar
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
