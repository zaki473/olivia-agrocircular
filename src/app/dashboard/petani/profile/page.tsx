export default function ProfilePetaniPage() {
  return (
    <div>
      {/* Cover & Avatar */}
      <div className="bg-green-800 rounded-2xl h-36 mb-14 relative">
        <div className="absolute -bottom-10 left-6 flex items-end gap-4">
          <div className="w-20 h-20 bg-white rounded-full border-4 border-white flex items-center justify-center text-3xl shadow">
            👩‍🌾
          </div>
          <div className="mb-2">
            <p className="text-xl font-bold text-gray-800">Ibu Siti Aminah</p>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Mitra Petani</span>
              <span className="text-gray-400 text-xs">📍 Bandung, Jawa Barat</span>
            </div>
          </div>
        </div>
        <button className="absolute bottom-3 right-4 bg-[#b5e550] text-green-900 text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition">
          ✏️ Edit Profile
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-4">
        {/* Form kiri */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-800 text-lg mb-4">👤 Detail Pribadi</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Nama Lengkap", placeholder: "Ibu Siti Aminah" },
                { label: "Nomor Telepon", placeholder: "08xx-xxxx-xxxx" },
                { label: "Alamat Email", placeholder: "siti@example.com", full: true },
                { label: "Desa / Kelurahan", placeholder: "Subang" },
                { label: "Kecamatan / Kabupaten", placeholder: "Subang, Jawa Barat" },
              ].map((f) => (
                <div key={f.label} className={f.full ? "col-span-2" : ""}>
                  <label className="text-sm text-gray-500 mb-1 block">{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-sm text-gray-500 mb-1 block">Alamat Lengkap</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
            </div>
            <button className="w-full mt-4 bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition">
              Simpan Perubahan
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-800 text-lg mb-4">🌿 Detail Pertanian / Peternak</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm text-gray-500 mb-1 block">Nama Kelompok Tani/Kebun</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-500 mb-1 block">Penjelasan Singkat</label>
                <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Luas Lahan</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Komoditas Utama Limbah</label>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-green-700 text-white text-xs px-3 py-1.5 rounded-full">Kohe Sapi</span>
                  <button className="border border-dashed border-gray-300 text-gray-400 text-xs px-3 py-1.5 rounded-full hover:border-green-500">+ Tambah</button>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition">
              Simpan Perubahan
            </button>
          </div>
        </div>

        {/* Sidebar kanan */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="font-semibold text-gray-800 mb-3">Riwayat Aktivitas</p>
            <div className="space-y-3">
              {[
                { ikon: "✅", judul: "Barter Selesai: Jerami Padi", detail: "Total: 500 Kg\nOleh: Pak Mahmud (Peternak)", tanggal: "12 OKTOBER 2023", warna: "green" },
                { ikon: "✅", judul: "Pembelian Selesai: Jerami Padi", detail: "Total: 1000 Kg\nOleh: Pak Sugeng (Peternak)", tanggal: "12 OKTOBER 2023", warna: "green" },
                { ikon: "📦", judul: "Endpoint: Sekam Padi", detail: "Berhasil menyetor 800 Kg ke PT. BioEnergi.", tanggal: "05 OKTOBER 2023", warna: "blue" },
              ].map((r, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                    r.warna === "green" ? "bg-green-100" : "bg-blue-100"
                  }`}>
                    {r.ikon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{r.judul}</p>
                    <p className="text-xs text-gray-400 whitespace-pre-line">{r.detail}</p>
                    <p className="text-xs text-gray-300 mt-0.5">{r.tanggal}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="text-green-600 text-xs mt-3 hover:underline">Lihat Seluruh Riwayat →</button>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Status Akun</p>
            <p className="font-bold text-green-700">Petani Terverifikasi ✓</p>
          </div>
        </div>
      </div>
    </div>
  );
}