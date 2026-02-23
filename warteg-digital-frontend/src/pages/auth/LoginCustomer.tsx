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
        alert(err.response?.data?.message ?? "Login gagal, cek email/password.");
      } else {
        alert("Terjadi kesalahan tak terduga!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#f5ecdd] via-[#f3e3c9] to-[#ead8bc] px-4 py-10">
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-10 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl" />

      <section className="relative w-full max-w-md rounded-3xl border border-amber-100 bg-white/90 p-8 shadow-[0_16px_40px_rgba(90,58,26,0.12)] md:p-10">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-amber-700">Warteg Digital</p>
        <h1 className="mt-2 text-center font-display text-4xl text-amber-950">Masuk Akun</h1>
        <p className="mt-1 text-center text-sm text-amber-900/70">Akses pesanan favoritmu dalam hitungan detik.</p>

        <form onSubmit={handleLogin} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-amber-900/70">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700/70" />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-amber-200 bg-[#fffdf8] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-amber-900/70">Password</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700/70" />
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className="w-full rounded-xl border border-amber-200 bg-[#fffdf8] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-emerald-700 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                Masuk Sekarang
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="pt-2 text-center text-sm text-amber-900/80">
            Belum punya akun? {" "}
            <Link to="/register" className="font-semibold text-emerald-800 hover:underline">
              Daftar di sini
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default LoginCustomer;
