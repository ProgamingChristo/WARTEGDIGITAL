import Customer from "../models/Customer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Order from "../models/Orders.js";
import Menu from "../models/Menu.js"; // ✅ Tambahan

// ======================
// REGISTER CUSTOMER
// ======================
export const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address)
      return res.status(400).json({ message: "Semua field wajib diisi." });

    const existing = await Customer.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email sudah digunakan." });

    const username = email.split("@")[0]; 

const newCustomer = new Customer({
  name,
  email,
  username,
  password,
  phone,
  address,
});

    await newCustomer.save();

    res.status(201).json({
      message: "Customer berhasil dibuat.",
      data: {
        id: newCustomer._id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat akun customer.",
      error: error.message,
    });
  }
};

// ======================
// LOGIN CUSTOMER
// ======================
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    if (!customer)
      return res.status(404).json({ message: "Customer tidak ditemukan." });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch)
      return res.status(400).json({ message: "Password salah." });

    const token = jwt.sign(
      { id: customer._id, role: "customer", username: customer.name }, // ✅ Simpan name ke token
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login berhasil.",
      token,
      data: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        role: "customer",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
};

// ======================
// ✅ Customer Buat Order — Harga otomatis
// ======================
export const createOrderCustomer = async (req, res) => {
  try {
    const { items } = req.body;
    const customerId = req.user.id;
    const customerName = req.user.username;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items tidak boleh kosong" });
    }

    let totalPrice = 0;

    for (const item of items) {
      const menu = await Menu.findById(item.menuId);
      if (!menu)
        return res.status(404).json({ message: `Menu ${item.menuId} tidak ditemukan` });

      totalPrice += menu.price * item.qty;
    }

    const newOrder = new Order({
      customerName,
      items,
      totalPrice,
      createdBy: customerId,
      status: "waiting",
      paymentStatus: "unpaid",
      assignedToKitchen: true,
    });

    await newOrder.save();

    // ✅ Simpan history di Customer
    await Customer.findByIdAndUpdate(customerId, {
      $push: { orderHistory: newOrder._id },
    });

    res.status(201).json({
      message: "Pesanan berhasil dibuat! Menunggu pembayaran kasir.",
      data: newOrder,
    });

  } catch (error) {
    res.status(500).json({ message: "Gagal membuat pesanan", error: error.message });
  }
};

// ======================
// ✅ Customer Lihat Riwayat Order
// ======================
export const getOrderHistoryCustomer = async (req, res) => {
  try {
    const customerId = req.user.id;

    const orders = await Order.find({ createdBy: customerId });

    res.json({
      message: "Riwayat pesanan berhasil diambil!",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil riwayat pesanan",
      error: error.message,
    });
  }
};
