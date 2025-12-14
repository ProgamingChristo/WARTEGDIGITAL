
import { useState } from "react";

export interface MenuFormData {
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MenuFormData) => void;
  initialData?: MenuFormData | null;
}

const MenuFormModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  const emptyForm: MenuFormData = {
    name: "",
    category: "",
    price: 0,
    description: "",
    imageUrl: "",
  };

  const [form, setForm] = useState<MenuFormData>(initialData || emptyForm);

  if (!open) return null;

  /* -------------------------------------------------
   * Harga: ketik bebas, tapi simpan sebagai number ≥ 0
   * ------------------------------------------------- */
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;               // string
    const num = Number(raw);                  // number
    const clean = raw === "" ? 0 : Math.max(0, num); // buang minus
    setForm((prev) => ({ ...prev, price: clean }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          {initialData ? "Edit Menu" : "Tambah Menu"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            placeholder="Nama menu"
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            placeholder="Kategori"
          />

          {/* HARGA : input bebas, minus otomatis jadi 0 */}
          <input
            type="text"
            name="price"
            value={form.price || ""}
            onChange={handlePriceChange}
            required
            className="w-full border p-2 rounded"
            placeholder="Harga"
          />

          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Image URL (opsional)"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border p-2 rounded"
            placeholder="Deskripsi"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
