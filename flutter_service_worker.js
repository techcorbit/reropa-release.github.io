'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "aaff2adc3467ca8bbb398c78650d7268",
"assets/AssetManifest.bin.json": "c132d87888c5b03ca30f8815c24e3d87",
"assets/AssetManifest.json": "1bcdf6519eff8233c8b3f23360c336c9",
"assets/assets/fonts/Manrope/Manrope-Bold.ttf": "69258532ce99ef9abf8220e0276fff04",
"assets/assets/fonts/Manrope/Manrope-Regular.ttf": "f8105661cf5923464f0db8290746d2f9",
"assets/assets/images/dashboardFinance.png": "32f2f708482b92b6a18d34a8f9c9215b",
"assets/assets/images/dashboardPermissions.png": "0343628ced3a57602ee69b775b22e9f5",
"assets/assets/images/dashboardReports.png": "8df0250a06e8b846d6a48fe0d2769951",
"assets/assets/images/dropdownArrow.png": "459569518b34a1cafa7b083f6310ce6b",
"assets/assets/images/homeAboutUs.jpg": "5cc8e62cfab0ad4b7dda59b14329b8a5",
"assets/assets/images/homeComments.png": "fcb1f5e028450243703029581cea414e",
"assets/assets/images/homeDownload.jpg": "8ecdd7b7166589931e1f35822a305fc3",
"assets/assets/images/homeDownloadApple.png": "39db9fe74191c38838941bfb5801ef3c",
"assets/assets/images/homeDownloadGoogle.png": "77f91185ad32ef3982ac7a528cd9c9d6",
"assets/assets/images/homeDownloadPhone.png": "fd66dacc1c96b0b5b46548a2f62ef9f7",
"assets/assets/images/homeNews.png": "15b900e57a03e3c2e9699af1b100679e",
"assets/assets/images/homeServicesSupplier.jpg": "c32e90fedfb3e1ce53082bdf01acb735",
"assets/assets/images/homeServicesTransport.jpg": "d08ae6fad48c92db70c043f72cdf8316",
"assets/assets/images/homeStart.png": "ea297ad058b01a112712ada03a7d2a73",
"assets/assets/images/loginWall.jpg": "7ad5651624643ca2315e5d2085212027",
"assets/assets/images/loginWall.png": "e2aff6f0e07cba03586321a458400c99",
"assets/assets/images/logo.png": "b3198f9e53ca4a11e7c7fd6a998744db",
"assets/assets/images/logo.svg": "5790a05c7b20210f932a91f99e64e495",
"assets/FontManifest.json": "06eaa3930f8f8d553ba83762f4ce9c3f",
"assets/fonts/MaterialIcons-Regular.otf": "edaa88f099c47891081676d229057146",
"assets/NOTICES": "47d92d8f7f466456a146eb6b9e49d998",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"canvaskit/canvaskit.js": "321aa0c874f6112cabafc27a74a784b4",
"canvaskit/canvaskit.js.symbols": "7bc7b816cc2ea20158b8f96a99960393",
"canvaskit/canvaskit.wasm": "2a1addcc316c372baa0080f30b85a0e3",
"canvaskit/chromium/canvaskit.js": "bc979fce6b4b3cc75d54b0d162cafaa7",
"canvaskit/chromium/canvaskit.js.symbols": "8d26e71c60c1539a22231b253ee1a999",
"canvaskit/chromium/canvaskit.wasm": "ab0a0eb3c22e0ceaf46512d4ff17545e",
"canvaskit/skwasm.js": "411f776c9a5204d1e466141767f5a8fa",
"canvaskit/skwasm.js.symbols": "e03a50cb20ff6c262729d11295ac5454",
"canvaskit/skwasm.wasm": "feeb27aea29a9e626a87f2dac168933a",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.ico": "3a90d52dcdcff3b2a8ab65504b0191ab",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "599642922b6038dde348d6722ebab314",
"/": "599642922b6038dde348d6722ebab314",
"main.dart.js": "954b4157ff1d74a1757419e34acb939b",
"manifest.json": "a5ac2f4718388966fb880a321da3f90c",
"version.json": "7b502510627d6b068c61464d97f70cab",
"web.zip": "db84164ca1cbf045b930cc98943cf211"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
