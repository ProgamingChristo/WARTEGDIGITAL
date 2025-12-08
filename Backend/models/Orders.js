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

    // Status order (lengkap untuk semua tahap)
    status: {
      type: String,
      // include semua state yang pernah dipakai: waiting (baru), pending, processing, cooking, done, delivered
      enum: ["waiting", "pending", "processing", "cooking", "done", "delivered"],
      default: "waiting",
    },

    // Payment status (tambahkan processing karena dipakai saat midtrans checkout sementara menunggu webhook)
    paymentStatus: {
      type: String,
      enum: ["unpaid", "processing", "paid"],
      default: "unpaid",
    },

    // createdBy bisa berisi Customer atau Karyawan (kasir)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    assignedToKitchen: {
      type: Boolean,
      default: false,
    },

    // cookingStatus ditambahkan "waiting" untuk menghindari validasi error
    cookingStatus: {
      type: String,
      enum: ["waiting", "pending", "cooking", "done"],
      default: "waiting",
    },

    // optional extra fields for midtrans integration
    paymentMethod: { type: String, enum: ["cash", "midtrans"], default: "cash" },
    midtransOrderId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
