"use client";
import { useTransaksi } from "@/context/TransaksiContext";
import { useEndpoint } from "@/context/EndpointContext";

export default function RiwayatPengepulPage() {
  const { masuk, loading } = useTransaksi();
  const { myEndpoint } = useEndpoint();

  const riwayat = masuk.filter((t) => t.endpoint_id === myEndpoint?.id && t.status !== "menunggu");

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-1">Riwayat Transaksi</h1>
      <p className="text-gray-400 text-sm mb-6">Semua transaksi yang sudah diterima atau ditolak.</p>

      {loading ? (
        <p className="text-gray-400 text-sm">Memuat data...</p>
      ) : riwayat.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">Belum ada riwayat transaksi.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {riwayat.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 shadow-sm">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
                item.status === "diterima" ? "bg-green-100" : "bg-red-100"
              }`}>
                {item.status === "diterima" ? "✅" : "❌"}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">
                  {item.tipe === "donasi" ? "Donasi" : "Pembelian"}: {item.limbah?.judul}
                </p>
                <p className="text-gray-500 text-xs">Dari: {item.pengaju?.nama} • {item.jumlah} Kg</p>
                {item.total_harga && <p className="text-gray-500 text-xs">Total: Rp {item.total_harga.toLocaleString("id-ID")}</p>}
              </div>
              <p className="text-gray-300 text-xs whitespace-nowrap">
                {new Date(item.created_at).toLocaleDateString("id-ID")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}