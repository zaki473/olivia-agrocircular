"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DetailButton from "@/components/shared/DetailButton";
import SebaranRegional from "@/components/shared/SebaranRegional";
import { useLimbah } from "@/context/LimbahContext";

const kategoriList = [
  "Semua Limbah",
  "Jerami Padi",
  "Kohe Sapi (Kotoran Hewan)",
  "Ampas Tahu",
  "Sekam Padi",
  "Kulit Kakao",
  "Bagasse Tebu (Ampas Tahu)",
];

const mitraPabrik = [
  {
    nama: "CV Sinergi Pupuk Sukses",
    lokasi: "Berbah, Sleman",
    komoditas: ["Sapi Segar/Basah", "United Padi", "Kulit Sapi"],
    kapasitas: "50 Ton",
  },
  {
    nama: "PT Biomassa Nusantara",
    lokasi: "Sleman, Magelang",
    komoditas: ["Jerami", "Sekam Padi", "Ampas Tahu"],
    kapasitas: "200 Ton",
  },
];

const dampak = [
  {
    value: "2.4 Ton",
    label: "Limbah Terselamatkan",
    sub: "Target 04: 10.000 Ton",
    ikon: "⇄",
  },
  {
    value: "147 Kg",
    label: "CO₂ Ditekan",
    sub: "Pertumbuhan +13% ditekan",
    ikon: "🌿",
  },
  {
    value: "147",
    label: "Pelaku Agraris",
    sub: "Lebih dari 25.000 Petani",
    ikon: "👁",
  },
];

