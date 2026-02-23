import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, KeyRound, Loader2, MapPin, Save, Trash2, UserRound } from "lucide-react";
import { getCustomerProfile, updateCustomerPassword, updateCustomerProfile } from "../../api/customerApi";
import { useAuthStore } from "../../store/authStore";

type ProfileResponseData = {
  id?: string;
  username?: string;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  role?: string;
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getInitials = (name?: string) => {
  const source = (name || "CU").trim();
  if (!source) return "CU";

  const chunks = source.split(/\s+/).slice(0, 2);
  return chunks.map((chunk) => chunk.charAt(0).toUpperCase()).join("");
};

const CustomerProfilePage = () => {
  const navigate = useNavigate();
  const { token, user, updateUser } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [initialImage, setInitialImage] = useState("");
  const [removePhoto, setRemovePhoto] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await getCustomerProfile();
        const data = (res.data?.data || {}) as ProfileResponseData;
        const displayName = (data.username || data.name || "").trim();
        const image = data.profileImage || "";

        setUsername(displayName);
        setAddress(data.address || "");
        setProfileImage(image);
        setInitialImage(image);
        setRemovePhoto(false);

        updateUser({
          id: data.id,
          username: data.username || data.name,
          name: data.name || data.username,
          address: data.address,
          email: data.email,
          phone: data.phone,
          profileImage: data.profileImage,
          role: (data.role as "customer" | undefined) || "customer",
        });
      } catch {
        alert("Gagal memuat profil customer.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [token, navigate, updateUser]);

  const displayName = useMemo(
    () => username.trim() || user?.username || user?.name || "Customer",
    [username, user?.name, user?.username]
  );

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
      setRemovePhoto(false);
    } catch {
      alert("Gagal membaca file gambar.");
    } finally {
      event.target.value = "";
    }
  };

  const handleRemovePhoto = () => {
    setProfileImage("");
    setRemovePhoto(true);
  };

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedUsername = username.trim();
    const normalizedAddress = address.trim();

    if (!normalizedUsername) {
      alert("Username tidak boleh kosong.");
      return;
    }

    if (!normalizedAddress) {
      alert("Alamat tidak boleh kosong.");
      return;
    }

    const payload: {
      username: string;
      address: string;
      profileImage?: string;
      removeProfileImage?: boolean;
    } = {
      username: normalizedUsername,
      address: normalizedAddress,
    };

    if (removePhoto) {
      payload.removeProfileImage = true;
    } else if (profileImage && profileImage !== initialImage) {
      payload.profileImage = profileImage;
    }

    setIsSavingProfile(true);
    try {
      const res = await updateCustomerProfile(payload);
      const updated = (res.data?.data || {}) as ProfileResponseData;
      const nextImage = updated.profileImage || "";

      setUsername((updated.username || updated.name || normalizedUsername).trim());
      setAddress(updated.address || normalizedAddress);
      setProfileImage(nextImage);
      setInitialImage(nextImage);
      setRemovePhoto(false);

      updateUser(
        {
          id: updated.id,
          username: updated.username || updated.name,
          name: updated.name || updated.username,
          address: updated.address,
          email: updated.email,
          phone: updated.phone,
          profileImage: updated.profileImage,
          role: (updated.role as "customer" | undefined) || "customer",
        },
        typeof res.data?.token === "string" ? res.data.token : undefined
      );

      alert("Profil berhasil diperbarui.");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Lengkapi semua field password.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Konfirmasi password tidak sama.");
      return;
    }

    setIsSavingPassword(true);
    try {
      await updateCustomerPassword({
        oldPassword,
        newPassword,
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password berhasil diperbarui.");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Gagal memperbarui password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-white/80 p-8 text-center text-amber-900">
        Memuat profil customer...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-amber-100 bg-white/90 p-5 shadow-[0_10px_24px_rgba(90,58,26,0.09)] md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-emerald-800">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke menu
          </Link>
          <p className="font-display text-2xl text-amber-950">Profil Customer</p>
          <span className="w-24" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
          <aside className="rounded-2xl border border-amber-100 bg-[#fffdf8] p-5">
            <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-100 bg-gradient-to-br from-emerald-800 to-emerald-600 text-2xl font-bold text-white shadow-md">
              {profileImage ? (
                <img src={profileImage} alt="Foto profil customer" className="h-full w-full object-cover" />
              ) : (
                <span>{getInitials(displayName)}</span>
              )}
            </div>

            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-amber-950">{displayName}</p>
              <p className="text-sm text-amber-900/70">{user?.email}</p>
            </div>

            <div className="mt-4 flex gap-2">
              <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100">
                <ImagePlus className="h-4 w-4" />
                Pilih Foto
                <input type="file" accept="image/*" className="hidden" onChange={handlePickPhoto} />
              </label>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700 transition hover:bg-rose-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </aside>

          <div className="space-y-4">
            <form onSubmit={handleSaveProfile} className="rounded-2xl border border-amber-100 bg-[#fffdf8] p-5">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-amber-800">Informasi Profil</p>

              <label className="block">
                <span className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-amber-900/70">
                  <UserRound className="h-4 w-4" />
                  Username
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm text-amber-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Masukkan username"
                />
              </label>

              <label className="mt-3 block">
                <span className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-amber-900/70">
                  <MapPin className="h-4 w-4" />
                  Alamat
                </span>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm text-amber-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Masukkan alamat pengantaran"
                />
              </label>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-emerald-700 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan profil...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Simpan Profil
                  </>
                )}
              </button>
            </form>

            <form onSubmit={handleSavePassword} className="rounded-2xl border border-amber-100 bg-[#fffdf8] p-5">
              <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-amber-800">
                <KeyRound className="h-4 w-4" />
                Ubah Password
              </p>

              <div className="grid gap-3 md:grid-cols-3">
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm text-amber-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Password lama"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm text-amber-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Password baru"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm text-amber-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Konfirmasi password"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingPassword}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSavingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan password...
                  </>
                ) : (
                  "Perbarui Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerProfilePage;
