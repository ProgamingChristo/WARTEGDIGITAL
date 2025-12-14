import { useEffect } from "react";
import { useOrderStore } from "../../store/orderStore";
import { formatRupiah } from "../../utils/helpers";
import { Link } from "react-router-dom";

const OrderHistoryPage = () => {
  const { orders, loading, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-6">

      <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
        Riwayat Pesanan
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Memuat...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-10">
          <i className="fas fa-receipt text-5xl text-gray-300 mb-3"></i>
          <p className="text-gray-600">Belum ada pesanan.</p>
          <Link
            to="/"
            className="inline-block mt-4 bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600"
          >
            Pesan Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link
              key={o._id}
              to={`/order/${o._id}`}       // Untuk Phase 4D
              className="block bg-white shadow-sm rounded-xl p-4 border border-white/40 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                {/* Info kiri */}
                <div>
                  <p className="font-bold text-gray-800">
                    {new Date(o.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {o.items.length} item • Status: {o.paymentStatus}
                  </p>
                </div>

                {/* Total harga */}
                <p className="font-bold text-orange-600">
                  {formatRupiah(o.totalPrice)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
