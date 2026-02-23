import type { MenuType } from "../utils/types";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Plus, UtensilsCrossed, Coffee } from "lucide-react";
import { formatRupiah } from "../utils/helpers";

const normalizeCategory = (value?: string) => {
  const category = (value ?? "").toLowerCase();
  if (category.includes("minum")) return "minuman";
  if (category.includes("makan")) return "makanan";
  if (category.includes("lain")) return "lainnya";
  return "lainnya";
};

const MenuCard = ({ menu }: { menu: MenuType }) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();

  const category = normalizeCategory(menu.category);
  const stock = Number(menu.stock ?? 0);
  const isOrderable = Boolean(menu.available) && stock > 0;

  const handleAdd = async () => {
    if (!token) {
      alert("Harus login dulu!");
      navigate("/login");
      return;
    }

    if (!isOrderable) {
      alert("Menu sedang habis.");
      return;
    }

    try {
      await addToCart(menu);
      alert("Berhasil ditambahkan ke keranjang!");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Gagal menambahkan ke keranjang.");
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-amber-100 bg-white/90 shadow-[0_8px_25px_rgba(90,58,26,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(90,58,26,0.14)]">
      <div className="relative">
        <img
          src={menu.imageUrl || "https://via.placeholder.com/400x300?text=Menu+Warteg"}
          alt={menu.name}
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
          {category === "minuman" ? <Coffee className="h-3.5 w-3.5" /> : <UtensilsCrossed className="h-3.5 w-3.5" />}
          {category}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 font-display text-xl text-amber-950">{menu.name}</h3>
          <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-amber-900/70">
            {menu.description?.trim() || "Masakan khas Indonesia dengan cita rasa rumahan otentik."}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-extrabold text-emerald-800">{formatRupiah(menu.price)}</p>
            <p className={`text-xs font-semibold ${isOrderable ? "text-emerald-700" : "text-rose-600"}`}>
              {isOrderable ? `Stock: ${stock}` : "Stock habis"}
            </p>
          </div>
          <button
            onClick={handleAdd}
            disabled={!isOrderable}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:from-emerald-700 hover:to-emerald-500 disabled:cursor-not-allowed disabled:from-slate-500 disabled:to-slate-400"
          >
            <Plus className="h-4 w-4" />
            {isOrderable ? "Tambah" : "Habis"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default MenuCard;
