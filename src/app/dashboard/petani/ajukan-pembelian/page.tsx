"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLimbah, Limbah } from "@/context/LimbahContext";
import { useTransaksi } from "@/context/TransaksiContext";

export default function AjukanPembelianPage() {
  const router = useRouter();
  const { limbahList } = useLimbah();
  const { ajukanTransaksi } = useTransaksi();

  const [targetLimbah, setTargetLimbah] = useState<Limbah | null>(null);
  const [jumlah, setJumlah] = useState(0);
  const [pesan, setPesan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = sessionStorage.getItem("jual_target_id");
    const found = limbahList.find((l) => l.id === id);
    if (found) {
      setTargetLimbah(found);
      setJumlah(found.berat);
    }
  }, [limbahList]);

  if (!targetLimbah) {
    return <div className="text-center py-20 text-gray-400">Memuat data produk...</div>;
  }

  const totalHarga = (targetLimbah.harga ?? 0) * jumlah;

  const handleKirimTawaran = async () => {
    setSubmitting(true);
    setError("");

    const { error } = await ajukanTransaksi({
      limbah_id: targetLimbah.id,
      pemilik_id: targetLimbah.pemilik_id,
      tipe: "jual",
      pesan,
      jumlah,
      total_harga: totalHarga,
    });

    setSubmitting(false);

    if (error) {
      setError(error);
      return;
    }

    router.push("/dashboard/petani/kotak-transaksi");
  };

  return (
    <div>
      <Link href="/pasar-barter/detail" className="text-sm text-gray-500 hover:text-green-700 mb-4 inline-block">
        ← Kembali ke Detail Produk
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ajukan Pembelian</h1>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl mb-4 text-sm">
          ❌ {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Item yang Kamu Beli</h3>
          <div className="bg-green-100 rounded-xl h-48 flex items-center justify-center relative mb-3">
            <span className="text-green-500 text-4xl">🌾</span>
            <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">Tersedia</span>
          </div>
          <p className="font-bold text-gray-800">{targetLimbah.judul}</p>
          <p className="text-gray-500 text-sm">Stok: {targetLimbah.berat}kg</p>
          <p className="text-gray-400 text-sm">📍 {targetLimbah.lokasi}</p>
          <div className="bg-[#f0f7f0] rounded-xl p-3 mt-3">
            <p className="text-xs text-gray-500 mb-2">Pemilik Item</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {targetLimbah.profiles?.nama?.[0] || "P"}
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">{targetLimbah.profiles?.nama || "Petani"}</p>
                <p className="text-xs text-gray-400">{targetLimbah.profiles?.role || "Petani"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white text-sm">💰</div>
            <h3 className="font-semibold text-gray-700 uppercase text-sm">Ringkasan Transaksi</h3>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">Jumlah Pesanan (Kg)</label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setJumlah((j) => Math.max(1, j - 50))}
                className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600"
              >
                −
              </button>
              <input
                type="number"
                value={jumlah}
                onChange={(e) => setJumlah(Number(e.target.value))}
                className="flex-1 text-center text-sm py-3 focus:outline-none"
              />
              <button
                onClick={() => setJumlah((j) => j + 50)}
                className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Harga Dasar (per kg)</span>
              <span className="font-medium">Rp {targetLimbah.harga?.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Jumlah Barang</span>
              <span className="font-medium">{jumlah} Kg</span>
            </div>
          </div>

          <div className="bg-green-700 text-white rounded-xl p-4 mb-4">
            <p className="text-xs text-green-300 uppercase">Total Estimasi</p>
            <p className="text-2xl font-bold">Rp {totalHarga.toLocaleString("id-ID")}</p>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">Pesan untuk Penjual (Opsional)</label>
            <textarea
              rows={3}
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              placeholder="Contoh: Kami berencana mengambil pesanan secara mandiri di lokasi..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <button
            onClick={handleKirimTawaran}
            disabled={submitting}
            className="w-full bg-[#b5e550] text-green-900 font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? "Mengirim..." : "Kirim Tawaran"}
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">
            Tawaran Anda akan berlaku selama 48 jam.
          </p>
        </div>
      </div>
    </div>
  );
}