"use client";
import { useState } from "react";

const komoditasList = [
  { id: "jerami", label: "Jerami Padi", desc: "Sisa panen padi melimpah. Sangat baik untuk mulsa organik, pakan ternak fermentasi, atau cetakan kertas" },
  { id: "kohe", label: "Kohe Sapi (Kotoran Hewan)", desc: "Bahan baku pupuk organik kompos premium. Kaya nitrogen, fosfor, kalium, siap fermentasi.", default: true },
  { id: "kakao", label: "Kulit Kakao", desc: "Limbah perkebunan cokelat. Mengandung selulosa tinggi, baik untuk pakan ternak konsentrat tinggi serat.", default: true },
  { id: "ampas-tahu", label: "Ampas Tahu", desc: "Limbah cair & padat produksi tahu tinggi protein. Sempurna untuk bahan campuran pakan konsentrat sapi/bebek" },
  { id: "tebu", label: "Ampas Tebu", desc: "Serat keras sisa pemerasan tebu. Sangat diminati sebagai sumber energi biomassa industri.", default: true },
  { id: "sekam", label: "Sekam Padi", desc: "Kulit ari padi hasil penggilingan. Digunakan untuk media tanam sekam bakar, bahan bata merah." },
];

export default function KatalogSerapanPage() {
  const [dipilih, setDipilih] = useState<string[]>(
    komoditasList.filter((k) => k.default).map((k) => k.id)
  );
  const [berat, setBerat] = useState(1000);
  const [harga, setHarga] = useState(550);
  const [kapasitas] = useState(480);

  const toggle = (id: string) => {
    setDipilih((prev) => prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]);
  };

  return (
    <div>
      {/* Summary */}
      <div className="bg-[#f0f7f0] border border-green-100 rounded-2xl p-5 mb-6 flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
          <p className="text-green-600 text-sm font-medium">Jumlah Komoditas: {dipilih.length}</p>
          <p className="font-semibold text-gray-700 mt-1">Jenis Komoditas Limbah:</p>
          <div className="flex gap-2 flex-wrap mt-2">
            {dipilih.map((id) => {
              const k = komoditasList.find((k) => k.id === id);
              return k ? (
                <span key={id} className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full">{k.label.split(" ")[0]}</span>
              ) : null;
            })}
          </div>
        </div>
        <div className="bg-[#b5e550] rounded-xl px-6 py-4 text-center">
          <p className="text-green-800 text-sm font-medium">Batas Kapasitas Serapan:</p>
          <p className="text-3xl font-bold text-green-900">{kapasitas} ton/bulan</p>
        </div>
        <button className="border border-gray-200 text-gray-500 text-sm px-4 py-2 rounded-lg hover:bg-white transition">
          ✏️ Edit Data Katalog
        </button>
      </div>

      {/* Setup katalog */}
      <div className="bg-green-800 text-white rounded-2xl p-5 mb-6">
        <p className="font-semibold text-lg">🌿 Setup Katalog Serapan Komoditas Pengepul</p>
        <p className="text-green-200 text-sm mt-1">
          Tentukan jenis limbah pertanian yang sanggup diolah oleh instalasi pabrik Anda untuk menepis polusi karbon.
        </p>
      </div>

      {/* Grid komoditas */}
      <div className="mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Jenis Komoditas Limbah Terintegrasi</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {komoditasList.map((k) => {
            const aktif = dipilih.includes(k.id);
            return (
              <div
                key={k.id}
                onClick={() => toggle(k.id)}
                className={`border rounded-xl p-4 flex items-start gap-3 cursor-pointer transition ${
                  aktif ? "border-green-500 bg-green-50" : "border-gray-100 bg-white hover:border-green-300"
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  aktif ? "border-green-600 bg-green-600" : "border-gray-300"
                }`}>
                  {aktif && <span className="text-white text-xs">✓</span>}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{k.label}</p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{k.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kalkulator */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-semibold text-gray-800">💰 Kalkulator Harga</p>
            <p className="text-gray-400 text-sm">Simulasikan nilai investasi serapan berdasarkan volume harian.</p>
          </div>
          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
            MARKET BENCHMARK: RP 450 – 650 / KG
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Pilih Komoditas</label>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {komoditasList.map((k) => (
                  <option key={k.id}>{k.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Atur Berat (Kilogram)</label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <input
                  type="number"
                  value={berat}
                  onChange={(e) => setBerat(Number(e.target.value))}
                  className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
                />
                <span className="bg-gray-50 px-3 py-2.5 text-sm text-gray-400 border-l border-gray-200">KG</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-gray-500">Harga Beli Mandiri per KG (Rp)</label>
                <span className="font-semibold text-gray-700">Rp {harga}</span>
              </div>
              <input
                type="range"
                min={300}
                max={1000}
                value={harga}
                onChange={(e) => setHarga(Number(e.target.value))}
                className="w-full accent-green-700"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Rp 300</span>
                <span>Rp 1.000</span>
              </div>
            </div>
          </div>

          <div className="bg-green-700 text-white rounded-xl p-5">
            <p className="text-sm font-semibold mb-3">Estimasi Alokasi Dana</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-200">Total Berat</span>
                <span className="font-bold">{berat.toLocaleString("id-ID")} KG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-200">Harga Satuan</span>
                <span className="font-bold">Rp {harga}</span>
              </div>
              <div className="border-t border-green-600 pt-2 mt-2">
                <p className="text-xs text-green-300 uppercase">Total Pembayaran</p>
                <p className="text-2xl font-bold mt-1">
                  Rp {(berat * harga).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            <p className="text-xs text-green-300 mt-3 italic">*Belum termasuk biaya logistik armada AgroCircular.</p>
          </div>
        </div>
      </div>

      {/* Kapasitas bulanan */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-3">
          <p className="font-semibold text-gray-800">Batas Kapasitas Serapan Bulanan</p>
          <span className="bg-[#b5e550] text-green-900 text-sm font-semibold px-3 py-1 rounded-full">
            {kapasitas} ton/bulan
          </span>
        </div>
        <div className="bg-gray-100 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full w-4/5"></div>
        </div>
        <p className="text-gray-400 text-xs mt-2">
          Pengaruh kuota: Menunjukkan sisa kapasitas penyimpanan silo pengepul kepada publik di peta sinergi.
        </p>
      </div>

      <button className="w-full bg-green-700 text-white font-semibold py-4 rounded-xl hover:bg-green-800 transition">
        Simpan Perubahan
      </button>
    </div>
  );
}