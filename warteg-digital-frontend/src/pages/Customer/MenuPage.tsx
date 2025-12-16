
import { useMenuStore } from "../../store/menuStore";
import { useEffect, useState, useMemo } from "react";
import MenuCard from "../../components/MenuCard";
import { FiSearch, FiFilter, FiCoffee, FiShoppingBag } from "react-icons/fi";

const MenuPage = () => {
  const { menus, fetchMenus } = useMenuStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const categories = useMemo(() => {
    const unique = new Set(menus.map((m) => m.category));
    return ["all", ...Array.from(unique)];
  }, [menus]);

  const filteredMenus = useMemo(() => {
    return menus.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || m.category === category;
      return matchSearch && matchCategory;
    });
  }, [menus, search, category]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-2">
            <FiCoffee className="text-emerald-600 w-8 h-8" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-500">
              Menu Warteg
            </h1>
            <FiShoppingBag className="text-amber-500 w-8 h-8" />
          </div>
          <p className="text-gray-600 text-lg">Pilih menu favoritmu, langsung dihidangkan!</p>
        </header>

        {/* Search & Filter */}
        <section className="mb-10">
          <div className="bg-white/70 backdrop-blur rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full sm:flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari menu kesukaanmu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
              />
            </div>

            {/* Filter */}
            <div className="relative w-full sm:w-56">
              <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white appearance-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "Semua Kategori" : cat}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▾
              </span>
            </div>
          </div>
        </section>

        {/* Menu Grid */}
        <section>
          {filteredMenus.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMenus.map((menu) => (
                <MenuCard key={menu._id} menu={menu} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FiSearch className="mx-auto w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">Menu tidak ditemukan.</p>
              <p className="text-gray-400">Coba kata kunci lain atau pilih kategori lainnya.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default MenuPage;
