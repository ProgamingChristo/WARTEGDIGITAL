
// ==========================
// MENU TYPE
// ==========================
export interface MenuType {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  category?: string;
}

// ==========================
// CART TYPE
// ==========================
export interface CartItemType {
  menu: MenuType;
  qty: number;
}

// ==========================
// ORDER TYPE (customer)
// ==========================
export interface OrderType {
  _id: string;
  items: {
    menuId: MenuType;   // populate
    qty: number;
  }[];
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
}

// ==========================
// AUTH USER TYPE
// ==========================
export interface UserType {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "customer" | "admin" | "karyawan" | "superadmin";
}

// ==========================
// ORDER DETAIL (customer)
// ==========================
export interface OrderItem {
  menuId: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
    description?: string;
  };
  qty: number;
}

export interface OrderDetail {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  invoicePath?: string;
}

// ==========================
// ADMIN ORDER TYPES
// ==========================
export interface AdminOrderItemDetail {
  _id: string;          // tambahan agar key-map aman
  menuId: {
    name: string;
    price: number;
    imageUrl?: string;
  };
  qty: number;
}

export interface AdminOrderDetail {
  _id: string;
  customerName: string;
  items: AdminOrderItemDetail[];
  totalPrice: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}
