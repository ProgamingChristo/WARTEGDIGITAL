import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { formatRupiah } from "../../utils/helpers";
import loadSnap from "../../utils/snapLoader";
import api from "../../api/axios";
import { CreditCard, HandCoins, ReceiptText } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, total } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "midtrans">("cash");
  const [loading, setLoading] = useState(false);
  const [foodNote] = useState(() => {
    const state = location.state as { foodNote?: string } | null;
    return state?.foodNote ?? localStorage.getItem("foodNote") ?? "";
  });

  useEffect(() => {
    if (items.length === 0) navigate("/cart");
  }, [items, navigate]);

  const goSuccess = (pm: "cash" | "midtrans") => {
    localStorage.setItem("paymentMethod", JSON.stringify(pm));
    localStorage.removeItem("foodNote");
    navigate("/success", { state: { paymentMethod: pm } });
  };

  const handlePay = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await api.post("/cart/checkout", {
        paymentMethod,
        items: items
          .filter((i) => Boolean(i.menu?._id))
          .map((i) => ({
            menuId: i.menu._id,
            qty: i.qty,
          })),
        foodNote: foodNote.trim(),
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
      alert((err as any)?.response?.data?.message || "Checkout gagal.");
    } finally {
      setLoading(false);
    }
  };

  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
      <section className="rounded-2xl border border-amber-100 bg-white/90 p-5 shadow-[0_8px_25px_rgba(90,58,26,0.08)] md:p-6">
        <h1 className="font-display text-3xl text-amber-950">Checkout Pesanan</h1>
        <p className="mt-1 text-sm text-amber-900/70">Periksa detail pesanan sebelum pembayaran.</p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-amber-100">
          {items.map((item, idx) => (
            <div
              key={item.menu?._id || `checkout-item-${idx}`}
              className="flex items-start justify-between gap-4 border-b border-amber-100 bg-white px-4 py-3 last:border-b-0"
            >
              <div>
                <p className="font-semibold text-amber-950">{item.menu?.name || "Menu tidak tersedia"}</p>
                <p className="text-xs text-amber-900/70">{item.qty} x {formatRupiah(item.menu?.price || 0)}</p>
              </div>
              <p className="font-bold text-emerald-800">{formatRupiah((item.menu?.price || 0) * item.qty)}</p>
            </div>
          ))}
        </div>

        {foodNote.trim() && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900">
              <ReceiptText className="h-4 w-4" />
              Catatan Makanan
            </p>
            <p className="mt-1 text-sm text-amber-900/80">{foodNote.trim()}</p>
          </div>
        )}
      </section>

      <aside className="h-fit rounded-2xl border border-amber-100 bg-white/90 p-5 shadow-[0_8px_25px_rgba(90,58,26,0.08)] lg:sticky lg:top-24">
        <p className="font-display text-2xl text-amber-950">Pembayaran</p>

        <div className="mt-4 space-y-2 text-sm text-amber-900/80">
          <div className="flex items-center justify-between">
            <span>Total Item</span>
            <span className="font-semibold text-amber-950">{totalQty}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Harga</span>
            <span className="font-bold text-emerald-800">{formatRupiah(total)}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm transition ${
              paymentMethod === "cash" ? "border-emerald-500 bg-emerald-50" : "border-amber-200 bg-white hover:border-emerald-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            <HandCoins className="h-4 w-4 text-emerald-800" />
            Bayar di Kasir
          </label>

          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm transition ${
              paymentMethod === "midtrans"
                ? "border-emerald-500 bg-emerald-50"
                : "border-amber-200 bg-white hover:border-emerald-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "midtrans"}
              onChange={() => setPaymentMethod("midtrans")}
            />
            <CreditCard className="h-4 w-4 text-emerald-800" />
            Midtrans (QRIS / E-wallet)
          </label>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-emerald-700 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Memproses..." : "Bayar Sekarang"}
        </button>
      </aside>
    </div>
  );
};

export default CheckoutPage;
