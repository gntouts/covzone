var CACHE_NAME = 'covzone-cache-' + Math.floor(Date.now() / 1000).toString();

var urlsToCache = [
    '/',
    "/geo.html",
    "/style.css",
    "/script.js",
    "assets/android-icon-36x36.png",
    "assets/android-icon-48x48.png",
    "assets/android-icon-72x72.png",
    "assets/android-icon-96x96.png",
    "assets/android-icon-144x144.png",
    "assets/android-icon-192x192.png",
    "assets/apple-icon-57x57.png",
    "assets/apple-icon-60x60.png",
    "assets/apple-icon-72x72.png",
    "assets/apple-icon-76x76.png",
    "assets/apple-icon-114x114.png",
    "assets/apple-icon-120x120.png",
    "assets/apple-icon-144x144.png",
    "assets/apple-icon-152x152.png",
    "assets/apple-icon-180x180.png",
    "assets/apple-icon-precomposed.png",
    "assets/apple-icon.png",
    "assets/favicon-16x16.png",
    "assets/favicon-32x32.png",
    "assets/favicon-96x96.png",
    "assets/favicon.ico",
    "assets/ms-icon-70x70.png",
    "assets/ms-icon-144x144.png",
    "assets/ms-icon-150x150.png",
    "assets/ms-icon-310x310.png"
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});



self.addEventListener('activate', function (event) {
    console.log('Updating Service Worker...')
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                    return true
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
