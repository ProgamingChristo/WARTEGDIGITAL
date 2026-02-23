import { useEffect, useState } from "react";
import axiosKasir from "../../../api/axioKasir";
import { BadgeCheck, CreditCard, LogOut, Search, Timer } from "lucide-react";

interface OrderItem {
  _id: string;
  menuId: string;
  qty: number;
}

interface KasirOrder {
  _id: string;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: "cash";
  paymentStatus: "paid" | "unpaid";
  status: string;
  createdAt: string;
}

interface AttendanceInfo {
  serverTimeWIB: string;
  dateWIB: string;
  shift: "pagi" | "siang" | "malam" | string;
  shiftWindowWIB: string;
  alreadyAttendToday: boolean;
  canAttendNow: boolean;
}

const readErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message || fallback;

const KasirPage = () => {
  const [orders, setOrders] = useState<KasirOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState<AttendanceInfo | null>(null);
  const [attending, setAttending] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosKasir.get<{ data: KasirOrder[] }>("/karyawan/orders");
      const cashUnpaid = (res.data.data || []).filter(
        (o) => o.paymentMethod === "cash" && o.paymentStatus === "unpaid"
      );
      setOrders(cashUnpaid);
    } catch {
      alert("Gagal mengambil data kasir.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axiosKasir.get("/karyawan/absen/status");
      setAttendance(res.data?.data?.attendance ?? null);
    } catch {
      setAttendance(null);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchAttendance();
  }, []);

  const handleAttend = async () => {
    setAttending(true);
    try {
      const res = await axiosKasir.post("/karyawan/absen");
      setAttendance(res.data?.data ?? null);
      alert("Absensi berhasil.");
    } catch (error) {
      alert(readErrorMessage(error, "Gagal melakukan absensi."));
    } finally {
      setAttending(false);
      fetchAttendance();
    }
  };

  const handlePay = async (id: string) => {
    if (!confirm("Konfirmasi pembayaran cash?")) return;
    try {
      await axiosKasir.put(`/karyawan/order/${id}/pay`);
      await fetchOrders();
      alert("Pembayaran berhasil dikonfirmasi.");
    } catch (error) {
      alert(readErrorMessage(error, "Gagal konfirmasi pembayaran."));
    }
  };

  const handleLogout = () => {
    if (!confirm("Yakin ingin keluar?")) return;
    localStorage.removeItem("tokenKaryawan");
    localStorage.removeItem("tokenKasir");
    localStorage.removeItem("tokenDapur");
    localStorage.removeItem("karyawanRole");
    localStorage.removeItem("karyawanShift");
    window.location.href = "/karyawan/login";
  };

  const filtered = orders.filter((o) =>
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#edf4f1]">
      <header className="sticky top-0 z-20 border-b border-[#d4e5de] bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-display text-2xl text-[#12312f]">Kasir</h1>
            <p className="text-xs uppercase tracking-[0.16em] text-[#2d6b64]">Cash Counter</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-[#f3d0d0] bg-[#fdecec] px-3 py-2 text-sm font-semibold text-[#ad3b3b] transition hover:bg-[#fbdede]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-5 px-6 py-6">
        <section className="rounded-2xl border border-[#d5e3dc] bg-white p-4 shadow-[0_10px_24px_rgba(17,31,27,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#244340]">Absensi Shift</p>
              <p className="text-xs text-[#4d6c69]">
                {attendance?.shift
                  ? `Shift ${attendance.shift} (${attendance.shiftWindowWIB})`
                  : "Memuat shift..."}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#506f6b]">
                <Timer className="h-3.5 w-3.5" />
                {attendance?.serverTimeWIB || "-"}
              </p>
            </div>

            <button
              onClick={handleAttend}
              disabled={attending || !attendance?.canAttendNow}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#136f63] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f5d53] disabled:cursor-not-allowed disabled:bg-[#96b2ad]"
            >
              <BadgeCheck className="h-4 w-4" />
              {attendance?.alreadyAttendToday ? "Sudah Absen Hari Ini" : "Absen Sekarang"}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-[#d5e3dc] bg-white p-4 shadow-[0_10px_24px_rgba(17,31,27,0.08)]">
          <label className="relative block max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#728f8b]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama customer..."
              className="w-full rounded-xl border border-[#d7e1de] bg-[#fbfdfd] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#136f63] focus:ring-2 focus:ring-[#d6efe9]"
            />
          </label>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={`kasir-skeleton-${idx}`} className="h-28 animate-pulse rounded-xl border border-[#dce7e3] bg-[#f4f8f7]" />
              ))
            ) : filtered.length === 0 ? (
              <p className="col-span-full rounded-xl border border-dashed border-[#c7d9d2] bg-[#f8fbfa] p-6 text-center text-sm text-[#5f7b77]">
                Tidak ada pembayaran cash yang menunggu konfirmasi.
              </p>
            ) : (
              filtered.map((order) => (
                <article key={order._id} className="rounded-xl border border-[#d8e5e1] bg-[#fcfefd] p-4">
                  <p className="font-semibold text-[#152f2d]">{order.customerName}</p>
                  <p className="mt-1 text-sm font-bold text-[#136f63]">
                    Rp {Number(order.totalPrice || 0).toLocaleString("id-ID")}
                  </p>
                  <p className="mt-1 text-xs text-[#627f7b]">
                    {new Date(order.createdAt).toLocaleString("id-ID")}
                  </p>

                  <button
                    onClick={() => handlePay(order._id)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#174a95] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#123f7e]"
                  >
                    <CreditCard className="h-4 w-4" />
                    Konfirmasi Bayar
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default KasirPage;
