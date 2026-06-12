"use client";
import dynamic from "next/dynamic";
import { useLimbah } from "@/context/LimbahContext";
import { pengepulList } from "@/data/pengepul";
import type { MapMarker } from "@/components/map/MapLeaflet";

const MapLeaflet = dynamic(() => import("@/components/map/MapLeaflet"), { ssr: false });

export default function SebaranRegional() {
  const { limbahList } = useLimbah();

  const limbahAktif = limbahList.filter((l) => l.aktif_di_map);

  const limbahMarkers: MapMarker[] = limbahAktif.map((item) => ({
    id: item.id,
    nama: item.judul,
    lat: item.lat,
    lng: item.lng,
    lokasi: `${item.lokasi} • ${item.pemilik_nama}`,
    tipe: item.mekanisme,
    info: `Berat: ${item.berat} Kg`,
  }));

  const pengepulMarkers: MapMarker[] = pengepulList.map((p) => ({
    id: p.id,
    nama: p.nama,
    lat: p.lat,
    lng: p.lng,
    lokasi: p.lokasi,
    tipe: "pengepul",
    info: `Kapasitas: ${p.kapasitas_sisa} Ton`,
  }));

  const allMarkers = [...limbahMarkers, ...pengepulMarkers];

  return (
    <section className="py-10 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-1">🗺 Sebaran Regional Komoditas Limbah</h2>
        <p className="text-gray-400 text-sm mb-4">Peta mini penggambaran sebaran pasokan/profil petani dan titik tujuk pabrik rekanan.</p>

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

        <div className="rounded-2xl overflow-hidden border border-gray-200">
          <MapLeaflet markers={allMarkers} />
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">📦 Postingan Limbah Aktif dari Petani</p>
          <div className="grid md:grid-cols-3 gap-3">
            {limbahAktif.length === 0 && (
              <p className="text-gray-400 text-sm col-span-3">Belum ada postingan limbah aktif.</p>
            )}
            {limbahAktif.map((item) => (
              <div key={item.id} className="bg-[#f0f7f0] rounded-xl p-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.mekanisme === "barter" ? "bg-yellow-500" : "bg-green-500"}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{item.judul}</p>
                  <p className="text-xs text-gray-400">📍 {item.lokasi} • {item.pemilik_nama}</p>
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
            {pengepulList.map((p) => (
              <div key={p.id} className="bg-[#f0f7f0] rounded-xl p-3 flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{p.nama}</p>
                  <p className="text-xs text-gray-400">📍 {p.lokasi} • {p.komoditas.join(", ")}</p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  {p.kapasitas_sisa} Ton
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}