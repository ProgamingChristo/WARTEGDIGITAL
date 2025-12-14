import express from "express";

import {
  registerCustomer,
  loginCustomer,
  createOrderCustomer,
  getOrderHistoryCustomer,
  updateUsername,
  updatePassword,
  getAllMenuCustomer,
  getOrderDetailCustomer
} from "../controllers/customerController.js";

import { verifyToken, verifyCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

// =======================
// 🔐 AUTH
// =======================
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/logout", (req, res) => {
  return res.json({ message: "Logout berhasil" });
});

// =======================
// 🧾 ORDER CUSTOMER
// =======================
// Customer melihat menu (public)
router.get("/menu", getAllMenuCustomer);
router.post("/order", verifyToken, verifyCustomer, createOrderCustomer);
// Customer History
router.get("/order/history", verifyToken, verifyCustomer, getOrderHistoryCustomer);

// NEW → Detail Order
router.get("/order/:id", verifyToken, verifyCustomer, getOrderDetailCustomer);




// =======================
// 👤 UPDATE PROFILE CUSTOMER
// =======================

// Update Username
router.put("/update-username", verifyToken, verifyCustomer, updateUsername);

// Update Password
router.put("/update-password", verifyToken, verifyCustomer, updatePassword);

export default router;
