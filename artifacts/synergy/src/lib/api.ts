const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const headers = new Headers(options?.headers);
  if (!headers.has("Content-Type") && options?.method && options.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(`API Error (${response.status}): ${errorBody}`);
  }

  return response.json();
}
