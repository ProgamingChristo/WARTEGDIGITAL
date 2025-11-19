import mongoose from "mongoose";
import dotenv from "dotenv";
import Karyawan from "./models/Karyawan.js";

dotenv.config();

const seedKaryawan = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const data = [
      {
        name: "Pagi",
        username: "pagi11",
        password: "123456",
        position: "kasir",
        role: "karyawan (kasir)",
        shift: "pagi",
      },
      {
        name: "Siang",
        username: "siang11",
        password: "123456",
        position: "dapur",
        role: "karyawan (dapur)",
        shift: "siang",
      },
      {
        name: "Malam",
        username: "malam11",
        password: "123456",
        position: "dapur",
        role: "karyawan (dapur)",
        shift: "malam",
      },
    ];

    await Karyawan.deleteMany(); // hapus data lama
    await Karyawan.insertMany(data);

    console.log("✅ 3 Data karyawan (pagi, siang, malam) berhasil dibuat!");
    process.exit();
  } catch (err) {
    console.error("❌ Gagal seed data:", err.message);
    process.exit(1);
  }
};

seedKaryawan();
