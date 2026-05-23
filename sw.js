const CACHE = 'stelluna-v4';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.includes(self.location.origin)) return;
  event.respondWith(
    fetch(event.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(event.request, clone));
      return res;
    }).catch(() => caches.match(event.request))
  );
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(self.registration.showNotification(
    data.title || '听月发来消息 💓',
    {
      body: data.body || '',
      icon: './icon-192x192.png',
      badge: './icon-192x192.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || './' },
    }
  ));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const client of list) {
        if (client.url.includes('victoryaoife.github.io') && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow)
        return clients.openWindow(event.notification.data.url || './');
    })
  );
});
