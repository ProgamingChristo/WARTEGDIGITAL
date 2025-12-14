import { create } from "zustand";

interface User {
  username: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  role: string | null;
  setAuth: (token: string, user: User, role: string) => void;
  logout: () => void;
}

/**
 * Prevent localStorage JSON parse error
 */
const safeParse = (key: string): User | null => {
  const raw = localStorage.getItem(key);
  if (!raw || raw === "undefined" || raw === "null") return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token") ?? null,
  user: safeParse("user"),
  role: localStorage.getItem("role") ?? null,

  /**
   * Set authentication state
   */
  setAuth: (token, user, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", role);

    set({
      token,
      user,
      role,
    });
  },

  /**
   * Clear login session
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    set({
      token: null,
      user: null,
      role: null,
    });
  },
}));
