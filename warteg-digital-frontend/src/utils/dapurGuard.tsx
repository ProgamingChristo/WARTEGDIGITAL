import { Navigate } from "react-router-dom";

const DapurGuard = ({ children }: { children: React.ReactNode }) => {
  const token =
    localStorage.getItem("tokenKaryawan") ??
    localStorage.getItem("tokenDapur");
  const role = localStorage.getItem("karyawanRole");

  if (!token || role !== "dapur") {
    return <Navigate to="/karyawan/login" replace />;
  }

  return children;
};

export default DapurGuard;
