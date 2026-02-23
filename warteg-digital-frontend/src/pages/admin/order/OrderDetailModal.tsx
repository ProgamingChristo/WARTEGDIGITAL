import { Download, Printer, X } from "lucide-react";
import { exportOrdersExcel } from "../../../utils/exportExcel";
import { exportInvoicePDF } from "../../../utils/pdfinvoice";
import type { AdminOrderDetail } from "./AdminOrderPage";

interface Props {
  order: AdminOrderDetail | null;
  onClose: () => void;
}

const OrderDetailModal = ({ order, onClose }: Props) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,18,24,0.45)] p-4">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#d8e0eb] bg-white shadow-[0_30px_80px_rgba(17,24,39,0.3)]">
        <header className="flex items-center justify-between border-b border-[#e5ebf4] px-5 py-4">
          <div>
            <h2 className="font-display text-2xl text-[#13243a]">Detail Order</h2>
            <p className="text-xs text-[#617083]">{order._id}</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d7dfeb] text-[#576579] transition hover:bg-[#f2f6fc]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <section className="grid gap-3 rounded-xl border border-[#dfe6f1] bg-[#f8fbff] p-4 md:grid-cols-2">
            <p className="text-sm text-[#314357]">
              <span className="font-semibold text-[#14253a]">Customer:</span> {order.customerName}
            </p>
            <p className="text-sm text-[#314357]">
              <span className="font-semibold text-[#14253a]">Tanggal:</span> {new Date(order.createdAt).toLocaleString("id-ID")}
            </p>
            <p className="text-sm text-[#314357]">
              <span className="font-semibold text-[#14253a]">Metode:</span> {order.paymentMethod}
            </p>
            <p className="text-sm text-[#314357]">
              <span className="font-semibold text-[#14253a]">Payment:</span> {order.paymentStatus}
            </p>
            <p className="text-sm text-[#314357] md:col-span-2">
              <span className="font-semibold text-[#14253a]">Status Order:</span> {order.status}
            </p>
          </section>

          {!!order.foodNote?.trim() && (
            <section className="rounded-xl border border-[#eeddbf] bg-[#fff7e6] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#946d31]">Catatan Makanan</p>
              <p className="mt-1 text-sm text-[#8a612a]">{order.foodNote.trim()}</p>
            </section>
          )}

          <section className="overflow-hidden rounded-xl border border-[#dbe3ee]">
            <table className="min-w-full">
              <thead className="bg-[#f3f7fd]">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Menu</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Qty</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Harga</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#55657b]">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  const menuName = item.menuId?.name || "Menu tidak tersedia";
                  const price = Number(item.menuId?.price || 0);
                  return (
                    <tr key={item._id} className="border-t border-[#edf1f7]">
                      <td className="px-3 py-2 text-sm text-[#26384f]">{menuName}</td>
                      <td className="px-3 py-2 text-sm text-[#26384f]">{item.qty}</td>
                      <td className="px-3 py-2 text-sm text-[#26384f]">Rp {price.toLocaleString("id-ID")}</td>
                      <td className="px-3 py-2 text-sm font-semibold text-[#136f63]">
                        Rp {(price * Number(item.qty || 0)).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <div className="rounded-xl border border-[#dbe4f0] bg-[#f8fbff] px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.08em] text-[#5a6f8f]">Total Bayar</p>
            <p className="text-xl font-bold text-[#136f63]">Rp {Number(order.totalPrice || 0).toLocaleString("id-ID")}</p>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-[#e5ebf4] px-5 py-4">
          <button
            onClick={() => exportInvoicePDF(order)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#cfd9eb] bg-white px-3 py-2 text-sm font-semibold text-[#234067] transition hover:bg-[#eff5ff]"
          >
            <Printer className="h-4 w-4" />
            PDF
          </button>
          <button
            onClick={() => exportOrdersExcel([order])}
            className="inline-flex items-center gap-2 rounded-lg bg-[#136f63] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0f5d53]"
          >
            <Download className="h-4 w-4" />
            Excel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default OrderDetailModal;
