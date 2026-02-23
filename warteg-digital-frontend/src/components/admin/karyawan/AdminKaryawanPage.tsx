import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";
import KaryawanFormModal from "./KaryawanFormModal";
import type { Karyawan } from "../../../utils/Karyawan";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";

type Position = "all" | "kasir" | "dapur";

const AdminKaryawanPage = () => {
  const [data, setData] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Karyawan | null>(null);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<Position>("all");

  const fetchKaryawan = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/karyawan");
      setData(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      alert("Gagal mengambil data karyawan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKaryawan();
  }, []);

  const handleCreate = async (form: Omit<Karyawan, "_id" | "role" | "attendance" | "createdAt">) => {
    try {
      await api.post("/admin/karyawan", form);
      await fetchKaryawan();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Gagal menambahkan karyawan.");
    }
  };

  const handleUpdate = async (form: Omit<Karyawan, "_id" | "role" | "attendance" | "createdAt">) => {
    if (!editing) return;
    try {
      await api.put(`/admin/karyawan/${editing._id}`, form);
      setEditing(null);
      await fetchKaryawan();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Gagal memperbarui karyawan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus karyawan ini?")) return;
    try {
      await api.delete(`/admin/karyawan/${id}`);
      await fetchKaryawan();
    } catch {
      alert("Gagal menghapus karyawan.");
    }
  };

  const filtered = useMemo(
    () =>
      data.filter((item) => {
        const byName = item.name.toLowerCase().includes(search.toLowerCase());
        const byPosition = position === "all" || item.position === position;
        return byName && byPosition;
      }),
    [data, position, search]
  );

  const countKasir = data.filter((item) => item.position === "kasir").length;
  const countDapur = data.filter((item) => item.position === "dapur").length;

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-[#dae1ea] bg-white p-5 shadow-[0_18px_44px_rgba(19,28,38,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-display text-3xl text-[#13243a]">Kelola Karyawan</h1>
            <p className="text-sm text-[#5f6776]">Atur akun kasir dan dapur, termasuk shift kerja harian.</p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#136f63] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f5d53]"
          >
            <Plus className="h-4 w-4" />
            Tambah Karyawan
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-[#dbe2eb] bg-[#f8fbff] p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-[#637791]">Total</p>
            <p className="text-xl font-bold text-[#1c2f48]">{data.length}</p>
          </div>
          <div className="rounded-xl border border-[#dbe2eb] bg-[#f8fbff] p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-[#637791]">Kasir</p>
            <p className="text-xl font-bold text-[#1c2f48]">{countKasir}</p>
          </div>
          <div className="rounded-xl border border-[#dbe2eb] bg-[#f8fbff] p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-[#637791]">Dapur</p>
            <p className="text-xl font-bold text-[#1c2f48]">{countDapur}</p>
          </div>
          <div className="rounded-xl border border-[#dbe2eb] bg-[#f8fbff] p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-[#637791]">Absensi Hari Ini</p>
            <p className="text-xl font-bold text-[#1c2f48]">
              {
                data.filter((karyawan) =>
                  (karyawan.attendance || []).some((entry) => entry.status === "hadir")
                ).length
              }
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#72819a]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama karyawan..."
              className="w-full rounded-xl border border-[#d6dce6] bg-[#fcfdff] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
            />
          </label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value as Position)}
            className="rounded-xl border border-[#d6dce6] bg-[#fcfdff] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
          >
            <option value="all">Semua Posisi</option>
            <option value="kasir">Kasir</option>
            <option value="dapur">Dapur</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#dbe2eb] bg-white shadow-[0_12px_30px_rgba(19,28,38,0.07)]">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#f3f7fd]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Username</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Posisi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Shift</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#617083]">
                    Memuat data karyawan...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#617083]">
                    Data karyawan tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((karyawan) => (
                  <tr key={karyawan._id} className="border-t border-[#edf1f7]">
                    <td className="px-4 py-3 text-sm font-semibold text-[#1b2f49]">{karyawan.name}</td>
                    <td className="px-4 py-3 text-sm text-[#334962]">{karyawan.username}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="rounded-full bg-[#eaf4ff] px-2.5 py-1 text-xs font-semibold capitalize text-[#24539a]">
                        {karyawan.position}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm capitalize text-[#334962]">{karyawan.shift}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditing(karyawan);
                            setOpen(true);
                          }}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d4dcec] text-[#295496] transition hover:bg-[#edf3ff]"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(karyawan._id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#efd2d2] text-[#b13a3a] transition hover:bg-[#fae9e9]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <KaryawanFormModal
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

export default AdminKaryawanPage;
