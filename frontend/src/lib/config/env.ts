const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7115/api";

export const env = {
  apiBaseUrl: API_BASE_URL,
};
