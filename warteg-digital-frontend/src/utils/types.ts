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
  // jika backend nanti menambah kategori, tinggal aktifkan:
  // category?: string;
}


// ==========================
// CART TYPE
// ==========================
export interface CartItemType {
  menu: MenuType;
  qty: number;
}


// ==========================
// ORDER TYPE
// ==========================
export interface OrderType {
  _id: string;
  items: {
    menuId: MenuType;   // menu detail ikut tampil
    qty: number;
  }[];
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
}


// ==========================
// AUTH USER TYPE → mengikuti backend customer/admin
// ==========================
export interface UserType {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "customer" | "admin" | "karyawan" | "superadmin";
}
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
