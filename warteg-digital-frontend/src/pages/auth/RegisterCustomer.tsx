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
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registrasi gagal. Periksa kembali data Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#f5ecdd] via-[#f3e3c9] to-[#ead8bc] px-4 py-10">
      <div className="pointer-events-none absolute -left-10 top-20 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-60 w-60 rounded-full bg-emerald-300/20 blur-3xl" />

      <section className="relative w-full max-w-lg rounded-3xl border border-amber-100 bg-white/90 p-8 shadow-[0_16px_40px_rgba(90,58,26,0.12)] md:p-10">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-amber-700">Warteg Digital</p>
        <h1 className="mt-2 text-center font-display text-4xl text-amber-950">Daftar Akun</h1>
        <p className="mt-1 text-center text-sm text-amber-900/70">Satu akun untuk semua pesanan favoritmu.</p>

        <form onSubmit={handleRegister} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-amber-900/70">Nama Lengkap</span>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700/70" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nama lengkap"
                required
                className="w-full rounded-xl border border-amber-200 bg-[#fffdf8] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-amber-900/70">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700/70" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                required
                className="w-full rounded-xl border border-amber-200 bg-[#fffdf8] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-amber-900/70">Password</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700/70" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                required
                className="w-full rounded-xl border border-amber-200 bg-[#fffdf8] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-amber-900/70">Nomor Telepon</span>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700/70" />
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                required
                className="w-full rounded-xl border border-amber-200 bg-[#fffdf8] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-amber-900/70">Alamat</span>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700/70" />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Jakarta Selatan"
                required
                className="w-full rounded-xl border border-amber-200 bg-[#fffdf8] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="md:col-span-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-emerald-700 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                Daftar Sekarang
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="md:col-span-2 text-center text-sm text-amber-900/80">
            Sudah punya akun? {" "}
            <Link to="/login" className="font-semibold text-emerald-800 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default RegisterCustomer;
