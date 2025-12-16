import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  allow?: "kasir" | "dapur";
}

const KaryawanGuard = ({ children, allow }: Props) => {
  const token = localStorage.getItem("tokenKaryawan");
  const role = localStorage.getItem("karyawanRole");

  if (!token) {
    return <Navigate to="/karyawan/login" replace />;
  }

  if (allow && role !== allow) {
    return <Navigate to="/karyawan/login" replace />;
  }

  return children;
};

export default KaryawanGuard;
