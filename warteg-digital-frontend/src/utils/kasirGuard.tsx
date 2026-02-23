import { Navigate } from "react-router-dom";

const KasirGuard = ({ children }: { children: React.ReactNode}) => {
  const token =
    localStorage.getItem("tokenKaryawan") ??
    localStorage.getItem("tokenKasir");
  const role = localStorage.getItem("karyawanRole");

  if (!token || role !== "kasir") {
    return <Navigate to="/karyawan/login" replace />;
  }

  return children;
};

export default KasirGuard;
