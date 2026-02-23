import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    source: {
      type: String,
      enum: ["footer"],
      default: "footer",
    },
    status: {
      type: String,
      enum: ["new", "read"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
