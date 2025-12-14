import type { MenuType } from "../utils/types";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const MenuCard = ({ menu }: { menu: MenuType }) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!token) {
      alert("Harus login dulu!");
      return navigate("/login");
    }

    await addToCart(menu);
    alert("Berhasil ditambahkan ke keranjang!");
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
      <img
        src={menu.imageUrl || "/no-image.jpg"}
        alt={menu.name}
        className="w-full h-44 object-cover"
      />

      <div className="p-4 flex flex-col">
        <h3 className="font-semibold text-lg">{menu.name}</h3>
        <p className="text-green-600 font-bold mt-1">
          Rp {menu.price.toLocaleString("id-ID")}
        </p>

        <button
          onClick={handleAdd}
          className="mt-auto bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Tambah
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
