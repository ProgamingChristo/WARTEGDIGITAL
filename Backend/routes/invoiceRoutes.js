import express from "express";
import { generateInvoiceManually, getInvoiceFile } from "../controllers/invoiceController.js";

const router = express.Router();

// Generate invoice secara manual jika diperlukan
router.post("/generate/:orderId", generateInvoiceManually);

// Serve file invoice
router.get("/:filename", getInvoiceFile);

export default router;
