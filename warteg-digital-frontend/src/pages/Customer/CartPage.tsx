// src/pages/Cart/CartPage.tsx
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useCartStore } from "../../store/cartStore";
import { formatRupiah } from "../../utils/helpers";
import { ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const navigate = useNavigate();
  const {
    items,
    total,
    loading,
    fetchCart,
    updateCartItem,
    deleteCartItem,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, []);

  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen bg-[#FFF8EA] pb-10">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-center relative mb-6">
          <Link
            to="/"
            className="absolute left-0 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transition"
          >
            <ArrowLeft className="text-orange-600" size={20} />
          </Link>

          <div className="flex items-center gap-2">
            <img src={logo} className="w-8 h-8 rounded-full shadow" />
            <h1 className="text-xl font-bold text-gray-800 tracking-wide">
              Keranjang
            </h1>
          </div>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <p className="text-center text-gray-500">Memuat keranjang...</p>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && items.length === 0 && (
          <div className="text-center py-10">
            <i className="fas fa-shopping-basket text-5xl text-gray-300 mb-3"></i>
            <p className="text-gray-600 mb-4">Keranjang kamu masih kosong.</p>

            <Link
              to="/"
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full shadow hover:bg-orange-600 transition"
            >
              Tambah Menu
            </Link>
          </div>
        )}

        {/* ================= ITEMS ================= */}
        <div className="grid gap-4">
          {items.map((it) => (
            <div
              key={it.menu._id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 flex gap-4 items-center"
            >
              <img
                src={it.menu.imageUrl || "https://via.placeholder.com/150"}
                alt={it.menu.name}
                className="w-24 h-24 rounded-xl object-cover shadow"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{it.menu.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {it.menu.description || "Menu spesial warteg"}
                </p>

                <p className="font-bold text-orange-600 mt-2">
                  {formatRupiah(it.menu.price * it.qty)}
                </p>

                {/* Qty Controls */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartItem(it.menu._id, it.qty - 1)}
                      disabled={it.qty <= 1}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 disabled:opacity-40 transition"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="w-6 text-center text-gray-800 font-semibold">
                      {it.qty}
                    </span>

                    <button
                      onClick={() => updateCartItem(it.menu._id, it.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteCartItem(it.menu._id)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* =================== CATATAN MAKANAN =================== */}
        {items.length > 0 && (
          <div className="mt-6 bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Catatan Makanan
            </h3>
            <textarea
              className="w-full bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              rows={3}
              placeholder="Contoh: Jangan pedas, sausnya dipisah, tambahkan nasi..."
            />
          </div>
        )}

        {/* =================== FOOTER (TOTAL) =================== */}
        {items.length > 0 && (
          <div className="mt-8 mb-10 bg-white rounded-xl p-5 shadow border border-orange-100">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Total Item</span>
              <span className="text-gray-900 font-medium">{totalQty} pcs</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Ongkir</span>
              <span className="text-green-600 font-medium">Gratis</span>
            </div>

            <div className="flex justify-between text-lg font-bold mb-3">
              <span>Total Bayar</span>
              <span className="text-orange-600">{formatRupiah(total)}</span>
            </div>

            <button
  onClick={() => navigate("/checkout")}
  className="w-full mt-4 bg-gradient-to-r from-orange-500 to-amber-500 
             text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl 
             transition transform active:scale-95"
>
  Checkout
</button>
            
          </div>
        )}

      </div>
    </div>
  );
};

export default CartPage;
