// src/pages/superadmin/admin/SuperAdminAdminPage.tsx

import { useEffect, useState } from "react";
import api from "../../../api/axiosSuperadmin";
import AdminFormModal from "./AdminFormModal";
import type { AdminFormData } from "./AdminFormModal";

interface AdminUser {
  _id: string;
  username: string;
  role: "admin";
  createdAt: string;
}

const SuperAdminAdminPage = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);

  const fetchAdmins = async (): Promise<void> => {
    try {
      const res = await api.get("/superadmin/admin");
      setAdmins(res.data.data ?? []);
    } catch {
      alert("Gagal mengambil data admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (data: AdminFormData): Promise<void> => {
    if (!data.password) {
      alert("Password wajib diisi");
      return;
    }

    await api.post("/superadmin/admin", {
      username: data.username,
      password: data.password,
      role: "admin",
    });

    setOpen(false);
    fetchAdmins();
  };

  const handleUpdate = async (data: AdminFormData): Promise<void> => {
    if (!editing) return;

    await api.put(`/superadmin/admin/${editing._id}`, {
      username: data.username,
      role: "admin",
      ...(data.password ? { password: data.password } : {}),
    });

    setEditing(null);
    setOpen(false);
    fetchAdmins();
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm("Hapus admin ini?")) return;
    await api.delete(`/superadmin/admin/${id}`);
    fetchAdmins();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Admin</h1>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Tambah Admin
        </button>
      </div>

      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Username</th>
              <th className="p-3">Role</th>
              <th className="p-3">Dibuat</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
            ) : admins.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center">Kosong</td></tr>
            ) : (
              admins.map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="p-3">{a.username}</td>
                  <td className="p-3 text-center">{a.role}</td>
                  <td className="p-3 text-center">
                    {new Date(a.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        setEditing(a);
                        setOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminFormModal
        key={editing ? editing._id : "create"}   // 🔥 INI KUNCI UTAMA
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        initialData={
          editing
            ? { username: editing.username, role: "admin" }
            : null
        }
        onSubmit={editing ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default SuperAdminAdminPage;