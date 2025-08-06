self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'TutorLinc';
  const options = {
    body: data.body || 'New message received',
      icon: 'https://cdn-icons-png.flaticon.com/512/3408/3408542.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/3408/3408542.png',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('http://127.0.0.1:5500/frontend/inquiry.html')  // Adjust to your frontend route
  );
});

