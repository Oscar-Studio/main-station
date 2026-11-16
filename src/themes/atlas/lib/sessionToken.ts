export function getSessionToken() {
  const cookie = document.cookie.match(/(?:^|;\s*)userToken=([^;]*)/)?.[1];
  try {
    if (cookie) return decodeURIComponent(cookie);
    return localStorage.getItem('ai_token') || localStorage.getItem('userToken');
  } catch {
    return null;
  }
}
