import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);



self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Notifikasi Baru';
  const options = data.options || {
    body: 'Ada notifikasi baru.',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
