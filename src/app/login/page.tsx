"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const users = [
  {
    email: "siti@example.com",
    password: "password",
    role: "petani",
    nama: "Ibu Siti Aminah",
  },
  {
    email: "biogas@example.com",
    password: "password",
    role: "pengepul",
    nama: "Kelompok Biogas Mandiri",
  },
  {
    email: "admin@agrocircular.id",
    password: "admin123",
    role: "admin",
    nama: "Admin AgroCircular",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"masuk" | "daftar">("masuk");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) {
      setError("Email atau password salah");
      return;
    }
    sessionStorage.setItem("user", JSON.stringify(user));
    if (user.role === "petani") router.push("/dashboard/petani/kelola-limbah");
    if (user.role === "pengepul")
      router.push("/dashboard/pengepul/radius-distribusi");
    if (user.role === "admin") router.push("/dashboard/admin");
  };

  // Fungsi untuk menangani navigasi kembali secara aman
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/"); // Jalur alternatif aman jika tidak ada history
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7f0] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
        {/* Kiri */}
        <div className="relative p-10 flex flex-col justify-between overflow-hidden min-h-[500px]">
          {/* Gambar sebagai Background */}
          <img
            src="https://ik.imagekit.io/p27ub3udc/agorcircular/Group%2017.png?updatedAt=1779503537621"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            alt="logo-bg"
          />
          {/* Konten Teks Tengah */}
          <div className="relative z-10 mt-auto mb-8">
            <p className="text-green-800 font-bold text-2xl mb-1">
              AgroCircular
            </p>
            <p className="text-gray-700 text-sm">
              Membangun masa depan ekonomi sirkular yang berkelanjutan untuk
              ekosistem pertanian Indonesia.
            </p>
          </div>

          {/* Konten Box Bawah */}
          <div className="relative z-10 bg-green-800 rounded-xl p-5 text-white">
            <p className="font-semibold text-lg">Transformasi Limbah</p>
            <p className="text-green-200 text-sm mt-1">
              Ubah sisa hasil panen menjadi nilai ekonomi baru melalui jaringan
              mitra kami.
            </p>
          </div>
        </div>

        {/* Kanan */}
        <div className="p-10">
          {/* Tab */}
          <div className="flex border-b border-gray-200 mb-8">
            {["masuk", "daftar"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as "masuk" | "daftar")}
                className={`flex-1 pb-3 text-sm font-medium capitalize transition ${
                  tab === t
                    ? "border-b-2 border-green-700 text-green-700"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "masuk" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          {tab === "masuk" ? (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-gray-600">Kata Sandi</label>
                  <span className="text-xs text-green-600 cursor-pointer">
                    Lupa Kata Sandi?
                  </span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ingat"
                  className="accent-green-700"
                />
                <label htmlFor="ingat" className="text-sm text-gray-500">
                  Ingat saya di perangkat ini
                </label>
              </div>
              
              {/* Tombol Masuk */}
              <button
                onClick={handleLogin}
                className="w-full bg-[#b5e550] text-green-900 font-semibold py-3 rounded-lg hover:opacity-90 transition mt-2"
              >
                Masuk ke Dashboard →
              </button>

              {/* Teks Kembali Dinamis (Baru dimasukkan di sini) */}
              <button
                onClick={handleBack}
                className="w-full text-center text-sm text-gray-500 hover:text-green-700 font-medium transition py-1 focus:outline-none"
              >
                ← Kembali ke halaman sebelumnya
              </button>

              {/* Hint akun dummy */}
              <div className="bg-gray-50 rounded-lg p-3 mt-2">
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Akun Demo:
                </p>
                <p className="text-xs text-gray-400">
                  Petani: siti@example.com / password
                </p>
                <p className="text-xs text-gray-400">
                  Pengepul: biogas@example.com / password
                </p>
                <p className="text-xs text-gray-400">
                  Admin: admin@agrocircular.id / admin123
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nama Lengkap"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="password"
                placeholder="Kata Sandi"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-400">
                * Fitur daftar belum tersedia di versi demo ini.
              </p>
              <button className="w-full bg-gray-200 text-gray-500 font-semibold py-3 rounded-lg cursor-not-allowed mt-2">
                Daftar (Demo)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}