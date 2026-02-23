import { useEffect, useState } from "react";
import axiosDapur from "../../../api/axiosDapur";
import { BadgeCheck, ChefHat, LogOut, Search, Timer } from "lucide-react";

interface KitchenItem {
  _id: string;
  menuId: string;
  qty: number;
}

interface KitchenOrder {
  _id: string;
  customerName: string;
  items: KitchenItem[];
  cookingStatus: "waiting" | "pending" | "cooking" | "done";
  paymentStatus: "paid";
  createdAt: string;
  foodNote?: string;
}

interface KitchenFeedback {
  _id: string;
  email: string;
  message: string;
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

const KitchenPage = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [feedbacks, setFeedbacks] = useState<KitchenFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState<AttendanceInfo | null>(null);
  const [attending, setAttending] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const [orderRes, feedbackRes] = await Promise.all([
        axiosDapur.get<{ data: KitchenOrder[] }>("/karyawan/order/kitchen"),
        axiosDapur.get<{ data: KitchenFeedback[] }>("/karyawan/feedback"),
      ]);
      const pending = (orderRes.data.data || []).filter((o) =>
        ["waiting", "pending", "cooking"].includes(o.cookingStatus)
      );
      setOrders(pending);
      setFeedbacks(feedbackRes.data.data ?? []);
    } catch {
      alert("Gagal mengambil data dapur.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axiosDapur.get("/karyawan/absen/status");
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
      const res = await axiosDapur.post("/karyawan/absen");
      setAttendance(res.data?.data ?? null);
      alert("Absensi berhasil.");
    } catch (error) {
      alert(readErrorMessage(error, "Gagal melakukan absensi."));
    } finally {
      setAttending(false);
      fetchAttendance();
    }
  };

  const handleDone = async (id: string) => {
    if (!confirm("Tandai masakan selesai?")) return;
    try {
      await axiosDapur.put(`/karyawan/order/${id}/cooking`, { status: "done" });
      await fetchOrders();
      alert("Status masakan berhasil diperbarui.");
    } catch (error) {
      alert(readErrorMessage(error, "Gagal update status masak."));
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
    <div className="min-h-screen bg-[#eef4ef]">
      <header className="sticky top-0 z-20 border-b border-[#d7e3d9] bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-display text-2xl text-[#1d3524]">Dapur</h1>
            <p className="text-xs uppercase tracking-[0.16em] text-[#376149]">Kitchen Queue</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-[#f0d5d5] bg-[#fdecec] px-3 py-2 text-sm font-semibold text-[#ad3b3b] transition hover:bg-[#fbdede]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-5 px-6 py-6">
        <section className="rounded-2xl border border-[#d8e3da] bg-white p-4 shadow-[0_10px_24px_rgba(24,33,25,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#2f4a38]">Absensi Shift</p>
              <p className="text-xs text-[#5e7a67]">
                {attendance?.shift
                  ? `Shift ${attendance.shift} (${attendance.shiftWindowWIB})`
                  : "Memuat shift..."}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#5a7563]">
                <Timer className="h-3.5 w-3.5" />
                {attendance?.serverTimeWIB || "-"}
              </p>
            </div>
            <button
              onClick={handleAttend}
              disabled={attending || !attendance?.canAttendNow}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2f6f4a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#285f3f] disabled:cursor-not-allowed disabled:bg-[#9bb6a5]"
            >
              <BadgeCheck className="h-4 w-4" />
              {attendance?.alreadyAttendToday ? "Sudah Absen Hari Ini" : "Absen Sekarang"}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-[#d8e3da] bg-white p-4 shadow-[0_10px_24px_rgba(24,33,25,0.08)]">
          <h2 className="text-sm font-semibold text-[#2f4a38]">Kotak Saran Masuk</h2>
          {feedbacks.length === 0 ? (
            <p className="mt-2 text-sm text-[#6a7e72]">Belum ada saran terbaru.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {feedbacks.slice(0, 6).map((feedback) => (
                <article key={feedback._id} className="rounded-xl border border-[#d9e8dd] bg-[#f7fbf8] px-3 py-2">
                  <p className="text-[11px] text-[#668173]">{feedback.email}</p>
                  <p className="text-sm text-[#334e3f]">{feedback.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#d8e3da] bg-white p-4 shadow-[0_10px_24px_rgba(24,33,25,0.08)]">
          <label className="relative block max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b9082]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama customer..."
              className="w-full rounded-xl border border-[#d8e1db] bg-[#fbfdfc] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#2f6f4a] focus:ring-2 focus:ring-[#d7eddc]"
            />
          </label>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={`dapur-skeleton-${idx}`} className="h-32 animate-pulse rounded-xl border border-[#dce8de] bg-[#f4f9f5]" />
              ))
            ) : filtered.length === 0 ? (
              <p className="col-span-full rounded-xl border border-dashed border-[#cad8cc] bg-[#f8fbf8] p-6 text-center text-sm text-[#62796c]">
                Tidak ada order untuk dimasak.
              </p>
            ) : (
              filtered.map((order) => (
                <article key={order._id} className="rounded-xl border border-[#d6e5d9] bg-[#fcfefd] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#1f3a2b]">{order.customerName}</p>
                      <p className="mt-1 text-xs text-[#667c6d]">
                        {order.items.reduce((sum, item) => sum + item.qty, 0)} item
                      </p>
                    </div>
                    <button
                      onClick={() => handleDone(order._id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#2f6f4a] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#285f3f]"
                    >
                      <ChefHat className="h-3.5 w-3.5" />
                      Selesai
                    </button>
                  </div>

                  {order.foodNote?.trim() && (
                    <div className="mt-3 rounded-lg border border-[#ead9b8] bg-[#fff7e6] px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9b6f30]">Catatan Makanan</p>
                      <p className="text-sm text-[#8a612a]">{order.foodNote.trim()}</p>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default KitchenPage;
