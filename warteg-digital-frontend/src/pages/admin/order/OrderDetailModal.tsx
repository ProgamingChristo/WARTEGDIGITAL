
/* OrderDetailModal.tsx */
import { useEffect, useState } from "react";
import { X, Printer, Download, DollarSign, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { exportInvoicePDF } from "../../../utils/pdfinvoice";
import { exportOrdersExcel } from "../../../utils/exportExcel";
import type { AdminOrderDetail, AdminOrderItemDetail } from "../../../utils/types"; // <-- 1 sumber

interface Props {
  order: AdminOrderDetail | null;
  onClose: () => void;
}

const OrderDetailModal = ({ order, onClose }: Props) => {
  const [items, setItems] = useState<AdminOrderItemDetail[]>([]);

  useEffect(() => {
    if (!order) return;
    fetch(`/api/admin/order/${order._id}`)
      .then((r) => r.json())
      .then((d) => setItems(d.data.items || []));
  }, [order]);

  if (!order) return null;

  const handlePrint = () => exportInvoicePDF(order);
  const handleExportExcel = () => exportOrdersExcel([order]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Detail Order</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Info row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-slate-500">Customer</p>
                <p className="font-semibold">{order.customerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm text-slate-500">Total</p>
                <p className="font-bold text-emerald-600">Rp {order.totalPrice.toLocaleString("id-ID")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm text-slate-500">Dibuat</p>
                <p className="font-semibold">{new Date(order.createdAt).toLocaleString("id-ID")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {order.paymentStatus === "paid" ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600" />
              )}
              <div>
                <p className="text-sm text-slate-500">Payment</p>
                <p className="font-semibold">
                  {order.paymentMethod} ·{" "}
                  <span className={order.paymentStatus === "paid" ? "text-emerald-600" : "text-rose-600"}>
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div className="overflow-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 text-left">Menu</th>
                  <th className="p-3 text-left">Qty</th>
                  <th className="p-3 text-left">Harga</th>
                  <th className="p-3 text-left">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => {
                  const menu = it.menuId;
                  if (!menu) return null;
                  return (
                    <tr key={it._id} className="border-t border-slate-100">
                      <td className="p-3">{menu.name}</td>
                      <td className="p-3">{it.qty}</td>
                      <td className="p-3">Rp {menu.price.toLocaleString("id-ID")}</td>
                      <td className="p-3 font-semibold">
                        Rp {(it.qty * menu.price).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-200">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Printer className="w-4 h-4" /> PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Download className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
