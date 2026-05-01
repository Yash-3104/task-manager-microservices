import { useAuthStore } from "../features/auth/store.js";

export function useAuth(selector) {
  return useAuthStore(selector);
}

