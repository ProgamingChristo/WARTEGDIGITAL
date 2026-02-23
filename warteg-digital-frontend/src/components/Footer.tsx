import { useState, type FormEvent } from "react";
import api from "../api/axios";
import { Clock3, SendHorizonal, Sparkles } from "lucide-react";

const favorites = [
  "Nasi Telur Balado",
  "Oseng Kangkung Mercon",
  "Ayam Goreng Lengkuas",
  "Es Teh Manis Jumbo",
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSaranSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;

    setSending(true);
    try {
      await api.post("/customer/feedback", {
        email: email.trim(),
        message: message.trim(),
      });
      setEmail("");
      setMessage("");
      alert("Terima kasih! Saran Anda sudah masuk ke dapur kami.");
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim saran. Coba lagi.");
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-amber-100 bg-gradient-to-b from-[#f8f2e6] via-[#f5eadd] to-[#efddca] text-amber-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <p className="font-display text-3xl leading-none text-emerald-900">Warteg Digital</p>
          <p className="text-sm leading-relaxed text-amber-900/80">
            Rasa rumahan khas Indonesia, dibungkus pengalaman digital yang rapi, cepat, dan tetap hangat.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5" />
            Tradisi bertemu teknologi
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-display text-xl text-amber-900">Menu Andalan</h3>
          <ul className="space-y-2 text-sm text-amber-950/80">
            {favorites.map((item) => (
              <li key={item} className="rounded-lg bg-white/70 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-display text-xl text-amber-900">Jam Buka</h3>
          <div className="space-y-3 text-sm text-amber-950/80">
            <div className="rounded-xl border border-amber-200 bg-white/70 p-3">
              <p className="mb-1 inline-flex items-center gap-2 font-semibold text-amber-900">
                <Clock3 className="h-4 w-4" />
                Senin - Jumat
              </p>
              <p>07.00 - 22.00 WIB</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-white/70 p-3">
              <p className="mb-1 inline-flex items-center gap-2 font-semibold text-amber-900">
                <Clock3 className="h-4 w-4" />
                Sabtu - Minggu
              </p>
              <p>08.00 - 00.00 WIB</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-white/85 p-5 shadow-xl shadow-amber-900/5">
          <h3 className="font-display text-xl text-emerald-900">Kotak Saran</h3>
          <p className="mt-1 text-xs text-amber-900/70">Saran rasa, layanan, atau menu baru akan langsung tampil di dapur.</p>

          <form onSubmit={handleSaranSubmit} className="mt-4 space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email kamu"
              className="w-full rounded-xl border border-amber-200 bg-[#fffdf8] px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              required
            />
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis curhatan rasa..."
              className="w-full resize-none rounded-xl border border-amber-200 bg-[#fffdf8] px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              required
            />
            <button
              type="submit"
              disabled={sending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {sending ? "Mengirim..." : "Kirim ke Dapur"}
              <SendHorizonal className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="relative border-t border-amber-200/70 bg-white/60 py-4">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-6 text-xs text-amber-900/70 md:flex-row">
          <p>© 2026 Warteg Digital. Rasa tradisi, layanan modern.</p>
          <p>Dimasak hangat, dikelola cerdas.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
