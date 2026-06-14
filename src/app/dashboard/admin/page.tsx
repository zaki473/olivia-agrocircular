"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Stats = {
  totalUsers: number;
  activeTransactions: number;
  limbahSaved: number;
  pendingVerifications: number;
  reportsCount: number;
  activePengepul: number;
};

type Transaksi = {
  id: string;
  tipe: string;
  status: string;
  created_at: string;
  limbah?: {
    judul: string;
    kategori: string;
    berat: number;
  } | null;
  pengaju?: {
    nama: string;
  } | null;
};

type Aktivitas = {
  id: string;
  nama: string;
  role: string;
  created_at: string;
};

export default function AdminOverviewPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeTransactions: 0,
    limbahSaved: 0,
    pendingVerifications: 0,
    reportsCount: 0,
    activePengepul: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaksi[]>([]);
  const [recentActivities, setRecentActivities] = useState<Aktivitas[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);

    // 1. Fetch Users stats
    const { data: profiles, error: errProfiles } = await supabase
      .from("profiles")
      .select("id, role, status_verifikasi, nama, created_at");

    let totalUsers = 0;
    let pendingVerifications = 0;
    let activePengepul = 0;
    const activities: Aktivitas[] = [];

    if (!errProfiles && profiles) {
      totalUsers = profiles.length;
      pendingVerifications = profiles.filter((p) => p.status_verifikasi === "menunggu").length;
      activePengepul = profiles.filter((p) => p.role === "pengepul").length;

      // Sort profiles to get recently registered users
      const sortedProfiles = [...profiles]
        .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .slice(0, 5);

      sortedProfiles.forEach((p) => {
        activities.push({
          id: p.id,
          nama: p.nama,
          role: p.role,
          created_at: p.created_at || new Date().toISOString(),
        });
      });
    }

    // 2. Fetch Transactions stats
    const { data: transaksi, error: errTransaksi } = await supabase
      .from("transaksi")
      .select("*, limbah(judul, kategori, berat), pengaju:profiles!transaksi_pengaju_id_fkey(nama)")
      .order("created_at", { ascending: false });

    let activeTransactions = 0;
    let limbahSaved = 0;
    const transactionsList: Transaksi[] = [];

    if (!errTransaksi && transaksi) {
      activeTransactions = transaksi.filter((t) => t.status === "menunggu").length;
      
      // Sum the weight of accepted transactions
      const acceptedTrans = transaksi.filter((t) => t.status === "diterima");
      limbahSaved = acceptedTrans.reduce((acc, t) => acc + (t.limbah?.berat || 0), 0);

      // Take first 5 for recent transactions
      transaksi.slice(0, 5).forEach((t) => {
        transactionsList.push({
          id: t.id,
          tipe: t.tipe,
          status: t.status,
          created_at: t.created_at,
          limbah: t.limbah ? {
            judul: t.limbah.judul,
            kategori: t.limbah.kategori,
            berat: t.limbah.berat,
          } : null,
          pengaju: t.pengaju ? {
            nama: t.pengaju.nama,
          } : null,
        });
      });
    }

    setStats({
      totalUsers,
      activeTransactions,
      limbahSaved,
      pendingVerifications,
      reportsCount: 0, // Mocked as 0 for now since reports table isn't queryable or specified
      activePengepul,
    });
    setRecentTransactions(transactionsList);
    setRecentActivities(activities);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statItems = [
    { label: "Total Pengguna", value: stats.totalUsers.toString(), sub: "Semua Petani, Pengepul & Admin", warna: "blue" },
    { label: "Transaksi Aktif", value: stats.activeTransactions.toString(), sub: "Menunggu persetujuan", warna: "green" },
    { label: "Limbah Terselamatkan", value: `${(stats.limbahSaved / 1000).toFixed(2)} Ton`, sub: `Total: ${stats.limbahSaved} kg`, warna: "emerald" },
    { label: "Menunggu Verifikasi", value: stats.pendingVerifications.toString(), sub: "Butuh review KTP & Usaha", warna: "yellow" },
    { label: "Laporan Masuk", value: stats.reportsCount.toString(), sub: "Laporan pengaduan aktif", warna: "red" },
    { label: "Pengepul Aktif", value: stats.activePengepul.toString(), sub: "Mitra pengepul terdaftar", warna: "indigo" },
  ];

  // Helper colors mapping
  const colorMap: Record<string, { bg: string, text: string, border: string }> = {
    blue: { bg: "bg-blue-50/50", text: "text-blue-700", border: "border-blue-100" },
    green: { bg: "bg-green-50/50", text: "text-green-700", border: "border-green-100" },
    emerald: { bg: "bg-emerald-50/50", text: "text-emerald-700", border: "border-emerald-100" },
    yellow: { bg: "bg-yellow-50/50", text: "text-yellow-700", border: "border-yellow-100" },
    red: { bg: "bg-red-50/50", text: "text-red-700", border: "border-red-100" },
    indigo: { bg: "bg-indigo-50/50", text: "text-indigo-700", border: "border-indigo-100" },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-400 text-sm mt-1">Selamat datang kembali, Admin AgroCircular.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Memuat statistik dashboard...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statItems.map((s) => {
              const colors = colorMap[s.warna] || colorMap.blue;
              return (
                <div key={s.label} className={`bg-white border rounded-2xl p-5 shadow-sm ${colors.border}`}>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{s.label}</p>
                  <p className={`text-3xl font-bold mt-2 ${colors.text}`}>{s.value}</p>
                  <p className="text-gray-400 text-xs mt-1.5">{s.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Details Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800">Transaksi Terbaru</h3>
              {recentTransactions.length === 0 ? (
                <p className="text-gray-400 text-sm py-4">Belum ada transaksi terdaftar.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentTransactions.map((t) => (
                    <div key={t.id} className="flex justify-between items-center py-3 text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">
                          {t.tipe.toUpperCase()} : {t.limbah?.judul || "Material"} ({t.limbah?.berat || 0} kg)
                        </span>
                        <span className="text-xs text-gray-400">Pengaju: {t.pengaju?.nama || "Mitra"}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        t.status === "diterima" ? "bg-green-100 text-green-700"
                        : t.status === "ditolak" ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activities */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800">Registrasi Mitra Baru</h3>
              {recentActivities.length === 0 ? (
                <p className="text-gray-400 text-sm py-4">Belum ada aktivitas baru.</p>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((a) => (
                    <div key={a.id} className="flex gap-3 py-2 text-sm">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-1.5 shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-gray-700">
                          <strong className="text-gray-900">{a.nama}</strong> mendaftar sebagai{" "}
                          <span className="text-green-700 font-semibold uppercase text-xs">{a.role}</span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(a.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}