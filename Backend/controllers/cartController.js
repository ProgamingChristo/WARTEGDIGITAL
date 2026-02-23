import Cart from "../models/Cart.js";
import Menu from "../models/Menu.js";
import Customer from "../models/Customer.js";
import Order from "../models/Orders.js";
import { createMidtransTransaction } from "../controllers/midtransController.js";


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

const toSafeQty = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.floor(parsed));
};

const validateStockForItems = async (items) => {
  const resolved = [];
  let totalPrice = 0;

  for (const rawItem of items) {
    const qty = toSafeQty(rawItem.qty);
    if (qty <= 0) {
      return { ok: false, message: "Jumlah item tidak valid." };
    }

    const menu = await Menu.findById(rawItem.menuId);
    if (!menu) {
      return { ok: false, message: `Menu ${rawItem.menuId} tidak ditemukan.` };
    }

    const stock = Number(menu.stock ?? 0);
    if (!menu.available || stock <= 0) {
      return { ok: false, message: `${menu.name} sedang habis dan tidak bisa dipesan.` };
    }

    if (qty > stock) {
      return {
        ok: false,
        message: `Stock ${menu.name} tidak cukup. Sisa stock ${stock}.`,
      };
    }

    totalPrice += Number(menu.price || 0) * qty;
    resolved.push({ rawItem, menu, qty });
  }

  return { ok: true, resolved, totalPrice };
};

const decreaseStock = async (resolvedItems) => {
  for (const entry of resolvedItems) {
    entry.menu.stock = Math.max(0, Number(entry.menu.stock ?? 0) - entry.qty);
    if (entry.menu.stock <= 0) {
      entry.menu.available = false;
    }
    await entry.menu.save();
  }
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
    res.status(500).json({
      message: "Gagal mengambil cart",
      error: error.message,
    });
  }
};

// ============================
// 🟡 Add Item To Cart
// ============================
export const addToCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { menuId, qty } = req.body;
    const safeQty = toSafeQty(qty);

    if (!menuId || safeQty <= 0) {
      return res.status(400).json({ message: "menuId dan qty wajib valid." });
    }

    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu tidak ditemukan." });
    }

    const stock = Number(menu.stock ?? 0);
    if (!menu.available || stock <= 0) {
      return res.status(400).json({ message: "Menu ini sedang habis." });
    }

    let cart = await Cart.findOne({ customerId });

    if (!cart) cart = new Cart({ customerId, items: [] });

    const existingItem = cart.items.find(
      (item) => item.menuId.toString() === menuId
    );

    if (existingItem) {
      const nextQty = toSafeQty(existingItem.qty) + safeQty;
      if (nextQty > stock) {
        return res.status(400).json({
          message: `Stock tidak cukup. Sisa stock ${menu.name}: ${stock}.`,
        });
      }
      existingItem.qty = nextQty;
    } else {
      if (safeQty > stock) {
        return res.status(400).json({
          message: `Stock tidak cukup. Sisa stock ${menu.name}: ${stock}.`,
        });
      }
      cart.items.push({ menuId, qty: safeQty });
    }

    cart.totalPrice = await calculateTotal(cart.items);
    await cart.save();

    res.json({ message: "Item berhasil ditambahkan ke cart", data: cart });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menambah item",
      error: error.message,
    });
  }
};

// ============================
// 🔵 Update Quantity
// ============================
export const updateCartItem = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { menuId, qty } = req.body;
    const safeQty = toSafeQty(qty);

    let cart = await Cart.findOne({ customerId });
    if (!cart) return res.status(404).json({ message: "Cart tidak ditemukan" });

    const item = cart.items.find((i) => i.menuId.toString() === menuId);
    if (!item)
      return res.status(404).json({ message: "Item tidak ditemukan di cart" });

    if (safeQty <= 0) {
      cart.items = cart.items.filter((i) => i.menuId.toString() !== menuId);
    } else {
      const menu = await Menu.findById(menuId);
      if (!menu) {
        return res.status(404).json({ message: "Menu tidak ditemukan." });
      }

      const stock = Number(menu.stock ?? 0);
      if (!menu.available || stock <= 0) {
        return res.status(400).json({ message: "Menu ini sedang habis." });
      }

      if (safeQty > stock) {
        return res.status(400).json({
          message: `Stock tidak cukup. Sisa stock ${menu.name}: ${stock}.`,
        });
      }

      item.qty = safeQty;
    }

    cart.totalPrice = await calculateTotal(cart.items);
    await cart.save();

    res.json({ message: "Item berhasil diperbarui", data: cart });
  } catch (error) {
    res.status(500).json({
      message: "Gagal update item",
      error: error.message,
    });
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
    res.status(500).json({
      message: "Gagal menghapus item",
      error: error.message,
    });
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
    res.status(500).json({
      message: "Gagal clear cart",
      error: error.message,
    });
  }
};

// ============================
// 🟣 CHECKOUT: CASH / MIDTRANS
// ============================
export const checkoutCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { paymentMethod, foodNote } = req.body;
    const sanitizedFoodNote =
      typeof foodNote === "string" ? foodNote.trim().slice(0, 500) : "";

    if (!["cash", "midtrans"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Metode pembayaran tidak valid! Gunakan cash atau midtrans.",
      });
    }

    const cart = await Cart.findOne({ customerId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart masih kosong!" });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer tidak ditemukan" });
    }

    const stockCheck = await validateStockForItems(cart.items);
    if (!stockCheck.ok) {
      return res.status(400).json({ message: stockCheck.message });
    }

    const totalPrice = stockCheck.totalPrice;
    const customerName = customer.username || customer.name;

    // ========= CASE 1: CASH =========
    if (paymentMethod === "cash") {
      const newOrder = new Order({
        customerName,
        items: cart.items,
        totalPrice,
        createdBy: customerId,
        paymentStatus: "unpaid",
        status: "pending",
        cookingStatus: "pending",
        assignedToKitchen: false,
        paymentMethod: "cash",
        foodNote: sanitizedFoodNote,
      });

      await newOrder.save();
      await decreaseStock(stockCheck.resolved);

      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();

      return res.status(201).json({
        message: "Checkout cash berhasil! Silakan bayar di kasir.",
        data: newOrder,
      });
    }

    // ========= CASE 2: MIDTRANS =========
    if (paymentMethod === "midtrans") {
      const orderId = "ORDER-" + Date.now();

      const midtransResponse = await createMidtransTransaction(
        orderId,
        totalPrice,
        customerName,
        customerId // untuk ambil cart item_details
      );

      const newOrder = new Order({
        customerName,
        items: cart.items,
        totalPrice,
        createdBy: customerId,
        paymentStatus: "processing",
        status: "pending",
        cookingStatus: "pending",
        assignedToKitchen: false,
        paymentMethod: "midtrans",
        midtransOrderId: orderId,
        foodNote: sanitizedFoodNote,
      });

      await newOrder.save();
      await decreaseStock(stockCheck.resolved);

      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();

      return res.status(201).json({
        message: "Checkout Midtrans berhasil",
        snapToken: midtransResponse.token,
        redirectUrl: midtransResponse.redirect_url,
        orderId,
      });
    }

  } catch (error) {
    res.status(500).json({
      message: "Checkout gagal",
      error: error.message,
    });
  }
};
