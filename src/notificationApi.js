const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function postNotification(path, body = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    });
  } catch (error) {
    throw new Error('Không kết nối được Notification API. Hãy chạy `npm run server` và khởi động lại `npm run dev`.');
  }

  let payload = {};
  try { payload = await response.json(); } catch (_error) {}
  if (!response.ok) {
    throw new Error(payload.message || `Notification API trả về HTTP ${response.status}.`);
  }
  return payload;
}

export function sendTestEmail(to) {
  return postNotification('/api/notifications/test-email', { to });
}

export function sendTestTelegram(message) {
  return postNotification('/api/notifications/test-telegram', { message });
}
