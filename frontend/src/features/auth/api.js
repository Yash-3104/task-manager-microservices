import { api } from "../../services/api.js";

export async function login({ username, password }) {
  const res = await api.post("/api/auth/login", { username, password });

  const accessToken =
    res?.data?.accessToken ??
    res?.data?.token ??
    res?.data?.access_token;

  const refreshToken =
    res?.data?.refreshToken ??
    res?.data?.refresh_token;

  const role = res?.data?.role;

  return {
    accessToken,
    refreshToken,
    role
  };
}

export async function register({ username, password, role = "USER" }) {
  const res = await api.post("/api/auth/register", { username, password, role });
  return res.data;
}