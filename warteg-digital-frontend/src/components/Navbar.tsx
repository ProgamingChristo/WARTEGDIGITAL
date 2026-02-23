import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useEffect, useMemo, useRef, useState } from "react";
import logo from "../assets/logo.png";
import { ShoppingBag, Clock3, LogIn, UserPlus, LogOut, UserRoundCog, ChevronDown } from "lucide-react";

const getInitials = (name?: string) => {
  const source = (name || "CU").trim();
  if (!source) return "CU";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const Navbar = () => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { token, user, logout } = useAuthStore();
  const { items = [], fetchCart } = useCartStore();
  const displayName = useMemo(
    () => user?.username ?? user?.name ?? "Customer",
    [user?.name, user?.username]
  );
  const initials = useMemo(() => getInitials(displayName), [displayName]);

  useEffect(() => {
    if (token) fetchCart();
  }, [token, fetchCart]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-amber-100/70 bg-[rgba(251,246,237,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-emerald-800 to-emerald-600 shadow-md">
            <img src={logo} alt="logo warteg digital" className="h-9 w-9 rounded-md object-cover" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-xl tracking-wide text-emerald-900">Warteg Digital</p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-amber-700">Rasa Tradisi Nusantara</p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <Link
            to="/order/history"
            className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white/80 px-3 py-2 text-sm font-medium text-amber-900 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Clock3 className="h-4 w-4" />
            Riwayat
          </Link>

          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-800"
          >
            <ShoppingBag className="h-4 w-4" />
            Keranjang
            {items.length > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-amber-950">
                {items.length}
              </span>
            )}
          </Link>

          {!token ? (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-800 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <UserPlus className="h-4 w-4" />
                Daftar
              </Link>
            </>
          ) : (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-2.5 py-1.5 text-sm font-medium text-amber-900 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-gradient-to-br from-emerald-800 to-emerald-600 text-xs font-bold text-white">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Foto profil customer" className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </span>
                <span className="max-w-28 truncate text-left leading-tight">{displayName}</span>
                <ChevronDown className="h-4 w-4 text-amber-700" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-amber-100 bg-white p-2 shadow-[0_12px_28px_rgba(90,58,26,0.16)]">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-50"
                  >
                    <UserRoundCog className="h-4 w-4 text-emerald-700" />
                    Edit Profil
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
