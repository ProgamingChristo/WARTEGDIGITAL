import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAdminAuthStore } from "../../store/adminAuthStore";

const getInitials = (name?: string) => {
  const source = (name || "AD").trim();
  if (!source) return "AD";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("");
};

const AdminTopbar = () => {
  const navigate = useNavigate();
  const { adminUser, adminLogout } = useAdminAuthStore();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login", { replace: true });
  };

  const displayName = adminUser?.fullName?.trim() || adminUser?.username || "Admin";

  return (
    <header className="sticky top-0 z-30 border-b border-[#d8dfea] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#627084]">Control Center</p>
          <p className="font-display text-2xl text-[#142235]">Warteg Digital</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-[#d9e0ea] bg-white px-3 py-2 text-sm font-semibold text-[#233752] transition hover:bg-[#f2f6fb]"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#d4deeb] bg-gradient-to-br from-[#1a3d7d] to-[#2f6cc8] text-xs font-bold text-white">
              {adminUser?.profileImage ? (
                <img src={adminUser.profileImage} alt="Admin profile" className="h-full w-full object-cover" />
              ) : (
                getInitials(displayName)
              )}
            </span>
            <span className="max-w-40 truncate">{displayName}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-[#f0d5d5] bg-[#fdf1f1] px-3 py-2 text-sm font-semibold text-[#a23d3d] transition hover:bg-[#fae6e6]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
