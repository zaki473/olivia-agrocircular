import Link from "next/link";
import { transaksiList } from "@/data/transaksi";
import { limbahList } from "@/data/limbah";

export default async function DetailTransaksiJual({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; action?: string; weight?: string; price?: string; title?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams.id ? parseInt(resolvedSearchParams.id) : 4; // default transaksi ID 4 (jual)
  const action = resolvedSearchParams.action;

  let transaksi = transaksiList.find((t) => t.id === id);
  let limbah = limbahList[1];

  // Penanganan transaksi baru (inject 999)
  if (id === 999) {
    const weight = resolvedSearchParams.weight ? parseInt(resolvedSearchParams.weight) : 500;
    const price = resolvedSearchParams.price ? parseInt(resolvedSearchParams.price) : 1000000;
    const title = resolvedSearchParams.title ? decodeURIComponent(resolvedSearchParams.title) : "Kohe Sapi Murni";

    transaksi = {
      id: 999,
      tipe: "jual",
      status: "menunggu",
      judul_limbah: title,
      kategori: "Kohe Sapi",
      berat: weight,
      pemberi_nama: "Bu Jaremi",
      pemberi_role: "Peternak",
      jarak: "Terdekat",
      catatan: "Menunggu persetujuan penjual untuk dikirim.",
      harga_per_kg: Math.round(price / weight),
      total_harga: price,
      tanggal: "Baru saja",
    };
    limbah = limbahList.find((l) => l.id === 8) || limbahList[1];
  } else if (transaksi) {
    limbah = limbahList.find((l) => l.judul.includes(transaksi!.judul_limbah.split(',')[0]) || l.kategori === transaksi!.kategori) || limbahList[1];
  } else {
    transaksi = transaksiList[3];
    limbah = limbahList[1];
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
            <h3 className="font-bold text-green-800 text-sm">Transaksi Pembelian Disetujui!</h3>
            <p className="text-green-700 text-xs mt-0.5">
              Anda menyetujui transaksi penjualan limbah ini. Dana escrow platform telah diverifikasi aman. Silakan hubungi <strong>{transaksi.pemberi_nama}</strong> via chat atau WhatsApp untuk koordinasi pengiriman barang.
            </p>
          </div>
        </div>
      )}

      {action === "tolak" && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-sm">
          <div className="bg-red-100 p-1.5 rounded-full text-red-700 shrink-0 text-lg">✕</div>
          <div>
            <h3 className="font-bold text-red-800 text-sm">Pembelian Ditolak</h3>
            <p className="text-red-700 text-xs mt-0.5">
              Transaksi pembelian ini telah ditolak/dibatalkan.
            </p>
          </div>
        </div>
      )}

      <div className="bg-[#f0f7f0] rounded-2xl p-5 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-green-900">💰 Detail Alokasi Jual</h1>
          <p className="text-gray-500 text-sm italic mt-1">
            Instruksi: Tinjau semua detail pesanan untuk akurasi sebelum memproses konfirmasi final anda.
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
        {/* Foto */}
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

        {/* Info */}
        <div>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            {limbah.kategori}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">{limbah.judul}</h2>
          <p className="text-gray-500 text-sm mt-1">📍 {limbah.lokasi}</p>

          <div className="bg-[#f0f7f0] rounded-xl p-4 mt-4">
            <p className="text-xs text-gray-500 font-medium mb-2">Pihak Pembeli</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {transaksi.pemberi_nama[0]}
              </div>
              <div>
                <p className="font-semibold text-sm text-green-800">{transaksi.pemberi_nama}</p>
                <p className="text-gray-400 text-xs">{transaksi.pemberi_role} Terverifikasi</p>
              </div>
            </div>
          </div>

          <div className="bg-green-700 text-white rounded-xl p-4 mt-4">
            <p className="text-sm font-semibold mb-3">Ringkasan Transaksi Komersial</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-200">Harga per Kg</span>
                <span className="font-semibold">Rp {(transaksi.harga_per_kg || 0).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-200">Jumlah Pembelian</span>
                <span className="font-semibold">{transaksi.berat} Kg</span>
              </div>
              <div className="border-t border-green-600 pt-2 mt-2">
                <p className="text-xs text-green-300">TOTAL ESTIMASI PENDAPATAN</p>
                <p className="text-2xl font-bold">
                  Rp {(transaksi.total_harga || 0).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 mt-4 shadow-sm">
            <p className="font-semibold text-sm text-gray-700 mb-2">Catatan Pembeli:</p>
            <p className="text-gray-500 text-sm">{transaksi.catatan}</p>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      {status === "menunggu" && (
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Link
            href={`/dashboard/petani/kotak-transaksi/jual?id=${transaksi.id}&action=terima&weight=${transaksi.berat}&price=${transaksi.total_harga || ""}&title=${encodeURIComponent(transaksi.judul_limbah)}`}
            className="bg-green-700 text-white font-semibold py-4 rounded-xl hover:bg-green-800 transition text-center"
          >
            Terima
          </Link>
          <Link
            href={`/dashboard/petani/kotak-transaksi/jual?id=${transaksi.id}&action=tolak&weight=${transaksi.berat}&price=${transaksi.total_harga || ""}&title=${encodeURIComponent(transaksi.judul_limbah)}`}
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