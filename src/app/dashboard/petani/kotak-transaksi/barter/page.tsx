import Link from "next/link";
import { transaksiList } from "@/data/transaksi";
import { limbahList } from "@/data/limbah";

export default async function DetailTransaksiBarter({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; action?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams.id ? parseInt(resolvedSearchParams.id) : 2; // default transaksi ID 2
  const action = resolvedSearchParams.action;

  let transaksi = transaksiList.find((t) => t.id === id);
  let limbah = limbahList[0];

  // Penanganan transaksi baru (inject 999)
  if (id === 999) {
    transaksi = {
      id: 999,
      tipe: "barter",
      status: "menunggu",
      judul_limbah: "1.5 Ton Sekam Padi Kering",
      kategori: "Sekam Padi",
      berat: 1500,
      pemberi_nama: "Pak Budi (Mitra Tani Jaya)",
      pemberi_role: "Petani",
      jarak: "Terdekat",
      catatan: "Ingin ditukar dengan Sekam Padi Bakar/Kohe Sapi.",
      tanggal: "Baru saja",
    };
    limbah = limbahList.find((l) => l.id === 4) || limbahList[0];
  } else if (transaksi) {
    limbah = limbahList.find((l) => l.judul.includes(transaksi!.judul_limbah.split(',')[0]) || l.kategori === transaksi!.kategori) || limbahList[0];
  } else {
    transaksi = transaksiList[1];
    limbah = limbahList[0];
  }

  // Tentukan status berdasarkan action query
  const status = action === "terima" ? "diterima" : (action === "tolak" ? "ditolak" : transaksi.status);

  return (
    <div>
      {/* Toast Notifikasi Sukses */}
      {action === "terima" && (
        <div className="bg-green-50 border border-green-300 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-sm">
          <div className="bg-green-100 p-1.5 rounded-full text-green-700 shrink-0 text-lg">✓</div>
          <div>
            <h3 className="font-bold text-green-800 text-sm">Barter Disetujui!</h3>
            <p className="text-green-700 text-xs mt-0.5">
              Anda menyetujui transaksi barter ini. Silakan hubungi <strong>{transaksi.pemberi_nama}</strong> via chat atau telepon untuk logistik pertukaran barang.
            </p>
          </div>
        </div>
      )}

      {action === "tolak" && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-sm">
          <div className="bg-red-100 p-1.5 rounded-full text-red-700 shrink-0 text-lg">✕</div>
          <div>
            <h3 className="font-bold text-red-800 text-sm">Barter Ditolak</h3>
            <p className="text-red-700 text-xs mt-0.5">
              Transaksi ini telah dibatalkan/ditolak.
            </p>
          </div>
        </div>
      )}

      <div className="bg-[#f0f7f0] rounded-2xl p-5 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-green-900">Detail Alokasi Barter</h1>
          <p className="text-gray-500 text-sm italic mt-1">
            Instruksi: Tinjau rincian penawaran barter dari mitra Anda di bawah ini.
          </p>
        </div>
        <div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
            status === "menunggu" 
              ? "bg-yellow-100 text-yellow-800"
              : status === "diterima"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
            {status}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Foto & thumbnail */}
        <div>
          <div className="bg-green-100 rounded-xl h-72 flex items-center justify-center mb-3">
            <span className="text-green-500 text-4xl">🌾</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-green-100 rounded-lg w-20 h-16 flex items-center justify-center">
                <span className="text-green-400 text-xs">foto {i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info transaksi */}
        <div>
          <span className="bg-[#b5e550] text-green-900 text-xs font-semibold px-3 py-1 rounded-full">
            {limbah.kategori}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">{limbah.judul}</h2>
          <p className="text-gray-500 text-sm mt-1">📍 {limbah.lokasi}</p>

          <div className="bg-[#f0f7f0] rounded-xl p-4 mt-4">
            <p className="text-xs text-gray-500 font-medium mb-2">Mitra Barter</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {transaksi.pemberi_nama[0]}
              </div>
              <div>
                <p className="font-semibold text-sm text-green-800">{transaksi.pemberi_nama}</p>
                <p className="text-gray-400 text-xs">{transaksi.pemberi_role} Terverifikasi</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Total Berat:</p>
              <p className="text-gray-600">{transaksi.berat} Kilogram</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Metode Pengambilan:</p>
              <p className="text-gray-600">COD / Ambil di tempat mitra</p>
            </div>
            {limbah.barter_dengan && (
              <div>
                <p className="font-semibold text-gray-700">Kebutuhan Barter Yang Diminta:</p>
                <p className="text-green-700 font-semibold">{limbah.barter_dengan}</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 mt-4 shadow-sm">
            <p className="font-semibold text-sm text-gray-700 mb-2">Catatan Pesan Penawaran</p>
            <p className="text-gray-500 text-sm leading-relaxed">{transaksi.catatan}</p>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      {status === "menunggu" && (
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Link
            href={`/dashboard/petani/kotak-transaksi/barter?id=${transaksi.id}&action=terima`}
            className="bg-green-700 text-white font-semibold py-4 rounded-xl hover:bg-green-800 transition text-center"
          >
            Terima
          </Link>
          <Link
            href={`/dashboard/petani/kotak-transaksi/barter?id=${transaksi.id}&action=tolak`}
            className="bg-gray-200 text-gray-600 font-semibold py-4 rounded-xl hover:bg-gray-300 transition text-center"
          >
            Tolak
          </Link>
        </div>
      )}

      {status !== "menunggu" && (
        <div className="mt-8">
          <Link
            href="/dashboard/petani/kotak-transaksi"
            className="block w-full text-center bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-200 transition text-sm"
          >
            ← Kembali ke Kotak Transaksi
          </Link>
        </div>
      )}
    </div>
  );
}