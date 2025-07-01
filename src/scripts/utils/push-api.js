import { API_BASE_URL } from '../models/api-config.js';

const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribePush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert('Browser tidak mendukung Push Notification');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Kamu harus login untuk subscribe');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // 🔍 Cek apakah sudah ada subscription sebelumnya
    const existingSubscription = await registration.pushManager.getSubscription();

    if (existingSubscription) {
      console.log('ℹ️ Sudah subscribe sebelumnya, tidak perlu ulangi.');
      return; // ⛔ keluar tanpa melakukan subscribe lagi
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    await fetch(`${API_BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.toJSON().keys.p256dh,
          auth: subscription.toJSON().keys.auth,
        }
      })
    });

    alert('✅ Berhasil subscribe notifikasi!');
  } catch (err) {
    console.error(err);
    alert('❌ Gagal subscribe notifikasi!');
  }
}


export async function unsubscribePush() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Harus login dulu');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      alert('Kamu belum subscribe');
      return;
    }

    await fetch(`${API_BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    });

    await subscription.unsubscribe();
    alert('🗑️ Berhasil unsubscribe');
  } catch (err) {
    console.error(err);
    alert('❌ Gagal unsubscribe');
  }
}

export { subscribePush as registerPushNotification };
