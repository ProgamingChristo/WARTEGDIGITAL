import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Menu from "../models/Menu.js";
import Karyawan from "../models/Karyawan.js";
import Order from "../models/Orders.js";
import { body, validationResult } from "express-validator"; // Input validation steps

const sanitizeText = (value, max = 120) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const sanitizeProfileImage = (value) => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length > 4_500_000) return null;

  const dataUrlPattern = /^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=\s]+$/i;
  if (dataUrlPattern.test(trimmed)) return trimmed;

  try {
    const parsedUrl = new URL(trimmed);
    if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") return trimmed;
  } catch {
    return null;
  }

  return null;
};

const toAdminPayload = (admin) => ({
  id: admin._id,
  username: admin.username,
  fullName: admin.fullName || "",
  email: admin.email || "",
  phone: admin.phone || "",
  profileImage: admin.profileImage || "",
  role: "admin",
});

// ======================
// 🔐 AUTH ADMIN
// ======================

export const registerAdmin = async (req, res) => {
  // Validation middleware
  await body('username').isLength({ min: 3 }).withMessage('Username harus memiliki minimal 3 karakter').run(req);
  await body('password').isLength({ min: 6 }).withMessage('Password harus memiliki minimal 6 karakter').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username sudah digunakan" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({
      message: "Admin berhasil dibuat",
      data: { id: newAdmin._id, username: newAdmin.username },
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  await body('username').notEmpty().withMessage('Username wajib diisi').run(req);
  await body('password').notEmpty().withMessage('Password wajib diisi').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: "Admin tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login berhasil",
      token,
      data: toAdminPayload(admin),
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// ======================
// 🍽 MENU MANAGEMENT
// ======================
export const createMenu = async (req, res) => {
  await body('name').notEmpty().withMessage('Nama wajib diisi').run(req);
  await body('price').isNumeric().withMessage('Harga harus berupa angka').run(req);
  await body('stock').isInt({ min: 0 }).withMessage('Stock harus berupa angka >= 0').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, category, price, stock, description, imageUrl } = req.body;

  try {
    const normalizedStock = Number(stock ?? 0);
    const newMenu = new Menu({
      name: sanitizeText(name, 120),
      category,
      price: Number(price),
      stock: normalizedStock,
      description: sanitizeText(description, 500),
      imageUrl: sanitizeText(imageUrl, 2000),
      available: normalizedStock > 0,
    });
    await newMenu.save();

    res.status(201).json({ message: "Menu berhasil ditambahkan", data: newMenu });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Gagal menambahkan menu", error: error.message });
  }
};

export const getAllMenu = async (req, res) => {
  try {
    const menu = await Menu.find().sort({ updatedAt: -1, name: 1 });
    const normalized = menu.map((item) => ({
      ...item.toObject(),
      stock: Number(item.stock ?? 0),
      available: Number(item.stock ?? 0) > 0 ? item.available : false,
    }));
    res.json({ message: "Data menu berhasil diambil", data: normalized });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Gagal mengambil data menu", error: error.message });
  }
};

export const updateMenu = async (req, res) => {
  const { name, price, stock } = req.body;

  if (name) {
    await body('name').notEmpty().withMessage('Nama wajib diisi').run(req);
  }
  if (price) {
    await body('price').isNumeric().withMessage('Harga harus berupa angka').run(req);
  }
  if (stock !== undefined) {
    await body('stock').isInt({ min: 0 }).withMessage('Stock harus berupa angka >= 0').run(req);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const existing = await Menu.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Menu tidak ditemukan" });

    const nextStock =
      stock !== undefined ? Number(stock) : Number(existing.stock ?? 0);

    const payload = {
      ...req.body,
      ...(name !== undefined ? { name: sanitizeText(name, 120) } : {}),
      ...(price !== undefined ? { price: Number(price) } : {}),
      ...(stock !== undefined ? { stock: nextStock } : {}),
      ...(req.body.description !== undefined
        ? { description: sanitizeText(req.body.description, 500) }
        : {}),
      ...(req.body.imageUrl !== undefined
        ? { imageUrl: sanitizeText(req.body.imageUrl, 2000) }
        : {}),
    };

    if (nextStock <= 0) {
      payload.available = false;
    } else if (
      stock !== undefined &&
      Number(existing.stock ?? 0) <= 0 &&
      req.body.available === undefined
    ) {
      payload.available = true;
    }

    const updated = await Menu.findByIdAndUpdate(req.params.id, payload, { new: true });

    if (!updated) return res.status(404).json({ message: "Menu tidak ditemukan" });

    res.json({ message: "Menu berhasil diperbarui", data: updated });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Gagal memperbarui menu", error: error.message });
  }
};

export const deleteMenu = async (req, res) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Menu tidak ditemukan" });

    res.json({ message: "Menu berhasil dihapus" });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Gagal menghapus menu", error: error.message });
  }
};

