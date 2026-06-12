export type Transaksi = {
  id: number;
  tipe: "barter" | "jual" | "donasi";
  status: "menunggu" | "diterima" | "ditolak" | "selesai";
  judul_limbah: string;
  kategori: string;
  berat: number;
  pemberi_nama: string;
  pemberi_role: string;
  jarak: string;
  catatan: string;
  harga_per_kg?: number;
  total_harga?: number;
  tanggal: string;
};

export const transaksiList: Transaksi[] = [
  {
    id: 1,
    tipe: "barter",
    status: "menunggu",
    judul_limbah: "Ampas Tahu Kadar Air Rendah",
    kategori: "Ampas Tahu",
    berat: 40,
    pemberi_nama: "Ibu Siti Aminah",
    pemberi_role: "Mitra",
    jarak: "1 Km",
    catatan: "Pengajuan Saya — sedang menunggu konfirmasi pemilik.",
    tanggal: "5 Juni 2026, 10:20",
  },
  {
    id: 2,
    tipe: "barter",
    status: "menunggu",
    judul_limbah: "Jerami Padi Kering",
    kategori: "Jerami Padi",
    berat: 2500,
    pemberi_nama: "Pak Wayan Artha",
    pemberi_role: "Petani",
    jarak: "~2 Km",
    catatan: "50 kg Ampas Tahu Berkualitas siap digunakan sebagai pakan ternak.",
    tanggal: "4 Juni 2026, 09:00",
  },
  {
    id: 3,
    tipe: "donasi",
    status: "menunggu",
    judul_limbah: "Ampas Tahu",
    kategori: "Ampas Tahu",
    berat: 2500,
    pemberi_nama: "Taman Cacing Lumbricus Kaliurang",
    pemberi_role: "Mitra",
    jarak: "~3.2 Km",
    catatan: "Donasi ampas tahu untuk media cacing tanah organik.",
    tanggal: "3 Juni 2026, 14:00",
  },
  {
    id: 4,
    tipe: "jual",
    status: "menunggu",
    judul_limbah: "Ampas Tahu, Sekam Padi",
    kategori: "Ampas Tahu",
    berat: 500,
    pemberi_nama: "Kelompok Biogas Mandiri Desa Ketep",
    pemberi_role: "Pengepul",
    jarak: "~1.2 Km",
    catatan: "Halo Pak Saya Memerlukan ampas tahu untuk besok 10 Kg, bisa?",
    harga_per_kg: 1500,
    total_harga: 750000,
    tanggal: "2 Juni 2026, 11:30",
  },
  {
    id: 5,
    tipe: "donasi",
    status: "menunggu",
    judul_limbah: "Kohe Sapi",
    kategori: "Kohe Sapi",
    berat: 500,
    pemberi_nama: "CV Sinergi Pupuk Sukses",
    pemberi_role: "Pengepul",
    jarak: "~4 Km",
    catatan: "Donasi kohe sapi untuk petani yang membutuhkan pupuk organik.",
    tanggal: "1 Juni 2026, 08:00",
  },
  {
    id: 6,
    tipe: "jual",
    status: "menunggu",
    judul_limbah: "Jerami, Sekam Padi, Ampas Tahu",
    kategori: "Jerami Padi",
    berat: 1000,
    pemberi_nama: "PT Biomassa Nusantara",
    pemberi_role: "Pengepul",
    jarak: "~1.2 Km",
    catatan: "Pembelian campuran komoditas untuk kebutuhan pabrik biomassa.",
    harga_per_kg: 1200,
    total_harga: 1200000,
    tanggal: "31 Mei 2026, 16:00",
  },
];