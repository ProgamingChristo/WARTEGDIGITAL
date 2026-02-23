import { useEffect, useMemo, useState } from "react";

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
  onSubmit: (data: KaryawanFormData) => void | Promise<void>;
  initialData?: {
    name: string;
    username: string;
    position: "kasir" | "dapur";
    shift: "pagi" | "siang" | "malam";
  } | null;
}

const defaultForm: KaryawanFormData = {
  name: "",
  username: "",
  password: "",
  position: "kasir",
  shift: "pagi",
};

const KaryawanFormModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  const [form, setForm] = useState<KaryawanFormData>(defaultForm);
  const isEditing = useMemo(() => Boolean(initialData), [initialData]);

  useEffect(() => {
    if (!open) return;
    setForm({
      ...defaultForm,
      ...initialData,
      password: "",
    });
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: KaryawanFormData = {
      name: form.name.trim(),
      username: form.username.trim(),
      position: form.position,
      shift: form.shift,
      ...(form.password?.trim() ? { password: form.password.trim() } : {}),
    };

    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,22,28,0.45)] p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#dbe2ec] bg-white p-6 shadow-[0_30px_80px_rgba(17,24,39,0.3)]">
        <h2 className="font-display text-3xl text-[#13243a]">{isEditing ? "Edit Karyawan" : "Tambah Karyawan"}</h2>
        <p className="mt-1 text-sm text-[#5f6776]">Atur akun login, posisi, dan shift kerja karyawan.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5f6776]">Nama</span>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
              className="w-full rounded-xl border border-[#d5dce7] bg-[#fcfdff] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
              placeholder="Nama lengkap"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5f6776]">Username</span>
            <input
              value={form.username}
              onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
              required
              className="w-full rounded-xl border border-[#d5dce7] bg-[#fcfdff] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
              placeholder="Username login"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5f6776]">
              Password {isEditing ? "(opsional)" : ""}
            </span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              required={!isEditing}
              className="w-full rounded-xl border border-[#d5dce7] bg-[#fcfdff] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
              placeholder={isEditing ? "Kosongkan jika tidak diganti" : "Minimal 6 karakter"}
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5f6776]">Posisi</span>
              <select
                value={form.position}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, position: e.target.value as "kasir" | "dapur" }))
                }
                className="w-full rounded-xl border border-[#d5dce7] bg-[#fcfdff] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
              >
                <option value="kasir">Kasir</option>
                <option value="dapur">Dapur</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5f6776]">Shift</span>
              <select
                value={form.shift}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, shift: e.target.value as "pagi" | "siang" | "malam" }))
                }
                className="w-full rounded-xl border border-[#d5dce7] bg-[#fcfdff] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
              >
                <option value="pagi">Pagi</option>
                <option value="siang">Siang</option>
                <option value="malam">Malam</option>
              </select>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#cfd5df] px-4 py-2 text-sm font-semibold text-[#344256] transition hover:bg-[#f4f7fb]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#136f63] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f5d53]"
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
