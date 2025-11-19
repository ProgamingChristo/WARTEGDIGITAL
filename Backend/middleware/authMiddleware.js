import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// 🔹 Verifikasi token umum
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Token tidak ditemukan" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token tidak valid" });
    req.user = user;
    next();
  });
};

// 🔹 SuperAdmin only
export const verifySuperAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin")
    return res.status(403).json({ message: "Akses ditolak: hanya SuperAdmin" });
  next();
};

// 🔹 Admin only
export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Akses ditolak: hanya Admin" });
  next();
};

// 🔹 Karyawan only (boleh kasir atau dapur)
export const verifyKaryawan = (req, res, next) => {
  if (!req.user.role.toLowerCase().includes("karyawan"))
    return res.status(403).json({ message: "Akses ditolak: hanya Karyawan" });
  next();
};

// ✅ Kasir only
export const verifyKasir = (req, res, next) => {
  if (
    req.user.role.toLowerCase() === "karyawan (kasir)" ||
    req.user.position === "kasir"
  ) {
    return next();
  }
  return res.status(403).json({ message: "Akses khusus kasir" });
};

// ✅ Dapur only
export const verifyDapur = (req, res, next) => {
  if (
    req.user.role.toLowerCase() === "karyawan (dapur)" ||
    req.user.position === "dapur"
  ) {
    return next();
  }
  return res.status(403).json({ message: "Akses khusus dapur" });
};

// 🔹 Customer only
export const verifyCustomer = (req, res, next) => {
  if (req.user.role !== "customer")
    return res.status(403).json({ message: "Akses ditolak: hanya Customer" });
  next();
};
