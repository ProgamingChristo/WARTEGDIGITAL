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
// ===============================
// GET ALL MENU FOR CUSTOMER
// ===============================
export const getAllMenuCustomer = async (req, res) => {
  try {
    const menus = await Menu.find().select("name price imageUrl");

    res.json({
      message: "Daftar menu berhasil diambil",
      data: menus,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil menu",
      error: err.message,
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
export const getOrderDetailCustomer = async (req, res) => {
  try {
    const customerId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({
      _id: orderId,
      createdBy: customerId
    }).populate("items.menuId", "name price imageUrl description");

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    res.json(order);

  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil detail order",
      error: err.message,
    });
  }
};

// ==============================
// 🔵 UPDATE USERNAME
// ==============================
export const updateUsername = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username baru tidak boleh kosong" });
    }

    // Cek apakah username sudah dipakai user lain
    const existing = await Customer.findOne({ username });
    if (existing && existing._id.toString() !== customerId) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    const updated = await Customer.findByIdAndUpdate(
      customerId,
      { username },
      { new: true }
    );

    res.json({
      message: "Username berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal update username",
      error: error.message,
    });
  }
};

// ==============================
// 🔐 UPDATE PASSWORD
// ==============================
export const updatePassword = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Password lama dan password baru wajib diisi",
      });
    }

    const customer = await Customer.findById(customerId);

    // Cek password lama
    const match = await bcrypt.compare(oldPassword, customer.password);
    if (!match) {
      return res.status(400).json({ message: "Password lama salah" });
    }

    // Hash password baru
    const hashed = await bcrypt.hash(newPassword, 10);
    customer.password = hashed;

    await customer.save();

    res.json({ message: "Password berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal update password",
      error: error.message,
    });
  }
};