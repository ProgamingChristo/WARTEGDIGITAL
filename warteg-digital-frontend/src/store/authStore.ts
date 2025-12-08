import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: any;
  role: string | null;
  setAuth: (token: string, user: any, role: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  role: null,

  setAuth: (token, user, role) => set({ token, user, role }),

  logout: () => set({ token: null, user: null, role: null }),
}));

export default useAuthStore;
