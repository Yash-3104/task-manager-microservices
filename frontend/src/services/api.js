import axios from "axios";

const BASE_URL = "http://13.205.146.153";

const STORAGE_KEYS = {
  accessToken: "tm_access_token",
  refreshToken: "tm_refresh_token"
};

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.accessToken);
}

export function setAuthTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  if (refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
}

export function clearAuthTokens() {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
}

export function getJwtPayload(token) {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const decoded = atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiErrorMessage(error) {
  if (!error) return "Something went wrong.";
  const maybeMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data ||
    error?.message;
  if (typeof maybeMessage === "string") return maybeMessage;
  return "Something went wrong.";
}

