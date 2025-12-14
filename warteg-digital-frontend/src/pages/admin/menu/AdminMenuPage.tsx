
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import MenuFormModal from "./MenuFormModal";
import type { MenuFormData } from "./MenuFormModal";
import { Search, Plus, Filter, ToggleLeft, Edit, Trash2, ImageOff,  } from "lucide-react";

interface Menu extends MenuFormData {
  _id: string;
  available: boolean;
}

const AdminMenuPage = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Menu | null>(null);

  /* SEARCH & FILTER */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | "makanan" | "minuman">("all");

  /* FETCH */
  const fetchMenus = async () => {
    try {
      const res = await api.get("/admin/menu");
      setMenus(res.data.data);
    } catch {
      alert("Gagal mengambil menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  /* CRUD */
  const handleCreate = async (data: MenuFormData) => {
    await api.post("/admin/menu", data);
    fetchMenus();
  };

  const handleUpdate = async (data: MenuFormData) => {
    if (!editing) return;
    await api.put(`/admin/menu/${editing._id}`, data);
    setEditing(null);
    fetchMenus();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus menu ini?")) return;
    await api.delete(`/admin/menu/${id}`);
    fetchMenus();
  };

  const toggleAvailable = async (menu: Menu) => {
    await api.put(`/admin/menu/${menu._id}`, { ...menu, available: !menu.available });
    fetchMenus();
  };

  /* FILTER */
  const filtered = menus.filter((m) => {
    const matchName = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || m.category === category;
    return matchName && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile : top bar */}
      <header className="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Kelola Menu</h1>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Desktop : header + controls */}
        <div className="hidden lg:flex lg:items-center lg:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Kelola Menu</h1>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari menu..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none w-64"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as "all" | "makanan" | "minuman")}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none"
              >
                <option value="all">Semua</option>
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
              </select>
            </div>

            {/* Add */}
            <button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Tambah Menu
            </button>
          </div>
        </div>

        {/* Mobile : search + filter */}
        <div className="lg:hidden mb-4 grid grid-cols-2 gap-3">
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari menu..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none w-full"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "all" | "makanan" | "minuman")}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none w-full"
            >
              <option value="all">Semua</option>
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>
          </div>
        </div>

        {/* GRID CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <ImageOff className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Belum ada menu</p>
            </div>
          ) : (
            filtered.map((menu) => (
              <div
                key={menu._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Image */}
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img
                    src={menu.imageUrl || "https://via.placeholder.com/400x225/f3f4f6/9ca3af?text=No+Image"}
                    alt={menu.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        menu.available
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {menu.available ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 lg:p-4">
                  <h3 className="font-bold text-base lg:text-lg text-gray-900 mb-1 truncate">{menu.name}</h3>
                  <p className="text-xs lg:text-sm text-gray-500 mb-2 capitalize">{menu.category}</p>
                  <p className="text-xs lg:text-sm text-gray-600 mb-3 line-clamp-2">{menu.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg lg:text-xl font-bold text-green-600">
                      Rp {menu.price.toLocaleString("id-ID")}
                    </span>
                    
                    {/* Actions */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleAvailable(menu)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        title={menu.available ? "Nonaktifkan" : "Aktifkan"}
                      >
                        <ToggleLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(menu);
                          setOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(menu._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      <MenuFormModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={editing}
        onSubmit={editing ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default AdminMenuPage;
