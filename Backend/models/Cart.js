import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true // setiap customer hanya punya 1 cart aktif
    },
    items: [
      {
        menuId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true
        },
        qty: { type: Number, required: true, min: 1 }
      }
    ],
    totalPrice: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
