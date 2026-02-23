import { create } from "zustand";

interface User {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  role: string | null;
  setAuth: (token: string, user: User, role: string) => void;
  updateUser: (user: Partial<User>, token?: string) => void;
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

export const useAuthStore = create<AuthState>((set, get) => ({
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

  updateUser: (payload, nextToken) => {
    const currentUser = get().user;
    const mergedUser = {
      ...(currentUser ?? { role: get().role ?? "customer" }),
      ...payload,
    } as User;

    const tokenToSave = nextToken ?? get().token;
    if (tokenToSave) {
      localStorage.setItem("token", tokenToSave);
    }
    localStorage.setItem("user", JSON.stringify(mergedUser));

    set({
      token: tokenToSave ?? null,
      user: mergedUser,
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
