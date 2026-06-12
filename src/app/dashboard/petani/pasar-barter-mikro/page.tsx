"use client";
import { useLimbah } from "@/context/LimbahContext";
import AjukanButton from "@/components/shared/AjukanButton";

export default function PasarBarterMikroPage() {
  const { limbahList } = useLimbah();
  const barterItems = limbahList.filter((l) => l.mekanisme === "barter");

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-1">Pasar Barter Mikro</h1>
      <p className="text-gray-400 text-sm mb-6">
        Temukan mitra barter terdekat yang siap menukar limbah dengan Anda.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {barterItems.map((item) => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="bg-green-100 rounded-lg h-32 flex items-center justify-center mb-3">
              <span className="text-3xl">🌾</span>
            </div>
            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">Barter</span>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-1">{item.kategori}</span>
            <p className="font-semibold text-gray-800 text-sm mt-2">{item.judul}</p>
            <p className="text-gray-400 text-xs">📍 {item.lokasi}</p>
            <p className="text-gray-400 text-xs">👤 {item.pemilik_nama}</p>
            <p className="text-gray-500 text-xs mt-1">Berat: {item.berat} Kg</p>
            <p className="text-green-600 text-xs mt-0.5">Ingin: {item.barter_dengan}</p>
            <AjukanButton
              type="barter"
              limbahId={item.id}
              className="w-full mt-3 bg-green-700 text-white text-sm py-2 rounded-lg hover:bg-green-800 transition"
            >
              Ajukan Barter
            </AjukanButton>
          </div>
        ))}
      </div>
    </div>
  );
}