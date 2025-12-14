// src/store/cartStore.ts
import { create } from 'zustand';
import api from '../api/axios';
import type { CartItemType, MenuType } from '../utils/types';

interface CartState {
  items: CartItemType[];
  total: number;
  loading: boolean;

  fetchCart: () => Promise<void>;
  addToCart: (menu: MenuType, qty?: number) => Promise<void>;
  removeFromCart: (menuId: string) => Promise<void>;
  updateCartItem: (menuId: string, qty: number) => Promise<void>; // ➜ baru
  deleteCartItem: (menuId: string) => Promise<void>;              // ➜ baru
  clearCart: () => Promise<void>;
}

/* helper type-guard ---------------------------------------------------- */
function hasResponseStatus(
  err: unknown
): err is { response: { status: number } } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof (err as Record<string, unknown>).response === 'object' &&
    (err as Record<string, unknown>).response !== null &&
    'status' in ((err as Record<string, unknown>).response as Record<string, unknown>) &&
    typeof ((err as Record<string, unknown>).response as Record<string, unknown>).status === 'number'
  );
}

/* store ---------------------------------------------------------------- */
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/cart');
      const payload = res.data.data;

      const normalized: CartItemType[] = (payload.items ?? []).map(
        (i: { menuId: MenuType; qty: number; _id: string }) => ({
          ...i,
          menu: i.menuId, // alias
        })
      );
      set({
        items: normalized,
        total: payload.totalPrice ?? 0,
      });
    } catch (err: unknown) {
      console.error('❌ Failed fetchCart:', err);
      if (hasResponseStatus(err) && err.response.status === 401) {
        console.warn('User unauthorized – token expired or missing');
        // useAuthStore.getState().logout();
      }
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (menu, qty = 1) => {
    try {
      await api.post('/cart/add', { menuId: menu._id, qty });
      await get().fetchCart();
    } catch (err: unknown) {
      console.error('❌ Failed addToCart:', err);
      if (hasResponseStatus(err) && err.response.status === 401) {
        alert('Silakan login terlebih dahulu.');
      }
    }
  },

  removeFromCart: async (menuId) => {
    try {
      await api.post('/cart/remove', { menuId });
      await get().fetchCart();
    } catch (err: unknown) {
      console.error('❌ Failed removeFromCart:', err);
    }
  },

  /* ---------------------------------------------------- */
  updateCartItem: async (menuId, qty) => {
    try {
      await api.put('/cart/update', { menuId, qty });
      await get().fetchCart(); // reload cart
    } catch (err: unknown) {
      console.error('❌ Failed updateCartItem:', err);
    }
  },

  /* ---------------------------------------------------- */
  deleteCartItem: async (menuId) => {
    try {
      await api.delete(`/cart/delete/${menuId}`);
      await get().fetchCart(); // reload cart
    } catch (err: unknown) {
      console.error('❌ Failed deleteCartItem:', err);
    }
  },

  clearCart: async () => {
    try {
      await api.post('/cart/clear');
      set({ items: [], total: 0 });
    } catch (err: unknown) {
      console.error('❌ Failed clearCart:', err);
    }
  },
}));