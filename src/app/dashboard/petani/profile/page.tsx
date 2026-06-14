"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { uploadDokumen, getDokumenUrl } from "@/lib/supabase/uploadDoc";

export default function ProfilePetaniPage() {
  const { user, profile, refetchProfile } = useAuth();
  const supabase = createClient();

  const [nama, setNama] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [nik, setNik] = useState("");
  const [alamatLengkap, setAlamatLengkap] = useState("");
  const [namaUsaha, setNamaUsaha] = useState("");

  const [fileKtp, setFileKtp] = useState<File | null>(null);
  const [fileUsaha, setFileUsaha] = useState<File | null>(null);
  const [previewKtp, setPreviewKtp] = useState<string | null>(null);
  const [previewUsaha, setPreviewUsaha] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setNama(profile.nama || "");
      setLokasi(profile.lokasi || "");
      setWhatsapp(profile.whatsapp || "");
      setNomorTelepon(profile.nomor_telepon || "");
      setNik(profile.nik || "");
      setAlamatLengkap(profile.alamat_lengkap || "");
      setNamaUsaha(profile.nama_usaha || "");

      if (profile.foto_ktp_url) {
        getDokumenUrl(profile.foto_ktp_url).then(setPreviewKtp);
      }
      if (profile.foto_usaha_url) {
        getDokumenUrl(profile.foto_usaha_url).then(setPreviewUsaha);
      }
    }
  }, [profile]);

  const handleFileKtp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFileKtp(f);
      setPreviewKtp(URL.createObjectURL(f));
    }
  };

  const handleFileUsaha = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFileUsaha(f);
      setPreviewUsaha(URL.createObjectURL(f));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setError("");

    if (!nik.trim() || !alamatLengkap.trim() || !nomorTelepon.trim()) {
      setError("NIK, Nomor Telepon, dan Alamat Lengkap wajib diisi untuk verifikasi.");
      return;
    }

    setSaving(true);

    let ktpPath = profile?.foto_ktp_url || null;
    let usahaPath = profile?.foto_usaha_url || null;

    if (fileKtp) {
      const uploaded = await uploadDokumen(user.id, fileKtp, "ktp");
      if (uploaded) ktpPath = uploaded;
    }
    if (fileUsaha) {
      const uploaded = await uploadDokumen(user.id, fileUsaha, "usaha");
      if (uploaded) usahaPath = uploaded;
    }

    let statusVerifikasi = profile?.status_verifikasi || "belum_lengkap";
    if (ktpPath && nik && alamatLengkap && nomorTelepon) {
      if (statusVerifikasi === "belum_lengkap" || statusVerifikasi === "ditolak") {
        statusVerifikasi = "menunggu";
      }
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        nama,
        lokasi,
        whatsapp,
        nomor_telepon: nomorTelepon,
        nik,
        alamat_lengkap: alamatLengkap,
        nama_usaha: namaUsaha,
        foto_ktp_url: ktpPath,
        foto_usaha_url: usahaPath,
        status_verifikasi: statusVerifikasi,
      })
      .eq("id", user.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSukses(true);
    if (refetchProfile) refetchProfile();
    setTimeout(() => setSukses(false), 3000);
  };

  const statusBadge = () => {
    const baseClass = "text-[10px] sm:text-xs px-2.5 py-1 rounded-md font-bold border uppercase tracking-tight";
    switch (profile?.status_verifikasi) {
      case "terverifikasi":
        return <span className={`${baseClass} bg-green-50 text-green-700 border-green-200`}>✓ Terverifikasi</span>;
      case "menunggu":
        return <span className={`${baseClass} bg-amber-50 text-amber-700 border-amber-200`}>🕐 Menunggu Admin</span>;
      case "ditolak":
        return <span className={`${baseClass} bg-red-50 text-red-700 border-red-200`}>✕ Perlu Perbaikan</span>;
      default:
        return <span className={`${baseClass} bg-gray-100 text-gray-400 border-gray-200`}>Belum Lengkap</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 antialiased bg-gray-50 min-h-screen">

      {/* HEADER CARD - Semuanya di dalam kotak ini */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        {/* Banner Hijau */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-green-800 to-green-700 relative"></div>

        {/* Area Info (Di dalam kotak putih) */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 relative z-10">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-full border-4 border-white shadow-sm flex items-center justify-center text-4xl sm:text-5xl shrink-0">
              👩‍🌾
            </div>

            {/* Teks & Status (Sekarang di dalam area putih) */}
            <div className="flex-1 text-center sm:text-left pb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {profile?.nama || "Petani"}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2">
                <span className="bg-green-600 text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-md font-bold uppercase">
                  {profile?.role === "petani" ? "Mitra Petani" : profile?.role || "User"}
                </span>
                {statusBadge()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFIKASI */}
      <div className="space-y-4 mb-6">
        {sukses && (
          <div className="bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-medium shadow-md transition-all">
            ✓ Profil berhasil disimpan.
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
            ⚠ {error}
          </div>
        )}
        {profile?.status_verifikasi === "ditolak" && profile?.catatan_verifikasi && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-xs font-bold text-red-800 uppercase mb-1">Catatan Admin:</p>
            <p className="text-sm text-red-600 leading-relaxed">{profile.catatan_verifikasi}</p>
          </div>
        )}
      </div>

      {/* GRID KONTEN UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">
          {/* Card: Form */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2 border-b pb-4">
              <span>👤</span> Detail Akun
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">No. Telepon *</label>
                <input
                  type="text"
                  value={nomorTelepon}
                  onChange={(e) => setNomorTelepon(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">NIK KTP *</label>
                <input
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  maxLength={16}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Alamat Lengkap *</label>
                <textarea
                  rows={2}
                  value={alamatLengkap}
                  onChange={(e) => setAlamatLengkap(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Nama Kelompok Tani</label>
                <input
                  type="text"
                  value={namaUsaha}
                  onChange={(e) => setNamaUsaha(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card: Upload */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 text-lg mb-6 border-b pb-4">📄 Dokumen Verifikasi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-600">Foto KTP *</p>
                <div className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                  {previewKtp ? <img src={previewKtp} className="w-full h-full object-cover" /> : <span className="text-gray-400 text-[10px]">Belum diunggah</span>}
                </div>
                <input type="file" accept="image/*" onChange={handleFileKtp} className="text-xs w-full cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-600">Foto Lahan (Opsional)</p>
                <div className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                  {previewUsaha ? <img src={previewUsaha} className="w-full h-full object-cover" /> : <span className="text-gray-400 text-[10px]">Belum diunggah</span>}
                </div>
                <input type="file" accept="image/*" onChange={handleFileUsaha} className="text-xs w-full cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
          >
            {saving ? "Sedang Menyimpan..." : "Simpan Perubahan & Ajukan Verifikasi"}
          </button>
        </div>

        {/* Sidebar Status */}
        <div className="lg:sticky lg:top-6 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Informasi Akun</h3>
            <div className="mb-4">{statusBadge()}</div>
            <p className="text-xs text-gray-500 leading-relaxed pt-4 border-t border-gray-50">
              {profile?.status_verifikasi === "terverifikasi" ? "Akun Anda aktif dan dapat bertransaksi." : "Lengkapi profil Anda agar admin dapat melakukan verifikasi data petani."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}