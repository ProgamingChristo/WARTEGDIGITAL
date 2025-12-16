export interface KitchenOrderItem {
  _id: string;
  menuId: string;
  qty: number;
}

export interface KitchenOrder {
  _id: string;
  customerName: string;
  items: KitchenOrderItem[];
  totalPrice: number;
  paymentMethod: "cash" | "midtrans";
  paymentStatus: "paid";
  assignedToKitchen: boolean;
  cookingStatus: "pending" | "waiting" | "done";
  status: string;
  createdAt: string;
}
