import { useAdminAuthStore } from "../../store/adminAuthStore";

const AdminTopbar = () => {
  const { adminUser } = useAdminAuthStore();

  return (
    <header className="w-full h-16 bg-white border-b flex items-center justify-end px-6">
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-700">Halo, {adminUser?.username}</p>
        <p className="text-xs text-gray-500">{adminUser?.role}</p>
      </div>
    </header>
  );
};

export default AdminTopbar;
