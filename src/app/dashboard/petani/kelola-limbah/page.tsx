"use client";
import { useState } from "react";
import { useLimbah } from "@/context/LimbahContext";
import { useAuth } from "@/context/AuthContext";

const kategoriOptions = ["Jerami Padi", "Kohe Sapi", "Ampas Tahu", "Kulit Kakao", "Sekam Padi"];

export default function KelolaLimbahPage() {
  const { limbahList, tambahLimbah, hapusLimbah, toggleAktifMap, loading } = useLimbah();
  const { user, profile } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mekanisme, setMekanisme] = useState<"barter" | "jual">("barter");
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState(kategoriOptions[0]);
  const [berat, setBerat] = useState("");
  const [harga, setHarga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [barterDengan, setBarterDengan] = useState("");
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  

  const postinganSaya = limbahList.filter((l) => l.pemilik_id === user?.id);

  const resetForm = () => {
  setJudul("");
  setBerat("");
  setHarga("");
  setDeskripsi("");
  setBarterDengan("");
  setFile(null);
  setPreview(null);
};

const handleSubmit = async () => {
  setError("");
  if (!judul.trim() || !berat) {
    setError("Judul dan berat wajib diisi");
    return;
  }

  setSubmitting(true);
  const coords = await new Promise<{ lat: number; lng: number } | null>((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null), // user menolak izin lokasi, fallback ke random
      { timeout: 5000 }
    );
  });

  const { error } = await tambahLimbah({
    judul,
    kategori,
    berat: Number(berat),
    lokasi: profile?.lokasi || "Bandung, Jawa Barat",
    mekanisme,
    harga: mekanisme === "jual" ? Number(harga) : null,
    deskripsi,
    barter_dengan: mekanisme === "barter" ? (barterDengan || "Limbah Lain") : null,
  }, file, coords);

  setSubmitting(false);

  if (error) {
    setError(error);
    return;
  }

  resetForm();
  setSukses(true);
  setTimeout(() => setSukses(false), 3000);
};


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = e.target.files?.[0];
  if (selected) {
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }
};

  return (
    <div>
      {sukses && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
          ✅ Postingan berhasil diterbitkan dan tersimpan di database!
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
          ❌ {error}
        </div>
      )}

      {/* Form Unggah */}
      <div className="bg-[#f0f7f0] rounded-2xl p-6 mb-8">
        <h1 className="text-xl font-bold text-green-900 mb-1">⊕ Unggah Ketersediaan Limbah</h1>
        <p className="text-gray-500 text-sm mb-6">
          Masa panen menghasilkan sisa melimpah? Terbitkan postingan agar dibarter tetangga tani atau dijemput truk pabrik.
        </p>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Mekanisme Alokasi Sinergi</p>
          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden w-full max-w-sm">
            <button
              onClick={() => setMekanisme("barter")}
              className={`flex-1 py-2.5 text-sm font-medium transition ${mekanisme === "barter"
                ? "bg-green-700 text-white"
                : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              Barter
            </button>
            <button
              onClick={() => setMekanisme("jual")}
              className={`flex-1 py-2.5 text-sm font-medium transition ${mekanisme === "jual"
                ? "bg-green-700 text-white"
                : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              Jual
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600 mb-1 block">Judul Postingan Limbah</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Kotoran Sapi Basah Segar 4 Karung"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Kategori Limbah</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {kategoriOptions.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Total Estimasi Berat (Kg)</label>
            <input
              type="number"
              value={berat}
              onChange={(e) => setBerat(e.target.value)}
              placeholder="500"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {mekanisme === "jual" ? (
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 mb-1 block">Nominal Jual (per Kg)</label>
              <input
                type="number"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                placeholder="1500"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ) : (
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 mb-1 block">Ingin Ditukar Dengan</label>
              <input
                type="text"
                value={barterDengan}
                onChange={(e) => setBarterDengan(e.target.value)}
                placeholder="Contoh: Sekam Padi, Kohe Sapi"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600 mb-1 block">Foto Limbah (Opsional)</label>
            <div className="flex items-center gap-4">
              {preview ? (
                <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
              ) : (
                <div className="w-24 h-24 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-300 text-xs">
                  Belum ada foto
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-600 border border-gray-200 rounded-lg cursor-pointer focus:outline-none file:bg-green-50 file:text-green-700 file:border-0 file:px-4 file:py-2 file:mr-3 file:cursor-pointer hover:file:bg-green-100"
                />
                <p className="text-xs text-gray-400 mt-1">Format JPG/PNG, maksimal 5MB</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600 mb-1 block">Deskripsi Detail & Kondisi Kelembapan</label>
            <textarea
              rows={4}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Ceritakan kondisi limbah Anda, tingkat kekeringan, apakah sudah dikarungi, atau butuh bantuan kendaraan angkut."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full mt-4 bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition disabled:opacity-50"
        >
          {submitting ? "Menyimpan..." : "Terbitkan Postingan Komoditas"}
        </button>
      </div>

      {/* Postingan Aktif */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">Postingan Aktif Saya</h2>
        <p className="text-gray-400 text-sm mb-4">Daftar hasil panen dan limbah yang telah Anda unggah untuk ditukar atau dijual.</p>

        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">Memuat data...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {postinganSaya.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">Belum ada postingan. Terbitkan postingan pertama Anda di atas.</p>
            )}
            {postinganSaya.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {item.gambar_url ? (
                    <img src={item.gambar_url} alt={item.judul} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">🌾</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.mekanisme === "barter"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                      }`}>
                      {item.mekanisme.toUpperCase()}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.kategori}</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{item.judul}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.deskripsi?.slice(0, 60)}...</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Berat: {item.berat} Kg
                    {item.harga ? ` | Patokan Harga: Rp ${item.harga.toLocaleString("id-ID")}/kg` : ""}
                  </p>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  <button
                    onClick={() => toggleAktifMap(item.id, item.aktif_di_map)}
                    className={`border px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                      item.aktif_di_map
                        ? "text-green-600 border-green-200 hover:bg-green-50"
                        : "text-gray-400 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {item.aktif_di_map ? "✓ Aktif di Map" : "○ Nonaktif"}
                  </button>
                  <button
                    onClick={() => hapusLimbah(item.id, item.gambar_url)}
                    className="text-red-400 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 whitespace-nowrap"
                  >
                    🗑 Hapus Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}