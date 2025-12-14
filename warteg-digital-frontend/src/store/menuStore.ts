import { create } from "zustand";
import { getMenus } from "../api/menuApi";
import type { MenuType } from "../utils/types";

interface MenuStore {
  menus: MenuType[];
  loading: boolean;
  fetchMenus: () => Promise<void>;
}

export const useMenuStore = create<MenuStore>((set) => ({
  menus: [],
  loading: false,

  fetchMenus: async () => {
    set({ loading: true });
    try {
      const data = await getMenus();
      // jaga-jaga backend ngirim object / null
      set({ menus: Array.isArray(data) ? data : [] });
    } catch (err) {
      console.error("Failed fetch menus:", err);
      set({ menus: [] });
    } finally {
      set({ loading: false });
    }
  },
}));