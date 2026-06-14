"use client";
import { useTransaksi } from "@/context/TransaksiContext";

export default function RiwayatPage() {
  const { masuk, diajukan, loading } = useTransaksi();

  // Gabungkan riwayat dari transaksi yang masuk (sebagai pemilik) dan yang diajukan (sebagai pengaju)
  // Hanya yang sudah selesai (diterima/ditolak), bukan yang masih "menunggu"
  const riwayatMasuk = masuk
    .filter((t) => t.status !== "menunggu")
    .map((t) => ({
      id: t.id,
      status: t.status,
      tipe: t.tipe,
      judul: t.limbah?.judul || "Limbah",
      jumlah: t.jumlah ?? t.limbah?.berat ?? 0,
      pihak: t.pengaju?.nama || "Pengguna",
      arah: "masuk" as const,
      created_at: t.created_at,
    }));

  const riwayatDiajukan = diajukan
    .filter((t) => t.status !== "menunggu")
    .map((t) => ({
      id: t.id,
      status: t.status,
      tipe: t.tipe,
      judul: t.limbah?.judul || "Limbah",
      jumlah: t.jumlah ?? t.limbah?.berat ?? 0,
      pihak: t.endpoint?.nama || t.pemilik?.nama || "Pengguna",
      arah: "diajukan" as const,
      created_at: t.created_at,
    }));

  const riwayat = [...riwayatMasuk, ...riwayatDiajukan].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getIkon = (status: string, tipe: string) => {
    if (status === "ditolak") return "❌";
    if (tipe === "donasi") return "📦";
    return "✅";
  };

  const getWarna = (status: string) => {
    if (status === "ditolak") return "red";
    return "green";
  };

  const getJudul = (item: typeof riwayat[number]) => {
    const tipeLabel = item.tipe === "barter" ? "Barter" : item.tipe === "donasi" ? "Donasi" : "Jual";
    const statusLabel = item.status === "diterima" ? "Selesai" : "Dibatalkan";
    return `${tipeLabel} ${statusLabel}: ${item.judul}`;
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-1">Riwayat Transaksi</h1>
      <p className="text-gray-400 text-sm mb-6">Semua transaksi yang telah selesai atau dibatalkan.</p>

      {loading ? (
        <p className="text-gray-400 text-sm text-center py-8">Memuat data...</p>
      ) : riwayat.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">Belum ada riwayat transaksi.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {riwayat.map((r) => {
            const warna = getWarna(r.status);
            return (
              <div key={`${r.id}-${r.arah}`} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 shadow-sm">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
                  warna === "green" ? "bg-green-100" : "bg-red-100"
                }`}>
                  {getIkon(r.status, r.tipe)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{getJudul(r)}</p>
                  <p className="text-gray-500 text-xs">Total: {r.jumlah} Kg</p>
                  <p className="text-gray-400 text-xs">
                    {r.arah === "masuk" ? "Dari" : "Kepada"}: {r.pihak}
                  </p>
                </div>
                <p className="text-gray-300 text-xs whitespace-nowrap">{formatTanggal(r.created_at)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}