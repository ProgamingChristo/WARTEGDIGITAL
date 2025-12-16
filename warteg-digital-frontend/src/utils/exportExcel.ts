
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { AdminOrderDetail } from "./types";

export const exportOrdersExcel = (orders: AdminOrderDetail[]): void => {
  const data = orders.map((o) => ({
    Customer: o.customerName,
    Total: o.totalPrice,
    Status: o.status,
    Payment: o.paymentStatus,
    Method: o.paymentMethod,
    Date: new Date(o.createdAt).toLocaleString("id-ID"),
  }));

  /* 1. buat worksheet dari array-of-objects */
  const ws = XLSX.utils.json_to_sheet(data);

  /* 2. buat workbook baru */
  const wb = XLSX.utils.book_new();

  /* 3. tempel worksheet ke workbook */
  XLSX.utils.book_append_sheet(wb, ws, "Orders");

  /* 4. tulis ke buffer */
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  /* 5. download */
  saveAs(new Blob([excelBuffer]), "laporan-order.xlsx");
};
