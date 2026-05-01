import axios from "axios";

export const BASE_URL = "http://13.205.146.153";

export const STORAGE_KEYS = {
  accessToken: "tm_access_token"
};

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.accessToken);
}

export function setAccessToken(token) {
  if (!token) return;
  localStorage.setItem(STORAGE_KEYS.accessToken, token);
}

export function clearAccessToken() {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
}

export function getApiErrorMessage(error) {
  if (!error) return "Something went wrong.";
  const maybeMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.details ||
    error?.message;
  if (typeof maybeMessage === "string") return maybeMessage;
  return "Something went wrong.";
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

