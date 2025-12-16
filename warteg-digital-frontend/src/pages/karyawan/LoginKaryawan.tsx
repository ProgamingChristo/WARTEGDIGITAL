import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginKaryawan = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/karyawan/login",
        { username, password }
      );

      const { token, data } = res.data;
      const role = data.position; // "kasir" | "dapur"

      if (role === "kasir") {
        localStorage.setItem("tokenKasir", token);
        navigate("/karyawan/kasir", { replace: true });
      } else if (role === "dapur") {
        localStorage.setItem("tokenDapur", token);
        navigate("/karyawan/dapur", { replace: true });
      } else {
        alert("Role tidak dikenali");
      }
    } catch {
      alert("Login gagal");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
};

export default LoginKaryawan;
