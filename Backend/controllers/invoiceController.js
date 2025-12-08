import Order from "../models/Orders.js";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";

// ===================================================================
// 🔥 INTERNAL FUNCTION — Generate Invoice (Dipanggil webhook & manual)
// ===================================================================
const generateInvoice = async (order) => {
  return new Promise(async (resolve, reject) => {
    const dir = "./invoices";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const fileName = `invoice-${order.midtransOrderId}.pdf`;
    const filePath = path.join(dir, fileName);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // HEADER
    const green = "#0FA958";
    doc.fillColor(green).fontSize(26).text("Warteg Digital", { align: "center" });
    doc.fillColor("#333").fontSize(14).text("Invoice Pembelian", { align: "center" });
    doc.moveDown(1);

    doc.strokeColor(green).moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

    // QR CODE
    const qrData = order.midtransOrderId;
    const qrImage = await QRCode.toDataURL(qrData);
    const qrBuffer = Buffer.from(qrImage.split(",")[1], "base64");
    doc.image(qrBuffer, 430, 80, { width: 110 });

    // ORDER INFO
    doc.fillColor("#000").fontSize(12);
    doc.text(`Invoice ID   : ${order.midtransOrderId}`);
    doc.text(`Customer     : ${order.customerName}`);
    doc.text(`Payment      : ${order.paymentStatus}`);
    doc.text(`Total Price  : Rp ${order.totalPrice.toLocaleString("id-ID")}`);
    doc.moveDown(1);

    doc.strokeColor(green).moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

    // ITEMS TABLE
    doc.fontSize(14).text("Detail Pesanan:", { underline: true });
    doc.moveDown(0.5);

    const tableTop = doc.y;

    // Header table
    doc.fillColor("#FFF").rect(50, tableTop, 500, 22).fill(green);
    doc.fillColor("#FFF")
      .text("No", 60, tableTop + 6)
      .text("Nama Menu", 120, tableTop + 6)
      .text("Qty", 360, tableTop + 6)
      .text("Subtotal", 430, tableTop + 6);

    let y = tableTop + 28;

    // Rows
    order.items.forEach((item, index) => {
      const menuName = item.menuId?.name || "Menu tidak ditemukan";
      const subtotal = item.qty * (item.menuId?.price || 0);

      if (index % 2 === 0) {
        doc.fillColor("#F2FFF5").rect(50, y - 3, 500, 22).fill();
      }

      doc.fillColor("#000")
        .fontSize(12)
        .text(index + 1, 60, y)
        .text(menuName, 120, y)
        .text(item.qty, 360, y)
        .text(`Rp ${subtotal.toLocaleString("id-ID")}`, 430, y);

      y += 22;
    });

    doc.moveDown(2);

    // FOOTER
    doc.fontSize(12).fillColor("#333")
      .text("Terima kasih telah berbelanja di Warteg Digital 💚", { align: "center" });
    doc.text("Pesanan Anda sedang diproses...", { align: "center" });

    doc.end();

    stream.on("finish", () => resolve(fileName));
    stream.on("error", reject);
  });
};

// ===================================================================
// 🔥 Manual Generate (Testing via Postman) — Tetap DIEKSPORT
// ===================================================================
export const generateInvoiceManually = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items.menuId", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    const filename = await generateInvoice(order);

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

// ===================================================================
// 🟦 File Downloader (Route /api/invoice/:filename) — Tetap DIEKSPORT
// ===================================================================
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
export const generateInvoiceForWebhook = generateInvoice;
