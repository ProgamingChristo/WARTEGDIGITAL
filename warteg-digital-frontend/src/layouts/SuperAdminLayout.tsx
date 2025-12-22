import { Outlet, useNavigate } from "react-router-dom";
import { useSuperadminAuthStore } from "../store/superadminAuthStore";

const SuperAdminLayout = () => {
  const logout = useSuperadminAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4 flex justify-between">
        <span>Superadmin Panel</span>
        <button
          onClick={() => {
            logout();
            navigate("/superadmin/login");
          }}
        >
          Logout
        </button>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;