export default function BerandaPage() {
  const router = useRouter();
  const { limbahList } = useLimbah();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeKategori, setActiveKategori] = useState("Semua Limbah");

  const barterAktif = limbahList.filter((l) => l.mekanisme === "barter");
  const limbahJual = limbahList.filter((l) => l.mekanisme === "jual");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (activeKategori !== "Semua Limbah")
      params.set("kategori", activeKategori);
    router.push(`/pasar-barter?${params.toString()}`);
  };

  return (
    <>
      <Navbar />

      {/* Hero Search */}
      <section className="bg-[#f0f7f0] py-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-green-600 text-xs font-semibold uppercase tracking-widest mb-2">
            🌿 KEKUATAN PANGAN LESTARI • GOTO DESA
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-1">
            Pencarian Cepat{" "}
            <span className="italic text-green-700">Sinergi Limbah</span>
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Temukan jerami padi kering, kotoran hewan berkualitas yang siap
            dibarter antar/tetangga tani atau dijual langsung ke jaringan mitra
            pabrik sirkular kami.
          </p>

          <div className="flex gap-2 max-w-2xl mx-auto mb-4">
            <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 gap-2">
              <span className="text-gray-300">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Cari jenis komoditi... (jerami, 'Sekam Padi', 'Kohe Sapi', 'Ampas Tahu', 'Molase'...)"
                className="flex-1 text-sm outline-none text-gray-600 placeholder-gray-300"
              />
              <span className="text-gray-300 text-sm">📍</span>
            </div>
            <button
              onClick={handleSearch}
              className="bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-green-800 transition"
            >
              Cari
              <br />
              Sekarang
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {kategoriList.map((k) => (
              <button
                key={k}
                onClick={() => {
                  setActiveKategori(k);
                  const params = new URLSearchParams();
                  if (k !== "Semua Limbah") params.set("kategori", k);
                  router.push(`/pasar-barter?${params.toString()}`);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition ${
                  activeKategori === k
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Barter Aktif */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                ⇄ Barter Aktif
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">
                Daftar komoditas limbah lain yang siap ditukar mandiri tanpa
                memerlukan transaksi untuk memenuhi kebutuhan sinergi ekosistem
                siklus produksi tani.
              </p>
            </div>
            <Link
              href="/pasar-barter"
              className="bg-green-700 text-white text-xs px-4 py-2 rounded-lg hover:bg-green-800 transition"
            >
              Lihat Selengkapnya
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {barterAktif.length === 0 && (
              <p className="text-gray-400 text-sm col-span-4">
                Belum ada postingan barter.
              </p>
            )}
            {barterAktif.map((item) => (
              <div
                key={item.id}
                className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="bg-yellow-100 h-36 flex items-center justify-center relative">
                    <span className="text-4xl">🌾</span>
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                      Tersedia
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-gray-800 text-sm leading-snug">
                      {item.judul}
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                      📍 {item.lokasi}
                    </p>
                    <p className="text-gray-400 text-xs">
                      👤 {item.pemilik_nama}
                    </p>
                  </div>
                </div>
                <div className="p-3 pt-0">
                  <DetailButton id={item.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limbah Siap Jual */}
      <section className="py-10 px-4 bg-[#f8faf8]">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Limbah Siap Jual
              </h2>
              <p className="text-gray-400 text-xs">
                Daftar limbah yang tersedia untuk pembelian komersial langsung.
              </p>
            </div>
            <Link
              href="/pasar-barter"
              className="text-green-600 text-sm hover:underline"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {limbahJual.length === 0 && (
              <p className="text-gray-400 text-sm col-span-4">
                Belum ada postingan jual.
              </p>
            )}
            {limbahJual.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="bg-lime-100 h-32 flex items-center justify-center relative">
                    <span className="text-3xl">🌿</span>
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Baru
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-gray-800 text-sm">
                      {item.judul}
                    </p>
                    <p className="text-green-600 text-xs mt-0.5">
                      📍 {item.lokasi}
                    </p>
                    <p className="text-gray-400 text-xs">
                      👤 {item.pemilik_nama}
                    </p>
                    <p className="text-green-700 font-bold text-sm mt-1">
                      Rp {item.harga?.toLocaleString("id-ID")}/kg
                    </p>
                  </div>
                </div>
                <div className="p-3 pt-0">
                  <DetailButton id={item.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kalkulator Nilai Tukar */}
      <section className="py-10 px-4 bg-green-900 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-green-800 rounded-2xl p-4 text-sm">
            <p className="font-semibold text-green-200 mb-1">
              💰 Nol Biaya Rupiah
            </p>
            <p className="text-green-300 text-xs">
              Saling menyumbangkan antar tetangga tani tanpa transaksi biaya.
              Sama namun berbeda nilai.
            </p>
          </div>
          <div className="bg-green-800 rounded-2xl p-4 text-sm">
            <p className="font-semibold text-green-200 mb-1">
              🔄 Nilai Konversi Adil
            </p>
            <p className="text-green-300 text-xs">
              Kami memberikan estimasi nilai tukar adil berdasarkan nilai
              komoditi agraris organic organik terverifikasi.
            </p>
          </div>

          <div className="md:col-span-2 bg-white text-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>⇄</span> Kalkulator Est. Nilai Tukar Adil
            </h3>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    JENIS LIMBAH KAMU
                  </label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Jerami Padi</option>
                    <option>Kohe Sapi</option>
                    <option>Ampas Tahu</option>
                    <option>Sekam Padi</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    BERAT TOTAL LIMBAH (KG)
                  </label>
                  <input
                    type="number"
                    defaultValue="1000"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    INGIN DITUKAR DENGAN
                  </label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Kohe Sapi</option>
                    <option>Jerami Padi</option>
                    <option>Ampas Tahu</option>
                  </select>
                </div>
                <div className="bg-[#f0f7f0] rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    ESTIMASI HASIL TUKAR ADIL
                  </p>
                  <p className="text-4xl font-extrabold text-green-700">
                    667{" "}
                    <span className="text-lg font-normal text-gray-500">
                      Kg
                    </span>
                  </p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    MURNI SUBUR
                  </p>
                  <p className="text-xs text-gray-400 mt-2 italic">
                    *Hasil estimasi proporsional memperhatikan nilai hukum
                    fisika (N, P, K) untuk organisme tanah menjadi subur.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                  <img src="https://ik.imagekit.io/p27ub3udc/agorcircular/image%206%20(1).png"></img>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Peta Sebaran */}
      <SebaranRegional />

      {/* Program Kemitraan */}
      <section className="py-10 px-4 bg-[#f8faf8]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Program Kemitraan:{" "}
            <span className="italic text-green-700">
              Jual Langsung ke Pabrik
            </span>
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Punya limbah melimpah namun tidak ada pembeli? Jual langsung secara
            instan kepada rekanan pabrik dengan harga andalan industri tanpa
            perantara.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                📋 Daftar Pabrik Rekanan Pembeli Aktif
              </p>
              <div className="space-y-3">
                {mitraPabrik.map((m) => (
                  <div
                    key={m.nama}
                    className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                      🏭
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">
                        {m.nama}
                      </p>
                      <p className="text-gray-400 text-xs">📍 {m.lokasi}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {m.komoditas.map((k) => (
                          <span
                            key={k}
                            className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">Kapasitas</p>
                      <p className="font-bold text-green-700 text-sm">
                        {m.kapasitas}
                      </p>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-400 italic px-1">
                  * Tiap jual ke pabrik memerlukan tanda kuota komitmen. Tanda
                  kuota akan dikirimkan kepada pemasok terpilih via email
                  platform.
                </p>
              </div>
            </div>

            <div className="bg-green-800 text-white rounded-2xl p-5">
              <p className="font-semibold mb-4">
                💰 Kalkulator Mandiri Hasil Komersial
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-green-300 mb-1 block">
                    PILIH KOMODITAS LIMBAH
                  </label>
                  <select className="w-full bg-green-700 border border-green-600 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none">
                    <option>Jerami Padi</option>
                    <option>Kohe Sapi</option>
                    <option>Ampas Tahu</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-green-300 mb-1 block">
                    ESTIMASI BERAT PANEN (KG)
                  </label>
                  <input
                    type="number"
                    defaultValue="1000"
                    className="w-full bg-green-700 border border-green-600 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-green-300 mb-1 block">
                    PILIH REKANAN PABRIK
                  </label>
                  <select className="w-full bg-green-700 border border-green-600 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none">
                    <option>CV Sinergi Pupuk Sukses</option>
                    <option>PT Biomassa Nusantara</option>
                  </select>
                </div>
                <div className="bg-green-700 rounded-xl p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-300">Estimasi Pendapatan</span>
                    <span className="font-bold">Rp 1.200.000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-300">Berat Diterima</span>
                    <span className="font-bold">950 Kg</span>
                  </div>
                </div>
                <button className="w-full bg-[#b5e550] text-green-900 font-bold py-3 rounded-xl hover:opacity-90 transition text-sm">
                  AJUKAN PENJUALAN PABRIK →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dampak Kolektif */}
      <section className="py-12 px-4 bg-[#f0f7f0]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Dampak Kolektif Kita
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Data real-time dari seluruh jaringan AgroCircular di Indonesia.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {dampak.map((d) => (
              <div key={d.label} className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-3xl mb-2">{d.ikon}</p>
                <p className="text-3xl font-extrabold text-green-700">
                  {d.value}
                </p>
                <p className="text-gray-700 font-medium text-sm mt-1">
                  {d.label}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{d.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
