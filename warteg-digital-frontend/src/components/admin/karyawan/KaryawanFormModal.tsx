
import { useState } from "react";

export interface KaryawanFormData {
  name: string;
  username: string;
  password?: string;
  position: "kasir" | "dapur";
  shift: "pagi" | "siang" | "malam";
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: KaryawanFormData) => void;
  initialData?: {
    name: string;
    username: string;
    position: "kasir" | "dapur";
    shift: "pagi" | "siang" | "malam";
  } | null;
}


const KaryawanFormModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  /* inisialisasi state langsung dari props – tidak pakai effect */
  const [form, setForm] = useState<KaryawanFormData>(() => ({
    name: initialData?.name ?? "",
    username: initialData?.username ?? "",
    password: "", // selalu kosong saat mount
    position: initialData?.position ?? "kasir",
    shift: initialData?.shift ?? "pagi",
  }));

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: KaryawanFormData = form.password
      ? form
      : { name: form.name, username: form.username, position: form.position, shift: form.shift };
    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Karyawan" : "Tambah Karyawan"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="sr-only">Tutup</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              required
              placeholder="Nama lengkap"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              required
              placeholder="Username untuk login"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {initialData && <span className="text-gray-400">(kosongkan jika tidak diganti)</span>}
            </label>
            <input
              type="password"
              placeholder={initialData ? "Kosongkan jika tidak diganti" : "Minimal 6 karakter"}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posisi</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value as "kasir" | "dapur" })}
              >
                <option value="kasir">Kasir</option>
                <option value="dapur">Dapur</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                value={form.shift}
                onChange={(e) => setForm({ ...form, shift: e.target.value as "pagi" | "siang" | "malam" })}
              >
                <option value="pagi">Pagi</option>
                <option value="siang">Siang</option>
                <option value="malam">Malam</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KaryawanFormModal;
