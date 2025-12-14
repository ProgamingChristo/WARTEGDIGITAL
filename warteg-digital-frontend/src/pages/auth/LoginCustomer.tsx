import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { isAxiosError } from "axios";

const LoginCustomer = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/customer/login", form);

      const token: string = res.data.token;
      const user = res.data.data;

      setAuth(token, user, "customer");

      alert("Login berhasil!");
      navigate("/");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        alert(
          err.response?.data?.message ??
            "Login gagal, cek email/password."
        );
      } else {
        alert("Terjadi kesalahan tak terduga!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF4D6] px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10 border border-gray-200">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Masuk Akun
          </h2>
          <p className="text-gray-500 mt-1">
            Selamat datang kembali di{" "}
            <span className="font-semibold">Warteg Digital</span>
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">

          {/* Input Email */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Email
            </label>
            <div className="relative mt-1">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="Masukkan email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-green-500 outline-none transition text-gray-800"
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-green-500 outline-none transition text-gray-800"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 bg-green-600 hover:bg-green-700
             text-white font-semibold rounded-lg shadow-md transition disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" /> Memproses...
              </>
            ) : (
              <>
                Masuk Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-600 pt-2">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="font-semibold text-green-600 hover:underline"
            >
              Daftar disini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginCustomer;
