import Karyawan from "../models/Karyawan.js";
import jwt from "jsonwebtoken";
import Order from "../models/Orders.js";
import Feedback from "../models/Feedback.js";

const SHIFT_WINDOWS = {
  pagi: { startHour: 7, endHour: 12, label: "07:00 - 12:00 WIB" },
  siang: { startHour: 12, endHour: 18, label: "12:00 - 18:00 WIB" },
  malam: { startHour: 18, endHour: 24, label: "18:00 - 24:00 WIB" },
};

const getWIBParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const valueOf = (type) => parts.find((part) => part.type === type)?.value || "";

  const year = valueOf("year");
  const month = valueOf("month");
  const day = valueOf("day");
  const hour = Number(valueOf("hour"));
  const minute = Number(valueOf("minute"));
  const second = Number(valueOf("second"));

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    dateKey: `${year}-${month}-${day}`,
    timeLabel: `${day}/${month}/${year} ${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}:${String(second).padStart(2, "0")} WIB`,
  };
};

const getWIBDateKey = (date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

const isShiftOpen = (shift, hour) => {
  const window = SHIFT_WINDOWS[shift];
  if (!window) return false;
  return hour >= window.startHour && hour < window.endHour;
};

const buildAttendanceStatus = (karyawan) => {
  const nowWIB = getWIBParts();
  const attendanceToday = (karyawan.attendance || []).find(
    (absen) => getWIBDateKey(absen.date) === nowWIB.dateKey
  );

  const canAttendNow = isShiftOpen(karyawan.shift, nowWIB.hour) && !attendanceToday;

  return {
    serverTimeWIB: nowWIB.timeLabel,
    dateWIB: nowWIB.dateKey,
    shift: karyawan.shift,
    shiftWindowWIB: SHIFT_WINDOWS[karyawan.shift]?.label || "-",
    alreadyAttendToday: Boolean(attendanceToday),
    canAttendNow,
    attendanceToday: attendanceToday
      ? {
          status: attendanceToday.status,
          date: attendanceToday.date,
        }
      : null,
  };
};

// ========================
// ✅ Register Karyawan
// ========================
export const registerKaryawan = async (req, res) => {
  try {
    const { name, username, password, position } = req.body;

    if (!name || !username || !password || !position) {
      return res.status(400).json({ message: "Semua field wajib diisi!" });
    }

    const existingUser = await Karyawan.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username sudah digunakan!" });
    }

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
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// ========================
// ✅ Login Karyawan
// ========================
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
      { id: karyawan._id, role: karyawan.role, position: karyawan.position },
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
        shift: karyawan.shift,
        role: karyawan.role,
        attendanceStatus: buildAttendanceStatus(karyawan),
      },
    });
  } catch (error) {
    console.error("❌ Error Login Karyawan:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// ========================
// ✅ Get Semua Karyawan
// ========================
export const getAllKaryawan = async (req, res) => {
  try {
    const karyawanList = await Karyawan.find().select("-password");
    res.status(200).json({
      message: "Data karyawan berhasil diambil",
      data: karyawanList,
    });
  } catch (error) {
    console.error("❌ Error Get All Karyawan:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// ========================
// 📊 Status Absensi (WIB)
// ========================
export const getAttendanceStatus = async (req, res) => {
  try {
    const karyawan = await Karyawan.findById(req.user.id).select(
      "name username position shift attendance"
    );

    if (!karyawan) {
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    }

    res.json({
      message: "Status absensi berhasil diambil",
      data: {
        karyawan: {
          id: karyawan._id,
          name: karyawan.name,
          username: karyawan.username,
          position: karyawan.position,
          shift: karyawan.shift,
        },
        attendance: buildAttendanceStatus(karyawan),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil status absensi",
      error: error.message,
    });
  }
};

// ========================
// 🟢 Absen Masuk
// ========================
export const absenMasuk = async (req, res) => {
  try {
    const karyawanId = req.user.id;
    const karyawan = await Karyawan.findById(karyawanId);

    if (!karyawan)
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });

    const nowWIB = getWIBParts();
    if (!isShiftOpen(karyawan.shift, nowWIB.hour)) {
      return res.status(400).json({
        message: `Kamu tidak bisa absen di luar jam shift ${SHIFT_WINDOWS[karyawan.shift]?.label || karyawan.shift}`,
      });
    }

    const alreadyAbsen = (karyawan.attendance || []).some(
      (absen) => getWIBDateKey(absen.date) === nowWIB.dateKey
    );

    if (alreadyAbsen)
      return res.status(400).json({ message: "Sudah absen hari ini!" });

    karyawan.attendance.push({ status: "hadir", date: new Date() });
    await karyawan.save();

    res.json({
      message: "Absensi berhasil ✅",
      data: buildAttendanceStatus(karyawan),
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat absen", error: error.message });
  }
};

// ========================
// 📊 Admin Get Absensi
// ========================
export const getAllAbsensi = async (req, res) => {
  try {
    const list = await Karyawan.find().select("name position shift attendance");
    res.json({
      message: "Data absensi berhasil diambil",
      data: list,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data absensi", error: error.message });
  }
};

// ========================
// 💵 Kasir — Konfirmasi Pembayaran
// ========================




export const kasirConfirmPayment = async (req, res) => {
  try {
    const orderId = req.params.id;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "paid",
        assignedToKitchen: true,   // 🔥 WAJIB
        status: "waiting",         // 🔥 WAJIB BARU MASUK DAPUR
      },
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
// ========================
//  Kasir — get all orders
// ========================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("items.menuId", "name price imageUrl")
      .sort({ createdAt: -1 })
      .lean();

    const data = orders.map((o) => {
      const totalPrice = o.items.reduce(
        (sum, it) => sum + it.qty * (it.menuId?.price || 0),
        0
      );
      return { ...o, totalPrice };
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
// ========================
// 🍳 Dapur — Ambil Order Masak
// ========================
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

// ========================
// 🔥 Dapur — Update Status Masak
// ========================
export const getFeedbackForKitchen = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({})
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    res.json({
      message: "Saran dapur berhasil diambil",
      data: feedbacks,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil saran dapur",
      error: err.message,
    });
  }
};

export const updateCookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["waiting", "processing", "done"].includes(status)) {
      return res.status(400).json({ message: "Status masak tidak valid!" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        cookingStatus: status   // 🔥 FIX UTAMA
      },
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
