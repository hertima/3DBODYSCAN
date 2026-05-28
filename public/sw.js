const SHELL_CACHE = "zyrox-shell-v5";
const MEDIA_CACHE = "zyrox-media-v5";

const SHELL_ASSETS = [
  "/",
  "/app",
  "/icon-192.png",
  "/manifest.json",
];

const MEDIA_PATTERNS = [/\/musculacao-media\//, /\/calistenia-pura\//, /\/exercises\//];

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────────────────────
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

// ── Fetch ─────────────────────────────────────────────────────────────────────
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

// ── Push (background — app fechado) ──────────────────────────────────────────
self.addEventListener("push", (e) => {
  let data = { title: "3D Body Scanner", body: "Nova notificação", url: "/app" };
  try {
    if (e.data) data = { ...data, ...e.data.json() };
  } catch {}

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [200, 100, 200],
      data: { url: data.url || "/app" },
      actions: [
        { action: "open", title: "Abrir app" },
        { action: "dismiss", title: "Dispensar" },
      ],
    })
  );
});

// ── Notification click ────────────────────────────────────────────────────────
self.addEventListener("notificationclick", (e) => {
  e.notification.close();

  if (e.action === "dismiss") return;

  const targetUrl = e.notification.data?.url || "/app";

  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Se o app já está aberto, foca nele
      for (const client of clientList) {
        if ("focus" in client) {
          client.focus();
          if ("navigate" in client) client.navigate(targetUrl);
          return;
        }
      }
      // Senão, abre nova janela
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

// ── Sync periódico (lembrete de treino em background) ────────────────────────
self.addEventListener("periodicsync", (e) => {
  if (e.tag === "workout-reminder") {
    e.waitUntil(
      self.registration.showNotification("3D Body Scanner 💪", {
        body: "Hora do treino! Não perca sua sequência.",
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        data: { url: "/app/treinos" },
      })
    );
  }
});
