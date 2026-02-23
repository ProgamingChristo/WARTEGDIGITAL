import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";
import type { AdminOrder } from "../../../utils/Order";
import { Eye, Search, Trash2 } from "lucide-react";
import OrderDetailModal from "./OrderDetailModal";

interface AdminOrderItemDetail {
  _id: string;
  menuId: { name: string; price: number; imageUrl?: string } | null;
  qty: number;
}

export interface AdminOrderDetail {
  _id: string;
  customerName: string;
  items: AdminOrderItemDetail[];
  totalPrice: number;
  paymentMethod: "cash" | "midtrans" | string;
  paymentStatus: "paid" | "unpaid" | "processing" | string;
  status: "waiting" | "pending" | "processing" | "cooking" | "done" | "delivered" | string;
  createdAt: string;
  foodNote?: string;
}

const statuses = ["waiting", "pending", "processing", "cooking", "done", "delivered"] as const;
const payments = ["all", "paid", "processing", "unpaid"] as const;

const AdminOrderPage = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | (typeof statuses)[number]>("all");
  const [paymentFilter, setPaymentFilter] = useState<(typeof payments)[number]>("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetail | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/order");
      setOrders(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      alert("Gagal mengambil data order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const bySearch = order.customerName.toLowerCase().includes(search.toLowerCase());
        const byStatus = statusFilter === "all" || order.status === statusFilter;
        const byPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
        return bySearch && byStatus && byPayment;
      }),
    [orders, paymentFilter, search, statusFilter]
  );

  const paidIncome = useMemo(
    () =>
      filtered
        .filter((order) => order.paymentStatus === "paid")
        .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0),
    [filtered]
  );

  const updateOrder = async (
    id: string,
    payload: Partial<Pick<AdminOrder, "status" | "paymentStatus">>
  ) => {
    try {
      await api.put(`/admin/order/${id}`, payload);
      await fetchOrders();
    } catch {
      alert("Gagal memperbarui order.");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Hapus order ini?")) return;
    try {
      await api.delete(`/admin/order/${id}`);
      await fetchOrders();
    } catch {
      alert("Gagal menghapus order.");
    }
  };

  const openDetail = async (id: string) => {
    try {
      const res = await api.get(`/admin/order/${id}`);
      setSelectedOrder(res.data?.data || null);
    } catch {
      alert("Gagal memuat detail order.");
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-[#dae1ea] bg-white p-5 shadow-[0_18px_44px_rgba(19,28,38,0.08)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-display text-3xl text-[#13243a]">Laporan Order</h1>
            <p className="text-sm text-[#5f6776]">Kontrol status pesanan, pembayaran, dan ringkasan pemasukan.</p>
          </div>

          <div className="rounded-xl border border-[#dce3ed] bg-[#f8fbff] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-[#6680a1]">Income Paid</p>
            <p className="text-lg font-bold text-[#136f63]">Rp {paidIncome.toLocaleString("id-ID")}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px_220px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#748197]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari customer..."
              className="w-full rounded-xl border border-[#d6dce6] bg-[#fcfdff] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | (typeof statuses)[number])}
            className="rounded-xl border border-[#d6dce6] bg-[#fcfdff] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
          >
            <option value="all">Semua Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as (typeof payments)[number])}
            className="rounded-xl border border-[#d6dce6] bg-[#fcfdff] px-3 py-2.5 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
          >
            <option value="all">Semua Payment</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#dbe2eb] bg-white shadow-[0_12px_30px_rgba(19,28,38,0.07)]">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#f3f7fd]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Tanggal</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#617083]">
                    Memuat data order...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#617083]">
                    Tidak ada order untuk filter saat ini.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order._id} className="border-t border-[#edf1f7]">
                    <td className="px-4 py-3 text-sm text-[#25364d]">
                      {new Date(order.createdAt).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#1a2f49]">{order.customerName}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="capitalize text-[#354964]">{order.paymentMethod}</span>
                        <select
                          value={order.paymentStatus}
                          onChange={(e) =>
                            updateOrder(order._id, {
                              paymentStatus: e.target.value as AdminOrder["paymentStatus"],
                            })
                          }
                          className="rounded-lg border border-[#d2dae6] bg-white px-2 py-1 text-xs outline-none transition focus:border-[#136f63]"
                        >
                          <option value="paid">paid</option>
                          <option value="processing">processing</option>
                          <option value="unpaid">unpaid</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-[#136f63]">
                      Rp {Number(order.totalPrice || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrder(order._id, {
                            status: e.target.value as AdminOrder["status"],
                          })
                        }
                        className="rounded-lg border border-[#d2dae6] bg-white px-2 py-1 text-xs outline-none transition focus:border-[#136f63]"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openDetail(order._id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d4dcec] text-[#295496] transition hover:bg-[#edf3ff]"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#efd2d2] text-[#b13a3a] transition hover:bg-[#fae9e9]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
};

export default AdminOrderPage;
