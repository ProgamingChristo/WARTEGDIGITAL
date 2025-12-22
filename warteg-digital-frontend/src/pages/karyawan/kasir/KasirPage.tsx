
import { useEffect, useState } from "react";
import axiosKasir from "../../../api/axioKasir";

interface OrderItem {
  _id: string;
  menuId: string;
  qty: number;
}

interface KasirOrder {
  _id: string;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: "cash";
  paymentStatus: "paid" | "unpaid";
  status: string;
  createdAt: string;
}

const KasirPage = () => {
  const [orders, setOrders] = useState<KasirOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosKasir.get<{ data: KasirOrder[] }>("/karyawan/orders");
      const cashUnpaid = res.data.data.filter(
        (o) => o.paymentMethod === "cash" && o.paymentStatus === "unpaid"
      );
      setOrders(cashUnpaid);
    } catch {
      alert("Gagal mengambil data kasir");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePay = async (id: string) => {
    if (!confirm("Konfirmasi pembayaran cash?")) return;
    try {
      await axiosKasir.put(`/karyawan/order/${id}/pay`);
      fetchOrders();
      alert("Pembayaran berhasil dikonfirmasi!"); // alert sukses
    } catch {
      alert("Gagal konfirmasi pembayaran");
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
            <span className="text-2xl">💵</span>
            <h1 className="text-xl font-semibold text-emerald-800">Kasir – Cash</h1>
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
          <p className="text-gray-500">Tidak ada pembayaran cash.</p>
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
                    Rp {o.totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>
                <button
                  onClick={() => handlePay(o._id)}
                  className="ml-4 px-3 py-1.5 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Bayar
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default KasirPage;
