import { Navigate } from "react-router-dom";
import { useSuperadminAuthStore } from "../store/superadminAuthStore";

const SuperadminGuard = ({ children }: { children: React.ReactNode }) => {
  const token = useSuperadminAuthStore((s) => s.token);
  if (!token) return <Navigate to="/superadmin/login" replace />;
  return children;
};

export default SuperadminGuard;
