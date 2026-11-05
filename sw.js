"use strict";

const CACHE_NAME = "safewalk-shell-v6";
const APP_SHELL = [
  "./",
  "./index.html",
  "./home.html",
  "./login.html",
  "./track.html",
  "./safety.html",
  "./privacy.html",
  "./offline.html",
  "./manifest.json",
  "./assets/icon.svg",
  "./css/style.css",
  "./js/utils.js",
  "./js/i18n.js",
  "./js/login.js",
  "./js/home.js",
  "./js/app.js",
  "./js/map.js",
  "./js/share.js",
  "./js/track.js",
  "./js/safety.js",
  "./js/privacy.js",
  "./js/export.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith("safewalk-shell-") && name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          return cachedPage || caches.match("./offline.html");
        }),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then(async (response) => {
        if (response.ok && response.type === "basic") {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) {
          return cached;
        }
        throw new Error("This SafeWalk file is not available offline.");
      }),
  );
});
