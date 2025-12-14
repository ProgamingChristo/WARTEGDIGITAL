import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Loader2 } from "lucide-react";

const RegisterCustomer = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/customer/register", form);
      alert("Registrasi berhasil! Silahkan login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registrasi gagal. Periksa kembali data Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF4D6] px-4 py-12 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-10 space-y-8">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Daftar Akun</h2>
          <p className="text-gray-500 text-sm mt-1">
            Buat akun untuk mulai memesan di{" "}
            <span className="font-semibold text-green-700">Warteg Digital</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nama lengkap"
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Alamat email"
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nomor Telepon
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Alamat
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Contoh: Jakarta Selatan"
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 bg-green-600 hover:bg-green-700 
              text-white font-semibold rounded-lg shadow-md transition disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Memproses...
              </>
            ) : (
              <>
                Daftar Sekarang
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </button>

          {/* Footer Link */}
          <p className="text-center text-sm text-gray-600 mt-3">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-semibold text-green-600 hover:underline"
            >
              Masuk disini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterCustomer;
