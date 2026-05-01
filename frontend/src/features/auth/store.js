import { create } from "zustand";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken
} from "../../services/api.js";

const ROLE_KEY = "tm_role";
const USERNAME_KEY = "tm_username";
const REFRESH_TOKEN_KEY = "tm_refresh_token";

export const useAuthStore = create((set) => ({
  accessToken: getAccessToken(),
  role: localStorage.getItem(ROLE_KEY),
  username: localStorage.getItem(USERNAME_KEY),

  setSession: ({ accessToken, refreshToken, role, username }) => {
    setAccessToken(accessToken);

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    if (role && role !== "undefined") {
      localStorage.setItem(ROLE_KEY, role);
    }

    if (username && username !== "undefined") {
      localStorage.setItem(USERNAME_KEY, username);
    }

    set({
      accessToken,
      role,
      username
    });
  },

  setAccessToken: (token) => {
    setAccessToken(token);
    set({ accessToken: token });
  },

  logout: () => {
    clearAccessToken();
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    set({
      accessToken: null,
      role: null,
      username: null
    });
  }
}));