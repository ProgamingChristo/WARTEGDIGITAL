import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Link } from "react-router-dom";

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

const MenuListPage = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenus = async () => {
    try {
      const res = await api.get("/admin/menu");
      setMenus(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-green-700">Manage Menu</h1>

        <Link
          to="/admin/menu/add"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Tambah Menu
        </Link>
      </div>

      {/* Loading */}
      {loading && <p>Memuat...</p>}

      {/* Empty */}
      {!loading && menus.length === 0 && (
        <p className="text-gray-500">Belum ada menu.</p>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {menus.map((menu) => (
          <div
            key={menu._id}
            className="bg-white shadow border rounded-xl overflow-hidden"
          >
            <img
              src={menu.imageUrl || "https://via.placeholder.com/300"}
              alt={menu.name}
              className="h-40 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="font-bold text-gray-800">{menu.name}</h3>
              <p className="text-sm text-gray-500">{menu.category}</p>

              <p className="mt-1 text-green-700 font-semibold">
                Rp {menu.price.toLocaleString("id-ID")}
              </p>

              <div className="flex justify-between mt-4">
                <Link
                  to={`/admin/menu/edit/${menu._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>

                <Link
                  to={`/admin/menu/delete/${menu._id}`}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuListPage;
