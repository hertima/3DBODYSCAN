const MEDIA_CACHE = "zyrox-media-v2";
const MEDIA_PATTERNS = [/\/musculacao-media\//, /\/calistenia-pura\//];

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== MEDIA_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  const isMedia = MEDIA_PATTERNS.some((p) => p.test(request.url));
  if (!isMedia) return;

  if (request.headers.has("range")) return;

  e.respondWith(
    caches.open(MEDIA_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
  );
});
