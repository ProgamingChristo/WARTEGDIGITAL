import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // baca state dulu, kalau kosong ambil dari localStorage
  const paymentMethod =
    state?.paymentMethod ??
    (() => {
      try {
        return JSON.parse(localStorage.getItem("paymentMethod") || '"cash"');
      } catch {
        return "cash";
      }
    })();

  // bersihkan localStorage setelah dibaca
  useEffect(() => {
    localStorage.removeItem("paymentMethod");
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow p-6 text-center">
        {/* Icon centang */}
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-gray-800 mb-2">Pesanan berhasil!</h1>

        <p className="text-gray-600 mb-6">
          {paymentMethod === "cash"
            ? "Silakan lakukan pembayaran di kasir. Kami akan segera menyajikan pesanan Anda setelah pembayaran dikonfirmasi."
            : "Terima kasih sudah bayar, silahkan tunggu makanan Anda."}
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow hover:shadow-lg transition"
        >
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;