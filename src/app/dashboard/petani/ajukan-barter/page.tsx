"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLimbah, Limbah } from "@/context/LimbahContext";
import { useTransaksi } from "@/context/TransaksiContext";
import { useAuth } from "@/context/AuthContext";

export default function AjukanBarterPage() {
  const router = useRouter();
  const { limbahList } = useLimbah();
  const { ajukanTransaksi } = useTransaksi();
  const { profile } = useAuth();

  const [step, setStep] = useState<"form" | "konfirmasi">("form");
  const [targetLimbah, setTargetLimbah] = useState<Limbah | null>(null);
  const [itemDitawarkan, setItemDitawarkan] = useState("Pupuk Kandang Sapi (200kg)");
  const [pesan, setPesan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = sessionStorage.getItem("barter_target_id");
    const found = limbahList.find((l) => l.id === id);
    if (found) setTargetLimbah(found);
  }, [limbahList]);

  if (!targetLimbah) {
    return <div className="text-center py-20 text-gray-400">Memuat data produk...</div>;
  }

  const handleKirimTawaran = async () => {
    setSubmitting(true);
    setError("");

    const { error } = await ajukanTransaksi({
      limbah_id: targetLimbah.id,
      pemilik_id: targetLimbah.pemilik_id,
      tipe: "barter",
      item_ditawarkan: itemDitawarkan,
      pesan,
    });

    setSubmitting(false);

    if (error) {
      setError(error);
      return;
    }

    router.push("/dashboard/petani/kotak-transaksi");
  };

  if (step === "konfirmasi") {
    return (
      <div>
        <Link href="/pasar-barter/detail" className="text-sm text-gray-500 hover:text-green-700 mb-4 inline-block">
          ← Kembali ke Detail Produk
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Ajukan Penawaran Barter</h1>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl mb-4 text-sm">
            ❌ {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-4">Item yang Kamu Inginkan</h3>
              <div className="bg-green-100 rounded-xl h-48 flex items-center justify-center relative mb-3 overflow-hidden">
                {targetLimbah.gambar_url ? (
                  <img src={targetLimbah.gambar_url} alt={targetLimbah.judul} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-green-500 text-4xl">🌾</span>
                )}
                <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">Tersedia</span>
              </div>
            <p className="font-bold text-gray-800">{targetLimbah.judul}</p>
            <p className="text-gray-500 text-sm">Estimasi: {targetLimbah.berat}kg</p>
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
              <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white text-sm">⇄</div>
              <h3 className="font-semibold text-gray-700 uppercase text-sm">Konfirmasi Pengajuan Barter</h3>
            </div>

            <p className="text-sm font-medium text-gray-700 mb-2">Ringkasan Pertukaran</p>
            <div className="bg-[#f0f7f0] rounded-xl p-4 flex justify-between items-center mb-4">
              <div>
                <p className="text-xs text-gray-400 uppercase">Kamu Meminta</p>
                <p className="font-bold text-sm">{targetLimbah.judul}</p>
                <p className="text-xs text-gray-400">{targetLimbah.berat} Kg • {targetLimbah.profiles?.nama}</p>
              </div>
              <span className="text-green-600 text-xl">⇄</span>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase">Kamu Menawarkan</p>
                <p className="font-bold text-sm">{itemDitawarkan}</p>
                <p className="text-xs text-gray-400">Oleh: {profile?.nama}</p>
              </div>
            </div>

            <p className="text-sm font-medium text-gray-700 mb-2">Metode Logistik</p>
            <div className="space-y-2 mb-4">
              <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                <div>
                  <p className="text-sm font-medium">COD (Ketemu Tengah)</p>
                  <p className="text-xs text-gray-400">Janji temu via WhatsApp</p>
                </div>
              </div>
              <div className="border-2 border-green-600 rounded-xl p-3 flex items-center gap-3 bg-green-50">
                <div className="w-4 h-4 rounded-full border-2 border-green-600 bg-green-600"></div>
                <div>
                  <p className="text-sm font-medium">Antar ke Pemilik</p>
                  <p className="text-xs text-gray-400">Gunakan armada sendiri</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 text-sm text-blue-700">
              🛡 <strong>Sistem Terverifikasi</strong> — Verifikasi kualitas dilakukan saat bertemu fisik untuk keamanan bersama.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("form")}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition text-sm"
              >
                Kembali
              </button>
              <button
                onClick={handleKirimTawaran}
                disabled={submitting}
                className="flex-1 bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition text-sm font-semibold disabled:opacity-50"
              >
                {submitting ? "Mengirim..." : "▷ Kirim Tawaran"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/pasar-barter/detail" className="text-sm text-gray-500 hover:text-green-700 mb-4 inline-block">
        ← Kembali ke Detail Produk
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ajukan Penawaran Barter</h1>

      <div className="grid md:grid-cols-2 gap-6 items-start relative">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Item yang Kamu Inginkan</h3>
            <div className="bg-green-100 rounded-xl h-48 flex items-center justify-center relative mb-3 overflow-hidden">
              {targetLimbah.gambar_url ? (
                <img src={targetLimbah.gambar_url} alt={targetLimbah.judul} className="w-full h-full object-cover" />
              ) : (
                <span className="text-green-500 text-4xl">🌾</span>
              )}
              <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">Tersedia</span>
            </div>
          <p className="font-bold text-gray-800">{targetLimbah.judul}</p>
          <p className="text-gray-500 text-sm">Estimasi: {targetLimbah.berat}kg</p>
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
          <h3 className="font-semibold text-gray-700 mb-4">Item yang Kamu Tawarkan</h3>

          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">Pilih Waste Kamu</label>
            <select
              value={itemDitawarkan}
              onChange={(e) => setItemDitawarkan(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Pupuk Kandang Sapi (200kg)</option>
              <option>Jerami Padi Kering (500kg)</option>
              <option>Sekam Padi (300kg)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">Pesan untuk Pemilik</label>
            <textarea
              rows={4}
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              placeholder="Halo Pak, saya ada pupuk kandang 200kg, apakah boleh barter dengan jerami Bapak?"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="text-center mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Barter Meter</p>
            <div className="bg-gray-100 rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Fair Trade Value</p>
          </div>

          <button
            onClick={() => setStep("konfirmasi")}
            className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition"
          >
            ▷ Kirim Ajuan
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">
            Pemilik akan mendapatkan notifikasi dan dapat menyetujui, menolak, atau membalas pesan Anda.
          </p>
        </div>
      </div>
    </div>
  );
}