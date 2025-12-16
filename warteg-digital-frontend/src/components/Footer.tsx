import React from 'react';

const Footer = () => {
  // Handler untuk submit form
  const handleSaranSubmit = (e) => {
    e.preventDefault();
    alert('Terima kasih! Saran Anda sudah masuk ke dapur kami.');
  };

  return (
    <footer className="bg-[#FFF9E6] text-gray-800 relative pt-16 overflow-hidden font-sans border-t-2 border-[#0F8A5F]">
      
      {/* Ornamen Dekoratif (Efek "Asap Dapur" Digital) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[50px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-[#0F8A5F] opacity-10"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Kolom 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* Ikon Piring Digital */}
              <div className="w-10 h-10 bg-gradient-to-br from-[#0F8A5F] to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Warteg<span className="text-[#0F8A5F]">Digital</span>
              </h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Revolusi kuliner nusantara. Rasa kaki lima, teknologi bintang lima. Pesan tongkol balado semudah update status.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Social Media Icons */}
              <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#0F8A5F] hover:text-white hover:border-[#0F8A5F] transition-all duration-300 shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#0F8A5F] hover:text-white hover:border-[#0F8A5F] transition-all duration-300 shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Kolom 2: Menu Favorit */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4 border-l-4 border-[#0F8A5F] pl-3">Menu Andalan</h3>
            <ul className="space-y-3">
              {['Nasi Telur Balado', 'Oseng Kangkung Mercon', 'Ayam Goreng Lengkuas', 'Es Teh Manis Jumbo'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-[#0F8A5F] hover:translate-x-2 transition-all duration-300 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak & Info */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4 border-l-4 border-[#0F8A5F] pl-3">Jam Buka</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#0F8A5F] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  <strong className="text-gray-900 block">Senin - Jumat</strong>
                  07:00 - 22:00 WIB
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#0F8A5F] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  <strong className="text-gray-900 block">Sabtu - Minggu</strong>
                  08:00 - 00:00 WIB (Nongkrong Time)
                </span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Form Saran (Highlight) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50">
            <h3 className="text-gray-900 font-semibold mb-1">Kotak Saran</h3>
            <p className="text-xs text-gray-500 mb-4">Kurang asin? Terlalu pedas? Bisikin ke Chef kami.</p>
            
            <form onSubmit={handleSaranSubmit}>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email kamu"
                    className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#0F8A5F] focus:ring-1 focus:ring-[#0F8A5F] transition-all placeholder-gray-400"
                    required
                  />
                </div>
                <div className="relative">
                  <textarea
                    rows="2"
                    placeholder="Tulis curhatan rasa..."
                    className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#0F8A5F] focus:ring-1 focus:ring-[#0F8A5F] transition-all placeholder-gray-400 resize-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0F8A5F] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-emerald-900/20 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Kirim ke Dapur</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 pt-8 pb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2025 Warteg Digital · Rasa Tradisi, Transaksi Digital ✨
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-[#0F8A5F] transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-[#0F8A5F] transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;