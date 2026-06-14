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

      // Load preview dokumen yang sudah ada
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

    // Tentukan status verifikasi otomatis
    let statusVerifikasi = profile?.status_verifikasi || "belum_lengkap";
    if (ktpPath && nik && alamatLengkap && nomorTelepon) {
      // Data sudah lengkap, ajukan untuk verifikasi (kalau belum terverifikasi)
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
    switch (profile?.status_verifikasi) {
      case "terverifikasi":
        return <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">✓ Terverifikasi</span>;
      case "menunggu":
        return <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-semibold">🕐 Menunggu Verifikasi Admin</span>;
      case "ditolak":
        return <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-semibold">✕ Ditolak — Lengkapi Ulang</span>;
      default:
        return <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-semibold">Belum Lengkap</span>;
    }
  };

  return (
    <div>
      <div className="bg-green-800 rounded-2xl h-36 mb-14 relative">
        <div className="absolute -bottom-10 left-6 flex items-end gap-4">
          <div className="w-20 h-20 bg-white rounded-full border-4 border-white flex items-center justify-center text-3xl shadow">
            👩‍🌾
          </div>
          <div className="mb-2">
            <p className="text-xl font-bold text-gray-800">{profile?.nama}</p>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                {profile?.role === "petani" ? "Mitra Petani" : profile?.role}
              </span>
              {statusBadge()}
            </div>
          </div>
        </div>
      </div>

      {sukses && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
          ✅ Profil berhasil disimpan{profile?.status_verifikasi === "menunggu" ? " dan diajukan untuk verifikasi admin." : "."}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
          ❌ {error}
        </div>
      )}

      {profile?.status_verifikasi === "ditolak" && profile?.catatan_verifikasi && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-red-700 mb-1">Catatan dari Admin:</p>
          <p className="text-sm text-red-600">{profile.catatan_verifikasi}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Data Pribadi */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-800 text-lg mb-4">👤 Detail Pribadi</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm text-gray-500 mb-1 block">Nama Lengkap</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Nomor Telepon *</label>
                <input
                  type="text"
                  value={nomorTelepon}
                  onChange={(e) => setNomorTelepon(e.target.value)}
                  placeholder="08123456789"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="08123456789"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-500 mb-1 block">NIK (KTP) *</label>
                <input
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="16 digit nomor KTP"
                  maxLength={16}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Lokasi (Kota/Kabupaten)</label>
                <input
                  type="text"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder="Contoh: Bandung, Jawa Barat"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-500 mb-1 block">Alamat Lengkap *</label>
                <textarea
                  rows={3}
                  value={alamatLengkap}
                  onChange={(e) => setAlamatLengkap(e.target.value)}
                  placeholder="Sesuai KTP"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Detail Usaha */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-800 text-lg mb-4">🌿 Detail Pertanian / Usaha</h2>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Nama Kelompok Tani / Usaha</label>
              <input
                type="text"
                value={namaUsaha}
                onChange={(e) => setNamaUsaha(e.target.value)}
                placeholder="Contoh: Kelompok Tani Sumber Makmur"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Upload Dokumen */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-800 text-lg mb-1">📄 Dokumen Verifikasi</h2>
            <p className="text-gray-400 text-sm mb-4">
              Upload dokumen berikut agar akun Anda dapat diverifikasi oleh admin. Dokumen bersifat privat dan hanya bisa dilihat oleh Anda dan admin.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Foto KTP *</label>
                {previewKtp ? (
                  <img src={previewKtp} alt="KTP" className="w-full h-32 object-cover rounded-lg border border-gray-200 mb-2" />
                ) : (
                  <div className="w-full h-32 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-300 text-xs mb-2">
                    Belum ada foto
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileKtp}
                  className="block w-full text-xs text-gray-600 border border-gray-200 rounded-lg cursor-pointer focus:outline-none file:bg-green-50 file:text-green-700 file:border-0 file:px-3 file:py-2 file:mr-3 file:cursor-pointer hover:file:bg-green-100"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Foto Lahan / Usaha (Opsional)</label>
                {previewUsaha ? (
                  <img src={previewUsaha} alt="Usaha" className="w-full h-32 object-cover rounded-lg border border-gray-200 mb-2" />
                ) : (
                  <div className="w-full h-32 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-300 text-xs mb-2">
                    Belum ada foto
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUsaha}
                  className="block w-full text-xs text-gray-600 border border-gray-200 rounded-lg cursor-pointer focus:outline-none file:bg-green-50 file:text-green-700 file:border-0 file:px-3 file:py-2 file:mr-3 file:cursor-pointer hover:file:bg-green-100"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan & Ajukan Verifikasi"}
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="font-semibold text-gray-800 mb-2">Status Akun</p>
            {statusBadge()}
            <p className="text-gray-400 text-xs mt-3 leading-relaxed">
              {profile?.status_verifikasi === "terverifikasi" &&
                "Akun Anda sudah terverifikasi. Anda dapat mengakses semua fitur platform."}
              {profile?.status_verifikasi === "menunggu" &&
                "Data Anda sedang ditinjau oleh admin. Proses verifikasi biasanya memakan waktu 1-2 hari kerja."}
              {profile?.status_verifikasi === "ditolak" &&
                "Pengajuan verifikasi Anda ditolak. Silakan lengkapi/perbaiki data sesuai catatan admin, lalu ajukan kembali."}
              {(profile?.status_verifikasi === "belum_lengkap" || !profile?.status_verifikasi) &&
                "Lengkapi data diri dan upload dokumen untuk mengajukan verifikasi."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}