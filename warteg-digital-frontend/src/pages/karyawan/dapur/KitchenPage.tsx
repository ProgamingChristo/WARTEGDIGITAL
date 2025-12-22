
import { useEffect, useState } from "react";
import axiosDapur from "../../../api/axiosDapur";

interface KitchenItem {
  _id: string;
  menuId: string;
  qty: number;
}

interface KitchenOrder {
  _id: string;
  customerName: string;
  items: KitchenItem[];
  cookingStatus: "pending" | "done";
  paymentStatus: "paid";
  createdAt: string;
}

const KitchenPage = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosDapur.get<{ data: KitchenOrder[] }>("/karyawan/order/kitchen");
      const pending = res.data.data.filter((o) => o.cookingStatus === "pending");
      setOrders(pending);
    } catch {
      alert("Gagal mengambil data dapur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDone = async (id: string) => {
    if (!confirm("Tandai masakan selesai?")) return;
    try {
      await axiosDapur.put(`/karyawan/order/${id}/cooking`, { status: "done" });
      fetchOrders();
      alert("Status masakan berhasil diperbarui!"); // alert sukses
    } catch {
      alert("Gagal update status masak");
    }
  };

  const handleLogout = () => {
    if (!confirm("Yakin ingin keluar?")) return;
    localStorage.removeItem("tokenKaryawan");
    localStorage.removeItem("karyawanRole");
    window.location.href = "/login";
  };

  const filtered = orders.filter((o) =>
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-emerald-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍳</span>
            <h1 className="text-xl font-semibold text-emerald-800">Dapur</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-6">
        {/* Search */}
        <div className="mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama customer..."
            className="w-full max-w-xs px-4 py-2 rounded-lg border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {loading ? (
          <p className="text-emerald-700">Memuat data...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">Tidak ada order untuk dimasak.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((o) => (
              <div
                key={o._id}
                className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-800">{o.customerName}</p>
                  <p className="text-sm text-gray-500">
                    {o.items.reduce((t, i) => t + i.qty, 0)} item
                  </p>
                </div>
                <button
                  onClick={() => handleDone(o._id)}
                  className="ml-4 px-3 py-1.5 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Selesai
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default KitchenPage;
