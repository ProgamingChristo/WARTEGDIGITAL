import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  Users,
  FileText,
  LogOut,
} from "lucide-react";

const SidebarAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("tokenAdmin");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminRole");
    navigate("/admin/login", { replace: true });
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/admin/menu",
      label: "Kelola Menu",
      icon: <Utensils size={20} />,
    },
    {
      path: "/admin/karyawan",
      label: "Kelola Karyawan",
      icon: <Users size={20} />,
    },
    {
      path: "/admin/order", // ✅ laporan keuangan / order
      label: "Laporan Order",
      icon: <FileText size={20} />,
    },
  ];

  return (
    <aside className="w-64 bg-green-700 text-white min-h-screen shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 text-xl font-bold border-b border-green-900">
        Admin Panel
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 px-3 flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition
              ${
                isActive
                  ? "bg-green-900 text-white"
                  : "hover:bg-green-800"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer – Logout */}
      <div className="p-3 border-t border-green-900">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-800 transition text-left"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
