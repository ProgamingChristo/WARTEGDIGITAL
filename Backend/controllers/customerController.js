import Customer from "../models/Customer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Order from "../models/Orders.js";
import Feedback from "../models/Feedback.js";
import Menu from "../models/Menu.js"; // ✅ Tambahan

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
    if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
      return trimmed;
    }
  } catch {
    return null;
  }

  return null;
};

const toCustomerPayload = (customer) => ({
  id: customer._id,
  username: customer.username || customer.name,
  name: customer.name,
  email: customer.email,
  phone: customer.phone,
  address: customer.address,
  profileImage: customer.profileImage || "",
  role: "customer",
});

const signCustomerToken = (customer) =>
  jwt.sign(
    {
      id: customer._id,
      role: "customer",
      username: customer.username || customer.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

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
    const normalizedName = sanitizeText(name, 80);
    const normalizedAddress = sanitizeText(address, 500);

    const newCustomer = new Customer({
      name: normalizedName || name,
      email,
      username: sanitizeText(username, 40),
      password,
      phone: sanitizeText(phone, 30),
      address: normalizedAddress || address,
      profileImage: "",
    });

    await newCustomer.save();

    res.status(201).json({
      message: "Customer berhasil dibuat.",
      data: toCustomerPayload(newCustomer),
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

    const token = signCustomerToken(customer);

    res.json({
      message: "Login berhasil.",
      token,
      data: toCustomerPayload(customer),
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
    const menus = await Menu.find({
      $or: [{ available: true }, { stock: { $lte: 0 } }],
    })
      .select("name price imageUrl description category available stock")
      .sort({ category: 1, name: 1 });

    const normalized = menus.map((menu) => {
      const stock = Number(menu.stock ?? 0);
      return {
        ...menu.toObject(),
        stock,
        available: stock > 0 ? Boolean(menu.available) : false,
      };
    });

    res.json({
      message: "Daftar menu berhasil diambil",
      data: normalized,
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
    const { items, foodNote } = req.body;
    const customerId = req.user.id;
    const customer = await Customer.findById(customerId).select("name username");
    if (!customer) {
      return res.status(404).json({ message: "Customer tidak ditemukan" });
    }

    const customerName = customer.username || customer.name || req.user.username;
    const sanitizedFoodNote =
      typeof foodNote === "string" ? foodNote.trim().slice(0, 500) : "";

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items tidak boleh kosong" });
    }

    let totalPrice = 0;
    const resolvedMenus = [];

    for (const item of items) {
      const safeQty = Number(item.qty);
      if (!Number.isFinite(safeQty) || safeQty <= 0) {
        return res.status(400).json({ message: "Jumlah item tidak valid." });
      }

      const menu = await Menu.findById(item.menuId);
      if (!menu)
        return res.status(404).json({ message: `Menu ${item.menuId} tidak ditemukan` });

      const stock = Number(menu.stock ?? 0);
      if (!menu.available || stock <= 0) {
        return res.status(400).json({ message: `${menu.name} sedang habis.` });
      }

      if (safeQty > stock) {
        return res.status(400).json({
          message: `Stock ${menu.name} tidak cukup. Sisa stock ${stock}.`,
        });
      }

      totalPrice += Number(menu.price || 0) * safeQty;
      resolvedMenus.push({ menu, qty: Math.floor(safeQty) });
    }

    const newOrder = new Order({
      customerName,
      items,
      totalPrice,
      createdBy: customerId,
      status: "waiting",
      paymentStatus: "unpaid",
      assignedToKitchen: true,
      foodNote: sanitizedFoodNote,
    });

    await newOrder.save();

    for (const entry of resolvedMenus) {
      entry.menu.stock = Math.max(0, Number(entry.menu.stock ?? 0) - entry.qty);
      if (entry.menu.stock <= 0) {
        entry.menu.available = false;
      }
      await entry.menu.save();
    }

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

export const getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select("-password");

    if (!customer) {
      return res.status(404).json({ message: "Customer tidak ditemukan." });
    }

    res.json({
      message: "Profil customer berhasil diambil.",
      data: toCustomerPayload(customer),
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil profil customer.",
      error: error.message,
    });
  }
};

export const updateCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer tidak ditemukan." });
    }

    const { username, name, address, profileImage, removeProfileImage } = req.body;
    const requestedName = sanitizeText(username ?? name, 80);
    const requestedAddress = sanitizeText(address, 500);

    if (username !== undefined || name !== undefined) {
      if (!requestedName) {
        return res.status(400).json({ message: "Username tidak boleh kosong." });
      }
      customer.username = requestedName;
      customer.name = requestedName;
    }

    if (address !== undefined) {
      if (!requestedAddress) {
        return res.status(400).json({ message: "Alamat tidak boleh kosong." });
      }
      customer.address = requestedAddress;
    }

    if (removeProfileImage === true) {
      customer.profileImage = "";
    } else if (profileImage !== undefined) {
      const normalizedImage = sanitizeProfileImage(profileImage);
      if (normalizedImage === null) {
        return res.status(400).json({
          message: "Format foto profil tidak valid. Gunakan URL http/https atau data gambar.",
        });
      }
      customer.profileImage = normalizedImage;
    }

    await customer.save();
    const token = signCustomerToken(customer);

    res.json({
      message: "Profil berhasil diperbarui.",
      token,
      data: toCustomerPayload(customer),
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui profil customer.",
      error: error.message,
    });
  }
};

// ==============================
// 🔵 UPDATE USERNAME
// ==============================
// ======================
// Kotak Saran (Footer)
// ======================
export const submitFeedback = async (req, res) => {
  try {
    const { email, message } = req.body;

    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedMessage =
      typeof message === "string" ? message.trim().slice(0, 500) : "";

    if (!normalizedEmail || !normalizedMessage) {
      return res.status(400).json({ message: "Email dan saran wajib diisi." });
    }

    const feedback = await Feedback.create({
      email: normalizedEmail,
      message: normalizedMessage,
      source: "footer",
    });

    res.status(201).json({
      message: "Saran berhasil dikirim ke dapur.",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengirim saran.",
      error: error.message,
    });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const normalizedUsername = sanitizeText(username, 80);

    if (!normalizedUsername) {
      return res.status(400).json({ message: "Username baru tidak boleh kosong" });
    }

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer tidak ditemukan." });
    }

    customer.username = normalizedUsername;
    customer.name = normalizedUsername;
    await customer.save();
    const token = signCustomerToken(customer);

    res.json({
      message: "Username berhasil diperbarui",
      token,
      data: toCustomerPayload(customer),
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
    const normalizedNewPassword =
      typeof newPassword === "string" ? newPassword.trim() : "";

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Password lama dan password baru wajib diisi",
      });
    }

    if (normalizedNewPassword.length < 6) {
      return res.status(400).json({
        message: "Password baru minimal 6 karakter",
      });
    }

    if (oldPassword === normalizedNewPassword) {
      return res.status(400).json({
        message: "Password baru harus berbeda dari password lama",
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer tidak ditemukan." });
    }

    // Cek password lama
    const match = await bcrypt.compare(oldPassword, customer.password);
    if (!match) {
      return res.status(400).json({ message: "Password lama salah" });
    }

    customer.password = normalizedNewPassword;

    await customer.save();

    res.json({ message: "Password berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal update password",
      error: error.message,
    });
  }
};
