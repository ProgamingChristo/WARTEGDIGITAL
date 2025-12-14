
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { formatRupiah } from "../../utils/helpers";
import type { OrderDetail } from "../../utils/types";

/* ---------- PDF ---------- */
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
/* ------------------------- */

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/customer/order/${orderId}`);
      setOrder(res.data as OrderDetail);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat detail pesanan");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UNDUH PDF ---------- */
  const downloadPDF = async () => {
    const element = document.getElementById("order-pdf");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`order-${order?._id}.pdf`);
  };
  /* --------------------------------- */

  if (loading) return <p className="p-6">Memuat...</p>;
  if (!order) return <p className="p-6 text-red-500">Pesanan tidak ditemukan.</p>;

  const totalQty = order.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <div
        id="order-pdf"
        className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-6 px-4"
      >
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-lg border">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <Link
              to="/order/history"
              className="text-orange-600 font-semibold hover:underline"
            >
              ← Kembali
            </Link>

            <h1 className="text-lg font-bold text-gray-800">Detail Pesanan</h1>

            <div className="w-10" />
          </div>

          {/* ORDER INFO */}
          <div className="bg-white/70 p-4 rounded-xl border mb-6">
            <p><b>ID Pesanan:</b> {order._id}</p>
            <p><b>Tanggal:</b> {new Date(order.createdAt).toLocaleString("id-ID")}</p>
            <p><b>Metode Pembayaran:</b> {order.paymentMethod}</p>
            <p>
              <b>Status Pembayaran:</b>{" "}
              <span
                className={`font-bold ${
                  order.paymentStatus === "paid" ? "text-green-600" : "text-red-600"
                }`}
              >
                {order.paymentStatus}
              </span>
            </p>
          </div>

          {/* ITEMS */}
          <h2 className="text-md font-bold text-gray-700 mb-2">Item Pesanan</h2>
          <div className="grid gap-4 mb-6">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white/70 p-4 rounded-xl border"
              >
                <img
                  src={item.menuId.imageUrl || "https://via.placeholder.com/120"}
                  className="w-20 h-20 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <p className="font-semibold">{item.menuId.name}</p>
                  <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                </div>

                <span className="font-bold text-orange-600">
                  {formatRupiah(item.menuId.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="bg-white/70 p-4 rounded-xl border">
            <div className="flex justify-between text-sm mb-1">
              <span>Total Item</span>
              <span>{totalQty} pcs</span>
            </div>

            <div className="flex justify-between text-sm mb-1">
              <span>Ongkir</span>
              <span className="text-green-600 font-medium">Gratis</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total Bayar</span>
              <span className="text-orange-600">
                {formatRupiah(order.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TOMBOL AKSI (tidak masuk PDF) */}
      <div className="max-w-3xl mx-auto px-4 pb-6 flex gap-3">
        {order.paymentStatus === "paid" && order.invoicePath && (
          <a
            href={`http://localhost:5000/invoices/${order.invoicePath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 text-white py-3 rounded-xl text-center font-bold hover:bg-green-700 transition"
          >
            Download Invoice
          </a>
        )}

        <button
          onClick={downloadPDF}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-center font-bold hover:bg-blue-700 transition"
        >
          Unduh PDF
        </button>

        <Link
          to="/order/history"
          className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-xl text-center font-bold hover:bg-gray-400 transition"
        >
          Kembali
        </Link>
      </div>
    </>
  );
};

export default OrderDetailPage;
