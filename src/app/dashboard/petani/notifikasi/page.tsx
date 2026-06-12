export default function NotifikasiPage() {
  const notifs = [
    { id: 1, ikon: "✅", judul: "Barter Disetujui", pesan: "Pak Wayan menyetujui penawaran barter Jerami Padi Anda.", waktu: "2 jam lalu", warna: "green" },
    { id: 2, ikon: "🕐", judul: "Menunggu Konfirmasi", pesan: "Penawaran barter Ampas Tahu Anda sedang ditinjau oleh Ibu Siti.", waktu: "5 jam lalu", warna: "yellow" },
    { id: 3, ikon: "❌", judul: "Penawaran Ditolak", pesan: "Maaf, Kelompok Tani Makmur menolak penawaran Anda.", waktu: "1 hari lalu", warna: "red" },
    { id: 4, ikon: "💬", judul: "Pesan Baru", pesan: "CV Sinergi Pupuk Sukses mengirim pesan terkait transaksi Sekam Padi.", waktu: "2 hari lalu", warna: "blue" },
    { id: 5, ikon: "📦", judul: "Postingan Aktif", pesan: "Postingan Jerami Padi Kering Anda kini aktif di peta.", waktu: "3 hari lalu", warna: "green" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-1">Notifikasi</h1>
      <p className="text-gray-400 text-sm mb-6">Semua aktivitas terkini akun Anda.</p>
      <div className="flex flex-col gap-3">
        {notifs.map((n) => (
          <div key={n.id} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 shadow-sm hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
              n.warna === "green" ? "bg-green-100"
              : n.warna === "yellow" ? "bg-yellow-100"
              : n.warna === "red" ? "bg-red-100"
              : "bg-blue-100"
            }`}>
              {n.ikon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">{n.judul}</p>
              <p className="text-gray-500 text-xs mt-0.5">{n.pesan}</p>
            </div>
            <p className="text-gray-300 text-xs whitespace-nowrap">{n.waktu}</p>
          </div>
        ))}
      </div>
    </div>
  );
}