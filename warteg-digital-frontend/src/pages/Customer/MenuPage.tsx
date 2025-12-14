import { useMenuStore } from "../../store/menuStore";
import { useEffect, useState, useMemo } from "react";
import MenuCard from "../../components/MenuCard";

const MenuPage = () => {
  const { menus, fetchMenus } = useMenuStore();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // Ambil kategori unik dari data menu
  const categories = useMemo(() => {
    const unique = new Set(menus.map((m) => m.category));
    return ["all", ...Array.from(unique)];
  }, [menus]);

  // FILTER SEARCH + CATEGORY
  const filteredMenus = useMemo(() => {
    return menus.filter((m) => {
      const matchSearch = m.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "all" || m.category === category;

      return matchSearch && matchCategory;
    });
  }, [menus, search, category]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Menu Warteg
      </h1>

      {/* SEARCH & FILTER */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Cari menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full sm:w-1/2 px-4 py-2 border rounded-lg shadow-sm 
            focus:ring-2 focus:ring-green-500 focus:outline-none
          "
        />

        {/* FILTER CATEGORY */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="
            w-full sm:w-48 px-4 py-2 border rounded-lg shadow-sm
            focus:ring-2 focus:ring-green-500 focus:outline-none
          "
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "Semua Kategori" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* GRID MENU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMenus.length > 0 ? (
          filteredMenus.map((menu) => (
            <MenuCard key={menu._id} menu={menu} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            Menu tidak ditemukan.
          </p>
        )}
      </div>

    </div>
  );
};

export default MenuPage;
