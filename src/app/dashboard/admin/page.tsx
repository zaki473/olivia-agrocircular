export default function AdminOverviewPage() {
  const stats = [
    { label: "Total Pengguna", value: "247", sub: "↑ 12 bulan ini", warna: "blue" },
    { label: "Transaksi Aktif", value: "38", sub: "Barter & Jual", warna: "green" },
    { label: "Limbah Terselamatkan", value: "2.4 Ton", sub: "Target: 10.000 Ton", warna: "green" },
    { label: "Menunggu Verifikasi", value: "5", sub: "Petani baru", warna: "yellow" },
    { label: "Laporan Masuk", value: "3", sub: "Dalam review", warna: "red" },
    { label: "Pengepul Aktif", value: "12", sub: "Terdaftar & terverifikasi", warna: "blue" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard Admin</h1>
      <p className="text-gray-400 text-sm mb-8">Selamat datang, Admin AgroCircular.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white border rounded-2xl p-5 shadow-sm border-${s.warna}-100`}>
            <p className="text-gray-400 text-sm">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 text-${s.warna}-700`}>{s.value}</p>
            <p className="text-gray-400 text-xs mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="font-semibold text-gray-800 mb-4">Transaksi Terbaru</p>
          {["Barter: Jerami Padi ↔ Ampas Tahu", "Jual: Kohe Sapi (500kg)", "Donasi: Sekam Padi → Taman Cacing"].map((t, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-50 text-sm">
              <span className="text-gray-700">{t}</span>
              <span className="text-gray-300 text-xs">Baru</span>
            </div>
          ))}
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="font-semibold text-gray-800 mb-4">Aktivitas Terbaru</p>
          {[
            "Ibu Siti Aminah mendaftar sebagai Petani",
            "CV Sinergi Pupuk Sukses update katalog serapan",
            "Laporan baru dari Budi Santoso",
          ].map((a, i) => (
            <div key={i} className="flex gap-3 py-2 border-b border-gray-50">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 shrink-0"></div>
              <p className="text-sm text-gray-600">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}