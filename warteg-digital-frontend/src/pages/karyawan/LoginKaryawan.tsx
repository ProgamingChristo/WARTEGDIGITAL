
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosKaryawan from "../../api/axioskaryawan";
import { FiLogIn, FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const LoginKaryawan = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return alert("Lengkapi username & password");
    setLoading(true);

    try {
      const res = await axiosKaryawan.post("/karyawan/login", { username, password });
      const { token, data } = res.data;
      localStorage.setItem("tokenKaryawan", token);
      localStorage.setItem("karyawanRole", data.position); // "kasir" | "dapur"
      navigate(data.position === "kasir" ? "/karyawan/kasir" : "/karyawan/kitchen", { replace: true });
    } catch {
      alert("Username / password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-3 shadow-lg">
            <FiLogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-emerald-800">Login Karyawan</h1>
          <p className="text-sm text-gray-500 mt-1">Masuk untuk mulai bekerja</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPwd ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 active:scale-95 disabled:opacity-60 transition shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memuat...</span>
              </>
            ) : (
              <>
                <FiLogIn />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400">
          Lupa akun? Hubungi admin.
        </p>
      </div>
    </div>
  );
};

export default LoginKaryawan;
