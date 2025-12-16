import { create } from "zustand";

export type KaryawanPosition = "kasir" | "dapur";

interface KaryawanUser {
  _id: string;
  name: string;
  username: string;
  position: KaryawanPosition;
}

interface KaryawanAuthState {
  token: string | null;
  user: KaryawanUser | null;

  setAuth: (token: string, user: KaryawanUser) => void;
  logout: () => void;
}

export const useKaryawanAuthStore = create<KaryawanAuthState>((set) => ({
  token: localStorage.getItem("karyawanToken"),
  user: localStorage.getItem("karyawanUser")
    ? JSON.parse(localStorage.getItem("karyawanUser") as string)
    : null,

  setAuth: (token, user) => {
    localStorage.setItem("karyawanToken", token);
    localStorage.setItem("karyawanUser", JSON.stringify(user));

    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem("karyawanToken");
    localStorage.removeItem("karyawanUser");
    set({ token: null, user: null });
  },
}));
