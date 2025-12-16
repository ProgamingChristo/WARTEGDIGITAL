
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AdminOrderDetail } from "./types";
import { formatRupiah } from "./helpers";

export const exportInvoicePDF = (order: AdminOrderDetail) => {
  const doc = new jsPDF();

  doc.text("Warteg Digital - Invoice", 14, 15);
  doc.text(`Customer: ${order.customerName}`, 14, 25);

  autoTable(doc, {
    startY: 35,
    head: [["Menu", "Qty", "Harga", "Subtotal"]],
    body: order.items.map((i) => [
      i.menuId.name,
      i.qty,
      formatRupiah(i.menuId.price),
      formatRupiah(i.qty * i.menuId.price),
    ]),
  });

  // typed-safe alternative to (doc as any).lastAutoTable
  const lastY = (doc as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 35;
  doc.text(`Total: ${formatRupiah(order.totalPrice)}`, 14, lastY + 10);

  doc.save(`invoice-${order._id}.pdf`);
};
