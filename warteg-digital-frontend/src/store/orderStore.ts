import { create } from "zustand";
import api from "../api/axios";
import type { OrderType } from "../utils/types";

interface OrderState {
  orders: OrderType[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  loading: false,

  fetchOrders: async () => {
    try {
      set({ loading: true });

      // ⬅️ FIXED ENDPOINT
      const res = await api.get("/customer/order/history");

      // backend kamu biasanya memetakan data di: res.data.data
      const data = res.data.data || res.data;

      set({ orders: data, loading: false });

    } catch (err) {
      console.error("Failed fetchOrders:", err);
      set({ loading: false });
    }
  },
}));
