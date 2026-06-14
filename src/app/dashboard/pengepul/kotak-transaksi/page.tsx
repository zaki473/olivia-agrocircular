"use client";
import { useEffect } from "react";
import { useTransaksi } from "@/context/TransaksiContext";
import { useEndpoint } from "@/context/EndpointContext";

function WhatsAppButton({ nomor, nama, konteks }: { nomor?: string | null; nama?: string; konteks: string }) {
  if (!nomor) {
    return <p className="text-xs text-gray-400 italic">{nama} belum mengisi nomor WhatsApp.</p>;
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

export default function KotakTransaksiPengepulPage() {
  const { masuk, loading, updateStatus, refetch } = useTransaksi();
  const { myEndpoint } = useEndpoint();

  useEffect(() => {
    if (myEndpoint) refetch(myEndpoint.id);
  }, [myEndpoint]);

  const masukKeEndpoint = masuk.filter((t) => t.endpoint_id === myEndpoint?.id);
  const menunggu = masukKeEndpoint.filter((t) => t.status === "menunggu");
  const diterima = masukKeEndpoint.filter((t) => t.status === "diterima");

  if (!myEndpoint) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
        <p className="text-gray-600 text-sm">Buat profil endpoint dulu di Katalog Serapan.</p>
      </div>
    );
  }

  return (
    <div>
      {diterima.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Transaksi Diterima</h2>
          <div className="flex flex-col gap-3">
            {diterima.map((item) => (
              <div key={item.id} className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {item.limbah?.gambar_url ? (
                    <img src={item.limbah.gambar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🌾</span>
                  )}
                </div>
                <div className="flex-1">
                  <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">✓ Diterima</span>
                  <h3 className="text-lg font-bold mt-1 text-gray-800">{item.limbah?.judul}</h3>
                  <p className="text-sm text-gray-500">Dari: {item.pengaju?.nama}</p>
                  <p className="text-sm text-gray-500">Jumlah: {item.jumlah} Kg</p>
                  {item.total_harga && <p className="text-sm text-green-700 font-semibold">Total: Rp {item.total_harga.toLocaleString("id-ID")}</p>}
                  <div className="mt-3">
                    <WhatsAppButton nomor={item.pengaju?.whatsapp} nama={item.pengaju?.nama} konteks={`pembelian "${item.limbah?.judul}"`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-lg font-bold text-gray-800 mb-1">Penawaran Masuk dari Petani</h2>
      <p className="text-gray-400 text-sm mb-4">Tinjau dan tanggapi tawaran jual/donasi dari petani.</p>

      {loading ? (
        <p className="text-gray-400 text-sm">Memuat data...</p>
      ) : menunggu.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">Belum ada penawaran masuk.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {menunggu.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {item.limbah?.gambar_url ? (
                  <img src={item.limbah.gambar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">🌾</span>
                )}
              </div>
              <div className="flex-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  item.tipe === "donasi" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-700"
                }`}>
                  ● {item.tipe === "donasi" ? "Donasi" : "Jual"}
                </span>
                <p className="font-semibold text-gray-800 text-sm mt-1">{item.limbah?.judul}</p>
                <p className="text-gray-400 text-xs">Dari: {item.pengaju?.nama}</p>
                <p className="text-gray-400 text-xs">Jumlah: {item.jumlah} Kg</p>
                {item.total_harga && <p className="text-green-700 text-xs font-semibold">Total: Rp {item.total_harga.toLocaleString("id-ID")}</p>}
                {item.pesan && <p className="text-gray-400 text-xs mt-1 italic">"{item.pesan}"</p>}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => updateStatus(item.id, "diterima")} className="bg-green-700 text-white text-xs px-4 py-2 rounded-lg hover:bg-green-800 transition">
                  ✓ Terima
                </button>
                <button onClick={() => updateStatus(item.id, "ditolak")} className="bg-gray-100 text-gray-500 text-xs px-4 py-2 rounded-lg hover:bg-gray-200 transition">
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