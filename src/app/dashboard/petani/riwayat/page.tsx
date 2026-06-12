export default function RiwayatPage() {
  const riwayat = [
    { id: 1, ikon: "✅", judul: "Barter Selesai: Jerami Padi", detail: "Total: 500 Kg", oleh: "Pak Mahmud (Peternak)", tanggal: "12 Oktober 2023", warna: "green" },
    { id: 2, ikon: "✅", judul: "Pembelian Selesai: Jerami Padi", detail: "Total: 1000 Kg", oleh: "Pak Sugeng (Peternak)", tanggal: "12 Oktober 2023", warna: "green" },
    { id: 3, ikon: "📦", judul: "Endpoint: Sekam Padi", detail: "Berhasil menyetor 800 Kg ke PT. BioEnergi Nusantara.", oleh: "", tanggal: "05 Oktober 2023", warna: "blue" },
    { id: 4, ikon: "❌", judul: "Barter Dibatalkan: Kohe Sapi", detail: "Total: 200 Kg", oleh: "Kelompok Tani Makmur", tanggal: "01 Oktober 2023", warna: "red" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-1">Riwayat Transaksi</h1>
      <p className="text-gray-400 text-sm mb-6">Semua transaksi yang telah selesai atau dibatalkan.</p>
      <div className="flex flex-col gap-3">
        {riwayat.map((r) => (
          <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 shadow-sm">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
              r.warna === "green" ? "bg-green-100"
              : r.warna === "red" ? "bg-red-100"
              : "bg-blue-100"
            }`}>
              {r.ikon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">{r.judul}</p>
              <p className="text-gray-500 text-xs">{r.detail}</p>
              {r.oleh && <p className="text-gray-400 text-xs">Oleh: {r.oleh}</p>}
            </div>
            <p className="text-gray-300 text-xs whitespace-nowrap">{r.tanggal}</p>
          </div>
        ))}
      </div>
    </div>
  );
}