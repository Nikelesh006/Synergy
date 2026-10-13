const API_BASE = import.meta.env.VITE_API_URL || "/api";

let inMemoryCsrfToken: string | null = null;
let tokenFetchPromise: Promise<string> | null = null;

/**
 * Checks whether a given endpoint or URL is targeting our internal API.
 * Avoids leaking CSRF tokens to third-party domains.
 */
function isInternalApiUrl(url: string): boolean {
  if (url.startsWith("/") || url.startsWith(API_BASE)) {
    return true;
  }
  if (typeof window !== "undefined") {
    try {
      const parsed = new URL(url, window.location.origin);
      return parsed.origin === window.location.origin;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Retrieves the current in-memory CSRF token.
 * Automatically fetches and caches a fresh token from the backend if none exists.
 * Deduplicates parallel concurrent requests to avoid race conditions.
 */
export async function getCsrfToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && inMemoryCsrfToken) {
    return inMemoryCsrfToken;
  }

  if (tokenFetchPromise && !forceRefresh) {
    return tokenFetchPromise;
  }

  tokenFetchPromise = (async () => {
    try {
      const endpoint = `${API_BASE}/csrf-token${forceRefresh ? "?refresh=true" : ""}`;
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to retrieve CSRF token (status ${response.status})`);
      }

      const data = await response.json();
      if (!data?.csrfToken || typeof data.csrfToken !== "string") {
        throw new Error("CSRF token was missing from backend response.");
      }

      inMemoryCsrfToken = data.csrfToken;
      return data.csrfToken;
    } finally {
      tokenFetchPromise = null;
    }
  })();

  return tokenFetchPromise;
}

/**
 * Explicitly sets or updates the active in-memory CSRF token.
 */
export function setCsrfToken(token: string | null): void {
  inMemoryCsrfToken = token;
}

/**
 * Clears the active in-memory CSRF token.
 */
export function clearCsrfToken(): void {
  inMemoryCsrfToken = null;
  tokenFetchPromise = null;
}

/**
 * Force-refreshes the CSRF token from the server.
 */
export async function refreshCsrfToken(): Promise<string> {
  clearCsrfToken();
  return getCsrfToken(true);
}

/**
 * Core API fetch wrapper that automatically:
 * 1. Attaches X-CSRF-Token on state-changing requests (POST, PUT, PATCH, DELETE).
 * 2. Transmits credentials (cookies) consistently.
 * 3. Handles token expiration / session changes with a safe single-retry strategy.
 */
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
  isRetry = false
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const method = (options?.method || "GET").toUpperCase();
  const isStateChanging = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  const isInternal = isInternalApiUrl(url);

  const headers = new Headers(options?.headers);

  if (!headers.has("Content-Type") && isStateChanging && options?.body) {
    headers.set("Content-Type", "application/json");
  }

  // Attach CSRF token on state-changing requests directed to our API
  if (isStateChanging && isInternal) {
    try {
      const csrfToken = await getCsrfToken();
      headers.set("X-CSRF-Token", csrfToken);
    } catch (err) {
      console.warn("Failed to acquire CSRF token before request:", err);
      // Proceed; the backend will respond with 403 if required
    }
  }

  // Attach authenticated user identity headers for internal endpoints
  if (isInternal && typeof window !== "undefined") {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.userId && !headers.has("x-user-id")) {
          headers.set("x-user-id", String(parsed.userId));
        }
        if (parsed?.email && !headers.has("x-user-email")) {
          headers.set("x-user-email", String(parsed.email));
        }
      }
    } catch {
      // ignore parsing errors
    }
  }

  // Ensure cookies (session & _csrf) are consistently included
  const credentials = options?.credentials || "include";

  const response = await fetch(url, {
    ...options,
    headers,
    credentials,
  });

  // Handle token expiration / invalidation (single retry)
  if (!isRetry && isStateChanging && isInternal && response.status === 403) {
    try {
      const cloned = response.clone();
      const body = await cloned.json().catch(() => null);
      const isCsrfError =
        body?.code === "EXPIRED" ||
        body?.code === "INVALID_SIGNATURE" ||
        body?.code === "TOKEN_MISMATCH" ||
        body?.code === "MISSING_HEADER" ||
        body?.code === "MISSING_COOKIE" ||
        body?.code === "CONTEXT_MISMATCH" ||
        (typeof body?.error === "string" && body.error.toLowerCase().includes("csrf"));

      if (isCsrfError) {
        // Reacquire fresh token and retry exactly once
        const freshToken = await refreshCsrfToken();
        const retryHeaders = new Headers(headers);
        retryHeaders.set("X-CSRF-Token", freshToken);

        return fetchApi<T>(
          endpoint,
          {
            ...options,
            headers: retryHeaders,
            credentials,
          },
          true
        );
      }
    } catch {
      // Fall through to standard error handling
    }
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(`API Error (${response.status}): ${errorBody}`);
  }

  return response.json();
}
