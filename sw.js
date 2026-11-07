// キャッシュの名前。ファイルを更新したときは、この数字を変えると新しい内容に入れ替わる
const CACHE_NAME = "timer-app-v1";

// オフラインでも動かすためにキャッシュするファイル（すべて相対パス）
const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// インストール時: 必要なファイルをまとめて保存する
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

// 有効化時: 古いバージョンのキャッシュを削除する
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) { return key !== CACHE_NAME; })
          .map(function (key) { return caches.delete(key); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// ファイルの要求時: キャッシュにあればそれを返し、なければネットワークから取得する
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request);
    })
  );
});
