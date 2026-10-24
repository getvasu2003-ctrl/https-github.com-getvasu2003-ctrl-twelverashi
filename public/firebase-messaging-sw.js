// Firebase Cloud Messaging (FCM) Background Service Worker for 12Rashi
// Handles background push notifications for Daily Horoscope, Muhurat, and Rahu Kaal alerts

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Initialize Firebase in Service Worker with 12Rashi credentials
const firebaseConfig = {
  apiKey: "AIzaSyC1vcbWLqQPUqzdvpW4tNR9EJh9ArNGOq4",
  projectId: "light-diorama-nmn89",
  messagingSenderId: "482394355035",
  appId: "1:482394355035:web:2d2e95a02403eaefa3d67e",
};

firebase.initializeApp(firebaseConfig);

let messaging = null;
try {
  messaging = firebase.messaging();
} catch (e) {
  console.warn('[firebase-messaging-sw.js] Messaging not initialized:', e);
}

// Background push notification receiver
if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background push message:', payload);

    const title = payload.notification?.title || payload.data?.title || '12Rashi Auspicious Alert 🌟';
    const body = payload.notification?.body || payload.data?.body || 'Your daily Vedic astrological forecast & muhurat update.';
    const alertType = payload.data?.alertType || 'general';
    const clickUrl = payload.data?.clickUrl || (alertType === 'muhurat' ? '/?tab=panchang' : '/?tab=daily-audio');

    const notificationOptions = {
      body: body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: payload.data?.tag || `12rashi-${alertType}-${Date.now()}`,
      renotify: true,
      requireInteraction: alertType === 'muhurat' || alertType === 'rahu_kaal',
      vibrate: [200, 100, 200, 100, 300],
      data: {
        clickUrl: clickUrl,
        alertType: alertType,
        timestamp: Date.now(),
      },
      actions: [
        { action: 'open', title: 'Open 12Rashi 🧭' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    };

    return self.registration.showNotification(title, notificationOptions);
  });
}

// Handle notification interaction / click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = event.notification.data?.clickUrl || '/?tab=daily-audio';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a tab is already open, focus it and navigate
      for (let client of windowClients) {
        if (client.url.includes('ais-') || client.url.includes('12rashi')) {
          if ('focus' in client) {
            client.focus();
          }
          if ('navigate' in client) {
            client.navigate(targetUrl);
          }
          return;
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
