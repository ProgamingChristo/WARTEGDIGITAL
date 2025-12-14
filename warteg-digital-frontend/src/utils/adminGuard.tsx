
import { Navigate } from "react-router-dom";
import { useAdminAuthStore } from "../store/adminAuthStore";
import type { ReactNode } from "react";

interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const tokenAdmin = useAdminAuthStore((s) => s.tokenAdmin); // <-- nama benar

  if (!tokenAdmin) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
};

export default AdminGuard;