// ======================
// 👥 KARYAWAN MANAGEMENT + SHIFT
// ======================
export const createKaryawan = async (req, res) => {
  const { name, username, password, position, shift } = req.body;

  if (!["pagi", "siang", "malam"].includes(shift)) {
    return res.status(400).json({ message: "Shift tidak valid" });
  }

  const existing = await Karyawan.findOne({ username });
  if (existing) return res.status(400).json({ message: "Username sudah digunakan" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const newKaryawan = new Karyawan({
      name,
      username,
      password: hashedPassword,
      position,
      shift,
      role: `karyawan (${position})`,
    });

    await newKaryawan.save();
    res.status(201).json({
      message: "Karyawan berhasil ditambahkan",
      data: {
        id: newKaryawan._id,
        name: newKaryawan.name,
        username: newKaryawan.username,
        position: newKaryawan.position,
        shift: newKaryawan.shift,
        role: newKaryawan.role,
      },
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Gagal menambahkan karyawan", error: error.message });
  }
};

export const getAllKaryawan = async (req, res) => {
  try {
    const karyawanList = await Karyawan.find().select("-password");
    res.json({ message: "Data karyawan berhasil diambil", data: karyawanList });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Gagal mengambil data karyawan", error: error.message });
  }
};

export const updateKaryawan = async (req, res) => {
  const { shift } = req.body;
  if (shift && !["pagi", "siang", "malam"].includes(shift)) {
    return res.status(400).json({ message: "Shift tidak valid" });
  }

  try {
    const updated = await Karyawan.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ message: "Karyawan tidak ditemukan" });

    res.json({ message: "Data karyawan berhasil diperbarui", data: updated });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Gagal memperbarui karyawan", error: error.message });
  }
};

export const deleteKaryawan = async (req, res) => {
  try {
    const deleted = await Karyawan.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Karyawan tidak ditemukan" });

    res.json({ message: "Karyawan berhasil dihapus" });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Gagal menghapus karyawan", error: error.message });
  }
};


// ✅ ADMIN / SUPERADMIN — GET SEMUA ABSENSI KARYAWAN
export const getAllAbsensi = async (req, res) => {
  try {
    const data = await Karyawan.find()
      .select("name position shift attendance")
      .sort({ name: 1 });

    res.status(200).json({
      message: "Data absensi karyawan berhasil diambil!",
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("❌ Error getAllAbsensi:", error);
    res.status(500).json({
      message: "Gagal mengambil data absensi",
      error: error.message,
    });
  }
};


// ======================
// 📦 ORDER MANAGEMENT
// ======================
export const createOrder = async (req, res) => {
  const { customerName, items, totalPrice, status, paymentStatus } = req.body;

  if (!customerName || !items || !totalPrice) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  try {
    const newOrder = new Order({ customerName, items, totalPrice, status, paymentStatus });
    await newOrder.save();

    res.status(201).json({ message: "Order berhasil dibuat", data: newOrder });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Gagal membuat order", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ message: "Daftar order berhasil diambil", data: orders });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Gagal mengambil order", error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Order tidak ditemukan" });

    res.json({ message: "Order berhasil diperbarui", data: updated });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Gagal memperbarui order", error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order tidak ditemukan" });
  
    res.json({ message: "Order berhasil dihapus" });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Gagal menghapus order", error: error.message });
  }
};
export const getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.menuId", "name price imageUrl") // populate nama, harga, gambar
      .lean(); // hasil plain object (cepat)

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    // opsional: hitung ulang totalPrice agar 100% akurat
    const totalPrice = order.items.reduce(
      (sum, it) => sum + it.qty * (it.menuId?.price || 0),
      0
    );

    return res.json({
      success: true,
      data: { ...order, totalPrice }, // kirim yang sudah populate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// ======================
// 👤 ADMIN PROFILE
// ======================
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin tidak ditemukan" });

    res.json({
      message: "Profil admin berhasil diambil",
      data: toAdminPayload(admin),
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil profil admin", error: error.message });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    if (req.body.password !== undefined) {
      return res.status(400).json({ message: "Password tidak dapat diubah dari halaman profil admin." });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin tidak ditemukan" });

    const { username, fullName, email, phone, profileImage } = req.body;

    if (username !== undefined) {
      const normalizedUsername = sanitizeText(username, 60);
      if (!normalizedUsername) {
        return res.status(400).json({ message: "Username tidak boleh kosong." });
      }

      const existing = await Admin.findOne({
        username: normalizedUsername,
        _id: { $ne: admin._id },
      });
      if (existing) {
        return res.status(400).json({ message: "Username sudah digunakan admin lain." });
      }

      admin.username = normalizedUsername;
    }

    if (fullName !== undefined) admin.fullName = sanitizeText(fullName, 120);
    if (email !== undefined) admin.email = sanitizeText(email, 160);
    if (phone !== undefined) admin.phone = sanitizeText(phone, 40);

    if (profileImage !== undefined) {
      const normalizedImage = sanitizeProfileImage(profileImage);
      if (normalizedImage === null) {
        return res.status(400).json({
          message: "Format foto profil tidak valid. Gunakan URL http/https atau data gambar.",
        });
      }
      admin.profileImage = normalizedImage;
    }

    await admin.save();

    res.json({
      message: "Profil admin berhasil diperbarui",
      data: toAdminPayload(admin),
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui profil admin", error: error.message });
  }
};
