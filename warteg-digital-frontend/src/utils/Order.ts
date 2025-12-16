export interface OrderItem {
  _id: string;
  menuId: string; // backend kirim string ID
  qty: number;
}

export interface AdminOrder {
  _id: string;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: "cash" | "midtrans";
  paymentStatus: "paid" | "unpaid";
  status: string; // backend driven
  cookingStatus: string;
  assignedToKitchen: boolean;
  createdAt: string;
}
