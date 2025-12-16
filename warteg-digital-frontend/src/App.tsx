import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

/* ================= LAYOUT ================= */
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

/* ================= CUSTOMER ================= */
import MenuPage from "./pages/Customer/MenuPage";
import LoginCustomer from "./pages/auth/LoginCustomer";
import RegisterCustomer from "./pages/auth/RegisterCustomer";
import CartPage from "./pages/Customer/CartPage";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import SuccessPage from "./pages/Checkout/SuccessPage";
import OrderHistoryPage from "./pages/Order/OrderHistoryPage";
import OrderDetailPage from "./pages/Customer/OrderDetailPage";

/* ================= ADMIN ================= */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMenuPage from "./pages/admin/menu/AdminMenuPage";
import AdminOrderPage from "./pages/admin/order/AdminOrderPage";
import AdminKaryawanPage from "./components/admin/karyawan/AdminKaryawanPage";
import AdminGuard from "./utils/adminGuard";

/* ================= KARYAWAN (PHASE 6 – FIX) ================= */
import LoginKaryawan from "./pages/karyawan/LoginKaryawan";
import KasirOrderPage from "./pages/karyawan/kasir/KasirPage";
import KitchenOrderPage from "./pages/karyawan/dapur/KitchenPage";
import KasirGuard from "./utils/kasirGuard";
import DapurGuard from "./utils/dapurGuard";

const App = () => {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            CUSTOMER AREA
        ================================================= */}
        <Route element={<MainLayout key={token ?? "guest"} />}>
          <Route path="/" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/order/history" element={<OrderHistoryPage />} />
          <Route path="/order/:orderId" element={<OrderDetailPage />} />
        </Route>

        {/* CUSTOMER AUTH */}
        <Route path="/login" element={<LoginCustomer />} />
        <Route path="/register" element={<RegisterCustomer />} />

        {/* =================================================
            ADMIN
        ================================================= */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="menu" element={<AdminMenuPage />} />
          <Route path="karyawan" element={<AdminKaryawanPage />} />
          <Route path="order" element={<AdminOrderPage />} />
        </Route>

        {/* =================================================
            KARYAWAN (PHASE 6 – FINAL)
        ================================================= */}
        <Route path="/karyawan/login" element={<LoginKaryawan />} />

        {/* Kasir hanya bisa akses halaman kasir */}
        <Route
          path="/karyawan/kasir"
          element={
            <KasirGuard>
              <KasirOrderPage />
            </KasirGuard>
          }
        />

        {/* Dapur hanya bisa akses halaman dapur */}
        <Route
          path="/karyawan/kitchen"
          element={
            <DapurGuard>
              <KitchenOrderPage />
            </DapurGuard>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
