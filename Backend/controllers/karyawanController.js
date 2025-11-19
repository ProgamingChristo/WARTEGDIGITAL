import Karyawan from "../models/Karyawan.js";
import jwt from "jsonwebtoken";
import Order from "../models/Orders.js";

// ✅ Register Karyawan
export const registerKaryawan = async (req, res) => {
  try {
    const { name, username, password, position } = req.body;

    // Validasi input
    if (!name || !username || !password || !position) {
      return res.status(400).json({ message: "Semua field wajib diisi!" });
    }
    // Cek apakah username sudah digunakan
    const existingUser = await Karyawan.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username sudah digunakan!" });
    }

    // Buat karyawan baru
    const newKaryawan = new Karyawan({
      name,
      username,
      password,
      position,
      role: position === "kasir" ? "karyawan (kasir)" : "karyawan (dapur)",
    });

    await newKaryawan.save();

    res.status(201).json({
      message: "Karyawan berhasil didaftarkan!",
      data: {
        id: newKaryawan._id,
        name: newKaryawan.name,
        username: newKaryawan.username,
        position: newKaryawan.position,
        role: newKaryawan.role,
      },
    });
  } catch (error) {
    console.error("❌ Error Register Karyawan:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// ✅ Login Karyawan
export const loginKaryawan = async (req, res) => {
  try {
    const { username, password } = req.body;

    const karyawan = await Karyawan.findOne({ username });
    if (!karyawan) {
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    }

    const isMatch = await karyawan.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: karyawan._id, role: karyawan.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login berhasil!",
      token,
      data: {
        id: karyawan._id,
        name: karyawan.name,
        username: karyawan.username,
        position: karyawan.position,
        role: karyawan.role,
      },
    });
  } catch (error) {
    console.error("❌ Error Login Karyawan:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// ✅ Get Semua Karyawan (khusus SuperAdmin)
export const getAllKaryawan = async (req, res) => {
  try {
    const karyawanList = await Karyawan.find().select("-password");
    res.status(200).json({
      message: "Data karyawan berhasil diambil",
      data: karyawanList,
    });
  } catch (error) {
    console.error("❌ Error Get All Karyawan:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};
// ✅ Helper untuk cek jam & shift
const validateShiftTime = (shift) => {
  const now = new Date();
  const hour = now.getHours(); // 0 - 23

  if (shift === "pagi" && hour >= 7 && hour < 13) return true;
  if (shift === "siang" && hour >= 13 && hour < 19) return true;
  if (shift === "malam" && hour >= 19 && hour < 24) return true;

  return false;
};

// ✅ ABSEN KARYAWAN
export const absenMasuk = async (req, res) => {
  try {
    const karyawanId = req.user.id;
    const karyawan = await Karyawan.findById(karyawanId);

    if (!karyawan)
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });

    // Cek shift
    if (!validateShiftTime(karyawan.shift)) {
      return res.status(400).json({
        message: `Kamu tidak bisa absen di luar jam shift ${karyawan.shift}`,
      });
    }

    const today = new Date().toISOString().split("T")[0];

    // Cek apakah sudah absen hari ini
    const alreadyAbsen = karyawan.attendance.some(
      (absen) => absen.date.toISOString().split("T")[0] === today
    );

    if (alreadyAbsen)
      return res.status(400).json({ message: "Sudah absen hari ini!" });

    // Simpan absensi
    karyawan.attendance.push({ status: "hadir" });
    await karyawan.save();

    res.json({
      message: "Absensi berhasil ✅",
      shift: karyawan.shift,
      data: karyawan.attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan saat absen",
      error: error.message,
    });
  }
};

// ✅ ADMIN / SUPERADMIN — GET ABSENSI
export const getAllAbsensi = async (req, res) => {
  try {
    const list = await Karyawan.find().select("name position shift attendance");
    res.json({
      message: "Data absensi berhasil diambil",
      data: list,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data absensi",
      error: error.message,
    });
  }
};
// ======================
// ✅ Kasir — Konfirmasi Pembayaran
// ======================
export const kasirConfirmPayment = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: "paid" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    res.json({
      message: "Pembayaran berhasil dikonfirmasi ✅",
      data: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal update status pembayaran",
      error: err.message,
    });
  }
};

// ======================
// ✅ Dapur — Lihat Order yang harus dimasak
// ======================
export const getOrdersForKitchen = async (req, res) => {
  try {
    const listOrder = await Order.find({
      assignedToKitchen: true,
      paymentStatus: "paid",
      status: { $in: ["waiting", "processing"] },
    }).select("-createdBy");

    res.json({
      message: "Order untuk dapur berhasil diambil 🍳",
      data: listOrder,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil order dapur",
      error: err.message,
    });
  }
};

// ======================
// ✅ Dapur — Update Status Masak
// ======================
export const updateCookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["waiting", "processing", "done"].includes(status)) {
      return res.status(400).json({ message: "Status masak tidak valid!" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    res.json({
      message: "Status masak diperbarui ✅",
      data: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal update status masak",
      error: err.message,
    });
  }
};