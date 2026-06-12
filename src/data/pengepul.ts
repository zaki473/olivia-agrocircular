export type Pengepul = {
  id: number;
  nama: string;
  tipe: string;
  lokasi: string;
  lat: number;
  lng: number;
  komoditas: string[];
  kapasitas_sisa: number;
  kontak: string;
  harga_per_kg: number;
  donasi_aktif?: boolean;
};

export const pengepulList: Pengepul[] = [
  {
    id: 1,
    nama: "CV. Sinergi Pupuk Sukses",
    tipe: "REKANAN INDUSTRI",
    lokasi: "Berbah, Sleman",
    lat: -7.812,
    lng: 110.432,
    komoditas: ["Jerami", "Ampas Tahu", "Sekam Padi"],
    kapasitas_sisa: 100,
    kontak: "0812-3456-781x",
    harga_per_kg: 1800,
    donasi_aktif: false,
  },
  {
    id: 2,
    nama: "PT Biomassa Nusantara",
    tipe: "PEMBERDAYAAN CACING TANAH",
    lokasi: "Cepokomulyo, Kepanjen",
    lat: -8.012,
    lng: 112.573,
    komoditas: ["Jerami", "Sekam Padi", "Ampas Tahu"],
    kapasitas_sisa: 200,
    kontak: "0813-xxxx-xxxx",
    harga_per_kg: 1800,
    donasi_aktif: false,
  },
  {
    id: 3,
    nama: "CV Sinergi Pupuk Sukses",
    tipe: "BIOGAS DESA BINAAN",
    lokasi: "Sukodadi, Wagir",
    lat: -7.985,
    lng: 112.541,
    komoditas: ["Kohe Sapi"],
    kapasitas_sisa: 50,
    kontak: "0814-xxxx-xxxx",
    harga_per_kg: 0,
    donasi_aktif: true,
  },
];