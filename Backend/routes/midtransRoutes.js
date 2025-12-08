import express from "express";
import { midtransWebhookHandler } from "../controllers/midtransController.js";

const router = express.Router();

// Webhook endpoint (harus tanpa auth!)
router.post("/webhook", midtransWebhookHandler);

export default router;
