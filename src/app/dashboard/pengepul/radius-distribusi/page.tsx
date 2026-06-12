"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { pengepulList } from "@/data/pengepul";

const MapLeaflet = dynamic(() => import("@/components/map/MapLeaflet"), { ssr: false });

const mapMarkers = pengepulList.map((p) => ({
  id: p.id,
  nama: p.nama,
  lat: p.lat,
  lng: p.lng,
  lokasi: p.lokasi,
  tipe: "pengepul" as const,
  info: `Kapasitas: ${p.kapasitas_sisa} Ton`,
}));

export default function RadiusDistribusiPage() {
  const [scanning, setScanning] = useState(false);
  const [selectedPengepul, setSelectedPengepul] = useState<typeof pengepulList[0] | null>(null);
  const [jumlah, setJumlah] = useState(500);
  const [pesan, setPesan] = useState("");
  const [sukses, setSukses] = useState(false);

  const handlePindaiUlang = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 1500);
  };

  const handleWhatsApp = (kontak: string, nama: string) => {
    const nomor = kontak.replace(/[^0-9]/g, "").replace(/^0/, "62");
    const teks = encodeURIComponent(`Halo ${nama}, saya tertarik dengan kapasitas serapan limbah Anda di AgroCircular. Bisa kita diskusikan lebih lanjut?`);
    window.open(`https://wa.me/${nomor}?text=${teks}`, "_blank");
  };

  const openTawaran = (p: typeof pengepulList[0]) => {
    setSelectedPengepul(p);
    setJumlah(500);
    setPesan("");
    setSukses(false);
  };

  const closeModal = () => setSelectedPengepul(null);

  const handleKirimTawaran = () => {
    setSukses(true);
    setTimeout(() => {
      setSukses(false);
      closeModal();
    }, 2000);
  };

  return (
    <div>
      <div className="bg-[#f0f7f0] border border-green-100 rounded-2xl p-5 mb-6 flex justify-between items-center">
        <div>
          <p className="flex items-center gap-2 text-green-700 font-semibold">
            📊 Pasokan Komoditas Kritis Terdekat
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Urutan deteksi optimal radius terkecil menuju desa-desa tani terdaftar.
          </p>
        </div>
        <button
          onClick={handlePindaiUlang}
          disabled={scanning}
          className="border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-white transition disabled:opacity-50"
        >
          {scanning ? "🔄 Memindai..." : "🔄 Pindai Ulang"}
        </button>
      </div>

      {scanning && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-xl mb-6 text-center">
          Memindai radius distribusi terdekat...
        </div>
      )}

      {/* Peta */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="font-semibold text-gray-800">Radius Distribusi Prediksi Terdekat</p>
            <p className="text-gray-400 text-sm">Peta rute logistik hemat emisi ke pusat serapan mitra pengolah terdekat Anda.</p>
            <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full mt-2">
              🟢 Live koordinat daerah Kab. Malang
            </span>
          </div>
        </div>
        <MapLeaflet markers={mapMarkers} />
      </div>

      {/* Card pengepul utama */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex justify-between items-start mb-3">
          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
            {pengepulList[0].tipe}
          </span>
          <span className="text-gray-400 text-xs">📍 75°, 70°</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{pengepulList[0].nama}</h2>
        <p className="text-gray-400 text-sm mb-4">{pengepulList[0].lokasi}</p>

        <div className="bg-[#f0f7f0] rounded-xl p-4 mb-4">
          <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Komoditas & Kontribusi</p>
          <p className="font-semibold text-green-800">
            Siap Serap: {pengepulList[0].komoditas.join(", ")}
          </p>
          <p className="text-gray-500 text-sm">Kapasitas sisa: {pengepulList[0].kapasitas_sisa} Ton/bln</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <p className="text-sm font-medium text-green-800">Data Privat Terbuka</p>
          </div>
          <p className="text-xs text-gray-500">Kontak WhatsApp Terverifikasi:</p>
          <p className="font-semibold text-green-800">📞 {pengepulList[0].kontak}</p>
        </div>

        <button
          onClick={() => handleWhatsApp(pengepulList[0].kontak, pengepulList[0].nama)}
          className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition"
        >
          Hubungi Langsung (WhatsApp)
        </button>
      </div>

      {/* Grid pengepul lain */}
      <div className="grid md:grid-cols-2 gap-4">
        {pengepulList.slice(1).map((p) => (
          <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <span className="text-xs text-gray-400 font-semibold uppercase">{p.tipe}</span>
            <h3 className="text-lg font-bold text-gray-900 mt-1">{p.nama}</h3>
            <p className="text-gray-400 text-sm flex items-center gap-1">📍 {p.lokasi}</p>
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Jenis Komoditas Limbah:</p>
              <div className="flex gap-2 flex-wrap">
                {p.komoditas.map((k) => (
                  <span key={k} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{k}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              {p.donasi_aktif ? (
                <p className="text-red-500 font-semibold text-sm">❤️ Donasi Aktif</p>
              ) : (
                <p className="text-green-700 font-semibold text-sm">
                  💰 Rp {p.harga_per_kg.toLocaleString("id-ID")}/Kg
                </p>
              )}
              <button
                onClick={() => openTawaran(p)}
                className="bg-green-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-800 transition"
              >
                Ajukan Tawaran
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ajukan Tawaran */}
      {selectedPengepul && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sukses ? (
              <div className="text-center py-6">
                <p className="text-4xl mb-3">✅</p>
                <p className="font-bold text-gray-800 text-lg mb-1">Tawaran Terkirim!</p>
                <p className="text-gray-500 text-sm">
                  {selectedPengepul.donasi_aktif
                    ? "Donasi Anda telah diajukan ke " + selectedPengepul.nama
                    : "Penawaran jual Anda telah dikirim ke " + selectedPengepul.nama}
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {selectedPengepul.donasi_aktif ? "Ajukan Donasi" : "Ajukan Tawaran Jual"}
                    </h3>
                    <p className="text-gray-400 text-sm">{selectedPengepul.nama}</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
                </div>

                <div className="bg-[#f0f7f0] rounded-xl p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Komoditas Diterima:</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedPengepul.komoditas.map((k) => (
                      <span key={k} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{k}</span>
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm mt-2">📍 {selectedPengepul.lokasi}</p>
                </div>

                <div className="mb-4">
                  <label className="text-sm text-gray-600 mb-1 block">Jumlah (Kg)</label>
                  <input
                    type="number"
                    value={jumlah}
                    onChange={(e) => setJumlah(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {!selectedPengepul.donasi_aktif && (
                  <div className="bg-green-700 text-white rounded-xl p-3 mb-4">
                    <p className="text-xs text-green-300">Estimasi Pendapatan</p>
                    <p className="text-xl font-bold">
                      Rp {(jumlah * selectedPengepul.harga_per_kg).toLocaleString("id-ID")}
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="text-sm text-gray-600 mb-1 block">Pesan (Opsional)</label>
                  <textarea
                    rows={3}
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    placeholder={selectedPengepul.donasi_aktif
                      ? "Contoh: Limbah dalam kondisi kering, siap diambil kapan saja."
                      : "Contoh: Bisa diambil hari ini, lokasi mudah diakses truk."}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleKirimTawaran}
                    className="flex-1 bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition text-sm font-semibold"
                  >
                    {selectedPengepul.donasi_aktif ? "Kirim Donasi" : "Kirim Tawaran"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}