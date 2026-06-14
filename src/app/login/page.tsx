"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { user, profile, login, register } = useAuth();

  const [tab, setTab] = useState<"masuk" | "daftar">("masuk");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [role, setRole] = useState<"petani" | "pengepul">("petani");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const { error } = await login(email, password);
    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    const redirectTo = sessionStorage.getItem("redirect_after_login");
    if (redirectTo) {
      sessionStorage.removeItem("redirect_after_login");
      router.push(redirectTo);
      return;
    }

    // Default redirect, akan disesuaikan setelah profile termuat
    router.push("/dashboard/petani/kelola-limbah");
  };

  const handleRegister = async () => {
    setError("");
    if (!email || !password || !nama) {
      setError("Semua field wajib diisi");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    const { error } = await register(email, password, nama, role);

    if (error) {
      setLoading(false);
      setError(error);
      return;
    }

    // Auto-login setelah registrasi berhasil
    const { error: loginError } = await login(email, password);
    setLoading(false);

    if (loginError) {
      setSuccessMsg("Registrasi berhasil! Silakan masuk menggunakan akun Anda.");
      setTab("masuk");
    }
  };

  useEffect(() => {
  if (user && profile) {
    const redirectTo = sessionStorage.getItem("redirect_after_login");
    if (redirectTo) {
      sessionStorage.removeItem("redirect_after_login");
      router.push(redirectTo);
      return;
    }
    if (profile.role === "pengepul") router.push("/dashboard/pengepul/radius-distribusi");
    if (profile.role === "admin") router.push("/dashboard/admin");
  }
}, [user, profile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f0] via-[#e8f5e8] to-[#d4ebd4] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-lime-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 relative z-10">

        {/* Kiri */}
        <div 
          className="p-10 flex flex-col justify-between bg-cover bg-center relative overflow-hidden"
          style={{ 
            backgroundImage: "url('https://ik.imagekit.io/p27ub3udc/agorcircular/Mask%20group%20(1).png?updatedAt=1779504409276')",
            backgroundColor: "#f0f7f0"
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-green-900/20"></div>
          
          {/* Decorative Shapes */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-green-300/20 rounded-full blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🌱</span>
              </div>
              <p className="text-green-800 font-bold text-2xl">AgroCircular</p>
            </div>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed mt-4">
              Membangun masa depan ekonomi sirkular yang berkelanjutan untuk ekosistem pertanian Indonesia.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-6 text-white relative z-10 shadow-xl border border-green-700/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">♻️</span>
              <p className="font-semibold text-lg">Transformasi Limbah</p>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Ubah sisa hasil panen menjadi nilai ekonomi baru melalui jaringan mitra kami.
            </p>
          </div>
        </div>

        {/* Kanan */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-white to-gray-50/50">
          <div className="flex border-b border-gray-200 mb-8 relative">
            {["masuk", "daftar"].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t as "masuk" | "daftar"); setError(""); setSuccessMsg(""); }}
                className={`flex-1 pb-3 text-sm font-semibold capitalize transition-all relative ${
                  tab === t
                    ? "text-green-700"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "masuk" ? "Masuk" : "Daftar"}
                {tab === t && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-green-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {successMsg && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-start gap-2 shadow-sm">
              <span className="text-lg shrink-0">✓</span>
              <span className="leading-relaxed">{successMsg}</span>
            </div>
          )}

          {tab === "masuk" ? (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-medium">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@perusahaan.com"
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-medium">Kata Sandi</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white shadow-sm"
                  />
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#b5e550] to-[#a8d840] text-green-900 font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {loading ? "Memproses..." : "Masuk ke Dashboard →"}
              </button>

              <button 
                onClick={() => router.push("/")}
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-green-700 font-semibold text-sm transition-all group z-20 self-start max-w-4xl mx-auto md:self-center"
              >
                <span className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all">
                  ←
                </span>
                Kembali ke Beranda
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-medium">Nama Lengkap</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Ibu Siti Aminah"
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-medium">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-medium">Kata Sandi (min. 6 karakter)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-medium">Daftar Sebagai</label>
                <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setRole("petani")}
                    className={`flex-1 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      role === "petani" 
                        ? "bg-gradient-to-r from-green-700 to-green-600 text-white shadow-md" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span>🌾</span>
                    <span>Petani/Peternak</span>
                  </button>
                  <button
                    onClick={() => setRole("pengepul")}
                    className={`flex-1 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      role === "pengepul" 
                        ? "bg-gradient-to-r from-green-700 to-green-600 text-white shadow-md" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span>🏭</span>
                    <span>Pengepul</span>
                  </button>
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {loading ? "Memproses..." : "Daftar Sekarang"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}