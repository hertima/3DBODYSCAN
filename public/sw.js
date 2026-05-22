const SHELL_CACHE = "zyrox-shell-v3";
const MEDIA_CACHE = "zyrox-media-v3";

const SHELL_ASSETS = [
  "/",
  "/app",
  "/favicon.png",
  "/manifest.json",
];

const MEDIA_PATTERNS = [/\/musculacao-media\//, /\/calistenia-pura\//, /\/exercises\//];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== MEDIA_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Media: cache-first
  const isMedia = MEDIA_PATTERNS.some((p) => p.test(url.pathname));
  if (isMedia) {
    e.respondWith(
      caches.open(MEDIA_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  // Navigation: network-first, fallback to shell
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request).catch(() =>
        caches.match("/").then((r) => r ?? Response.error())
      )
    );
    return;
  }

  // Static assets: stale-while-revalidate
  e.respondWith(
    caches.open(SHELL_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const fetchPromise = fetch(request).then((response) => {
        if (response.ok) cache.put(request, response.clone());
        return response;
      });
      return cached ?? fetchPromise;
    })
  );
});
