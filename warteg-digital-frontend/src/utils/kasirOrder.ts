export interface KasirOrderItem {
  _id: string;
  menuId: string;
  qty: number;
}

export interface KasirOrder {
  _id: string;
  customerName: string;
  items: KasirOrderItem[];
  totalPrice: number;
  paymentMethod: "cash";
  paymentStatus: "paid" | "unpaid";
  status: string;
  cookingStatus: string;
  createdAt: string;
}
