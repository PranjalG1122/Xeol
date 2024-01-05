const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  const responseFromNetwork = await fetch(request);
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;
};

const cachable = ["/session/details"];

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (cachable.includes(url.pathname)) {
    e.respondWith(cacheFirst(e.request));
  } else return;
});
