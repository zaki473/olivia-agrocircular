export type User = {
  id: number;
  nama: string;
  role: "petani" | "pengepul" | "admin";
  email: string;
  password: string;
  lokasi: string;
  verified: boolean;
  rating?: number;
  transaksi_berhasil?: number;
};

export const users: User[] = [
  {
    id: 1,
    nama: "Ibu Siti Aminah",
    role: "petani",
    email: "siti@example.com",
    password: "password",
    lokasi: "Bandung, Jawa Barat",
    verified: true,
    rating: 4.9,
    transaksi_berhasil: 48,
  },
  {
    id: 2,
    nama: "Kelompok Biogas Mandiri Desa Ketep",
    role: "pengepul",
    email: "biogas@example.com",
    password: "password",
    lokasi: "Wagir, Malang",
    verified: true,
    rating: 4.8,
    transaksi_berhasil: 120,
  },
  {
    id: 3,
    nama: "Admin AgroCircular",
    role: "admin",
    email: "admin@agrocircular.id",
    password: "admin123",
    lokasi: "Jakarta",
    verified: true,
  },
  {
    id: 4,
    nama: "Pak Wayan Artha",
    role: "petani",
    email: "wayan@example.com",
    password: "password",
    lokasi: "Sukabumi, Jawa Barat",
    verified: true,
    rating: 4.7,
    transaksi_berhasil: 22,
  },
  {
    id: 5,
    nama: "Budi Santoso",
    role: "petani",
    email: "budi@example.com",
    password: "password",
    lokasi: "Malang, Jawa Timur",
    verified: false,
    rating: 4.5,
    transaksi_berhasil: 10,
  },
];