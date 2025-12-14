import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { formatRupiah } from "../../utils/helpers";
import loadSnap from "../../utils/snapLoader";
import api from "../../api/axios";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "midtrans">("cash");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) navigate("/cart");
  }, [items]);

  const goSuccess = (pm: "cash" | "midtrans") => {
    localStorage.setItem("paymentMethod", JSON.stringify(pm));
    navigate("/success", { state: { paymentMethod: pm } });
  };

  const handlePay = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await api.post("/cart/checkout", {
        paymentMethod,
        items: items.map((i) => ({
          menuId: i.menu._id,
          qty: i.qty,
        })),
      });

      if (paymentMethod === "midtrans") {
        const { snapToken } = res.data;
        await loadSnap();
        window.snap.pay(snapToken, {
          onSuccess: () => goSuccess("midtrans"),
          onPending: () => goSuccess("midtrans"),
          onError: () => alert("Pembayaran gagal."),
        });
      } else {
        alert("Pesanan berhasil! Silakan bayar di kasir.");
        goSuccess("cash");
      }
    } catch (err) {
      console.error(err);
      alert("Checkout gagal.");
    } finally {
      setLoading(false);
    }
  };

  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow">
        <h1 className="text-xl font-bold text-gray-800 text-center mb-6">
          Checkout Pesanan
        </h1>

        {/* RINGKASAN PESANAN */}
        <div className="border rounded-xl p-4 bg-white shadow-sm">
          {items.map((it) => (
            <div key={it.menu._id} className="flex justify-between py-2 border-b last:border-none">
              <span>{it.menu.name} x {it.qty}</span>
              <span className="font-semibold">{formatRupiah(it.menu.price * it.qty)}</span>
            </div>
          ))}

          <div className="flex justify-between mt-3 font-bold text-orange-600 text-lg">
            <span>Total</span>
            <span>{formatRupiah(total)}</span>
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div className="mt-6">
          <h2 className="font-semibold text-gray-700 mb-2">Metode Pembayaran</h2>

          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              <span className="font-medium">Bayar di Kasir</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "midtrans"}
                onChange={() => setPaymentMethod("midtrans")}
              />
              <span className="font-medium">Midtrans (QRIS / E-wallet)</span>
            </label>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full mt-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 
                     text-white font-bold rounded-xl shadow-lg hover:shadow-xl 
                     transition active:scale-95 disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Bayar Sekarang"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-3">
          Total {totalQty} item • {formatRupiah(total)}
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;