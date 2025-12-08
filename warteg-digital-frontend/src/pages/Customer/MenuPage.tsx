import { useEffect } from "react";
import useMenuStore from "../../store/menuStore";
import useCartStore from "../../store/cartStore";

const MenuPage = () => {
  const { menus, loading, fetchMenus } = useMenuStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Daftar Menu</h1>

      {loading && <p>Loading menu...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menus.map((menu) => (
          <div
            key={menu._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-bold">{menu.name}</h2>
            <p className="text-gray-600">Rp {menu.price.toLocaleString()}</p>

            <button
              onClick={() => addToCart(menu)}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Tambah ke Keranjang
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
