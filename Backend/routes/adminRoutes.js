import express from "express";
import {
  registerAdmin,
  loginAdmin,
  createMenu,
  getAllMenu,
  updateMenu,
  deleteMenu,
  createKaryawan,
  getAllKaryawan,
  updateKaryawan,
  deleteKaryawan,
  createOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getAdminOrderById,
  getAllAbsensi, // ✅ Pindahkan ke sini biar semua controller di satu tempat
  getAdminProfile,
  updateAdminProfile,
} from "../controllers/adminController.js";

import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// 🔐 AUTH (Admin Login & Register)
// ==========================
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", verifyToken, verifyAdmin, getAdminProfile);
router.put("/profile", verifyToken, verifyAdmin, updateAdminProfile);

// ==========================
// 🍽 MENU MANAGEMENT
// ==========================
router.post("/menu", verifyToken, verifyAdmin, createMenu);
router.get("/menu", verifyToken, verifyAdmin, getAllMenu);
router.put("/menu/:id", verifyToken, verifyAdmin, updateMenu);
router.delete("/menu/:id", verifyToken, verifyAdmin, deleteMenu);

// ==========================
// 👥 KARYAWAN MANAGEMENT + SHIFT
// ==========================
router.post("/karyawan", verifyToken, verifyAdmin, createKaryawan);
router.get("/karyawan", verifyToken, verifyAdmin, getAllKaryawan);
router.put("/karyawan/:id", verifyToken, verifyAdmin, updateKaryawan);
router.delete("/karyawan/:id", verifyToken, verifyAdmin, deleteKaryawan);

// ==========================
// 🕒 ABSENSI MANAGEMENT
// ==========================
router.get("/absensi", verifyToken, verifyAdmin, getAllAbsensi);

// ==========================
// 📦 ORDER MANAGEMENT
// ==========================
router.post("/order", verifyToken, verifyAdmin, createOrder);
router.get("/order/:id", verifyToken, verifyAdmin, getAdminOrderById); // <-- baru
router.get("/order", verifyToken, verifyAdmin, getAllOrders);
router.put("/order/:id", verifyToken, verifyAdmin, updateOrder);
router.delete("/order/:id", verifyToken, verifyAdmin, deleteOrder);

export default router;
