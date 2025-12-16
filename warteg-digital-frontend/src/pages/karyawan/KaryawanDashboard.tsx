import { useNavigate } from "react-router-dom";

const KaryawanDashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("karyawanRole");

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard Karyawan</h1>

      {role === "kasir" && (
        <button onClick={() => navigate("/karyawan/kasir")}>
          Masuk Halaman Kasir
        </button>
      )}

      {role === "dapur" && (
        <button onClick={() => navigate("/karyawan/kitchen")}>
          Masuk Halaman Dapur
        </button>
      )}
    </div>
  );
};

export default KaryawanDashboard;
