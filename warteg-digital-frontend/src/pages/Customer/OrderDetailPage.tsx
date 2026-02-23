import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { formatRupiah } from "../../utils/helpers";
import type { OrderDetail } from "../../utils/types";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ArrowLeft, FileDown, ReceiptText } from "lucide-react";
import logoImage from "../../assets/logo.png";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10,
    color: "#2b2218",
    backgroundColor: "#fffdfa",
  },
  hero: {
    backgroundColor: "#1f6a4a",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  heroSubtitle: {
    color: "#dcefe6",
    fontSize: 10,
    marginTop: 4,
  },
  metaCard: {
    borderWidth: 1,
    borderColor: "#e8dcc8",
    borderRadius: 10,
    backgroundColor: "#fff9f0",
    padding: 12,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  metaLabel: {
    width: 105,
    color: "#736557",
  },
  metaValue: {
    flex: 1,
    fontWeight: "bold",
  },
  noteCard: {
    borderWidth: 1,
    borderColor: "#f2ddb3",
    borderRadius: 10,
    backgroundColor: "#fff5df",
    padding: 10,
    marginBottom: 12,
  },
  noteTitle: {
    fontWeight: "bold",
    color: "#8d5b34",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#2b2218",
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#184f37",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  headText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 9,
  },
  colNo: { width: 24 },
  colItem: { flex: 1 },
  colQty: { width: 40, textAlign: "right" },
  colPrice: { width: 85, textAlign: "right" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.6,
    borderBottomColor: "#efe2cf",
    paddingHorizontal: 8,
    paddingVertical: 9,
  },
  itemImage: {
    width: 42,
    height: 42,
    borderRadius: 6,
    marginRight: 8,
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 10,
    color: "#2b2218",
  },
  itemSub: {
    fontSize: 8,
    color: "#736557",
    marginTop: 2,
  },
  totalCard: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#d6e7de",
    borderRadius: 10,
    backgroundColor: "#f4fbf7",
    padding: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalGrand: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 0.8,
    borderTopColor: "#d6e7de",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 18,
    borderTopWidth: 0.8,
    borderTopColor: "#eadfcf",
    paddingTop: 8,
    textAlign: "center",
    color: "#736557",
    fontSize: 8,
  },
});

type SafeItem = {
  key: string;
  name: string;
  price: number;
  imageUrl: string;
  qty: number;
};

type PdfItem = SafeItem & {
  pdfImageSrc: string;
};

const toSafeItems = (order: OrderDetail): SafeItem[] => {
  return order.items.map((item, idx) => ({
    key: item.menuId?._id || `fallback-${idx}`,
    name: item.menuId?.name || "Menu sudah tidak tersedia",
    price: item.menuId?.price || 0,
    imageUrl: item.menuId?.imageUrl || logoImage,
    qty: item.qty,
  }));
};

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const normalizeImageUrl = (url: string): string => {
  if (!url) return logoImage;
  if (url.startsWith("//")) return `https:${url}`;
  return url;
};

const fetchPdfImage = async (url: string): Promise<string> => {
  const source = normalizeImageUrl(url || logoImage);

  try {
    const response = await fetch(source);
    if (!response.ok) throw new Error("Image fetch failed");
    const blob = await response.blob();
    return await blobToDataUrl(blob);
  } catch {
    return logoImage;
  }
};

