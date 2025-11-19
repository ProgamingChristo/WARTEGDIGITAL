import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },

    items: [
      {
        menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
        qty: { type: Number, required: true },
      },
    ],

    totalPrice: { type: Number, required: true },

    // ✅ Status order lebih lengkap untuk workflow customer → kasir → dapur
    status: {
      type: String,
      enum: ["waiting", "pending", "cooking", "done", "delivered"],
      default: "waiting",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // ✅ Customer yang membuat pesanan
      required: true,
    },

    assignedToKitchen: {
      type: Boolean,
      default: true, // ✅ Pesanan otomatis masuk dapur setelah dibuat
    },

    cookingStatus: {
      type: String,
      enum: ["pending", "cooking", "done"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
