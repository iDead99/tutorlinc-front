self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'TutorLinc';
  const options = {
    body: data.body || 'New message received',
    icon: 'http://localhost:5500/frontend/images/logo.png',
    badge: 'http://localhost:5500/frontend/images/logo.png',
    data: {
      url: 'http://127.0.0.1:5500/frontend/inquiry.html'  // You can even pass dynamic URLs
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url || 'http://127.0.0.1:5500/frontend/inquiry.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
