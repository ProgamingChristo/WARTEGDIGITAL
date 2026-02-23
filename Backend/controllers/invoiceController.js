import Order from "../models/Orders.js";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";

const formatCurrency = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const THEME = {
  green: "#1f6a4a",
  greenDark: "#184f37",
  gold: "#d6a54b",
  cream: "#f8f1e4",
  text: "#2b2218",
  muted: "#6f6255",
  border: "#e7dbc7",
};

const drawTableHeader = (doc, y) => {
  const rowHeight = 22;

  doc.save();
  doc.rect(50, y, 500, rowHeight).fill(THEME.greenDark);
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10);
  doc.text("No", 58, y + 6);
  doc.text("Menu", 92, y + 6);
  doc.text("Qty", 332, y + 6, { width: 36, align: "right" });
  doc.text("Harga", 380, y + 6, { width: 70, align: "right" });
  doc.text("Subtotal", 460, y + 6, { width: 82, align: "right" });
  doc.restore();

  return y + rowHeight;
};

const generateInvoicePdf = async (order) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dir = "./invoices";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      const orderCode = order.midtransOrderId || order._id;
      const fileName = `invoice-${orderCode}.pdf`;
      const filePath = path.join(dir, fileName);

      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();

      doc.rect(0, 0, doc.page.width, 120).fill(THEME.green);

      doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(24).text("Warteg Digital", 50, 44);
      doc.font("Helvetica").fontSize(11).text("Invoice Pesanan", 50, 74);

      const qrSource = `${orderCode}`;
      const qrDataUrl = await QRCode.toDataURL(qrSource, {
        margin: 0,
        color: { dark: "#FFFFFF", light: "#00000000" },
      });
      const qrBuffer = Buffer.from(qrDataUrl.split(",")[1], "base64");
      doc.image(qrBuffer, 486, 34, { width: 64, height: 64 });

      let y = 145;

      doc.fillColor(THEME.text).font("Helvetica-Bold").fontSize(11).text("Informasi Transaksi", 50, y);
      y += 18;

      doc.lineWidth(1).strokeColor(THEME.border).rect(50, y, 500, 92).stroke();

      doc.font("Helvetica").fontSize(10).fillColor(THEME.muted);
      doc.text("Invoice ID", 62, y + 14);
      doc.text("Tanggal", 62, y + 34);
      doc.text("Metode Bayar", 62, y + 54);
      doc.text("Status Bayar", 62, y + 74);

      doc.fillColor(THEME.text).font("Helvetica-Bold");
      doc.text(`: ${orderCode}`, 140, y + 14);
      doc.text(`: ${orderDate.toLocaleString("id-ID")}`, 140, y + 34);
      doc.text(`: ${(order.paymentMethod || "-").toUpperCase()}`, 140, y + 54);
      doc.text(`: ${(order.paymentStatus || "-").toUpperCase()}`, 140, y + 74);

      doc.fillColor(THEME.muted).font("Helvetica");
      doc.text("Customer", 330, y + 14);
      doc.fillColor(THEME.text).font("Helvetica-Bold");
      doc.text(`: ${order.customerName || "-"}`, 392, y + 14, { width: 150 });

      y += 116;

      doc.fillColor(THEME.text).font("Helvetica-Bold").fontSize(11).text("Rincian Pesanan", 50, y);
      y += 14;
      y = drawTableHeader(doc, y);

      const items = Array.isArray(order.items) ? order.items : [];
      const rowHeight = 24;
      let itemIndex = 1;

      for (const item of items) {
        if (y > doc.page.height - 120) {
          doc.addPage();
          y = 50;
          doc.fillColor(THEME.text).font("Helvetica-Bold").fontSize(11).text("Rincian Pesanan (lanjutan)", 50, y);
          y += 14;
          y = drawTableHeader(doc, y);
        }

        const unitPrice = item.menuId?.price || 0;
        const subtotal = unitPrice * (item.qty || 0);
        const menuName = item.menuId?.name || "Menu tidak tersedia";

        if (itemIndex % 2 === 0) {
          doc.save();
          doc.rect(50, y, 500, rowHeight).fill(THEME.cream);
          doc.restore();
        }

        doc.fillColor(THEME.text).font("Helvetica").fontSize(10);
        doc.text(`${itemIndex}`, 58, y + 7);
        doc.text(menuName, 92, y + 7, { width: 220, ellipsis: true });
        doc.text(`${item.qty || 0}`, 332, y + 7, { width: 36, align: "right" });
        doc.text(formatCurrency(unitPrice), 380, y + 7, { width: 70, align: "right" });
        doc.text(formatCurrency(subtotal), 460, y + 7, { width: 82, align: "right" });

        y += rowHeight;
        itemIndex += 1;
      }

      y += 14;
      if (y > doc.page.height - 130) {
        doc.addPage();
        y = 60;
      }

      doc.save();
      doc.roundedRect(340, y, 210, 66, 10).fill("#f6ead1");
      doc.restore();

      doc.fillColor(THEME.muted).font("Helvetica").fontSize(10).text("Total Pembayaran", 354, y + 14);
      doc.fillColor(THEME.green).font("Helvetica-Bold").fontSize(16).text(formatCurrency(order.totalPrice), 354, y + 32);

      y += 82;

      if (order.foodNote?.trim()) {
        if (y > doc.page.height - 110) {
          doc.addPage();
          y = 60;
        }

        doc.fillColor(THEME.text).font("Helvetica-Bold").fontSize(10).text("Catatan Makanan", 50, y);
        y += 12;

        doc.save();
        doc.roundedRect(50, y, 500, 48, 8).fill("#fffaf0");
        doc.restore();

        doc.fillColor(THEME.muted).font("Helvetica").fontSize(10).text(order.foodNote.trim(), 60, y + 12, {
          width: 480,
        });

        y += 64;
      }

      if (y > doc.page.height - 70) {
        doc.addPage();
        y = 60;
      }

      doc.moveTo(50, y).lineTo(550, y).lineWidth(1).strokeColor(THEME.border).stroke();
      doc.fillColor(THEME.muted).font("Helvetica").fontSize(9).text(
        "Terima kasih sudah memesan di Warteg Digital. Pesanan Anda diproses dengan cita rasa khas Indonesia.",
        50,
        y + 10,
        { align: "center", width: 500 }
      );

      doc.end();

      stream.on("finish", () => resolve(fileName));
      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};

export const generateInvoiceManually = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items.menuId", "name price imageUrl");

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    const filename = await generateInvoicePdf(order);

    res.json({
      message: "Invoice berhasil dibuat",
      file: filename,
      downloadUrl: `/api/invoice/${filename}`,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal membuat invoice",
      error: err.message,
    });
  }
};

export const getInvoiceFile = async (req, res) => {
  try {
    const file = req.params.filename;
    const filePath = path.join("./invoices", file);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Invoice tidak ditemukan" });
    }

    res.sendFile(path.resolve(filePath));
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil invoice",
      error: err.message,
    });
  }
};

export const generateInvoiceForWebhook = generateInvoicePdf;
