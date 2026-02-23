import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import strict from "assert/strict";
// Import routes
import superAdminRoutes from "../routes/superAdminRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import karyawanRoutes from "../routes/karyawanRoutes.js";
import customerRoutes from "../routes/customerRoutes.js";
import orderKaryawanRoutes from "../routes/orderKaryawanRoutes.js";
import cartRoutes from "../routes/cartRoutes.js";
import midtransRoutes from "../routes/midtransRoutes.js";
import midtransWebhookRoutes from "../routes/midtransWebhookRoutes.js";
import invoiceRoutes from "../routes/invoiceRoutes.js";

dotenv.config();

const app = express();


/* 1. HARD-CHECK: timpa CORS duluan */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // preflight OK
  }
  next();
});

/* 2. Baru middleware lain */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =====================================================
// 📌 FIX: Path helper (karena kita pakai ES Module)
// =====================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// 🟦 CREATE invoices FOLDER IF NOT EXISTS
// =====================================================
const invoicesDir = path.join(__dirname, "../invoices");

if (!fs.existsSync(invoicesDir)) {
  fs.mkdirSync(invoicesDir);
  console.log("📁 Folder invoices/ berhasil dibuat");
} else {
  console.log("📁 Folder invoices/ sudah tersedia");
}

// =====================================================
// 🟩 FIX: BUAT STATIC ROUTE UNTUK PDF
// =====================================================
app.use("/invoices", express.static(invoicesDir));
// Setelah ini, PDF dapat diakses via:
// http://localhost:5000/invoices/invoice-ORDER-xxxxxxxx.pdf

// =====================================================
// 🧭 Routes
// =====================================================
app.use("/api/midtrans/webhook", midtransWebhookRoutes);  // <== PENTING !!
app.use("/api/midtrans", midtransRoutes);

app.use("/api/superadmin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/karyawan", karyawanRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/karyawan/order", orderKaryawanRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/invoice", invoiceRoutes);

// =====================================================
// 🛠️ MongoDB connection
// =====================================================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) =>
    console.error("❌ MongoDB Connection Error:", err.message)
  );

// =====================================================
// 🧠 Error handler
// =====================================================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    message: "Terjadi kesalahan pada server",
    error: err.message,
  });
});

// =====================================================
// 🚀 Start Server
// =====================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
