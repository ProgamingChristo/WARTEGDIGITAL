import { NavLink, Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";

const mobileLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/menu", label: "Menu" },
  { to: "/admin/karyawan", label: "Karyawan" },
  { to: "/admin/order", label: "Order" },
  { to: "/admin/profile", label: "Profil" },
];

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#f2f6fb] text-[#142235]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-120px] top-[-140px] h-80 w-80 rounded-full bg-[#a9c4e9]/40 blur-3xl" />
        <div className="absolute right-[-80px] bottom-[-120px] h-72 w-72 rounded-full bg-[#b8ddcf]/50 blur-3xl" />
      </div>

      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="flex-1">
          <AdminTopbar />

          <nav className="border-b border-[#d7deea] bg-white px-4 py-2 xl:hidden">
            <div className="flex flex-wrap gap-2">
              {mobileLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                      isActive
                        ? "bg-[#1f5fa8] text-white"
                        : "border border-[#d7deea] bg-white text-[#2a3d59]"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </nav>

          <main className="mx-auto max-w-[1400px] p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
