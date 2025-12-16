import { useEffect, useState } from "react";
import axiosDapur from "../../../api/axiosDapur";

const KitchenPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axiosDapur.get("/karyawan/order/kitchen").then((res) => {
      setOrders(res.data.data.filter((o: any) => o.cookingStatus === "pending"));
    });
  }, []);

  const doneCooking = async (id: string) => {
    await axiosDapur.put(`/karyawan/order/${id}/cooking`);
    setOrders((prev) => prev.filter((o: any) => o._id !== id));
  };

  return (
    <div>
      <h1>Dapur – Order Masuk</h1>
      {orders.map((o: any) => (
        <div key={o._id}>
          <p>{o.customerName}</p>
          <button onClick={() => doneCooking(o._id)}>Selesai</button>
        </div>
      ))}
    </div>
  );
};

export default KitchenPage;
