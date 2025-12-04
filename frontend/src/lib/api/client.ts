const DEFAULT_API_BASE_URL = "https://localhost:7115";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || DEFAULT_API_BASE_URL;

export function buildQueryString(
  query?: Record<string, string | number | boolean | undefined | null>
): string {
  if (!query) return "";
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    params.append(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

interface ApiRequestOptions {
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
}

async function apiRequest<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  options: ApiRequestOptions = {}
): Promise<T> {
  const { query, body } = options;
  const queryString = buildQueryString(query);
  const url = `${API_BASE_URL}${path}${queryString}`;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = undefined;
    }

    const message =
      (errorBody as { title?: string; message?: string } | undefined)?.title ||
      (errorBody as { title?: string; message?: string } | undefined)?.message ||
      `API request failed with status ${response.status}`;

    const error: Error & { status?: number; body?: unknown } = new Error(message);
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get<T>(path: string, query?: ApiRequestOptions["query"]) {
    return apiRequest<T>(path, "GET", { query });
  },
  post<T>(path: string, body?: unknown) {
    return apiRequest<T>(path, "POST", { body });
  },
  put<T>(path: string, body?: unknown) {
    return apiRequest<T>(path, "PUT", { body });
  },
  delete<T>(path: string) {
    return apiRequest<T>(path, "DELETE");
  },
};
