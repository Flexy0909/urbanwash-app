const CACHE_NAME = "urbanwash-cache-v1";
const OFFLINE_ASSETS = ["/", "/register", "/success", "/admin", "/manifest.json"];

// Install event - Cache pages
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching assets for offline support...");
        return cache.addAll(OFFLINE_ASSETS);
      })
      .then(() => self.skipWaiting()),
  );
});

// Activate event - Clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch event - Network-first with cache fallback
self.addEventListener("fetch", (event) => {
  // Only handle HTTP/S requests (ignores chrome-extension or other protocols)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If valid response, cache it dynamically for static assets
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback if offline and asset not cached
          return new Response("Offline mode active. Connection required for this resource.", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({ "Content-Type": "text/plain" }),
          });
        });
      }),
  );
});