const OrderPDF = ({ order, items }: { order: OrderDetail; items: PdfItem[] }) => {
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Detail Pesanan Warteg Digital</Text>
          <Text style={styles.heroSubtitle}>Rasa tradisional Indonesia, disajikan dengan layanan digital modern.</Text>
        </View>

        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>ID Pesanan</Text>
            <Text style={styles.metaValue}>{order._id}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Tanggal</Text>
            <Text style={styles.metaValue}>{new Date(order.createdAt).toLocaleString("id-ID")}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Metode Bayar</Text>
            <Text style={styles.metaValue}>{(order.paymentMethod || "-").toUpperCase()}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Status Bayar</Text>
            <Text style={styles.metaValue}>{(order.paymentStatus || "-").toUpperCase()}</Text>
          </View>
        </View>

        {!!order.foodNote?.trim() && (
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Catatan Makanan</Text>
            <Text>{order.foodNote.trim()}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Item Pesanan</Text>

        <View style={styles.tableHead}>
          <Text style={[styles.headText, styles.colNo]}>No</Text>
          <Text style={[styles.headText, styles.colItem]}>Menu</Text>
          <Text style={[styles.headText, styles.colQty]}>Qty</Text>
          <Text style={[styles.headText, styles.colPrice]}>Subtotal</Text>
        </View>

        {items.map((item, idx) => (
          <View key={`${item.key}-${idx}`} style={styles.row}>
            <Text style={styles.colNo}>{idx + 1}</Text>
            <View style={styles.colItem}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image src={item.pdfImageSrc} style={styles.itemImage} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSub}>{formatRupiah(item.price)} / item</Text>
                </View>
              </View>
            </View>
            <Text style={styles.colQty}>{item.qty}</Text>
            <Text style={styles.colPrice}>{formatRupiah(item.price * item.qty)}</Text>
          </View>
        ))}

        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text>Total Item</Text>
            <Text>{totalQty} pcs</Text>
          </View>
          <View style={styles.totalGrand}>
            <Text>Total Bayar</Text>
            <Text>{formatRupiah(order.totalPrice)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>Terima kasih sudah memesan di Warteg Digital.</Text>
      </Page>
    </Document>
  );
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfItems, setPdfItems] = useState<PdfItem[]>([]);

  useEffect(() => {
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

    fetchOrder();
  }, [orderId]);

  const safeItems = useMemo(() => (order ? toSafeItems(order) : []), [order]);

  useEffect(() => {
    let active = true;

    const loadPdfImages = async () => {
      const mapped = await Promise.all(
        safeItems.map(async (item) => ({
          ...item,
          pdfImageSrc: await fetchPdfImage(item.imageUrl),
        }))
      );

      if (active) {
        setPdfItems(mapped);
      }
    };

    if (safeItems.length > 0) {
      loadPdfImages();
    } else {
      setPdfItems([]);
    }

    return () => {
      active = false;
    };
  }, [safeItems]);

  const itemsForPdf = useMemo(() => {
    if (pdfItems.length === safeItems.length && pdfItems.length > 0) return pdfItems;
    return safeItems.map((item) => ({ ...item, pdfImageSrc: logoImage }));
  }, [pdfItems, safeItems]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-white/80 p-8 text-center text-amber-900">
        Memuat detail pesanan...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
        Pesanan tidak ditemukan.
      </div>
    );
  }

  const totalQty = safeItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-amber-100 bg-white/90 p-5 shadow-[0_8px_20px_rgba(90,58,26,0.08)] md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <Link to="/order/history" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-emerald-800">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
          <p className="font-display text-2xl text-amber-950">Detail Pesanan</p>
          <span className="w-16" />
        </div>

        <div className="grid gap-3 rounded-2xl border border-amber-100 bg-[#fffdf8] p-4 text-sm text-amber-900/80 md:grid-cols-2">
          <p>
            <span className="font-semibold text-amber-950">ID Pesanan:</span> {order._id}
          </p>
          <p>
            <span className="font-semibold text-amber-950">Tanggal:</span> {new Date(order.createdAt).toLocaleString("id-ID")}
          </p>
          <p>
            <span className="font-semibold text-amber-950">Metode:</span> {order.paymentMethod}
          </p>
          <p>
            <span className="font-semibold text-amber-950">Status:</span>{" "}
            <span className={order.paymentStatus === "paid" ? "text-emerald-700" : "text-rose-600"}>{order.paymentStatus}</span>
          </p>
        </div>

        {!!order.foodNote?.trim() && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900">
              <ReceiptText className="h-4 w-4" />
              Catatan Makanan
            </p>
            <p className="mt-1 text-sm text-amber-900/80">{order.foodNote.trim()}</p>
          </div>
        )}

        <div className="mt-5 space-y-3">
          {safeItems.map((item) => (
            <article key={item.key} className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-white p-3">
              <img src={item.imageUrl || logoImage} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-amber-950">{item.name}</p>
                <p className="text-xs text-amber-900/70">Qty: {item.qty}</p>
              </div>
              <p className="font-bold text-emerald-800">{formatRupiah(item.price * item.qty)}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-amber-100 bg-white p-4 text-sm">
          <div className="flex items-center justify-between text-amber-900/80">
            <span>Total Item</span>
            <span>{totalQty} pcs</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-base font-bold text-amber-950">
            <span>Total Bayar</span>
            <span className="text-emerald-800">{formatRupiah(order.totalPrice)}</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 sm:flex-row">
        {order.paymentStatus === "paid" && order.invoicePath && (
          <a
            href={`http://localhost:5000/invoices/${order.invoicePath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
          >
            <FileDown className="h-4 w-4" />
            Download Invoice
          </a>
        )}

        <PDFDownloadLink
          document={<OrderPDF order={order} items={itemsForPdf} />}
          fileName={`order-${order._id}.pdf`}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-emerald-700 hover:to-emerald-500"
        >
          {({ loading: generating }) => (generating ? "Menyiapkan PDF..." : "Unduh PDF")}
        </PDFDownloadLink>
      </section>
    </div>
  );
};

export default OrderDetailPage;
