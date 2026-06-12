export default function AdminMonitoringPage() {
  const transaksi = [
    { id: 1, tipe: "Barter", item: "Jerami Padi ↔ Ampas Tahu", pihak: "Ibu Siti ↔ Pak Wayan", status: "Selesai", tanggal: "12 Okt 2023" },
    { id: 2, tipe: "Jual", item: "Kohe Sapi 500kg", pihak: "CV Sinergi ↔ Pak Budi", status: "Aktif", tanggal: "10 Okt 2023" },
    { id: 3, tipe: "Donasi", item: "Sekam Padi 300kg", pihak: "Ibu Siti → Taman Cacing", status: "Selesai", tanggal: "05 Okt 2023" },
    { id: 4, tipe: "Barter", item: "Kulit Kakao ↔ Jerami", pihak: "Pak Roy ↔ Kelompok Tani", status: "Menunggu", tanggal: "01 Okt 2023" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Monitoring Transaksi</h1>
      <p className="text-gray-400 text-sm mb-6">Pantau semua aktivitas transaksi di platform.</p>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Tipe</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Item</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Pihak</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {transaksi.map((t) => (
              <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    t.tipe === "Barter" ? "bg-yellow-100 text-yellow-700"
                    : t.tipe === "Jual" ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-600"
                  }`}>
                    {t.tipe}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-700">{t.item}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">{t.pihak}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    t.status === "Selesai" ? "bg-green-100 text-green-700"
                    : t.status === "Aktif" ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400 text-xs">{t.tanggal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}