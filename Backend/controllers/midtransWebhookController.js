import Order from "../models/Orders.js";
import fs from "fs";
import path from "path";
import { generateInvoiceForWebhook } from "./invoiceController.js";

export const midtransWebhook = async (req, res) => {
  try {
    console.log("\n===== 🔔 MIDTRANS WEBHOOK MASUK 🔔 =====");
    console.log("Raw Body:", req.body);

    const { order_id, transaction_status } = req.body;

    // Log basic values
    console.log("📦 order_id:", order_id);
    console.log("💰 transaction_status:", transaction_status);

    // Normalize status
    const cleanStatus = (transaction_status || "").trim().toLowerCase();
    console.log("💰 Clean Status:", cleanStatus);

    // Save to file log
    fs.appendFileSync(
      "midtrans_webhook.log",
      `[${new Date().toISOString()}] ${JSON.stringify(req.body)}\n`
    );

    /** ============================================================
     *  VALIDASI WAJIB
     * ============================================================ */
    if (!order_id) {
      console.log("❌ order_id missing!");
      return res.status(400).json({ message: "Webhook missing order_id" });
    }

    /** ============================================================
     *  SETTLEMENT / CAPTURE PAYMENT SUCCESS
     * ============================================================ */
    if (cleanStatus === "settlement" || cleanStatus === "capture") {
      console.log("💳 STATUS = PAYMENT SUCCESS → Searching order...");

      let order = await Order.findOne({ midtransOrderId: order_id })
  .populate("items.menuId", "name price");


      if (!order) {
        console.log("❌ ORDER NOT FOUND in DB");
        return res.status(404).json({ message: "Order tidak ditemukan" });
      }

      console.log("✅ ORDER FOUND:", order._id);

      // Update order → READY for kitchen
      order.paymentStatus = "paid";
      order.status = "pending";
      order.cookingStatus = "pending";
      order.assignedToKitchen = true;

      await order.save();
      console.log("🔄 Order updated after payment");

      /** =======================================
       *  🔥 GENERATE INVOICE
       * ======================================= */
      try {
        console.log("🧾 Generating invoice PDF...");

        const invoicePath = await generateInvoice(order);

        order.invoicePath = invoicePath;
        await order.save();

        console.log("✅ Invoice generated at:", invoicePath);

      } catch (err) {
        console.error("❌ FAILED GENERATING INVOICE:", err.message);
      }

      console.log("===== ✅ WEBHOOK DONE =====\n");

      return res.json({
        message: "Webhook settlement diterima ✔ Payment success",
        data: order
      });
    }

    /** ============================================================
     *  OTHER STATUS (pending, cancel, deny, refund, etc)
     * ============================================================ */
    console.log("ℹ️ STATUS BUKAN SETTLEMENT:", cleanStatus);

    return res.json({
      message: "Webhook diterima (status bukan settlement)"
    });

  } catch (err) {
    console.error("🔥 CRITICAL ERROR IN WEBHOOK:", err);

    return res.status(500).json({
      message: "Webhook gagal",
      error: err.message
    });
  }
};
