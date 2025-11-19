import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import routes
import superAdminRoutes from "../routes/superAdminRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import karyawanRoutes from "../routes/karyawanRoutes.js";
import customerRoutes from "../routes/customerRoutes.js";
import orderKaryawanRoutes from "../routes/orderKaryawanRoutes.js";

dotenv.config();

const app = express();

// 🧩 Middleware
app.use(cors());
app.use(express.json());

// 🧭 Routes
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/karyawan", karyawanRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/karyawan/order", orderKaryawanRoutes); // ✅ Kasir & Dapur khusus order

// 🛠️ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// 🧠 Error handler (optional)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    message: "Terjadi kesalahan pada server",
    error: err.message,
  });
});

// 🚀 Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
