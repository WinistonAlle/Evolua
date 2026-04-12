const POST_AUTH_LOADING_KEY = "evolua-post-auth-loading-until";

export function startPostAuthLoading(durationMs = 2500) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    POST_AUTH_LOADING_KEY,
    String(Date.now() + Math.max(0, durationMs)),
  );
}

export function getRemainingPostAuthLoadingMs() {
  if (typeof window === "undefined") return 0;

  const rawValue = window.sessionStorage.getItem(POST_AUTH_LOADING_KEY);
  if (!rawValue) return 0;

  const expiresAt = Number(rawValue);
  if (!Number.isFinite(expiresAt)) {
    clearPostAuthLoading();
    return 0;
  }

  const remaining = expiresAt - Date.now();
  if (remaining <= 0) {
    clearPostAuthLoading();
    return 0;
  }

  return remaining;
}

export function clearPostAuthLoading() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(POST_AUTH_LOADING_KEY);
}
