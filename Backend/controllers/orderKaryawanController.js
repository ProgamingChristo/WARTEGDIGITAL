import Order from "../models/Orders.js";
import Menu from "../models/Menu.js";

// ✅ Kasir: Buat Order (opsional kalau kasir input manual)
export const kasirCreateOrder = async (req, res) => {
  try {
    const { customerName, items } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ message: "Data pesanan tidak lengkap!" });
    }

    let totalPrice = 0;
    for (const item of items) {
      const menu = await Menu.findById(item.menuId);
      if (!menu) return res.status(404).json({ message: `Menu ${item.menuId} tidak ditemukan` });
      totalPrice += menu.price * item.qty;
    }

    const newOrder = new Order({
      customerName,
      items,
      totalPrice,
      createdBy: req.user.id, // Kasir ID
      paymentStatus: "unpaid",
      status: "pending",
      assignedToKitchen: false,
      cookingStatus: "pending"
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order berhasil dibuat oleh kasir!",
      data: newOrder,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal membuat order", error: err.message });
  }
};


// ✅ Kasir: Konfirmasi Pembayaran → Kirim ke dapur
export const kasirPayment = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "paid", assignedToKitchen: true },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    res.json({
      message: "Pembayaran berhasil! Pesanan dikirim ke dapur ✅",
      data: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengupdate pembayaran", error: err.message });
  }
};


// ✅ Dapur: Mendapatkan Order Yang Harus Dimasak
export const getOrdersForKitchen = async (req, res) => {
  try {
    const orders = await Order.find({
      assignedToKitchen: true,
      paymentStatus: "paid",
      cookingStatus: { $in: ["pending", "cooking"] }
    });

    res.json({
      message: "Daftar order dapur berhasil diambil ✅",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil order dapur", error: err.message });
  }
};


// ✅ Dapur: Update Status Masak
export const updateCookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "cooking", "done"].includes(status)) {
      return res.status(400).json({ message: "Status masak tidak valid!" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { cookingStatus: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    res.json({
      message: "Status masak berhasil diperbarui ✅",
      data: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal update status masak", error: err.message });
  }
};
