import express from "express";
import {
  registerKaryawan,
  loginKaryawan,
  getAllKaryawan,
  absenMasuk,
  getAttendanceStatus,
  kasirConfirmPayment,
  getAllOrders,
  getOrdersForKitchen,
  updateCookingStatus,
  getFeedbackForKitchen
} from "../controllers/karyawanController.js";

import {
  verifyToken,
  verifyKaryawan,
  verifyKasir,
  verifyDapur
} from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧩 Auth Karyawan
router.post("/register", registerKaryawan);
router.post("/login", loginKaryawan);

// 👥 Lihat semua karyawan
router.get("/", verifyToken, verifyKaryawan, getAllKaryawan);

// 🕓 Absensi
router.post("/absen", verifyToken, verifyKaryawan, absenMasuk);
router.get("/absen/status", verifyToken, verifyKaryawan, getAttendanceStatus);

// =========================
// ✅ Kasir — Konfirmasi Pembayaran
// =========================
router.put("/order/:id/pay", verifyToken, verifyKasir, kasirConfirmPayment);
router.get("/orders", verifyToken, verifyKaryawan, getAllOrders);

// =========================
// ✅ Dapur — Ambil order yang harus dimasak
// =========================
router.get("/order/kitchen", verifyToken, verifyDapur, getOrdersForKitchen);
router.get("/feedback", verifyToken, verifyDapur, getFeedbackForKitchen);

// ✅ Dapur — Update status masak
router.put("/order/:id/cooking", verifyToken, verifyDapur, updateCookingStatus);

export default router;
