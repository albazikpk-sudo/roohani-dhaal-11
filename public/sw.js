// This file is replaced after `vite build` by scripts/generate-sw.mjs.
// The generated worker precaches every built HTML, JS, CSS, JSON and image asset.
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
