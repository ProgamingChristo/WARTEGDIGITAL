import mongoose from "mongoose";
import bcrypt from "bcrypt";

const karyawanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    position: {
      type: String,
      enum: ["kasir", "dapur"],
      required: true,
    },
    shift: {
      type: String,
      enum: ["pagi", "siang", "malam"],
      default: "pagi",
      required: true,
    },
    attendance: [
      {
        date: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["hadir", "izin", "alpha"],
          default: "hadir",
        },
      },
    ],
    role: {
      type: String,
      default: "karyawan (kasir)",
    },
  },
  { timestamps: true }
);

// ✅ Hash password sebelum disimpan
karyawanSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Cek password saat login
karyawanSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Karyawan = mongoose.model("Karyawan", karyawanSchema);
export default Karyawan;
