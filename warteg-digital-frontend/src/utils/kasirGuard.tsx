import { Navigate } from "react-router-dom";

const KasirGuard = ({ children }: { children: React.ReactNode}) => {
  const token = localStorage.getItem("tokenKasir");
  if (!token) return <Navigate to="/karyawan/login" replace />;
  return children;
};

export default KasirGuard;
