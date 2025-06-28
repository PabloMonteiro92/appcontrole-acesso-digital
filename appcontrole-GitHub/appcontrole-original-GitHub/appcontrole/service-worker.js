const CACHE_NAME = "app-controle-veiculos-v3"; // Atualize a versão para forçar recarga do cache

const urlsToCache = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./manifest.json",

  // Ícones usados no PWA (ajuste nomes e caminhos conforme seus arquivos)
  "./favicon.ico",
  "./favicon-16x16.png",
  "./favicon-32x32.png",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",

  // Recursos externos
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
];

// Evento de instalação: cache dos arquivos essenciais
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // ativa imediatamente o service worker instalado
});

// Evento de ativação: limpar caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return null;
        })
      )
    )
  );
  self.clients.claim(); // assume o controle das páginas abertas imediatamente
});

// Evento de fetch: responde com cache ou busca na rede
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          // Cacheia a nova resposta para futuras requisições (opcional)
          return caches.open(CACHE_NAME).then((cache) => {
            // Evita caching de requests não GET (ex: POST)
            if (event.request.method === "GET") {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => {
          // Aqui você pode retornar um fallback offline se desejar, ex:
          // return caches.match('./offline.html');
          return new Response(
            "Você está offline e o recurso não está no cache.",
            {
              status: 503,
              statusText: "Service Unavailable",
              headers: new Headers({ "Content-Type": "text/plain" }),
            }
          );
        });
    })
  );
});
