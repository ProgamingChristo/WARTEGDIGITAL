const SuperAdminDashboard = () => {
  const fullName = localStorage.getItem("superadminName");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Selamat datang, {fullName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/superadmin/admin"
          className="p-6 bg-white shadow rounded-xl hover:ring"
        >
          <h2 className="text-lg font-semibold">Kelola Admin</h2>
          <p className="text-sm text-gray-500">
            Tambah, edit, dan hapus admin
          </p>
        </a>

        <a
          href="/superadmin/report"
          className="p-6 bg-white shadow rounded-xl hover:ring"
        >
          <h2 className="text-lg font-semibold">Laporan Global</h2>
          <p className="text-sm text-gray-500">
            Statistik seluruh sistem
          </p>
        </a>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
