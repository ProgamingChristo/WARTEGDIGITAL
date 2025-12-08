import { create } from "zustand";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  addToCart: (item) => {
    const existing = get().cart.find((i) => i._id === item._id);

    if (existing) {
      existing.qty += 1;
      set({ cart: [...get().cart] });
    } else {
      set({
        cart: [
          ...get().cart,
          { _id: item._id, name: item.name, price: item.price, qty: 1 },
        ],
      });
    }
  },

  removeFromCart: (id) =>
    set({ cart: get().cart.filter((i) => i._id !== id) }),

  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;
