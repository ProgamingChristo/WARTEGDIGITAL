import { NavLink, useNavigate } from "react-router-dom";
import { FileText, LayoutDashboard, LogOut, UserRoundCog, Users, UtensilsCrossed } from "lucide-react";
import { useAdminAuthStore } from "../../store/adminAuthStore";

const sidebarLinks = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/menu", label: "Kelola Menu", icon: UtensilsCrossed },
  { path: "/admin/karyawan", label: "Kelola Karyawan", icon: Users },
  { path: "/admin/order", label: "Laporan Order", icon: FileText },
  { path: "/admin/profile", label: "Profil Admin", icon: UserRoundCog },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { adminLogout } = useAdminAuthStore();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="hidden w-72 border-r border-[#d8dfea] bg-[#0f1725] text-white xl:flex xl:flex-col">
      <div className="border-b border-[#253147] px-6 py-6">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8aa4cc]">Warteg Digital</p>
        <p className="mt-2 font-display text-3xl text-white">Admin</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#1f5fa8] text-white shadow-[0_8px_18px_rgba(31,95,168,0.35)]"
                    : "text-[#cad5e8] hover:bg-[#1f293a] hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-[#253147] p-3">
        <button
          onClick={handleLogout}
          className="inline-flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#ffcece] transition hover:bg-[#35202a]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
