import SuperAdmin from "../models/SuperAdmin.js";
import Admin from "../models/Admin.js";
import Karyawan from "../models/Karyawan.js";
import Customer from "../models/Customer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ===========================
   🔹 REGISTER SUPERADMIN
=========================== */
export const registerSuperAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "Semua field wajib diisi" });

    const existing = await SuperAdmin.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email sudah digunakan" });

    const newSuperAdmin = new SuperAdmin({ fullName, email, password });
    await newSuperAdmin.save();

    res.status(201).json({
      message: "SuperAdmin berhasil dibuat",
      data: {
        id: newSuperAdmin._id,
        fullName: newSuperAdmin.fullName,
        email: newSuperAdmin.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

/* ===========================
   🔹 LOGIN SUPERADMIN
=========================== */
export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin)
      return res.status(404).json({ message: "SuperAdmin tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign(
      { id: superAdmin._id, role: "superadmin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      data: {
        id: superAdmin._id,
        fullName: superAdmin.fullName,
        email: superAdmin.email,
        role: "superadmin",
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

/* ===========================
   🔹 CRUD ADMIN (SuperAdmin Only)
=========================== */
// CREATE ADMIN
export const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username dan password wajib diisi" });

    const existing = await Admin.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "Username sudah digunakan" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({
      message: "Admin berhasil dibuat",
      data: {
        id: newAdmin._id,
        username: newAdmin.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat admin", error: error.message });
  }
};

// READ ALL ADMINS
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json({ message: "Data admin berhasil diambil", admins });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data admin", error: error.message });
  }
};

// UPDATE ADMIN
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin tidak ditemukan" });

    if (username) admin.username = username;
    if (password) admin.password = await bcrypt.hash(password, 10);

    await admin.save();
    res.json({ message: "Admin berhasil diperbarui", data: admin });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui admin", error: error.message });
  }
};

// DELETE ADMIN
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Admin tidak ditemukan" });

    res.json({ message: "Admin berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus admin", error: error.message });
  }
};

/* ===========================
   🔹 GET SEMUA DATA
=========================== */
export const getAllData = async (req, res) => {
  try {
    const karyawan = await Karyawan.find().select("-password");
    const customers = await Customer.find().select("-password");

    res.json({
      message: "Data berhasil diambil",
      karyawan,
      customers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data", error: error.message });
  }
};
