import { useEffect, useState } from "react";
import axiosKasir from "../../../api/axioKasir";

const KasirPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axiosKasir.get("/karyawan/orders").then((res) => {
      const cashOnly = res.data.data.filter(
        (o: any) => o.paymentMethod === "cash" && o.paymentStatus === "unpaid"
      );
      setOrders(cashOnly);
    });
  }, []);

  const confirmPay = async (id: string) => {
    await axiosKasir.put(`/karyawan/order/${id}/pay`);
    setOrders((prev) => prev.filter((o: any) => o._id !== id));
  };

  return (
    <div>
      <h1>Kasir – Pembayaran Cash</h1>
      {orders.map((o: any) => (
        <div key={o._id}>
          <p>{o.customerName} – Rp {o.totalPrice}</p>
          <button onClick={() => confirmPay(o._id)}>Bayar</button>
        </div>
      ))}
    </div>
  );
};

export default KasirPage;
