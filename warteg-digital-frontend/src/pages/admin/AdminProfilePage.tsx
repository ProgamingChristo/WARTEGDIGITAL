import { useEffect, useState } from "react";
import { Camera, Loader2, Save, UserRound } from "lucide-react";
import { getAdminProfile, updateAdminProfile } from "../../api/AdminApi";
import { useAdminAuthStore } from "../../store/adminAuthStore";

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AdminProfilePage = () => {
  const { adminUser, updateAdminUser } = useAdminAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getAdminProfile();
        const data = res?.data ?? {};
        setUsername(data.username || "");
        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setProfileImage(data.profileImage || "");
        updateAdminUser(data);
      } catch {
        alert("Gagal memuat profil admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [updateAdminUser]);

  const handlePickPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2MB.");
      return;
    }

    try {
      const encoded = await fileToDataUrl(file);
      setProfileImage(encoded);
    } catch {
      alert("Gagal membaca file.");
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim()) {
      alert("Username wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        username: username.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        profileImage: profileImage.trim(),
      };

      const res = await updateAdminProfile(payload);
      const updated = res?.data ?? payload;
      updateAdminUser(updated);
      alert("Profil admin berhasil diperbarui.");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Gagal menyimpan profil admin.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#dbe2eb] bg-white p-8 text-center text-sm text-[#5f6776]">
        Memuat profil admin...
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-[#dae1ea] bg-white p-5 shadow-[0_18px_44px_rgba(19,28,38,0.08)] md:p-6">
      <h1 className="font-display text-3xl text-[#142235]">Profil Admin</h1>
      <p className="mt-1 text-sm text-[#5f6776]">Anda dapat mengubah data profil, namun password tidak bisa diubah dari halaman ini.</p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-5 lg:grid-cols-[320px,1fr]">
        <aside className="rounded-2xl border border-[#d9e0ea] bg-[#f8fbff] p-5">
          <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#d9e8f9] bg-gradient-to-br from-[#1b3a7a] to-[#2352ac] text-white">
            {profileImage ? (
              <img src={profileImage} alt="Foto profil admin" className="h-full w-full object-cover" />
            ) : (
              <UserRound className="h-10 w-10" />
            )}
          </div>

          <label className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#cfd9ea] bg-white px-3 py-2 text-sm font-semibold text-[#26406b] transition hover:bg-[#eef4ff]">
            <Camera className="h-4 w-4" />
            Ubah Foto
            <input type="file" accept="image/*" className="hidden" onChange={handlePickPhoto} />
          </label>

          <button
            type="button"
            onClick={() => setProfileImage("")}
            className="mt-2 w-full rounded-xl border border-[#f1d0d0] bg-[#fdf1f1] px-3 py-2 text-sm font-semibold text-[#a23d3d] transition hover:bg-[#fae6e6]"
          >
            Hapus Foto
          </button>
        </aside>

        <div className="space-y-3 rounded-2xl border border-[#d9e0ea] bg-[#fcfdff] p-5">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5f6776]">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-[#d5dce7] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#d6e8fb]"
              placeholder="Username admin"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5f6776]">Nama Lengkap</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-[#d5dce7] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#d6e8fb]"
              placeholder="Nama lengkap"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5f6776]">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#d5dce7] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#d6e8fb]"
                placeholder="admin@email.com"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5f6776]">No. HP</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-[#d5dce7] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#d6e8fb]"
                placeholder="08xxxxxxxxxx"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f5fa8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#184f8c] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan Profil
              </>
            )}
          </button>
        </div>
      </form>

      <p className="mt-3 text-xs text-[#7a8393]">
        Login user aktif: <span className="font-semibold">{adminUser?.username}</span>
      </p>
    </section>
  );
};

export default AdminProfilePage;
