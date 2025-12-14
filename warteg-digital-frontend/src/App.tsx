import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import MainLayout from "./layouts/MainLayout";

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
import AdminGuard from "./utils/adminGuard";
import AdminLayout from "./layouts/AdminLayout";

const App = () => {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= CUSTOMER AREA ================= */}
        <Route element={<MainLayout key={token ?? "guest"} />}>
          <Route path="/" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/order/history" element={<OrderHistoryPage />} />
          <Route path="/order/:orderId" element={<OrderDetailPage />} />
        </Route>

        {/* ================= CUSTOMER AUTH ================= */}
        <Route path="/login" element={<LoginCustomer />} />
        <Route path="/register" element={<RegisterCustomer />} />

        {/* ================= ADMIN AUTH ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ================= ADMIN AREA ================= */}
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
          {/* future routes nanti nyusul */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
