const STORAGE_KEY = "chat-siris-access-token";

let memoryToken = null;

export function setAccessToken(token) {
  memoryToken = token;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, token);
    window.dispatchEvent(new Event("chat-siris-token-set"));
  }
}

export function getAccessToken() {
  if (memoryToken) {
    return memoryToken;
  }
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      memoryToken = stored;
      return stored;
    }
  }
  return null;
}

export function clearAccessToken() {
  memoryToken = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
