/**
 * Monolith profile routes return { status, obj }. When the legacy `users`
 * document is missing, obj is null — keep local Recoil state instead of wiping it.
 */
export function mergeUserFromResponse(currentUser, responseData, patch = {}) {
  const obj = responseData?.obj ?? responseData?.user;
  if (obj) {
    return obj;
  }
  if (currentUser) {
    return { ...currentUser, ...patch };
  }
  return currentUser;
}

export function sameUserId(a, b) {
  if (a == null || b == null) {
    return false;
  }
  return String(a) === String(b);
}
