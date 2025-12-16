import { Navigate } from "react-router-dom";

const DapurGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("tokenDapur");
  if (!token) return <Navigate to="/karyawan/login" replace />;
  return children;
};

export default DapurGuard;
