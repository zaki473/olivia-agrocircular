"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  nama: string;
  role: "petani" | "pengepul" | "admin";
  lokasi: string | null;
  whatsapp?: string | null;
  status_verifikasi?: "belum_lengkap" | "menunggu" | "terverifikasi" | "ditolak";
  created_at?: string;
};

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("semua");

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("nama", { ascending: true });

    if (!error && data) {
      setUsers(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna ${nama}?`)) {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) {
        alert("Gagal menghapus pengguna: " + error.message);
      } else {
        alert("Pengguna berhasil dihapus.");
        fetchUsers();
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      (u.lokasi && u.lokasi.toLowerCase().includes(search.toLowerCase())) ||
      (u.whatsapp && u.whatsapp.includes(search));
    const matchesRole = roleFilter === "semua" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Pengguna</h1>
          <p className="text-gray-400 text-sm mt-1">Semua pengguna terdaftar di platform AgroCircular.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 bg-white p-4 border border-gray-100 rounded-2xl shadow-sm">
        <input
          type="text"
          placeholder="Cari nama, lokasi, atau WA..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="semua">Semua Role</option>
          <option value="petani">Petani</option>
          <option value="pengepul">Pengepul</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Memuat data pengguna...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Tidak ada pengguna ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Nama</th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Kontak (WA)</th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Role</th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Lokasi</th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Verifikasi</th>
                  <th className="text-center px-6 py-4 text-gray-500 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-800">{u.nama}</td>
                    <td className="px-6 py-4 text-gray-500">{u.whatsapp || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        u.role === "petani" ? "bg-green-50 text-green-700 border border-green-100"
                        : u.role === "pengepul" ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{u.lokasi || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        u.status_verifikasi === "terverifikasi" ? "bg-green-100 text-green-800"
                        : u.status_verifikasi === "menunggu" ? "bg-yellow-100 text-yellow-800"
                        : u.status_verifikasi === "ditolak" ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-600"
                      }`}>
                        {u.status_verifikasi === "terverifikasi" ? "Terverifikasi"
                        : u.status_verifikasi === "menunggu" ? "Pending Review"
                        : u.status_verifikasi === "ditolak" ? "Ditolak"
                        : "Belum Lengkap"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(u.id, u.nama)}
                        className="text-red-500 hover:text-red-700 hover:underline text-xs font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}