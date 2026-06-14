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
    const baseClass = "text-[10px] sm:text-xs px-2.5 py-1 rounded-lg font-bold border uppercase tracking-tight transition-all";
    switch (profile?.status_verifikasi) {
      case "terverifikasi":
        return <span className={`${baseClass} bg-green-50 text-green-700 border-green-200`}>✓ Terverifikasi</span>;
      case "menunggu":
        return <span className={`${baseClass} bg-amber-50 text-amber-700 border-amber-200`}>🕐 Menunggu Verifikasi</span>;
      case "ditolak":
        return <span className={`${baseClass} bg-red-50 text-red-700 border-red-200`}>✕ Perlu Perbaikan</span>;
      default:
        return <span className={`${baseClass} bg-gray-100 text-gray-400 border-gray-200`}>Belum Lengkap</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 antialiased bg-gray-50/30 min-h-screen">

      {/* HEADER CARD - Banner dan Info di dalam satu kotak */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        {/* Banner Hijau Atas */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-green-800 to-green-700 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        </div>

        {/* Konten Info Bawah (Masih di dalam Card Putih) */}
        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-12 relative z-10">
            {/* Avatar bulat */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full border-[6px] border-white shadow-md flex items-center justify-center text-4xl sm:text-5xl shrink-0">
              {profile?.role === "petani" ? "👩‍🌾" : "🏭"}
            </div>

            {/* Nama & Status */}
            <div className="flex-1 text-center sm:text-left pb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-none mb-3">
                {profile?.nama || "Nama Pengguna"}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                <span className="bg-green-600 text-white text-[10px] sm:text-xs px-3 py-1 rounded-lg font-bold uppercase tracking-wider shadow-sm">
                  {profile?.role === "petani" ? "Mitra Petani" : profile?.role || "Mitra Usaha"}
                </span>
                {statusBadge()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFIKASI ALERT */}
      <div className="space-y-4 mb-6">
        {sukses && (
          <div className="bg-green-600 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-green-900/10 transition-all">
            ✅ Profil berhasil disimpan dan diperbarui.
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl text-sm font-semibold">
            ❌ Gagal: {error}
          </div>
        )}
        {profile?.status_verifikasi === "ditolak" && profile?.catatan_verifikasi && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-black text-red-700 uppercase mb-1">Catatan Admin:</p>
            <p className="text-sm text-red-600 leading-relaxed font-medium">{profile.catatan_verifikasi}</p>
          </div>
        )}
      </div>

      {/* GRID CONTENT UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-8">

          {/* Card: Detail Pribadi */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-bold text-gray-800 text-xl mb-8 flex items-center gap-3 border-b pb-5 border-gray-50">
              <span className="p-2 bg-green-50 rounded-lg text-green-700">👤</span> Informasi Pribadi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">No. Telepon *</label>
                <input
                  type="text"
                  value={nomorTelepon}
                  onChange={(e) => setNomorTelepon(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">NIK (KTP) *</label>
                <input
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  maxLength={16}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alamat Lengkap KTP *</label>
                <textarea
                  rows={2}
                  value={alamatLengkap}
                  onChange={(e) => setAlamatLengkap(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Card: Detail Bisnis */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-bold text-gray-800 text-xl mb-8 flex items-center gap-3 border-b pb-5 border-gray-50">
              <span className="p-2 bg-amber-50 rounded-lg text-amber-700">🏢</span> Detail Bisnis / Usaha
            </h2>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Perusahaan / Kelompok</label>
              <input
                type="text"
                value={namaUsaha}
                onChange={(e) => setNamaUsaha(e.target.value)}
                placeholder="Contoh: CV Sinergi Tani Bersama"
                className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-green-900/10 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? "Sedang Memproses..." : "Simpan & Ajukan Verifikasi"}
          </button>
        </div>

        {/* Sidebar Status */}
        <div className="lg:sticky lg:top-6 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Ringkasan Akun</h3>
            <div className="mb-6">{statusBadge()}</div>
            <p className="text-[11px] text-gray-500 leading-relaxed pt-5 border-t border-gray-50">
              Pastikan seluruh data dengan tanda bintang (*) terisi dengan benar. Dokumen Anda dijamin aman dan hanya digunakan untuk keperluan verifikasi identitas di platform ini.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}