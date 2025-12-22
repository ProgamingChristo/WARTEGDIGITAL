
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosSuperadmin from "../../api/axiosSuperadmin";
import { useSuperadminAuthStore } from "../../store/superadminAuthStore";

const LoginSuperadmin = () => {
  const navigate = useNavigate();
  const login = useSuperadminAuthStore((s) => s.login);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosSuperadmin.post("/superadmin/login", form);
      login(res.data.token, res.data.data);
      alert(`Selamat datang ${res.data.data.fullName}`);
      navigate("/superadmin/dashboard");
    } catch {
      alert("Login superadmin gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-emerald-50">
      <div className="w-full max-w-sm">
        {/* card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 space-y-5
                     transition-all hover:shadow-xl"
        >
          <h1 className="text-2xl font-bold text-emerald-800 text-center">
            Superadmin Login
          </h1>

          {/* email */}
          <div className="relative">
            <input
              type="email"
              required
              placeholder=" "
              className="peer w-full px-4 py-3 rounded-lg border border-emerald-200
                         bg-emerald-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <label className="absolute left-4 -top-2.5 text-xs text-emerald-700
                             transition-all peer-placeholder-shown:top-3.5
                             peer-placeholder-shown:text-base peer-focus:-top-2.5
                             peer-focus:text-xs">
              Email
            </label>
          </div>

          {/* password */}
          <div className="relative">
            <input
              type="password"
              required
              placeholder=" "
              className="peer w-full px-4 py-3 rounded-lg border border-emerald-200
                         bg-emerald-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <label className="absolute left-4 -top-2.5 text-xs text-emerald-700
                             transition-all peer-placeholder-shown:top-3.5
                             peer-placeholder-shown:text-base peer-focus:-top-2.5
                             peer-focus:text-xs">
              Password
            </label>
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold
                       hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>

        {/* footer accent */}
        <div className="mt-4 h-1 bg-emerald-600 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default LoginSuperadmin;
