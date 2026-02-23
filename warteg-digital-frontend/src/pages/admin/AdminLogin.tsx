import { useState } from "react";
import api from "../../api/axios";
import { useAdminAuthStore } from "../../store/adminAuthStore";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, ShieldUser, UserRound } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const setAdminAuth = useAdminAuthStore((state) => state.setAdminAuth);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/admin/login", form);
      const token: string = res.data.token;
      const admin = res.data.data;

      setAdminAuth(token, {
        id: admin.id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        profileImage: admin.profileImage,
        role: admin.role,
      });

      navigate("/admin/dashboard");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Login admin gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f1725] px-4 py-10">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#1f5fa8]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-8 h-72 w-72 rounded-full bg-[#2f6f4a]/35 blur-3xl" />

      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.15)] bg-white/95 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:grid-cols-2">
        <aside className="hidden flex-col justify-between bg-[#131d2d] p-10 text-white md:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8ba6cc]">Warteg Digital</p>
            <h1 className="mt-3 font-display text-5xl leading-tight">Admin Panel</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#c9d4e7]">
              Kelola menu, operasional karyawan, dan laporan order dalam satu dashboard terpadu.
            </p>
          </div>
          <p className="text-xs text-[#9ab0d0]">© {new Date().getFullYear()} Warteg Digital</p>
        </aside>

        <div className="p-8 md:p-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f0fc] text-[#1f5fa8]">
            <ShieldUser className="h-6 w-6" />
          </div>
          <h2 className="mt-3 font-display text-4xl text-[#13243a]">Masuk Admin</h2>
          <p className="mt-1 text-sm text-[#5f6776]">Gunakan akun admin resmi untuk mengakses sistem.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5f6776]">Username</span>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#758299]" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#d5dce7] bg-[#fcfdff] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#d6e8fb]"
                  placeholder="adminwarteg"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5f6776]">Password</span>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#758299]" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#d5dce7] bg-[#fcfdff] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#d6e8fb]"
                  placeholder="••••••••"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#1f5fa8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#174f8f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
