import { create } from "zustand";

/* ---------- TYPE DEFINITIONS ---------- */
export interface AdminUser {
  id: string; // backend gunakan "id" bukan "_id"
  username: string;
  role: "admin" | "superadmin";
}

interface AdminAuthState {
  tokenAdmin: string | null;
  adminUser: AdminUser | null;
  adminRole: string | null;

  setAdminAuth: (token: string, admin: AdminUser) => void;
  adminLogout: () => void;
}

/* ---------- SAFE JSON PARSER ---------- */
const safeParse = (key: string): AdminUser | null => {
  const raw = localStorage.getItem(key);
  if (!raw || raw === "undefined" || raw === "null") return null;

  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
};

/* ---------- STORE ---------- */
export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  tokenAdmin: localStorage.getItem("tokenAdmin") ?? null,
  adminUser: safeParse("adminUser"),
  adminRole: localStorage.getItem("adminRole") ?? null,

  setAdminAuth: (token, admin) => {
    // Validasi sesuai backend response
    if (!admin || !admin.id || !admin.username || !admin.role) {
      console.error("Invalid admin object:", admin);
      return;
    }

    // Simpan ke localStorage
    localStorage.setItem("tokenAdmin", token);
    localStorage.setItem("adminUser", JSON.stringify(admin));
    localStorage.setItem("adminRole", admin.role);

    set({
      tokenAdmin: token,
      adminUser: admin,
      adminRole: admin.role,
    });
  },

  adminLogout: () => {
    localStorage.removeItem("tokenAdmin");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminRole");

    set({
      tokenAdmin: null,
      adminUser: null,
      adminRole: null,
    });
  },
}));
