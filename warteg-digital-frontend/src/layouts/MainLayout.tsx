import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--wd-ivory)] text-[var(--wd-deep)]">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-70">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-emerald-100/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-amber-100/35 to-transparent" />
      </div>

      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
