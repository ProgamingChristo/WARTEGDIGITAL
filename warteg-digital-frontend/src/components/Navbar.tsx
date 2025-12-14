import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useEffect } from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const { token, user, logout } = useAuthStore();
  const { items = [], fetchCart } = useCartStore(); // ⬅️ DEFAULT [] AGAR AMAN

  // Auto fetch cart ketika login
  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-green-700 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-10" />
          <span className="text-white font-bold text-lg">Warteg Digital</span>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {/* -------------------------------- */}
          {/*       LINK RIWAYAT PESANAN       */}
          {/* -------------------------------- */}
          <Link
            to="/order/history"
            className="text-white hover:opacity-80 transition"
          >
            Riwayat
          </Link>

          {/* -------------------------------- */}
          {/*             CART BUTTON          */}
          {/* -------------------------------- */}
          <Link to="/cart" className="relative">
            <span className="bg-yellow-400 px-3 py-1 rounded-lg font-semibold">
              🛒 Cart
            </span>

            {items.length > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-red-600 text-white text-xs 
                  rounded-full w-5 h-5 flex items-center justify-center"
              >
                {items.length}
              </span>
            )}
          </Link>

          {/* -------------------------------- */}
          {/*         AUTH LOGIN / LOGOUT      */}
          {/* -------------------------------- */}
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-white border px-3 py-1 rounded-lg hover:bg-white hover:text-green-700 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-white border px-3 py-1 rounded-lg hover:bg-white hover:text-green-700 transition"
              >
                Daftar
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
            >
              Logout ({user?.username})
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
