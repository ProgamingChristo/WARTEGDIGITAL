import { useEffect, useMemo, useState } from "react";
import { Activity, ClipboardList, Package2, TrendingUp, UsersRound } from "lucide-react";
import api from "../../api/axios";

type DashboardStats = {
  menuCount: number;
  outOfStockCount: number;
  karyawanCount: number;
  orderCount: number;
  paidIncome: number;
  attendanceToday: number;
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    menuCount: 0,
    outOfStockCount: 0,
    karyawanCount: 0,
    orderCount: 0,
    paidIncome: 0,
    attendanceToday: 0,
  });

  const todayWIB = useMemo(
    () =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    []
  );

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [menuRes, karyawanRes, orderRes, absensiRes] = await Promise.all([
          api.get("/admin/menu"),
          api.get("/admin/karyawan"),
          api.get("/admin/order"),
          api.get("/admin/absensi"),
        ]);

        const menus = Array.isArray(menuRes.data?.data) ? menuRes.data.data : [];
        const karyawan = Array.isArray(karyawanRes.data?.data) ? karyawanRes.data.data : [];
        const orders = Array.isArray(orderRes.data?.data) ? orderRes.data.data : [];
        const absensi = Array.isArray(absensiRes.data?.data) ? absensiRes.data.data : [];

        const paidIncome = orders
          .filter((order: any) => order.paymentStatus === "paid")
          .reduce((sum: number, order: any) => sum + Number(order.totalPrice || 0), 0);

        const attendanceToday = absensi.reduce((sum: number, karyawanItem: any) => {
          const isAttendToday = (karyawanItem.attendance || []).some((entry: any) => {
            const key = new Intl.DateTimeFormat("en-CA", {
              timeZone: "Asia/Jakarta",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(new Date(entry.date));
            return key === todayWIB && entry.status === "hadir";
          });
          return sum + (isAttendToday ? 1 : 0);
        }, 0);

        setStats({
          menuCount: menus.length,
          outOfStockCount: menus.filter((menu: any) => Number(menu.stock ?? 0) <= 0).length,
          karyawanCount: karyawan.length,
          orderCount: orders.length,
          paidIncome,
          attendanceToday,
        });
      } catch {
        alert("Gagal memuat dashboard admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [todayWIB]);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-[#dbe2ec] bg-white p-5 shadow-[0_18px_44px_rgba(19,28,38,0.08)] md:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#60728c]">Admin Overview</p>
        <h1 className="mt-2 font-display text-4xl text-[#13243a]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#5f6776]">Pantau operasional warteg digital secara real-time dari satu layar.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl border border-[#d8e1ec] bg-white p-5 shadow-[0_8px_20px_rgba(19,28,38,0.06)]">
          <div className="inline-flex rounded-xl bg-[#e8f0fc] p-2 text-[#2457a7]">
            <Package2 className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm text-[#60728c]">Total Menu</p>
          <p className="text-3xl font-bold text-[#152338]">{loading ? "-" : stats.menuCount}</p>
          <p className="mt-1 text-xs text-[#7c889a]">Out of stock: {loading ? "-" : stats.outOfStockCount}</p>
        </article>

        <article className="rounded-2xl border border-[#d8e1ec] bg-white p-5 shadow-[0_8px_20px_rgba(19,28,38,0.06)]">
          <div className="inline-flex rounded-xl bg-[#e7f5ef] p-2 text-[#1d7f57]">
            <UsersRound className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm text-[#60728c]">Total Karyawan</p>
          <p className="text-3xl font-bold text-[#152338]">{loading ? "-" : stats.karyawanCount}</p>
          <p className="mt-1 text-xs text-[#7c889a]">Hadir hari ini: {loading ? "-" : stats.attendanceToday}</p>
        </article>

        <article className="rounded-2xl border border-[#d8e1ec] bg-white p-5 shadow-[0_8px_20px_rgba(19,28,38,0.06)]">
          <div className="inline-flex rounded-xl bg-[#fff2e4] p-2 text-[#b26a16]">
            <ClipboardList className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm text-[#60728c]">Total Order</p>
          <p className="text-3xl font-bold text-[#152338]">{loading ? "-" : stats.orderCount}</p>
          <p className="mt-1 text-xs text-[#7c889a]">Semua order dari customer</p>
        </article>

        <article className="rounded-2xl border border-[#d8e1ec] bg-white p-5 shadow-[0_8px_20px_rgba(19,28,38,0.06)] sm:col-span-2 xl:col-span-2">
          <div className="inline-flex rounded-xl bg-[#e8f8f4] p-2 text-[#117867]">
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm text-[#60728c]">Total Pendapatan (Paid)</p>
          <p className="text-3xl font-bold text-[#136f63]">
            {loading ? "-" : `Rp ${Number(stats.paidIncome || 0).toLocaleString("id-ID")}`}
          </p>
          <p className="mt-1 text-xs text-[#7c889a]">Nilai akumulasi pembayaran berhasil.</p>
        </article>

        <article className="rounded-2xl border border-[#d8e1ec] bg-white p-5 shadow-[0_8px_20px_rgba(19,28,38,0.06)]">
          <div className="inline-flex rounded-xl bg-[#f0edff] p-2 text-[#6346d8]">
            <Activity className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm text-[#60728c]">Tanggal WIB</p>
          <p className="text-xl font-bold text-[#1b2440]">{todayWIB}</p>
          <p className="mt-1 text-xs text-[#7c889a]">Basis waktu absensi: Asia/Jakarta.</p>
        </article>
      </section>
    </div>
  );
};

export default AdminDashboard;
