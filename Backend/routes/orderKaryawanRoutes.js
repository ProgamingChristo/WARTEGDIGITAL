import express from "express";
import {
  kasirCreateOrder,
  kasirPayment,
  getOrdersForKitchen,
  updateCookingStatus,
} from "../controllers/orderKaryawanController.js";

import { verifyToken, verifyKasir, verifyDapur } from "../middleware/authMiddleware.js";

const router = express.Router();
// ======================
// 💰 KASIR ORDER MANAGEMENT
// ======================
router.post("/order", verifyToken, verifyKasir, kasirCreateOrder); 
router.put("/order/:id/pay", verifyToken, verifyKasir, kasirPayment);

// ======================
// 🍳 DAPUR ORDER MANAGEMENT
// ======================
router.get("/kitchen/orders", verifyToken, verifyDapur, getOrdersForKitchen);
router.put("/kitchen/orders/:id/status", verifyToken, verifyDapur, updateCookingStatus);

export default router;
