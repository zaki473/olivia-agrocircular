"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLimbah } from "@/context/LimbahContext";
import { useState, useEffect } from "react";

const kategoriList = ["Semua", "Jerami Padi", "Kohe Sapi", "Ampas Tahu", "Batang Jagung", "Kulit Kakao", "Sekam Padi"];

export default function PasarBarterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { limbahList } = useLimbah();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeKategori, setActiveKategori] = useState(searchParams.get("kategori") || "Semua");

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setActiveKategori(searchParams.get("kategori") || "Semua");
  }, [searchParams]);

  const filteredList = limbahList.filter((item) => {
    const matchQuery = searchQuery.trim() === "" ||
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase());

    const matchKategori = activeKategori === "Semua" || item.kategori === activeKategori;

    return matchQuery && matchKategori;
  });

  const lihatDetail = (id: number) => {
    sessionStorage.setItem("selected_limbah_id", String(id));
    router.push("/pasar-barter/detail");
  };

  return (
    <>
      <Navbar />
      <section className="bg-[#f0f7f0] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Temukan Bahan Baku Circular</h1>
          <div className="flex gap-3 mt-4">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 flex-1 max-w-md">
              <span className="text-gray-400 mr-2">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari jenis limbah..."
                className="flex-1 text-sm outline-none bg-transparent"
              />
            </div>
            <button
              onClick={() => {}}
              className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition"
            >
              Cari
            </button>
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            {kategoriList.map((k) => (
              <button
                key={k}
                onClick={() => setActiveKategori(k)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                  activeKategori === k
                    ? "bg-[#b5e550] text-green-900 border-[#b5e550]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-500"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="font-semibold text-gray-800">Hasil Pencarian</p>
              <p className="text-gray-400 text-sm">Ditemukan {filteredList.length} listing material</p>
            </div>
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
              <option>Urutkan: Terdekat</option>
              <option>Terbaru</option>
              <option>Harga Terendah</option>
            </select>
          </div>

          {filteredList.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500">Tidak ada hasil ditemukan untuk pencarian ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredList.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="relative">
                    <div className="bg-green-100 h-40 flex items-center justify-center">
                      <span className="text-green-600 text-sm">📦 {item.kategori}</span>
                    </div>
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.status === "tersedia" ? "Tersedia" : "Habis"}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-800 text-sm leading-snug">{item.judul}</p>
                    <p className="text-green-700 text-xs mt-1">📍 {item.lokasi}</p>
                    <p className="text-gray-500 text-xs mt-0.5">👤 {item.pemilik_nama}</p>
                    {item.harga && (
                      <p className="text-green-700 text-sm font-semibold mt-2">Rp {item.harga.toLocaleString("id-ID")}/kg</p>
                    )}
                    {item.mekanisme === "barter" && (
                      <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full mt-2">Barter</span>
                    )}
                    <button
                      onClick={() => lihatDetail(item.id)}
                      className="block w-full text-center border border-green-700 text-green-700 text-sm font-medium py-2 rounded-lg mt-3 hover:bg-green-50 transition"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}