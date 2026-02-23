import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

const SuccessPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const paymentMethod =
    state?.paymentMethod ??
    (() => {
      try {
        return JSON.parse(localStorage.getItem("paymentMethod") || '"cash"');
      } catch {
        return "cash";
      }
    })();

  useEffect(() => {
    localStorage.removeItem("paymentMethod");
  }, []);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <section className="w-full max-w-xl rounded-3xl border border-amber-100 bg-white/90 p-8 text-center shadow-[0_10px_35px_rgba(90,58,26,0.12)]">
        <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h1 className="mt-5 font-display text-4xl text-amber-950">Pesanan Berhasil</h1>
        <p className="mt-3 text-sm leading-relaxed text-amber-900/75 md:text-base">
          {paymentMethod === "cash"
            ? "Silakan lakukan pembayaran di kasir. Setelah konfirmasi, pesanan langsung kami proses ke dapur."
            : "Pembayaran berhasil diterima. Terima kasih, pesanan Anda sedang disiapkan di dapur."}
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-emerald-700 hover:to-emerald-500"
        >
          Kembali ke Menu
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </div>
  );
};

export default SuccessPage;
