
import { useState } from "react";
import api from "../../../api/axios";
import KaryawanFormModal from "./KaryawanFormModal";
import type { Karyawan } from "../.././../utils/Karyawan"
import { Plus, Search, Filter, Edit, Trash2, Users, CheckCircle, XCircle, X } from "lucide-react";

type Position = "all" | "kasir" | "dapur";

type Alert = { msg: string; type: "success" | "error" } | null;

const AdminKaryawanPage = () => {
  const [alert, setAlert] = useState<Alert>(null);
  const showAlert = (msg: string, type: "success" | "error") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const [data, setData] = useState<Karyawan[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Karyawan | null>(null);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<Position>("all");

  /* initial data – ambil sekali saat mount */
  useState(() => {
    (async () => {
      try {
        const res = await api.get("/admin/karyawan");
        setData(res.data.data);
      } catch {
        showAlert("Gagal mengambil data karyawan", "error");
      }
    })();
  });

  /* ---------- CRUD ---------- */
  const handleCreate = async (form: Omit<Karyawan, "_id" | "role" | "attendance" | "createdAt">) => {
    try {
      await api.post("/admin/karyawan", form);
      const res = await api.get("/admin/karyawan");
      setData(res.data.data);
      showAlert("Karyawan berhasil ditambahkan", "success");
    } catch {
      showAlert("Gagal menambahkan karyawan", "error");
    }
  };

  const handleUpdate = async (form: Omit<Karyawan, "_id" | "role" | "attendance" | "createdAt">) => {
    if (!editing) return;
    try {
      await api.put(`/admin/karyawan/${editing._id}`, form);
      const res = await api.get("/admin/karyawan");
      setData(res.data.data);
      setEditing(null);
      showAlert("Karyawan berhasil diperbarui", "success");
    } catch {
      showAlert("Gagal memperbarui karyawan", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus karyawan ini?")) return;
    try {
      await api.delete(`/admin/karyawan/${id}`);
      const res = await api.get("/admin/karyawan");
      setData(res.data.data);
      showAlert("Karyawan berhasil dihapus", "success");
    } catch {
      showAlert("Gagal menghapus karyawan", "error");
    }
  };

  /* filter */
  const filtered = data.filter((k) => {
    const matchName = k.name.toLowerCase().includes(search.toLowerCase());
    const matchPos = position === "all" || k.position === position;
    return matchName && matchPos;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 lg:p-6">
      {/* alert inline modern */}
      {alert && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-4 p-4 rounded-2xl shadow-2xl border max-w-sm animate-slide-in-right ${
            alert.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
          <p className="flex-1 text-sm font-semibold">{alert.msg}</p>
          <button onClick={() => setAlert(null)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* header modern */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-md border">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Kelola Karyawan</h1>
              <p className="text-gray-500 mt-1">Atur data karyawan warung Anda dengan cepat</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                placeholder="Cari nama karyawan..."
                className="pl-11 pr-4 py-3 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none w-full sm:w-72 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                className="pl-11 pr-10 py-3 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none w-full sm:w-56 shadow-sm"
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
              >
                <option value="all">Semua Posisi</option>
                <option value="kasir">Kasir</option>
                <option value="dapur">Dapur</option>
              </select>
            </div>

            {/* tambah */}
            <button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg transition-all hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Tambah Karyawan
            </button>
          </div>
        </div>

        {/* stats card modern */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-md border flex items-center gap-5 hover:shadow-lg transition">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Karyawan</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-md border flex items-center gap-5 hover:shadow-lg transition">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Kasir</p>
              <p className="text-2xl font-bold text-gray-900">{data.filter((k) => k.position === "kasir").length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-md border flex items-center gap-5 hover:shadow-lg transition">
            <div className="p-3 bg-green-100 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Dapur</p>
              <p className="text-2xl font-bold text-gray-900">{data.filter((k) => k.position === "dapur").length}</p>
            </div>
          </div>
        </div>

        {/* table wrapper modern */}
        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-5 text-left text-sm font-bold text-gray-700">Nama</th>
                  <th className="p-5 text-left text-sm font-bold text-gray-700 hidden md:table-cell">Username</th>
                  <th className="p-5 text-left text-sm font-bold text-gray-700">Posisi</th>
                  <th className="p-5 text-left text-sm font-bold text-gray-700 hidden sm:table-cell">Shift</th>
                  <th className="p-5 text-left text-sm font-bold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((k) => (
                  <tr key={k._id} className="hover:bg-gray-50 transition">
                    <td className="p-5">
                      <div className="font-bold text-gray-900">{k.name}</div>
                      <div className="text-sm text-gray-500 md:hidden">{k.username}</div>
                    </td>
                    <td className="p-5 hidden md:table-cell text-gray-700">{k.username}</td>
                    <td className="p-5">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          k.position === "kasir"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {k.position === "kasir" ? (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        ) : (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                        {k.position}
                      </span>
                    </td>
                    <td className="p-5 capitalize hidden sm:table-cell text-gray-700">{k.shift}</td>
                    <td className="p-5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditing(k);
                            setOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(k._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">Tidak ada data karyawan.</div>
          )}
        </div>
      </div>

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
