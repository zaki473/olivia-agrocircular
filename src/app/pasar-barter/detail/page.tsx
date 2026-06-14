"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLimbah, Limbah } from "@/context/LimbahContext";
import AjukanButton from "@/components/shared/AjukanButton";

export default function DetailProdukPage() {
  const { limbahList } = useLimbah();
  const [item, setItem] = useState<Limbah | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("selected_limbah_id");
    const found = limbahList.find((l) => l.id === id) || limbahList[0];
    setItem(found || null);
  }, [limbahList]);

  if (!item) return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">Memuat produk...</div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-green-700">Beranda</Link>
          {" / "}
          <Link href="/pasar-barter" className="hover:text-green-700">{item.kategori}</Link>
          {" / "}
          <span className="text-gray-600">{item.judul}</span>
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="bg-green-100 rounded-xl h-72 flex items-center justify-center mb-4 relative overflow-hidden">
              {item.gambar_url ? (
                <img src={item.gambar_url} alt={item.judul} className="w-full h-full object-cover" />
              ) : (
                <span className="text-green-600">📦 Foto Produk</span>
              )}
              <span className="absolute top-3 left-3 bg-green-700 text-white text-xs px-2 py-0.5 rounded">BARU</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-green-100 rounded-lg w-20 h-16 flex items-center justify-center">
                  <span className="text-green-400 text-xs">foto {i}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-lg mb-3">Deskripsi Produk</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{item.deskripsi}</p>
              <div className="mt-4 border-l-4 border-green-500 pl-4 bg-green-50 rounded-r-lg py-3">
                <p className="text-green-800 font-semibold text-sm">Dampak Sirkular:</p>
                <p className="text-green-700 text-sm mt-1">
                  Dengan melakukan barter limbah ini, Anda berkontribusi pada pengurangan emisi karbon dari logistik distribusi konvensional.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{item.judul}</h1>
            <p className="text-gray-500 text-sm mb-4">📍 {item.lokasi}</p>

            {item.mekanisme === "barter" ? (
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mb-4">
                <div className="flex items-center gap-2 text-green-700 font-semibold mb-3">
                  <span>⇄</span>
                  <span>KEBUTUHAN BARTER</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">🌾</div>
                  <div>
                    <p className="font-medium text-sm">{item.barter_dengan}</p>
                    <p className="text-gray-400 text-xs">Jumlah: {item.berat} Kg</p>
                  </div>
                </div>
                <AjukanButton
                  type="barter"
                  limbahId={item.id}
                  className="block w-full text-center bg-[#b5e550] text-green-900 font-semibold py-3 rounded-lg mt-4 hover:opacity-90 transition"
                >
                  Ajukan Barter Sekarang
                </AjukanButton>
                <button className="w-full border border-gray-200 text-gray-600 py-3 rounded-lg mt-2 text-sm hover:bg-gray-50 transition">
                  💬 Chat dengan Pemilik
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mb-4">
                <p className="text-2xl font-bold text-green-800 mb-1">
                  Rp {item.harga?.toLocaleString("id-ID")}/kg
                </p>
                <div className="border-t border-gray-100 pt-4 mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Harga Dasar (per kg)</span>
                    <span className="font-medium">Rp {item.harga?.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Pembelian</span>
                    <span className="font-medium">{item.berat} Kg</span>
                  </div>
                  <div className="bg-green-700 text-white rounded-lg p-3 mt-3">
                    <p className="text-xs">Total Estimasi</p>
                    <p className="text-xl font-bold">
                      Rp {((item.harga ?? 0) * item.berat).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <AjukanButton
                  type="pembelian"
                  limbahId={item.id}
                  className="w-full bg-[#b5e550] text-green-900 font-semibold py-3 rounded-lg mt-4 hover:opacity-90 transition"
                >
                  Konfirmasi & Hubungi Penjual
                </AjukanButton>
              </div>
            )}

            <div className="bg-[#f0f7f0] rounded-xl p-4">
              <p className="font-semibold text-gray-800 mb-3">Profil Pemilik</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {item.profiles?.nama?.[0] || "P"}
                </div>
                <div>
                  <p className="font-medium text-sm">{item.profiles?.nama || "Petani"}</p>
                  <p className="text-gray-400 text-xs">{item.profiles?.role || "Petani"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-gray-400 uppercase tracking-wide">Lokasi</p>
                  <p className="font-medium text-gray-700 mt-0.5">{item.lokasi}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}