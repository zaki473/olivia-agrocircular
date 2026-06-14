"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { useEndpoint } from "@/context/EndpointContext";
import { useLimbah } from "@/context/LimbahContext";
import { useTransaksi } from "@/context/TransaksiContext";
import { useAuth } from "@/context/AuthContext";
import type { MapMarker } from "@/components/map/MapLeaflet";

const MapLeaflet = dynamic(() => import("@/components/map/MapLeaflet"), { ssr: false });

export default function RadiusDistribusiPage() {
  const { endpointList, myEndpoint, loading } = useEndpoint();
  const { limbahList } = useLimbah();
  const { ajukanTransaksi } = useTransaksi();
  const { user } = useAuth();

  const [scanning, setScanning] = useState(false);
  const [selectedLimbah, setSelectedLimbah] = useState<typeof limbahList[0] | null>(null);
  const [jumlah, setJumlah] = useState(500);
  const [pesan, setPesan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sukses, setSukses] = useState(false);

  const limbahCocok = myEndpoint
    ? limbahList.filter(
        (l) =>
          l.aktif_di_map &&
          l.pemilik_id !== user?.id &&
          myEndpoint.komoditas.some((k) =>
            l.kategori.toLowerCase().includes(k.toLowerCase())
          )
      )
    : [];

  const handlePindaiUlang = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 1500);
  };

  const openTawaran = (limbah: typeof limbahList[0]) => {
    setSelectedLimbah(limbah);
    setJumlah(limbah.berat);
    setPesan("");
    setSukses(false);
  };

  const closeModal = () => setSelectedLimbah(null);

  const handleKirimTawaran = async () => {
    if (!selectedLimbah) return;
    setSubmitting(true);

    const { error } = await ajukanTransaksi({
      limbah_id: selectedLimbah.id,
      pemilik_id: selectedLimbah.pemilik_id,
      tipe: myEndpoint?.donasi_aktif ? "donasi" : "jual",
      pesan,
      jumlah,
      total_harga: myEndpoint?.donasi_aktif
        ? undefined
        : jumlah * (myEndpoint?.harga_per_kg || 0),
    });

    setSubmitting(false);

    if (!error) {
      setSukses(true);
      setTimeout(() => {
        setSukses(false);
        closeModal();
      }, 2000);
    }
  };

  const endpointMarkers: MapMarker[] = endpointList.map((e) => ({
    id: e.id,
    nama: e.nama,
    lat: e.lat,
    lng: e.lng,
    lokasi: e.lokasi,
    tipe: "pengepul",
    info: `Kapasitas: ${e.kapasitas_sisa} Ton`,
  }));

  const limbahMarkers: MapMarker[] = limbahList
    .filter((l) => l.aktif_di_map)
    .map((l) => ({
      id: l.id,
      nama: l.judul,
      lat: l.lat,
      lng: l.lng,
      lokasi: l.lokasi,
      tipe: l.mekanisme,
      info: `Berat: ${l.berat} Kg`,
    }));

  const allMarkers = [...endpointMarkers, ...limbahMarkers];

  if (loading) {
    return (
      <p className="text-gray-400 text-sm text-center py-16">Memuat data...</p>
    );
  }

  if (!myEndpoint) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
        <p className="text-4xl mb-3">🏭</p>
        <p className="font-bold text-gray-800 text-lg mb-2">
          Profil Endpoint Belum Dibuat
        </p>
        <p className="text-gray-500 text-sm mb-4">
          Anda perlu membuat profil endpoint terlebih dahulu di halaman{" "}
          <strong>Katalog Serapan</strong> agar dapat melihat radius distribusi
          dan limbah yang cocok.
        </p>
        <a
          href="/dashboard/pengepul/katalog-serapan"
          className="inline-block bg-green-700 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-green-800 transition"
        >
          Buat Profil Endpoint
        </a>
      </div>
    );
  }

  // Modal dipisah sebagai variabel agar bisa di-portal ke document.body
  const modalContent = selectedLimbah ? (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {sukses ? (
          <div className="text-center py-6">
            <p className="text-4xl mb-3">✅</p>
            <p className="font-bold text-gray-800 text-lg mb-1">
              Tawaran Terkirim!
            </p>
            <p className="text-gray-500 text-sm">
              {myEndpoint.donasi_aktif
                ? `Permintaan donasi telah dikirim ke ${selectedLimbah.profiles?.nama}`
                : `Penawaran jual telah dikirim ke ${selectedLimbah.profiles?.nama}`}
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {myEndpoint.donasi_aktif
                    ? "Ajukan Permintaan Donasi"
                    : "Ajukan Tawaran Jual"}
                </h3>
                <p className="text-gray-400 text-sm">{selectedLimbah.judul}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <div className="bg-[#f0f7f0] rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-500 mb-1">Pemilik Limbah:</p>
              <p className="text-sm font-semibold text-gray-700">
                {selectedLimbah.profiles?.nama || "Petani"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                📍 {selectedLimbah.lokasi}
              </p>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-1 block">
                Jumlah (Kg)
              </label>
              <input
                type="number"
                value={jumlah}
                onChange={(e) => setJumlah(Number(e.target.value))}
                max={selectedLimbah.berat}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {!myEndpoint.donasi_aktif && (
              <div className="bg-green-700 text-white rounded-xl p-3 mb-4">
                <p className="text-xs text-green-300">Estimasi Pembayaran</p>
                <p className="text-xl font-bold">
                  Rp{" "}
                  {(jumlah * myEndpoint.harga_per_kg).toLocaleString("id-ID")}
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-1 block">
                Pesan (Opsional)
              </label>
              <textarea
                rows={3}
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder={
                  myEndpoint.donasi_aktif
                    ? "Contoh: Kami akan menjemput limbah ini untuk program donasi."
                    : "Contoh: Bisa dijemput hari ini, lokasi mudah diakses truk."
                }
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
                disabled={submitting}
                className="flex-1 bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition text-sm font-semibold disabled:opacity-50"
              >
                {submitting
                  ? "Mengirim..."
                  : myEndpoint.donasi_aktif
                  ? "Kirim Permintaan"
                  : "Kirim Tawaran"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div>
      <div className="bg-[#f0f7f0] border border-green-100 rounded-2xl p-5 mb-6 flex justify-between items-center">
        <div>
          <p className="flex items-center gap-2 text-green-700 font-semibold">
            📊 Pasokan Komoditas Kritis Terdekat
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Limbah aktif dari petani yang cocok dengan komoditas endpoint Anda:{" "}
            {myEndpoint.komoditas.join(", ")}
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

      {/* Peta — dibungkus isolation: isolate agar z-index Leaflet tidak bocor ke luar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="font-semibold text-gray-800">
              Radius Distribusi Prediksi Terdekat
            </p>
            <p className="text-gray-400 text-sm">
              Peta rute logistik ke endpoint dan postingan limbah aktif.
            </p>
            <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full mt-2">
              🟢 Endpoint Anda: {myEndpoint.nama}
            </span>
          </div>
          <a
            href="/dashboard/pengepul/katalog-serapan"
            className="bg-green-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-800 transition"
          >
            ✏️ Edit Profil
          </a>
        </div>
        {/* isolate mencegah z-index Leaflet bocor menindih Navbar */}
        <div className="rounded-xl overflow-hidden isolate">
          <MapLeaflet markers={allMarkers} />
        </div>
      </div>

      {/* Profil endpoint saya */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex justify-between items-start mb-3">
          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
            {myEndpoint.tipe}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{myEndpoint.nama}</h2>
        <p className="text-gray-400 text-sm mb-4">{myEndpoint.lokasi}</p>

        <div className="bg-[#f0f7f0] rounded-xl p-4 mb-4">
          <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
            Komoditas & Kontribusi
          </p>
          <p className="font-semibold text-green-800">
            Siap Serap: {myEndpoint.komoditas.join(", ")}
          </p>
          <p className="text-gray-500 text-sm">
            Kapasitas sisa: {myEndpoint.kapasitas_sisa} Ton/bln
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <p className="text-sm font-medium text-green-800">
              Kontak Terdaftar
            </p>
          </div>
          <p className="text-xs text-gray-500">Nomor WhatsApp:</p>
          <p className="font-semibold text-green-800">
            📞 {myEndpoint.kontak || "Belum diisi"}
          </p>
        </div>
      </div>

      {/* Limbah yang cocok */}
      <h2 className="text-lg font-bold text-gray-800 mb-1">
        Limbah Tersedia Sesuai Komoditas Anda
      </h2>
      <p className="text-gray-400 text-sm mb-4">
        Ajukan tawaran jual atau donasi ke pemilik limbah berikut.
      </p>

      {limbahCocok.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center text-gray-400 text-sm">
          Belum ada postingan limbah yang cocok dengan komoditas endpoint Anda
          saat ini.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {limbahCocok.map((l) => (
            <div
              key={l.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                  {l.gambar_url ? (
                    <img
                      src={l.gambar_url}
                      alt={l.judul}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">🌾</span>
                  )}
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-semibold uppercase">
                    {l.kategori}
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    {l.judul}
                  </h3>
                </div>
              </div>
              <p className="text-gray-400 text-sm flex items-center gap-1">
                📍 {l.lokasi}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                👤 {l.profiles?.nama || "Petani"}
              </p>
              <p className="text-gray-500 text-sm">Berat: {l.berat} Kg</p>

              <div className="flex items-center justify-between mt-4">
                {myEndpoint.donasi_aktif ? (
                  <p className="text-red-500 font-semibold text-sm">
                    ❤️ Mode Donasi
                  </p>
                ) : (
                  <p className="text-green-700 font-semibold text-sm">
                    💰 Rp {myEndpoint.harga_per_kg.toLocaleString("id-ID")}/Kg
                  </p>
                )}
                <button
                  onClick={() => openTawaran(l)}
                  className="bg-green-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-800 transition"
                >
                  Ajukan Tawaran
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal dirender ke document.body via Portal agar bebas dari stacking context */}
      {typeof window !== "undefined" && createPortal(modalContent, document.body)}
    </div>
  );
}