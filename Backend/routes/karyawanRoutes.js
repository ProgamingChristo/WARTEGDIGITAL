import express from "express";
import {
  registerKaryawan,
  loginKaryawan,
  getAllKaryawan,
  absenMasuk,
  kasirConfirmPayment,
  getOrdersForKitchen,
  updateCookingStatus
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

// =========================
// ✅ Kasir — Konfirmasi Pembayaran
// =========================
router.put("/order/:id/pay", verifyToken, verifyKasir, kasirConfirmPayment);

// =========================
// ✅ Dapur — Ambil order yang harus dimasak
// =========================
router.get("/order/kitchen", verifyToken, verifyDapur, getOrdersForKitchen);

// ✅ Dapur — Update status masak
router.put("/order/:id/cooking", verifyToken, verifyDapur, updateCookingStatus);

export default router;
