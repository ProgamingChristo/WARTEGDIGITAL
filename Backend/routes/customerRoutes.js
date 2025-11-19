import express from "express";
import {
  registerCustomer,
  loginCustomer,
} from "../controllers/customerController.js";

import {
  createOrderCustomer,
  getOrderHistoryCustomer,
} from "../controllers/customerController.js";

import { verifyToken, verifyCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

// ✅ Customer Create Order
router.post("/order", verifyToken, verifyCustomer, createOrderCustomer);

// ✅ Customer History
router.get("/order/history", verifyToken, verifyCustomer, getOrderHistoryCustomer);

export default router;
