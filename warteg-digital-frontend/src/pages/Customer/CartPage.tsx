import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { formatRupiah } from "../../utils/helpers";
import { ArrowLeft, Plus, Minus, Trash2, CookingPot, NotebookText } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, total, loading, fetchCart, updateCartItem, deleteCartItem } = useCartStore();
  const [foodNote, setFoodNote] = useState(() => localStorage.getItem("foodNote") ?? "");

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    localStorage.setItem("foodNote", foodNote);
  }, [foodNote]);

  const safeItems = useMemo(() => items.filter((it) => Boolean(it.menu?._id)), [items]);
  const totalQty = safeItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white/80 p-4 shadow-sm md:p-5">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-900 transition hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="font-display text-2xl text-amber-950">Keranjang Belanja</p>
            <p className="text-xs uppercase tracking-[0.16em] text-amber-700">Siap diproses ke dapur</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          <CookingPot className="h-3.5 w-3.5" />
          {totalQty} item
        </span>
      </header>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={`cart-skeleton-${idx}`} className="h-28 animate-pulse rounded-2xl border border-amber-100 bg-white/70" />
          ))}
        </div>
      ) : safeItems.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-amber-300 bg-white/75 p-12 text-center">
          <p className="font-display text-3xl text-amber-900">Keranjang masih kosong</p>
          <p className="mt-2 text-sm text-amber-900/70">Pilih menu dulu, lalu kembali checkout dari sini.</p>
          <Link
            to="/"
            className="mt-5 inline-flex rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Jelajahi Menu
          </Link>
        </section>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.65fr_1fr]">
          <section className="space-y-4">
            {safeItems.map((item) => (
              <article
                key={item.menu._id}
                className="rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-[0_8px_20px_rgba(90,58,26,0.08)]"
              >
                <div className="flex gap-4">
                  <img
                    src={item.menu.imageUrl || "https://via.placeholder.com/240x180?text=Menu"}
                    alt={item.menu.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-xl text-amber-950">{item.menu.name}</p>
                    <p className="line-clamp-2 text-xs text-amber-900/70">
                      {item.menu.description?.trim() || "Masakan tradisional dengan sentuhan modern."}
                    </p>
                    <p className="mt-2 text-sm font-bold text-emerald-800">{formatRupiah(item.menu.price * item.qty)}</p>
                    <p className="mt-1 text-xs font-medium text-amber-900/70">
                      Stock tersedia: {Number(item.menu.stock ?? 0)}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-2 py-1">
                        <button
                          onClick={() => updateCartItem(item.menu._id, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-amber-900 transition hover:bg-amber-100 disabled:opacity-40"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-bold text-amber-950">{item.qty}</span>
                        <button
                          onClick={() => {
                            const stock = Number(item.menu.stock ?? 0);
                            if (stock > 0 && item.qty >= stock) {
                              alert(`Stock maksimal ${stock} untuk ${item.menu.name}.`);
                              return;
                            }
                            updateCartItem(item.menu._id, item.qty + 1);
                          }}
                          disabled={Number(item.menu.stock ?? 0) > 0 && item.qty >= Number(item.menu.stock ?? 0)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-amber-900 transition hover:bg-amber-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => deleteCartItem(item.menu._id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            <section className="rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
              <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-amber-900">
                <NotebookText className="h-4 w-4" />
                Catatan Makanan
              </p>
              <textarea
                value={foodNote}
                onChange={(e) => setFoodNote(e.target.value)}
                rows={4}
                placeholder="Contoh: jangan pedas, sambal dipisah, tambah kuah..."
                className="w-full resize-none rounded-xl border border-amber-200 bg-[#fffdf8] px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </section>
          </section>

          <aside className="h-fit rounded-2xl border border-amber-100 bg-white/90 p-5 shadow-[0_8px_20px_rgba(90,58,26,0.08)] lg:sticky lg:top-24">
            <p className="font-display text-2xl text-amber-950">Ringkasan</p>

            <div className="mt-4 space-y-2 text-sm text-amber-900/80">
              <div className="flex items-center justify-between">
                <span>Total Item</span>
                <span className="font-semibold text-amber-950">{totalQty} pcs</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Ongkir</span>
                <span className="font-semibold text-emerald-700">Gratis</span>
              </div>
              <div className="mt-3 border-t border-amber-100 pt-3">
                <div className="flex items-center justify-between text-base font-bold text-amber-950">
                  <span>Total Bayar</span>
                  <span className="text-emerald-800">{formatRupiah(total)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout", { state: { foodNote: foodNote.trim() } })}
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-emerald-700 hover:to-emerald-500"
            >
              Lanjut Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;
