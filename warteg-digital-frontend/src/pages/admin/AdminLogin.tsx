import { useState } from "react";
import api from "../../api/axios";
import { useAdminAuthStore } from "../../store/adminAuthStore";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const setAdminAuth = useAdminAuthStore((s) => s.setAdminAuth);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/admin/login", form);

      const token: string = res.data.token;
      const admin = res.data.data;

      const adminUser = {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      };

      setAdminAuth(token, adminUser);

      alert("Login berhasil!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login gagal. Cek username/password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 to-green-900 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* LEFT SECTION */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-green-700 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Warteg Digital
          </h2>
          <p className="text-sm leading-relaxed opacity-90">
            Admin panel khusus untuk mengelola menu, transaksi,
            dan operasional sistem Warteg Digital.
          </p>
          <div className="mt-6 text-xs opacity-80">
            © {new Date().getFullYear()} Warteg Digital
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Admin Login
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Masuk menggunakan akun admin
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="adminwarteg"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 transition text-white py-2.5 rounded-lg font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
