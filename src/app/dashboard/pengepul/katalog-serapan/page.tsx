"use client";
import { useState, useEffect } from "react";
import { useEndpoint } from "@/context/EndpointContext";
import { useAuth } from "@/context/AuthContext";

const komoditasOptions = ["Jerami Padi", "Kohe Sapi", "Ampas Tahu", "Kulit Kakao", "Ampas Tebu", "Sekam Padi"];

export default function KatalogSerapanPage() {
  const { myEndpoint, saveEndpoint, loading } = useEndpoint();
  const { profile } = useAuth();

  const [nama, setNama] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [kontak, setKontak] = useState("");
  const [dipilih, setDipilih] = useState<string[]>([]);
  const [kapasitas, setKapasitas] = useState(100);
  const [hargaPerKg, setHargaPerKg] = useState(550);
  const [donasiAktif, setDonasiAktif] = useState(false);
  const [berat, setBerat] = useState(1000);
  const [submitting, setSubmitting] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (myEndpoint) {
      setNama(myEndpoint.nama);
      setLokasi(myEndpoint.lokasi);
      setKontak(myEndpoint.kontak);
      setDipilih(myEndpoint.komoditas);
      setKapasitas(myEndpoint.kapasitas_sisa);
      setHargaPerKg(myEndpoint.harga_per_kg);
      setDonasiAktif(myEndpoint.donasi_aktif);
    } else {
      setNama(profile?.nama || "");
      setLokasi(profile?.lokasi || "");
      setKontak((profile as any)?.whatsapp || "");
    }
  }, [myEndpoint, profile]);

  const toggle = (id: string) => {
    setDipilih((prev) => prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]);
  };

  const handleSave = async () => {
    setError("");
    if (!nama.trim() || dipilih.length === 0) {
      setError("Nama endpoint dan minimal 1 komoditas wajib diisi");
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
        () => resolve(null),
        { timeout: 5000 }
      );
    });

    const { error } = await saveEndpoint({
      nama,
      lokasi,
      komoditas: dipilih,
      kapasitas_sisa: kapasitas,
      kontak,
      harga_per_kg: hargaPerKg,
      donasi_aktif: donasiAktif,
    }, coords);

    setSubmitting(false);

    if (error) {
      setError(error);
      return;
    }

    setSukses(true);
    setTimeout(() => setSukses(false), 3000);
  };

  if (loading) {
    return <p className="text-gray-400 text-sm text-center py-16">Memuat data...</p>;
  }

  return (
    <div>
      {sukses && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
          ✅ Profil endpoint berhasil disimpan dan tampil di peta!
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
          ❌ {error}
        </div>
      )}

      {/* Setup profil endpoint */}
      <div className="bg-green-800 text-white rounded-2xl p-5 mb-6">
        <p className="font-semibold text-lg">🌿 Setup Profil Endpoint Pengepul</p>
        <p className="text-green-200 text-sm mt-1">
          {myEndpoint
            ? "Edit profil endpoint Anda. Perubahan akan langsung tampil di peta sinergi."
            : "Buat profil endpoint Anda agar muncul di peta sinergi dan bisa diajukan tawaran oleh petani."}
        </p>
      </div>

      {/* Form Info Dasar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Informasi Endpoint</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600 mb-1 block">Nama Endpoint / Perusahaan</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: CV Sinergi Pupuk Sukses"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Lokasi</label>
            <input
              type="text"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Contoh: Berbah, Sleman"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nomor Kontak WhatsApp</label>
            <input
              type="text"
              value={kontak}
              onChange={(e) => setKontak(e.target.value)}
              placeholder="08123456789"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Grid komoditas */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Jenis Komoditas Limbah Diterima</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {komoditasOptions.map((k) => {
            const aktif = dipilih.includes(k);
            return (
              <div
                key={k}
                onClick={() => toggle(k)}
                className={`border rounded-xl p-3 flex items-center gap-3 cursor-pointer transition ${
                  aktif ? "border-green-500 bg-green-50" : "border-gray-100 bg-white hover:border-green-300"
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                  aktif ? "border-green-600 bg-green-600" : "border-gray-300"
                }`}>
                  {aktif && <span className="text-white text-xs">✓</span>}
                </div>
                <p className="font-medium text-gray-800 text-sm">{k}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kalkulator Harga */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <p className="font-semibold text-gray-800 mb-3">💰 Kalkulator Harga & Donasi</p>

        <div className="mb-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={donasiAktif}
              onChange={(e) => setDonasiAktif(e.target.checked)}
              className="w-5 h-5 accent-green-700"
            />
            <span className="text-sm font-medium text-gray-700">
              Aktifkan mode <span className="text-red-500 font-semibold">Donasi</span> (petani bisa donasi limbah tanpa transaksi jual)
            </span>
          </label>
        </div>

        {!donasiAktif && (
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Atur Berat Simulasi (Kg)</label>
                <input
                  type="number"
                  value={berat}
                  onChange={(e) => setBerat(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-gray-500">Harga Beli per KG (Rp)</label>
                  <span className="font-semibold text-gray-700">Rp {hargaPerKg}</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={3000}
                  step={50}
                  value={hargaPerKg}
                  onChange={(e) => setHargaPerKg(Number(e.target.value))}
                  className="w-full accent-green-700"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Rp 300</span>
                  <span>Rp 3.000</span>
                </div>
              </div>
            </div>

            <div className="bg-green-700 text-white rounded-xl p-5">
              <p className="text-sm font-semibold mb-3">Estimasi Alokasi Dana</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-200">Total Berat</span>
                  <span className="font-bold">{berat.toLocaleString("id-ID")} KG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-200">Harga Satuan</span>
                  <span className="font-bold">Rp {hargaPerKg}</span>
                </div>
                <div className="border-t border-green-600 pt-2 mt-2">
                  <p className="text-xs text-green-300 uppercase">Total Pembayaran</p>
                  <p className="text-2xl font-bold mt-1">
                    Rp {(berat * hargaPerKg).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Kapasitas */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-3">
          <p className="font-semibold text-gray-800">Batas Kapasitas Serapan</p>
          <span className="bg-[#b5e550] text-green-900 text-sm font-semibold px-3 py-1 rounded-full">
            {kapasitas} ton/bulan
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={500}
          value={kapasitas}
          onChange={(e) => setKapasitas(Number(e.target.value))}
          className="w-full accent-green-700"
        />
        <p className="text-gray-400 text-xs mt-2">
          Menunjukkan sisa kapasitas penyimpanan endpoint kepada publik di peta sinergi.
        </p>
      </div>

      <button
        onClick={handleSave}
        disabled={submitting}
        className="w-full bg-green-700 text-white font-semibold py-4 rounded-xl hover:bg-green-800 transition disabled:opacity-50"
      >
        {submitting ? "Menyimpan..." : myEndpoint ? "Simpan Perubahan" : "Terbitkan Profil Endpoint"}
      </button>
    </div>
  );
}