// src/pages/superadmin/admin/AdminFormModal.tsx

import { useState } from "react";

export interface AdminFormData {
  username: string;
  password?: string;
  role: "admin";
}

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: AdminFormData | null;
  onSubmit: (data: AdminFormData) => Promise<void>;
}

const AdminFormModal = ({
  open,
  onClose,
  initialData,
  onSubmit,
}: Props) => {
  const [form, setForm] = useState<AdminFormData>({
    username: initialData?.username ?? "",
    password: "",
    role: "admin",
  });

  if (!open) return null;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">
          {initialData ? "Edit Admin" : "Tambah Admin"}
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, username: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="password"
          placeholder={initialData ? "Password (opsional)" : "Password"}
          value={form.password ?? ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, password: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
          required={!initialData}
        />

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminFormModal;
