import { useMenuStore } from "../../store/menuStore";
import { useEffect, useMemo, useState } from "react";
import MenuCard from "../../components/MenuCard";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

const normalizeCategory = (value?: string): "makanan" | "minuman" | "lainnya" => {
  const category = (value ?? "").toLowerCase();
  if (category.includes("minum")) return "minuman";
  if (category.includes("makan")) return "makanan";
  if (category.includes("lain")) return "lainnya";
  return "lainnya";
};

const categoryLabels: Record<"all" | "makanan" | "minuman" | "lainnya", string> = {
  all: "Semua",
  makanan: "Makanan",
  minuman: "Minuman",
  lainnya: "Lainnya",
};

const baseCategories = ["makanan", "minuman", "lainnya"] as const;

const MenuPage = () => {
  const { menus, loading, fetchMenus } = useMenuStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | "makanan" | "minuman" | "lainnya">("all");

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const normalizedMenus = useMemo(() => {
    return menus.map((menu) => ({
      ...menu,
      category: normalizeCategory(menu.category),
    }));
  }, [menus]);

  const availableCategories = useMemo(() => {
    const found = new Set(normalizedMenus.map((m) => normalizeCategory(m.category)));
    return ["all", ...baseCategories.filter((cat) => found.has(cat))] as Array<
      "all" | "makanan" | "minuman" | "lainnya"
    >;
  }, [normalizedMenus]);

  const filteredMenus = useMemo(() => {
    return normalizedMenus.filter((menu) => {
      const matchSearch = menu.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || normalizeCategory(menu.category) === category;
      return matchSearch && matchCategory;
    });
  }, [normalizedMenus, search, category]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-[#fbf2e4] via-[#f6ead8] to-[#efe0cc] p-6 shadow-xl shadow-amber-900/5 md:p-10">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-52 w-52 rounded-full bg-amber-300/30 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            <Sparkles className="h-3.5 w-3.5" />
            Warteg Rasa Tradisi
          </p>
          <h1 className="font-display text-4xl leading-tight text-amber-950 md:text-6xl">
            Sajian Indonesia,
            <span className="block text-emerald-800">Sentuhan Digital Mewah</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-amber-950/75 md:text-base">
            Pilih makanan dan minuman favoritmu dengan pengalaman belanja yang rapi, cepat, dan tetap terasa hangat seperti warteg langganan.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-white/85 p-4 shadow-lg shadow-amber-900/5 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700/70" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari menu favoritmu..."
              className="w-full rounded-xl border border-amber-200 bg-[#fffdf8] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filter
            </span>
            {availableCategories.map((cat) => (
              <button
                key={`cat-${cat}`}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition ${
                  category === cat
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-amber-200 bg-white text-amber-900 hover:border-emerald-300 hover:text-emerald-800"
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={`skeleton-${idx}`} className="h-80 animate-pulse rounded-2xl border border-amber-100 bg-white/70" />
            ))}
          </div>
        ) : filteredMenus.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMenus.map((menu, idx) => (
              <MenuCard key={menu._id || `menu-${menu.name}-${idx}`} menu={menu} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-amber-300 bg-white/70 px-6 py-16 text-center">
            <p className="font-display text-3xl text-amber-900">Menu tidak ditemukan</p>
            <p className="mt-2 text-sm text-amber-900/70">Coba kata kunci lain atau ubah filter kategori.</p>
          </div>
        )}
      </section>

      <section className="grid gap-3 rounded-2xl border border-amber-100 bg-white/80 p-5 text-sm text-amber-900/80 md:grid-cols-3">
        <div className="rounded-xl bg-amber-50 p-4">
          <p className="mb-1 font-semibold text-amber-900">Cita Rasa Rumah</p>
          <p>Bumbu otentik khas dapur Indonesia, disajikan konsisten setiap hari.</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="mb-1 font-semibold text-emerald-900">Pemesanan Praktis</p>
          <p>Pilih menu, simpan catatan makanan, lalu checkout dalam beberapa langkah singkat.</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4">
          <p className="mb-1 font-semibold text-amber-900">Langsung ke Dapur</p>
          <p>Order dan catatan khusus diteruskan real-time agar penyajian lebih akurat.</p>
        </div>
      </section>
    </div>
  );
};

export default MenuPage;
