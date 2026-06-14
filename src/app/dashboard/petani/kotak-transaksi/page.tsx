"use client";
import { useTransaksi } from "@/context/TransaksiContext";

function WhatsAppButton({ nomor, nama, konteks }: { nomor?: string | null; nama?: string; konteks: string }) {
  if (!nomor) {
    return (
      <p className="text-xs text-gray-400 italic">
        {nama} belum mengisi nomor WhatsApp di profil.
      </p>
    );
  }

  const cleaned = nomor.replace(/[^0-9]/g, "").replace(/^0/, "62");
  const teks = encodeURIComponent(`Halo ${nama}, terkait ${konteks} di AgroCircular, bisa kita lanjutkan?`);

  return (
    <a
      href={`https://wa.me/${cleaned}?text=${teks}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-green-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-green-700 transition"
    >
      💬 Hubungi via WhatsApp
    </a>
  );
}

export default function KotakTransaksiPage() {
  const { masuk, diajukan, loading } = useTransaksi();
  const { updateStatus } = useTransaksi();

  const menunggu = masuk.filter((t) => t.status === "menunggu");
  const diterimaMasuk = masuk.filter((t) => t.status === "diterima");
  const diajukanAktif = diajukan.filter((t) => t.status !== "ditolak");

  return (
    <div>
      {/* Pengajuan Saya */}
      {diajukanAktif.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Pengajuan Saya</h2>
          <div className="flex flex-col gap-3">
            {diajukanAktif.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl p-5 flex items-center gap-4 ${
                  item.status === "diterima" ? "bg-green-50 border border-green-200" : "bg-green-800 text-white"
                }`}
              >
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center shrink-0 ${
                  item.status === "diterima" ? "bg-green-100" : "bg-green-600"
                }`}>
                  <span className="text-2xl">🌾</span>
                </div>
                <div className="flex-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    item.status === "diterima" ? "bg-green-600 text-white" : "bg-[#b5e550] text-green-900"
                  }`}>
                    {item.status === "diterima" ? "✓ Diterima" : "Menunggu"}
                  </span>
                  <h3 className={`text-lg font-bold mt-1 ${item.status === "diterima" ? "text-gray-800" : "text-white"}`}>
                    {item.limbah?.judul}
                  </h3>
                  <p className={`text-sm ${item.status === "diterima" ? "text-gray-500" : "text-green-200"}`}>
                    Kepada: {item.pemilik?.nama}
                  </p>
                  <p className={`text-sm ${item.status === "diterima" ? "text-gray-500" : "text-green-200"}`}>
                    {item.tipe === "barter" ? `Ditawarkan: ${item.item_ditawarkan}` : `Jumlah: ${item.jumlah} Kg`}
                  </p>

                  {item.status === "diterima" && (
                    <div className="mt-3">
                      <WhatsAppButton
                        nomor={item.pemilik?.whatsapp}
                        nama={item.pemilik?.nama}
                        konteks={`${item.tipe} "${item.limbah?.judul}"`}
                      />
                    </div>
                  )}
                </div>
                {item.status === "menunggu" && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#b5e550] rounded-full flex items-center justify-center mb-1">
                      <span className="text-xl">🕐</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diterima - Masuk */}
      {diterimaMasuk.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Transaksi Diterima</h2>
          <div className="flex flex-col gap-3">
            {diterimaMasuk.map((item) => (
              <div key={item.id} className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-2xl">🌾</span>
                </div>
                <div className="flex-1">
                  <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">✓ Diterima</span>
                  <h3 className="text-lg font-bold mt-1 text-gray-800">{item.limbah?.judul}</h3>
                  <p className="text-sm text-gray-500">Dari: {item.pengaju?.nama}</p>
                  <p className="text-sm text-gray-500">
                    {item.tipe === "barter" ? `Ditawarkan: ${item.item_ditawarkan}` : `Jumlah: ${item.jumlah} Kg`}
                  </p>
                  <div className="mt-3">
                    <WhatsAppButton
                      nomor={item.pengaju?.whatsapp}
                      nama={item.pengaju?.nama}
                      konteks={`${item.tipe} "${item.limbah?.judul}"`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Penawaran Masuk - Menunggu */}
      <h2 className="text-lg font-bold text-gray-800 mb-1">Penawaran Masuk</h2>
      <p className="text-gray-400 text-sm mb-4">Tinjau dan tanggapi pengajuan dari pengguna lain.</p>

      {loading ? (
        <p className="text-gray-400 text-sm">Memuat data...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {menunggu.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">Belum ada penawaran masuk.</p>
          )}
          {menunggu.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                <span className="text-xl">🌾</span>
              </div>
              <div className="flex-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  item.tipe === "barter"
                    ? "bg-green-100 text-green-700"
                    : item.tipe === "donasi"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  ● Alokasi: {item.tipe.charAt(0).toUpperCase() + item.tipe.slice(1)}
                </span>
                <p className="font-semibold text-gray-800 text-sm mt-1">{item.limbah?.judul}</p>
                <p className="text-gray-400 text-xs">Pengaju: {item.pengaju?.nama}</p>
                {item.tipe === "barter" ? (
                  <p className="text-gray-400 text-xs">Ditawarkan: {item.item_ditawarkan}</p>
                ) : (
                  <>
                    <p className="text-gray-400 text-xs">Jumlah: {item.jumlah} Kg</p>
                    {item.total_harga && (
                      <p className="text-green-700 text-xs font-semibold">Total: Rp {item.total_harga.toLocaleString("id-ID")}</p>
                    )}
                  </>
                )}
                {item.pesan && (
                  <p className="text-gray-400 text-xs mt-1 italic">"{item.pesan}"</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => updateStatus(item.id, "diterima")}
                  className="bg-green-700 text-white text-xs px-4 py-2 rounded-lg hover:bg-green-800 transition text-center"
                >
                  ✓ Terima
                </button>
                <button
                  onClick={() => updateStatus(item.id, "ditolak")}
                  className="bg-gray-100 text-gray-500 text-xs px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  ✕ Tolak
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}