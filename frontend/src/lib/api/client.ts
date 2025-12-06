// ============= Generic API Client =============

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://localhost:7115';

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

// Build query string from object, skipping undefined/null values
export function buildQueryString(query?: QueryParams): string {
  if (!query) return '';

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  }

  const str = params.toString();
  return str ? `?${str}` : '';
}

// Custom API error with status and body
export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// Generic API request function
export async function apiRequest<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  options?: {
    query?: QueryParams;
    body?: unknown;
    headers?: HeadersInit;
  }
): Promise<T> {
  const url = API_BASE_URL + path + buildQueryString(options?.query);

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };

  if (options?.body !== undefined) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    let errorBody: { title?: string; message?: string } | null = null;
    try {
      errorBody = await response.json();
    } catch {
      // Ignore JSON parse errors
    }

    const errorMessage =
      errorBody?.title ||
      errorBody?.message ||
      `API request failed with status ${response.status}`;

    throw new ApiError(errorMessage, response.status, errorBody);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// Convenience API client object
export const apiClient = {
  get<T>(path: string, query?: QueryParams): Promise<T> {
    return apiRequest<T>(path, 'GET', { query });
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return apiRequest<T>(path, 'POST', { body });
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return apiRequest<T>(path, 'PUT', { body });
  },

  delete<T>(path: string): Promise<T> {
    return apiRequest<T>(path, 'DELETE');
  },
};
