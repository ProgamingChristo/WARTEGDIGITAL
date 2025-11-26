import Cart from "../models/Cart.js";
import Menu from "../models/Menu.js";

// ============================
// 🔹 Helper Hitung Total
// ============================
const calculateTotal = async (items) => {
  let total = 0;
  for (const item of items) {
    const menu = await Menu.findById(item.menuId);
    if (menu) {
      total += menu.price * item.qty;
    }
  }
  return total;
};

// ============================
// 🟢 Get Cart Customer
// ============================
export const getCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    let cart = await Cart.findOne({ customerId }).populate("items.menuId");

    if (!cart) {
      cart = new Cart({ customerId, items: [], totalPrice: 0 });
      await cart.save();
    }

    res.json({ message: "Data cart berhasil diambil", data: cart });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil cart", error: error.message });
  }
};

// ============================
// 🟡 Add Item To Cart
// ============================
export const addToCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { menuId, qty } = req.body;

    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      cart = new Cart({ customerId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.menuId.toString() === menuId);

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.items.push({ menuId, qty });
    }

    cart.totalPrice = await calculateTotal(cart.items);
    await cart.save();

    res.json({ message: "Item berhasil ditambahkan ke cart", data: cart });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah item", error: error.message });
  }
};

// ============================
// 🔵 Update Quantity
// ============================
export const updateCartItem = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { menuId, qty } = req.body;

    let cart = await Cart.findOne({ customerId });
    if (!cart) return res.status(404).json({ message: "Cart tidak ditemukan" });

    const item = cart.items.find((i) => i.menuId.toString() === menuId);
    if (!item) return res.status(404).json({ message: "Item tidak ditemukan" });

    item.qty = qty;

    cart.totalPrice = await calculateTotal(cart.items);
    await cart.save();

    res.json({ message: "Item berhasil diperbarui", data: cart });
  } catch (error) {
    res.status(500).json({ message: "Gagal update item", error: error.message });
  }
};

// ============================
// 🔴 Delete Item From Cart
// ============================
export const deleteCartItem = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { menuId } = req.params;

    let cart = await Cart.findOne({ customerId });
    if (!cart) return res.status(404).json({ message: "Cart tidak ditemukan" });

    cart.items = cart.items.filter((i) => i.menuId.toString() !== menuId);

    cart.totalPrice = await calculateTotal(cart.items);
    await cart.save();

    res.json({ message: "Item berhasil dihapus", data: cart });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus item", error: error.message });
  }
};

// ============================
// 🧹 Clear Cart
// ============================
export const clearCart = async (req, res) => {
  try {
    const customerId = req.user.id;

    let cart = await Cart.findOne({ customerId });
    if (!cart) return res.status(404).json({ message: "Cart tidak ditemukan" });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.json({ message: "Cart berhasil dikosongkan", data: cart });
  } catch (error) {
    res.status(500).json({ message: "Gagal clear cart", error: error.message });
  }
};
