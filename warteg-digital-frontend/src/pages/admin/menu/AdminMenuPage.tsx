import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";
import MenuFormModal from "./MenuFormModal";
import type { MenuFormData } from "./MenuFormModal";
import { Edit3, ImageOff, Plus, Search, Trash2 } from "lucide-react";

interface Menu extends MenuFormData {
  _id: string;
  available: boolean;
  stock: number;
}

const AdminMenuPage = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Menu | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | "makanan" | "minuman" | "lainnya">("all");

  const fetchMenus = async () => {
    try {
      const res = await api.get("/admin/menu");
      const list = Array.isArray(res.data?.data) ? (res.data.data as Menu[]) : [];
      setMenus(
        list.map((item) => ({
          ...item,
          stock: Number(item.stock ?? 0),
        }))
      );
    } catch {
      alert("Gagal mengambil menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleCreate = async (data: MenuFormData) => {
    try {
      await api.post("/admin/menu", data);
      await fetchMenus();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Gagal menambah menu.");
    }
  };

  const handleUpdate = async (data: MenuFormData) => {
    if (!editing) return;
    try {
      await api.put(`/admin/menu/${editing._id}`, data);
      setEditing(null);
      await fetchMenus();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Gagal memperbarui menu.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus menu ini?")) return;
    try {
      await api.delete(`/admin/menu/${id}`);
      await fetchMenus();
    } catch {
      alert("Gagal menghapus menu.");
    }
  };

  const toggleAvailable = async (menu: Menu) => {
    if (!menu.available && menu.stock <= 0) {
      alert("Tidak bisa mengaktifkan menu dengan stock 0. Tambah stock dulu.");
      return;
    }

    try {
      await api.put(`/admin/menu/${menu._id}`, {
        available: !menu.available,
      });
      await fetchMenus();
    } catch {
      alert("Gagal mengubah status menu.");
    }
  };

  const filtered = useMemo(
    () =>
      menus.filter((menu) => {
        const matchSearch = menu.name.toLowerCase().includes(search.toLowerCase());
        const matchCategory = category === "all" || menu.category === category;
        return matchSearch && matchCategory;
      }),
    [menus, search, category]
  );

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-[#dae1ea] bg-white p-5 shadow-[0_18px_44px_rgba(19,28,38,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-display text-3xl text-[#131f2e]">Kelola Menu</h1>
            <p className="text-sm text-[#5d6572]">Atur harga, stock, dan status menu untuk customer secara real-time.</p>
          </div>

          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#136f63] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f5d53]"
          >
            <Plus className="h-4 w-4" />
            Tambah Menu
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#738095]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama menu..."
              className="w-full rounded-xl border border-[#d6dce6] bg-[#fcfdff] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
            />
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "all" | "makanan" | "minuman" | "lainnya")}
            className="rounded-xl border border-[#d6dce6] bg-[#fcfdff] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
          >
            <option value="all">Semua Kategori</option>
            <option value="makanan">Makanan</option>
            <option value="minuman">Minuman</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={`menu-skeleton-${idx}`} className="h-72 animate-pulse rounded-2xl border border-[#dce2eb] bg-white/70" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-[#cfd8e4] bg-white/70 p-12 text-center">
            <ImageOff className="mx-auto h-10 w-10 text-[#99a4b5]" />
            <p className="mt-2 text-sm text-[#697487]">Menu belum tersedia untuk filter saat ini.</p>
          </div>
        ) : (
          filtered.map((menu) => {
            const isOutOfStock = Number(menu.stock ?? 0) <= 0;
            const active = menu.available && !isOutOfStock;

            return (
              <article
                key={menu._id}
                className="overflow-hidden rounded-2xl border border-[#dbe2eb] bg-white shadow-[0_8px_20px_rgba(19,28,38,0.06)]"
              >
                <div className="relative h-44 bg-[#edf1f8]">
                  <img
                    src={menu.imageUrl || "https://via.placeholder.com/600x340?text=Menu"}
                    alt={menu.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-[rgba(16,21,31,0.72)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {menu.category}
                  </div>
                  <div
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      active ? "bg-[#d8f5e8] text-[#0f7042]" : "bg-[#f7dede] text-[#a12828]"
                    }`}
                  >
                    {active ? "Aktif" : "Nonaktif"}
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="line-clamp-1 text-lg font-bold text-[#152235]">{menu.name}</h3>
                    <p className="mt-1 line-clamp-2 min-h-[2.4rem] text-sm text-[#5f6776]">
                      {menu.description?.trim() || "Belum ada deskripsi menu."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-[#136f63]">Rp {Number(menu.price || 0).toLocaleString("id-ID")}</p>
                    <p className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isOutOfStock ? "bg-[#fbe6e6] text-[#b03a3a]" : "bg-[#eaf6ef] text-[#1c7d4e]"}`}>
                      Stock: {Number(menu.stock || 0)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => toggleAvailable(menu)}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        active
                          ? "bg-[#ffe4e4] text-[#a83b3b] hover:bg-[#ffd5d5]"
                          : "bg-[#def6eb] text-[#0f7042] hover:bg-[#cef0e0]"
                      }`}
                    >
                      {active ? "Nonaktifkan" : "Aktifkan"}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditing(menu);
                          setOpen(true);
                        }}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d2dae4] text-[#3b495e] transition hover:bg-[#f1f4f9]"
                        title="Edit menu"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(menu._id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#ebd0d0] text-[#b13a3a] transition hover:bg-[#fbe8e8]"
                        title="Hapus menu"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      <MenuFormModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        initialData={editing}
        onSubmit={editing ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default AdminMenuPage;
