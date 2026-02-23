import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Package2, ScrollText, Tags, Wallet } from "lucide-react";

export interface MenuFormData {
  name: string;
  category: "makanan" | "minuman" | "lainnya";
  price: number;
  stock: number;
  description: string;
  imageUrl?: string;
  available?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MenuFormData) => void | Promise<void>;
  initialData?: MenuFormData | null;
}

const defaultForm: MenuFormData = {
  name: "",
  category: "makanan",
  price: 0,
  stock: 0,
  description: "",
  imageUrl: "",
  available: true,
};

const MenuFormModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  const [form, setForm] = useState<MenuFormData>(defaultForm);
  const isEditing = useMemo(() => Boolean(initialData), [initialData]);

  useEffect(() => {
    if (!open) return;
    setForm(initialData ? { ...defaultForm, ...initialData } : defaultForm);
  }, [open, initialData]);

  if (!open) return null;

  const setField = (key: keyof MenuFormData, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: MenuFormData = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl?.trim() || "",
      price: Math.max(0, Number(form.price || 0)),
      stock: Math.max(0, Math.floor(Number(form.stock || 0))),
      available: Number(form.stock || 0) > 0 ? Boolean(form.available) : false,
    };

    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,22,28,0.45)] px-4 py-6">
      <div className="w-full max-w-2xl rounded-3xl border border-[rgba(255,255,255,0.25)] bg-white p-6 shadow-[0_30px_80px_rgba(18,22,28,0.3)] md:p-7">
        <h2 className="font-display text-3xl text-[#151515]">{isEditing ? "Edit Menu" : "Tambah Menu"}</h2>
        <p className="mt-1 text-sm text-[#5f646d]">Pastikan data menu lengkap termasuk stock agar sinkron dengan pesanan customer.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#5d6470]">
              <ScrollText className="h-4 w-4" />
              Nama Menu
            </span>
            <input
              name="name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
              className="w-full rounded-xl border border-[#d8dde6] bg-[#fdfefe] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
              placeholder="Contoh: Nasi Ayam Bakar"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#5d6470]">
                <Tags className="h-4 w-4" />
                Kategori
              </span>
              <select
                value={form.category}
                onChange={(e) => setField("category", e.target.value as MenuFormData["category"])}
                className="w-full rounded-xl border border-[#d8dde6] bg-[#fdfefe] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
              >
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#5d6470]">
                <Wallet className="h-4 w-4" />
                Harga
              </span>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setField("price", Number(e.target.value))}
                required
                className="w-full rounded-xl border border-[#d8dde6] bg-[#fdfefe] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
                placeholder="Contoh: 15000"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#5d6470]">
                <Package2 className="h-4 w-4" />
                Stock
              </span>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => setField("stock", Math.max(0, Math.floor(Number(e.target.value || 0))))}
                required
                className="w-full rounded-xl border border-[#d8dde6] bg-[#fdfefe] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
                placeholder="Jumlah stock"
              />
            </label>

            <label className="block">
              <span className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#5d6470]">
                <ImagePlus className="h-4 w-4" />
                URL Gambar
              </span>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={(e) => setField("imageUrl", e.target.value)}
                className="w-full rounded-xl border border-[#d8dde6] bg-[#fdfefe] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
                placeholder="https://..."
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5d6470]">Deskripsi</span>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border border-[#d8dde6] bg-[#fdfefe] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
              placeholder="Deskripsi singkat menu..."
            />
          </label>

          <div className="flex justify-end gap-2 pt-1">
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

export default MenuFormModal;
