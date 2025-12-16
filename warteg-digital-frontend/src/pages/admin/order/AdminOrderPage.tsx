
import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";
import type { AdminOrder } from "../../../utils/Order";
import {
  Search, DollarSign, Package, Clock, Trash2, CheckCircle, XCircle, X, Eye
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import OrderDetailModal from "./OrderDetailModal"; // satu folder

/* tipe hasil fetch populate (dipakai modal) */
interface AdminOrderItemDetail {
  _id: string;
  menuId: { name: string; price: number; imageUrl?: string };
  qty: number;
}
export interface AdminOrderDetail {
  _id: string;
  customerName: string;
  items: AdminOrderItemDetail[];
  totalPrice: number;
  paymentMethod: "cash" | "midtrans";
  paymentStatus: "paid" | "unpaid";
  status: string;
  createdAt: string;
}

type StatusFilter = "all" | "waiting" | "process" | "done" | "cancel";
type PaymentFilter = "all" | "paid" | "unpaid";

const AdminOrderPage = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  /* search & filter */
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");

  /* modal state */
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetail | null>(null);

  /* ---------- data ---------- */
  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/order");
      setOrders(res.data.data);
    } catch {
      showAlert("Gagal mengambil data order", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------- logic ---------- */
  const showAlert = (msg: string, type: "success" | "error") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const matchesPayment = paymentFilter === "all" || o.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const totalIncome = useMemo(
    () => filteredOrders.filter((o) => o.paymentStatus === "paid").reduce((sum, o) => sum + o.totalPrice, 0),
    [filteredOrders]
  );

  const incomeLast7Days = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return d.toISOString().slice(0, 10);
    }).reverse();

    const map = days.reduce((acc, date) => {
      acc[date] = 0;
      return acc;
    }, {} as Record<string, number>);

    filteredOrders
      .filter((o) => o.paymentStatus === "paid")
      .forEach((o) => {
        const d = new Date(o.createdAt).toISOString().slice(0, 10);
        if (map[d] !== undefined) map[d] += o.totalPrice;
      });

    return days.map((date) => ({
      date: new Date(date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric" }),
      income: map[date],
    }));
  }, [filteredOrders]);

  /* ---------- actions ---------- */
  const updateStatus = async (id: string, status: string) => {
    try {
      const paymentStatus = status === "done" ? "paid" : "unpaid";
      await api.put(`/admin/order/${id}`, { status, paymentStatus });
      fetchOrders();
      showAlert("Status order diperbarui", "success");
    } catch {
      showAlert("Gagal update status", "error");
    }
  };

  const updatePayment = async (id: string, paymentStatus: "paid" | "unpaid") => {
    try {
      await api.put(`/admin/order/${id}`, { paymentStatus });
      fetchOrders();
      showAlert("Status pembayaran diperbarui", "success");
    } catch {
      showAlert("Gagal update pembayaran", "error");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Hapus order ini?")) return;
    try {
      await api.delete(`/admin/order/${id}`);
      fetchOrders();
      showAlert("Order berhasil dihapus", "success");
    } catch {
      showAlert("Gagal menghapus order", "error");
    }
  };

  const openDetail = async (order: AdminOrder) => {
    try {
      const { data } = await api.get<AdminOrderDetail>(`/admin/order/${order._id}`);
      setSelectedOrder(data);
    } catch {
      showAlert("Gagal memuat detail order", "error");
    }
  };

  /* ---------- render ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 lg:p-6">
      {alert && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-4 p-4 rounded-2xl shadow-2xl border max-w-sm animate-slide-in-right ${
            alert.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-500" />
          )}
          <p className="flex-1 text-sm font-semibold">{alert.msg}</p>
          <button onClick={() => setAlert(null)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-md border border-indigo-100">
              <Package className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Kelola Order</h1>
              <p className="text-slate-500 mt-1">Monitor & kelola pesanan pelanggan</p>
            </div>
          </div>
        </div>

        {/* summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-5 rounded-2xl shadow-md border border-indigo-100 flex items-center gap-5 hover:shadow-lg transition">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Order</p>
              <p className="text-3xl font-bold text-slate-900">{filteredOrders.length}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-md border border-emerald-100 flex items-center gap-5 hover:shadow-lg transition">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Income (Paid)</p>
              <p className="text-3xl font-bold text-emerald-600">Rp {totalIncome.toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>

        {/* chart */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Income 7 Hari Terakhir (Paid)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={incomeLast7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `Rp ${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v: number) => [`Rp ${v.toLocaleString("id-ID")}`, "Income"]}
                labelStyle={{ fontWeight: 600 }}
                contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
              />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* filter bar */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="waiting">Waiting</option>
              <option value="process">Process</option>
              <option value="done">Done</option>
              <option value="cancel">Cancel</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="all">Semua Payment</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {/* table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-5 text-left text-sm font-bold text-slate-700">Tanggal</th>
                <th className="p-5 text-left text-sm font-bold text-slate-700">Customer</th>
                <th className="p-5 text-left text-sm font-bold text-slate-700">Payment</th>
                <th className="p-5 text-left text-sm font-bold text-slate-700">Total</th>
                <th className="p-5 text-left text-sm font-bold text-slate-700">Status</th>
                <th className="p-5 text-left text-sm font-bold text-slate-700">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-3">
                      <Clock className="w-5 h-5 animate-spin" />
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">Tidak ada order yang sesuai.</td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="p-5 text-sm text-slate-900">
                      {new Date(o.createdAt).toLocaleString("id-ID")}
                    </td>
                    <td className="p-5 font-semibold text-slate-900">{o.customerName}</td>

                    {/* payment toggle */}
                    <td className="p-5 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="capitalize text-slate-600">{o.paymentMethod}</span>
                        <button
                          onClick={() => updatePayment(o._id, o.paymentStatus === "paid" ? "unpaid" : "paid")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            o.paymentStatus === "paid" ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              o.paymentStatus === "paid" ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span
                          className={`text-xs font-semibold ${
                            o.paymentStatus === "paid" ? "text-emerald-700" : "text-slate-600"
                          }`}
                        >
                          {o.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                      </div>
                    </td>

                    <td className="p-5 font-bold text-slate-900">
                      Rp {o.totalPrice.toLocaleString("id-ID")}
                    </td>

                    {/* status */}
                    <td className="p-5">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      >
                        <option value="waiting">Waiting</option>
                        <option value="process">Process</option>
                        <option value="done">Done</option>
                        <option value="cancel">Cancel</option>
                      </select>
                    </td>

                    {/* aksi */}
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetail(o)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                          title="Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteOrder(o._id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal detail */}
      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
};

export default AdminOrderPage;
