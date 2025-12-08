import express from "express";
import { midtransWebhook } from "../controllers/midtransWebhookController.js";

const router = express.Router();

router.post("/", midtransWebhook);

export default router;
