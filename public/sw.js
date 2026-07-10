// ============================================================
// Service worker — La Casa de la Motosierra
// Estrategia pensada para conexión variable (zona austral):
//  - Navegación: red primero, con caída al app shell cacheado.
//  - Assets estáticos y fotos: caché primero (inmutables por
//    hash de Vite), rellenando el caché en la primera visita.
// Subir la versión invalida los cachés antiguos.
// ============================================================
const VERSION = 'lcm-v2';
const APP_SHELL = ['/', '/index.html', '/favicon.svg', '/manifest.webmanifest'];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** true si la ruta es un asset cacheable con caché-primero */
function esAssetCacheable(url) {
  return (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/productos/') ||
      url.pathname === '/hero.webp' ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.webmanifest'))
  );
}

self.addEventListener('fetch', (evento) => {
  const solicitud = evento.request;
  if (solicitud.method !== 'GET') return;
  const url = new URL(solicitud.url);

  // Navegación (SPA): red primero, app shell si no hay conexión
  if (solicitud.mode === 'navigate') {
    evento.respondWith(
      fetch(solicitud)
        .then((respuesta) => {
          const copia = respuesta.clone();
          caches.open(VERSION).then((cache) => cache.put('/index.html', copia));
          return respuesta;
        })
        .catch(() => caches.match('/index.html')),
    );
    return;
  }

  // Assets y fotos: caché primero, red como respaldo
  if (esAssetCacheable(url)) {
    evento.respondWith(
      caches.match(solicitud).then(
        (enCache) =>
          enCache ||
          fetch(solicitud).then((respuesta) => {
            if (respuesta.ok) {
              const copia = respuesta.clone();
              caches.open(VERSION).then((cache) => cache.put(solicitud, copia));
            }
            return respuesta;
          }),
      ),
    );
  }
});
