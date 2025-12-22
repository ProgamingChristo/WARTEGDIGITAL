
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { formatRupiah } from "../../utils/helpers";
import type { OrderDetail } from "../../utils/types";

/* ---------- REACT-PDF ---------- */
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
/* ------------------------------- */

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  title: { fontSize: 16, fontWeight: "bold" },
  row: { flexDirection: "row", marginBottom: 4 },
  label: { width: 100, fontWeight: "bold" },
  value: { flex: 1 },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  itemImage: { width: 50, height: 50, marginRight: 10 },
  itemInfo: { flex: 1 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  bold: { fontWeight: "bold" },
});

const OrderPDF = ({ order }: { order: OrderDetail }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Detail Pesanan</Text>
        <Text>{new Date(order.createdAt).toLocaleString("id-ID")}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>ID Pesanan</Text>
        <Text style={styles.value}>{order._id}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Metode</Text>
        <Text style={styles.value}>{order.paymentMethod}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{order.paymentStatus}</Text>
      </View>

      <Text style={{ marginTop: 16, marginBottom: 8, fontWeight: "bold" }}>Item Pesanan</Text>
      {order.items.map((item, idx) => (
        <View key={idx} style={styles.itemRow}>
          <Image
            src={item.menuId.imageUrl || "https://via.placeholder.com/120"}
            style={styles.itemImage}
          />
          <View style={styles.itemInfo}>
            <Text>{item.menuId.name}</Text>
            <Text>Qty: {item.qty}</Text>
          </View>
          <Text>{formatRupiah(item.menuId.price * item.qty)}</Text>
        </View>
      ))}

      <View style={styles.totalRow}>
        <Text style={styles.bold}>Total Bayar</Text>
        <Text style={styles.bold}>{formatRupiah(order.totalPrice)}</Text>
      </View>
    </Page>
  </Document>
);

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
    } catch {
      alert("Gagal memuat detail pesanan");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Memuat...</p>;
  if (!order) return <p className="p-6 text-red-500">Pesanan tidak ditemukan.</p>;

  const totalQty = order.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      {/* PREVIEW HTML */}
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-6 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-lg border">
          <div className="flex justify-between items-center mb-4">
            <Link to="/order/history" className="text-orange-600 font-semibold hover:underline">
              ← Kembali
            </Link>
            <h1 className="text-lg font-bold text-gray-800">Detail Pesanan</h1>
            <div className="w-10" />
          </div>

          <div className="bg-white/70 p-4 rounded-xl border mb-6">
            <p><b>ID Pesanan:</b> {order._id}</p>
            <p><b>Tanggal:</b> {new Date(order.createdAt).toLocaleString("id-ID")}</p>
            <p><b>Metode Pembayaran:</b> {order.paymentMethod}</p>
            <p>
              <b>Status Pembayaran:</b>{" "}
              <span className={`font-bold ${order.paymentStatus === "paid" ? "text-green-600" : "text-red-600"}`}>
                {order.paymentStatus}
              </span>
            </p>
          </div>

          <h2 className="text-md font-bold text-gray-700 mb-2">Item Pesanan</h2>
          <div className="grid gap-4 mb-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white/70 p-4 rounded-xl border">
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
              <span className="text-orange-600">{formatRupiah(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOMBOL AKSI */}
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

        <PDFDownloadLink
          document={<OrderPDF order={order} />}
          fileName={`order-${order._id}.pdf`}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-center font-bold hover:bg-blue-700 transition"
        >
          {({ loading }) => (loading ? "Menyiapkan PDF..." : "Unduh PDF")}
        </PDFDownloadLink>

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
