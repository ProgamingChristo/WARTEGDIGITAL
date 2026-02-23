import express from "express";

import {
  registerCustomer,
  loginCustomer,
  createOrderCustomer,
  getOrderHistoryCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  updateUsername,
  updatePassword,
  getAllMenuCustomer,
  getOrderDetailCustomer,
  submitFeedback
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
router.post("/feedback", submitFeedback);
router.post("/order", verifyToken, verifyCustomer, createOrderCustomer);
// Customer History
router.get("/order/history", verifyToken, verifyCustomer, getOrderHistoryCustomer);

// NEW → Detail Order
router.get("/order/:id", verifyToken, verifyCustomer, getOrderDetailCustomer);




// =======================
// 👤 UPDATE PROFILE CUSTOMER
// =======================
router.get("/profile", verifyToken, verifyCustomer, getCustomerProfile);
router.put("/profile", verifyToken, verifyCustomer, updateCustomerProfile);
router.put("/profile/password", verifyToken, verifyCustomer, updatePassword);

// Update Username
router.put("/update-username", verifyToken, verifyCustomer, updateUsername);

// Update Password
router.put("/update-password", verifyToken, verifyCustomer, updatePassword);

export default router;
