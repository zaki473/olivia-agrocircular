"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { useLimbah } from "@/context/LimbahContext";
import { useEndpoint } from "@/context/EndpointContext";
import { useTransaksi } from "@/context/TransaksiContext";
import { useAuth } from "@/context/AuthContext";
import type { MapMarker } from "@/components/map/MapLeaflet";

const MapLeaflet = dynamic(() => import("@/components/map/MapLeaflet"), { ssr: false });

export default function SebaranRegional() {
  const { limbahList } = useLimbah();
  const { endpointList } = useEndpoint();
  const { ajukanTransaksi } = useTransaksi();
  const { user, isLoggedIn } = useAuth();

  const [selectedEndpoint, setSelectedEndpoint] = useState<typeof endpointList[0] | null>(null);
  const [selectedLimbahId, setSelectedLimbahId] = useState("");
  const [jumlah, setJumlah] = useState(0);
  const [pesan, setPesan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sukses, setSukses] = useState(false);

  const limbahAktif = limbahList.filter((l) => l.aktif_di_map);
  const limbahSaya = limbahList.filter((l) => l.pemilik_id === user?.id);

  const limbahMarkers: MapMarker[] = limbahAktif.map((item) => ({
    id: item.id,
    nama: item.judul,
    lat: item.lat,
    lng: item.lng,
    lokasi: `${item.lokasi} • ${item.profiles?.nama || "Petani"}`,
    tipe: item.mekanisme,
    info: `Berat: ${item.berat} Kg`,
  }));

  const endpointMarkers: MapMarker[] = endpointList.map((e) => ({
    id: e.id,
    nama: e.nama,
    lat: e.lat,
    lng: e.lng,
    lokasi: e.lokasi,
    tipe: "pengepul",
    info: `Kapasitas: ${e.kapasitas_sisa} Ton`,
  }));

  const allMarkers = [...limbahMarkers, ...endpointMarkers];

  const handleMarkerClick = (marker: MapMarker) => {
    if (marker.tipe !== "pengepul") return;
    const endpoint = endpointList.find((e) => e.id === marker.id);
    if (endpoint) {
      setSelectedEndpoint(endpoint);
      setSelectedLimbahId(limbahSaya[0]?.id || "");
      setJumlah(0);
      setPesan("");
      setSukses(false);
    }
  };

  const closeModal = () => setSelectedEndpoint(null);

  const selectedLimbah = limbahSaya.find((l) => l.id === selectedLimbahId);

  const handleKirim = async () => {
    if (!selectedEndpoint || !selectedLimbah) return;
    setSubmitting(true);

    const { error } = await ajukanTransaksi({
      limbah_id: selectedLimbah.id,
      endpoint_id: selectedEndpoint.id,
      tipe: selectedEndpoint.donasi_aktif ? "donasi" : "jual",
      pesan,
      jumlah,
      total_harga: selectedEndpoint.donasi_aktif ? undefined : jumlah * selectedEndpoint.harga_per_kg,
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

  // Modal dirender via Portal ke document.body agar bebas dari stacking context manapun
  const modalContent = selectedEndpoint ? (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {sukses ? (
          <div className="text-center py-6">
            <p className="text-4xl mb-3">✅</p>
            <p className="font-bold text-gray-800 text-lg mb-1">Tawaran Terkirim!</p>
            <p className="text-gray-500 text-sm">
              Penawaran Anda telah dikirim ke {selectedEndpoint.nama}
            </p>
          </div>
        ) : !isLoggedIn ? (
          <div className="text-center py-6">
            <p className="text-4xl mb-3">🔒</p>
            <p className="font-bold text-gray-800 text-lg mb-1">Login Diperlukan</p>
            <p className="text-gray-500 text-sm mb-4">
              Anda perlu login sebagai petani untuk mengajukan tawaran.
            </p>
            <a
              href="/login"
              className="inline-block bg-green-700 text-white px-6 py-2 rounded-lg text-sm"
            >
              Masuk
            </a>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{selectedEndpoint.nama}</h3>
                <p className="text-gray-400 text-sm">📍 {selectedEndpoint.lokasi}</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">
                ×
              </button>
            </div>

            <div className="bg-[#f0f7f0] rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                Komoditas Diterima
              </p>
              <div className="flex gap-2 flex-wrap mb-2">
                {selectedEndpoint.komoditas.map((k) => (
                  <span
                    key={k}
                    className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full"
                  >
                    {k}
                  </span>
                ))}
              </div>
              {selectedEndpoint.donasi_aktif ? (
                <p className="text-red-500 font-semibold text-sm">❤️ Mode Donasi Aktif</p>
              ) : (
                <p className="text-green-700 font-semibold text-sm">
                  💰 Rp {selectedEndpoint.harga_per_kg.toLocaleString("id-ID")}/Kg
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Kapasitas sisa: {selectedEndpoint.kapasitas_sisa} Ton
              </p>
            </div>

            {limbahSaya.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
                Anda belum punya postingan limbah. Buat postingan di{" "}
                <strong>Kelola Limbah</strong> terlebih dahulu.
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="text-sm text-gray-600 mb-1 block">Pilih Limbah Anda</label>
                  <select
                    value={selectedLimbahId}
                    onChange={(e) => {
                      setSelectedLimbahId(e.target.value);
                      const l = limbahSaya.find((x) => x.id === e.target.value);
                      if (l) setJumlah(l.berat);
                    }}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {limbahSaya.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.judul} ({l.berat} Kg)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="text-sm text-gray-600 mb-1 block">
                    Jumlah Ditawarkan (Kg)
                  </label>
                  <input
                    type="number"
                    value={jumlah}
                    onChange={(e) => setJumlah(Number(e.target.value))}
                    max={selectedLimbah?.berat}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {!selectedEndpoint.donasi_aktif && (
                  <div className="bg-green-700 text-white rounded-xl p-3 mb-4">
                    <p className="text-xs text-green-300">Estimasi Pendapatan</p>
                    <p className="text-xl font-bold">
                      Rp {(jumlah * selectedEndpoint.harga_per_kg).toLocaleString("id-ID")}
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="text-sm text-gray-600 mb-1 block">Pesan (Opsional)</label>
                  <textarea
                    rows={3}
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    placeholder="Contoh: Bisa diambil hari ini, lokasi mudah diakses truk."
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
                    onClick={handleKirim}
                    disabled={submitting}
                    className="flex-1 bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition text-sm font-semibold disabled:opacity-50"
                  >
                    {submitting
                      ? "Mengirim..."
                      : selectedEndpoint.donasi_aktif
                      ? "Kirim Donasi"
                      : "Kirim Tawaran"}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  ) : null;

  return (
    <section className="py-10 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          🗺 Sebaran Regional Komoditas Limbah
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Klik marker pengepul (biru) di peta untuk mengajukan tawaran jual/donasi limbah Anda.
        </p>

        <div className="flex gap-4 mb-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-500">Limbah Barter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-500">Limbah Jual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-500">Pengepul/Endpoint</span>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-200 isolate">
          <MapLeaflet markers={allMarkers} onMarkerClick={handleMarkerClick} />
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            📦 Postingan Limbah Aktif dari Petani
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {limbahAktif.length === 0 && (
              <p className="text-gray-400 text-sm col-span-3">
                Belum ada postingan limbah aktif.
              </p>
            )}
            {limbahAktif.map((item) => (
              <div
                key={item.id}
                className="bg-[#f0f7f0] rounded-xl p-3 flex items-center gap-3"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.mekanisme === "barter" ? "bg-yellow-500" : "bg-green-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{item.judul}</p>
                  <p className="text-xs text-gray-400">
                    📍 {item.lokasi} • {item.profiles?.nama || "Petani"}
                  </p>
                </div>
                <span className="bg-green-200 text-green-800 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  {item.berat} KG
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">🏭 Endpoint / Pengepul Aktif</p>
          <div className="grid md:grid-cols-3 gap-3">
            {endpointList.length === 0 && (
              <p className="text-gray-400 text-sm col-span-3">
                Belum ada endpoint terdaftar.
              </p>
            )}
            {endpointList.map((e) => (
              <button
                key={e.id}
                onClick={() =>
                  handleMarkerClick({
                    id: e.id,
                    nama: e.nama,
                    lat: e.lat,
                    lng: e.lng,
                    lokasi: e.lokasi,
                    tipe: "pengepul",
                  })
                }
                className="bg-[#f0f7f0] rounded-xl p-3 flex items-center gap-3 text-left hover:bg-green-50 transition"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{e.nama}</p>
                  <p className="text-xs text-gray-400">
                    📍 {e.lokasi} • {e.komoditas.join(", ")}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  {e.kapasitas_sisa} Ton
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal dirender langsung ke document.body via Portal */}
      {typeof window !== "undefined" && createPortal(modalContent, document.body)}
    </section>
  );
}