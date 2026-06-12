export default function ProfilePengepulPage() {
  return (
    <div>
      <div className="bg-green-800 rounded-2xl h-36 mb-14 relative">
        <div className="absolute -bottom-10 left-6 flex items-end gap-4">
          <div className="w-20 h-20 bg-white rounded-full border-4 border-white flex items-center justify-center text-3xl shadow">
            🏭
          </div>
          <div className="mb-2">
            <p className="text-xl font-bold text-gray-800">Kelompok Biogas Mandiri</p>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Pengepul</span>
              <span className="text-gray-400 text-xs">📍 Wagir, Malang</span>
            </div>
          </div>
        </div>
        <button className="absolute bottom-3 right-4 bg-[#b5e550] text-green-900 text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition">
          ✏️ Edit Profile
        </button>
      </div>

      <div className="mt-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 text-lg mb-4">🏭 Detail Perusahaan</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Nama Perusahaan", placeholder: "Kelompok Biogas Mandiri Desa Ketep" },
            { label: "Nomor Telepon", placeholder: "08xx-xxxx-xxxx" },
            { label: "Email Perusahaan", placeholder: "biogas@example.com" },
            { label: "Lokasi", placeholder: "Wagir, Malang" },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-sm text-gray-500 mb-1 block">{f.label}</label>
              <input
                type="text"
                placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
          <div className="col-span-2">
            <label className="text-sm text-gray-500 mb-1 block">Deskripsi Singkat</label>
            <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
        </div>
        <button className="w-full mt-4 bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition">
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}