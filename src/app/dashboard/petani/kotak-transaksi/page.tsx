import Link from "next/link";
import { transaksiList } from "@/data/transaksi";

export default async function KotakTransaksiPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; type?: string; title?: string; weight?: string; price?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { success, type, title, weight, price } = resolvedSearchParams;

  let currentTransaksiList = [...transaksiList];

  // Jika sukses mengajukan barter/jual, inject transaksi baru di index teratas
  if (success === "true" && title) {
    const isJual = type === "jual";
    const newTx = {
      id: 999,
      tipe: (type === "jual" ? "jual" : (type === "barter" ? "barter" : "donasi")) as "jual" | "barter" | "donasi",
      status: "menunggu" as const,
      judul_limbah: title,
      kategori: isJual ? "Limbah Jual" : "Barter",
      berat: weight ? parseInt(weight) : 500,
      pemberi_nama: isJual ? "Sistem Escrow" : "Pak Wayan Artha",
      pemberi_role: isJual ? "Pengepul" : "Petani",
      jarak: "Terdekat",
      catatan: isJual 
        ? `Menunggu konfirmasi pembayaran dari penjual untuk total Rp ${parseInt(price || "0").toLocaleString("id-ID")}.`
        : "Menunggu respon penukaran barter dari pemilik.",
      total_harga: price ? parseInt(price) : undefined,
      tanggal: "Baru saja",
    };
    currentTransaksiList = [newTx, ...currentTransaksiList];
  }

  // Baris pertama sebagai "Pengajuan Saya"
  const pengajuanSaya = currentTransaksiList[0];
  const listLain = currentTransaksiList.slice(1);

  return (
    <div>
      {/* Banner sukses pengajuan */}
      {success === "true" && (
        <div className="bg-green-50 border border-green-300 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-sm">
          <div className="bg-green-100 p-1.5 rounded-full text-green-700 shrink-0 text-lg">
            ✓
          </div>
          <div>
            <h3 className="font-bold text-green-800 text-sm">Pengajuan Berhasil Dikirim!</h3>
            <p className="text-green-700 text-xs mt-0.5">
              Penawaran Anda untuk <strong>{title}</strong> telah dikirim ke pihak pemilik. Silakan menunggu konfirmasi.
            </p>
          </div>
        </div>
      )}

      {/* Pengajuan saya — header hijau */}
      {pengajuanSaya && (
        <div className="bg-green-800 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-2xl">🌾</span>
            </div>
            <div className="flex-1">
              <span className="bg-[#b5e550] text-green-900 text-xs font-semibold px-2 py-0.5 rounded-full">
                Pengajuan Saya
              </span>
              <h2 className="text-lg font-bold mt-1">{pengajuanSaya.judul_limbah}</h2>
              <p className="text-green-200 text-xs">Mitra: {pengajuanSaya.pemberi_nama} ({pengajuanSaya.pemberi_role})</p>
              <p className="text-green-200 text-xs">Total Bobot: {pengajuanSaya.berat} Kg</p>
              {pengajuanSaya.total_harga && (
                <p className="text-[#b5e550] text-xs font-bold mt-0.5">
                  Nilai: Rp {pengajuanSaya.total_harga.toLocaleString("id-ID")}
                </p>
              )}
              <Link
                href={`/dashboard/petani/kotak-transaksi/${pengajuanSaya.tipe === "jual" ? "jual" : "barter"}?id=${pengajuanSaya.id}&weight=${pengajuanSaya.berat}&price=${pengajuanSaya.total_harga || ""}&title=${encodeURIComponent(pengajuanSaya.judul_limbah)}`}
                className="inline-block text-xs bg-green-700 hover:bg-green-600 text-white border border-green-600 px-3 py-1.5 rounded-lg mt-2.5 transition"
              >
                Lihat Detail Status & Pelacakan →
              </Link>
            </div>
          </div>
          <div className="text-center shrink-0">
            <div className="w-10 h-10 bg-[#b5e550] rounded-full flex items-center justify-center mb-1 mx-auto">
              <span className="text-lg">🕐</span>
            </div>
            <p className="text-[#b5e550] text-xs font-semibold">Menunggu</p>
          </div>
        </div>
      )}

      {/* Daftar penawaran masuk */}
      <h3 className="font-bold text-gray-800 text-sm mb-3 uppercase tracking-wide">Tawaran Sinergi Masuk</h3>
      <div className="flex flex-col gap-3">
        {listLain.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:border-green-100 transition"
          >
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
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
                ● {item.tipe === "jual" ? "Pembelian" : item.tipe.charAt(0).toUpperCase() + item.tipe.slice(1)}
              </span>
              <p className="font-semibold text-gray-800 text-sm mt-1">{item.judul_limbah}</p>
              <p className="text-gray-400 text-xs">Pemberi: {item.pemberi_nama} ({item.pemberi_role})</p>
              <p className="text-gray-400 text-xs">Total Bobot: {item.berat} Kg</p>
              {item.total_harga && (
                <p className="text-green-700 font-bold text-xs">Rp {item.total_harga.toLocaleString("id-ID")}</p>
              )}
              {item.jarak && (
                <span className="inline-block bg-yellow-50 text-yellow-700 text-xs border border-yellow-200 px-2 py-0.5 rounded-full mt-1.5">
                  Jarak: {item.jarak}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Link
                href={`/dashboard/petani/kotak-transaksi/${item.tipe === "jual" ? "jual" : "barter"}?id=${item.id}&weight=${item.berat}&price=${item.total_harga || ""}&title=${encodeURIComponent(item.judul_limbah)}`}
                className="bg-green-700 text-white text-xs px-4 py-2 rounded-lg hover:bg-green-800 transition text-center font-medium"
              >
                ✓ Kelola
              </Link>
              <button className="bg-gray-100 text-gray-500 text-xs px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                ✕ Tolak
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}