import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["makanan", "minuman", "lainnya"],
      default: "makanan",
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    description: {
      type: String,
    },
    available: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Menu", menuSchema);
