export default function AdminLaporanPage() {
  const laporan = [
    { id: 1, pelapor: "Budi Santoso", terlapor: "Agus T.", alasan: "Fraudulent Posting", status: "DALAM REVIEW", waktu: "2 jam lalu" },
    { id: 2, pelapor: "Pak Wayan", terlapor: "Sari K.", alasan: "Unresponsive in Barter", status: "DISELESAIKAN", waktu: "1 minggu lalu" },
    { id: 3, pelapor: "Ibu Siti Aminah", terlapor: "Roy K.", alasan: "Inappropriate Communication", status: "DALAM REVIEW", waktu: "3 hari lalu" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Laporan Pengguna</h1>
      <p className="text-gray-400 text-sm mb-6">Tinjau dan tindak lanjuti laporan dari komunitas.</p>
      <div className="flex flex-col gap-4">
        {laporan.map((l) => (
          <div key={l.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-xl shrink-0">⚠️</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{l.terlapor}</p>
              <p className="text-gray-400 text-sm">Dilaporkan oleh: {l.pelapor}</p>
              <p className="text-gray-500 text-sm">Alasan: {l.alasan}</p>
              <p className="text-gray-300 text-xs mt-1">{l.waktu}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                l.status === "DALAM REVIEW"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {l.status}
              </span>
              {l.status === "DALAM REVIEW" && (
                <button className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-600 transition">
                  🚫 Blokir User
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}