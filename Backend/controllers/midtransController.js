import midtransClient from "midtrans-client";
import Order from "../models/Orders.js";
import Cart from "../models/Cart.js";
import Menu from "../models/Menu.js";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

// CREATE TRANSACTION — dipanggil dari checkoutCart
export const createMidtransTransaction = async (orderId, amount, customerName, customerId) => {
  try {
    // Ambil cart untuk membuat item_details Midtrans
    const cart = await Cart.findOne({ customerId });
    if (!cart) throw new Error("Cart tidak ditemukan");

    const itemDetails = [];

    // Build item_details dari cart
    for (const item of cart.items) {
      const menu = await Menu.findById(item.menuId);
      if (menu) {
        itemDetails.push({
          id: menu._id.toString(),
          price: menu.price,
          quantity: item.qty,
          name: menu.name,
        });
      }
    }

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customerName,
      },
      item_details: itemDetails, // 🔥 tambahkan detail menu
    };

    return await snap.createTransaction(parameter);

  } catch (error) {
    console.error("Midtrans Transaction Error:", error);
    throw error;
  }
};

// WEBHOOK HANDLER
export const midtransWebhookHandler = async (req, res) => {
  try {
    const event = req.body;

    const orderId = event.order_id;
    const status = event.transaction_status;

    const order = await Order.findOne({ midtransOrderId: orderId });
    if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });

    // ---- FIX ENUM ----
    // di Orders.js kamu enum status: ["pending", "cooking", "done", "delivered"]
    // jadi gak boleh pakai "waiting"
    // -------------------

    if (status === "settlement") {
      order.paymentStatus = "paid";
      order.status = "pending";         // pesanan berhasil → pending untuk dapur
      order.cookingStatus = "pending";  // sesuai enum kamu
      order.assignedToKitchen = true;   // langsung masuk dapur

      await order.save();
    }

    res.status(200).json({ message: "Webhook diterima" });
  } catch (error) {
    res.status(500).json({
      message: "Webhook gagal",
      error: error.message,
    });
  }
};
