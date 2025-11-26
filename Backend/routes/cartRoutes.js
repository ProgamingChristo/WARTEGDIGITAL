import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart
} from "../controllers/cartController.js";

import { verifyToken, verifyCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ambil cart customer
router.get("/", verifyToken, verifyCustomer, getCart);

// Tambah ke cart
router.post("/add", verifyToken, verifyCustomer, addToCart);

// Update qty item
router.put("/update", verifyToken, verifyCustomer, updateCartItem);

// Hapus item
router.delete("/delete/:menuId", verifyToken, verifyCustomer, deleteCartItem);

// Clear cart
router.delete("/clear", verifyToken, verifyCustomer, clearCart);

export default router;
