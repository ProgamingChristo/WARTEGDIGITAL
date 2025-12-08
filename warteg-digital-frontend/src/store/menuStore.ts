import { create } from "zustand";
import api from "../api/axios";

interface Menu {
  _id: string;
  name: string;
  price: number;
}

interface MenuState {
  menus: Menu[];
  loading: boolean;
  fetchMenus: () => Promise<void>;
}

const useMenuStore = create<MenuState>((set) => ({
  menus: [],
  loading: false,

  fetchMenus: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/customer/menu");
      set({ menus: res.data.data });
    } catch (err) {
      console.error("Error fetch menu:", err);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useMenuStore;
