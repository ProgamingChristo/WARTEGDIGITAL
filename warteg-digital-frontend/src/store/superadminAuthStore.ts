import { create } from "zustand";

interface SuperadminUser {
  id: string;
  fullName: string;
  email: string;
  role: "superadmin";
}

interface SuperadminAuthState {
  token: string | null;
  user: SuperadminUser | null;
  login: (token: string, user: SuperadminUser) => void;
  logout: () => void;
}

export const useSuperadminAuthStore = create<SuperadminAuthState>((set) => ({
  token: localStorage.getItem("tokenSuperadmin"),
  user: localStorage.getItem("superadminUser")
    ? JSON.parse(localStorage.getItem("superadminUser") as string)
    : null,

  login: (token, user) => {
    localStorage.setItem("tokenSuperadmin", token);
    localStorage.setItem("superadminUser", JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem("tokenSuperadmin");
    localStorage.removeItem("superadminUser");
    set({ token: null, user: null });
  },
}));
