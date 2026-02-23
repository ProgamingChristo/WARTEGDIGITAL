import { useEffect, useMemo } from "react";
import { useOrderStore } from "../../store/orderStore";
import { formatRupiah } from "../../utils/helpers";
import { Link } from "react-router-dom";

const statusMap: Record<string, { label: string; className: string }> = {
  paid: { label: "Sudah Bayar", className: "bg-emerald-100 text-emerald-800" },
  unpaid: { label: "Belum Bayar", className: "bg-rose-100 text-rose-700" },
  processing: { label: "Diproses", className: "bg-amber-100 text-amber-800" },
};

const OrderHistoryPage = () => {
  const { orders, loading, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [orders]);

  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-amber-100 bg-white/80 p-6 shadow-sm md:p-8">
        <h1 className="font-display text-4xl text-amber-950">Riwayat Pesanan</h1>
        <p className="mt-1 text-sm text-amber-900/70">Pantau semua transaksi dan status pesanan Anda.</p>
      </header>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={`history-skeleton-${idx}`} className="h-24 animate-pulse rounded-2xl border border-amber-100 bg-white/70" />
          ))}
        </div>
      ) : sortedOrders.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-amber-300 bg-white/75 p-12 text-center">
          <p className="font-display text-3xl text-amber-900">Belum ada pesanan</p>
          <p className="mt-2 text-sm text-amber-900/70">Mulai pilih menu favoritmu sekarang.</p>
          <Link
            to="/"
            className="mt-5 inline-flex rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Pesan Sekarang
          </Link>
        </section>
      ) : (
        <section className="space-y-3">
          {sortedOrders.map((order, idx) => {
            const status = statusMap[order.paymentStatus] ?? {
              label: order.paymentStatus,
              className: "bg-slate-100 text-slate-700",
            };

            return (
              <Link
                key={order._id || `order-${idx}`}
                to={`/order/${order._id}`}
                className="block rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-[0_8px_20px_rgba(90,58,26,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(90,58,26,0.12)]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      {new Date(order.createdAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="mt-1 text-xs text-amber-900/70">{order.items.length} item</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${status.className}`}>
                      {status.label}
                    </span>
                    <p className="text-base font-extrabold text-emerald-800">{formatRupiah(order.totalPrice)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default OrderHistoryPage;
