"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getDokumenUrl } from "@/lib/supabase/uploadDoc";

type Profile = {
  id: string;
  nama: string;
  role: "petani" | "pengepul" | "admin";
  lokasi: string | null;
  whatsapp?: string | null;
  alamat_lengkap?: string | null;
  nama_usaha?: string | null;
  foto_ktp_url?: string | null;
  foto_usaha_url?: string | null;
  status_verifikasi?: "belum_lengkap" | "menunggu" | "terverifikasi" | "ditolak";
  catatan_verifikasi?: string | null;
};

export default function AdminVerifikasiPage() {
  const supabase = createClient();
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [actioning, setActioning] = useState(false);
  const [ktpUrl, setKtpUrl] = useState<string | null>(null);
  const [usahaUrl, setUsahaUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedUser) {
      setKtpUrl(null);
      setUsahaUrl(null);
      if (selectedUser.foto_ktp_url) {
        getDokumenUrl(selectedUser.foto_ktp_url).then(setKtpUrl);
      }
      if (selectedUser.foto_usaha_url) {
        getDokumenUrl(selectedUser.foto_usaha_url).then(setUsahaUrl);
      }
    }
  }, [selectedUser]);

  const fetchPendingUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("status_verifikasi", "menunggu")
      .order("nama", { ascending: true });

    if (!error && data) {
      setPendingUsers(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleVerify = async (id: string) => {
    setActioning(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        status_verifikasi: "terverifikasi",
        catatan_verifikasi: null
      })
      .eq("id", id);

    setActioning(false);
    if (error) {
      alert("Gagal melakukan verifikasi: " + error.message);
    } else {
      alert("Pengguna berhasil diverifikasi!");
      setSelectedUser(null);
      fetchPendingUsers();
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectNote.trim()) {
      alert("Silakan masukkan alasan penolakan.");
      return;
    }
    setActioning(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        status_verifikasi: "ditolak",
        catatan_verifikasi: rejectNote
      })
      .eq("id", id);

    setActioning(false);
    if (error) {
      alert("Gagal menolak verifikasi: " + error.message);
    } else {
      alert("Verifikasi pengguna ditolak.");
      setSelectedUser(null);
      setRejectNote("");
      fetchPendingUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Verifikasi Pengguna</h1>
        <p className="text-gray-400 text-sm mt-1">Review pendaftaran dan dokumen KTP/Usaha mitra baru.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* List of Pending Users */}
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-4 h-[fit-content]">
          <h2 className="font-bold text-gray-800 mb-4">Menunggu Verifikasi ({pendingUsers.length})</h2>
          {loading ? (
            <p className="text-gray-400 text-sm py-4 text-center">Memuat daftar...</p>
          ) : pendingUsers.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">Tidak ada pengajuan verifikasi baru.</p>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setSelectedUser(u);
                    setRejectNote("");
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col gap-1 ${
                    selectedUser?.id === u.id
                      ? "border-green-600 bg-green-50/50"
                      : "border-gray-100 hover:border-green-200 hover:bg-gray-50/50"
                  }`}
                >
                  <span className="font-semibold text-gray-800 text-sm">{u.nama}</span>
                  <div className="flex justify-between items-center w-full mt-1">
                    <span className="text-xs text-gray-400">📍 {u.lokasi || "Lokasi belum diatur"}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      u.role === "petani" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {u.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Detail & Document Verification */}
        <div className="lg:col-span-2 space-y-6">
          {selectedUser ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6">
              <div className="border-b border-gray-100 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedUser.nama}</h2>
                  <p className="text-gray-400 text-sm">Role: <span className="font-semibold text-green-700 uppercase">{selectedUser.role}</span></p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold">
                  Menunggu Keputusan
                </span>
              </div>

              {/* Profile Details */}
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">WhatsApp / Kontak</p>
                  <p className="font-medium text-gray-800 mt-0.5">{selectedUser.whatsapp || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Nama Usaha</p>
                  <p className="font-medium text-gray-800 mt-0.5">{selectedUser.nama_usaha || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-400 text-xs">Alamat Lengkap</p>
                  <p className="font-medium text-gray-800 mt-0.5">{selectedUser.alamat_lengkap || "-"}</p>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Foto KTP</p>
                  <div className="border border-gray-200 rounded-xl bg-gray-50 h-56 flex items-center justify-center overflow-hidden">
                    {ktpUrl ? (
                      <img
                        src={ktpUrl}
                        alt="Foto KTP"
                        className="w-full h-full object-contain hover:scale-105 transition duration-300 cursor-pointer"
                        onClick={() => window.open(ktpUrl, "_blank")}
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">KTP Belum Diunggah</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Foto Usaha / Kebun</p>
                  <div className="border border-gray-200 rounded-xl bg-gray-50 h-56 flex items-center justify-center overflow-hidden">
                    {usahaUrl ? (
                      <img
                        src={usahaUrl}
                        alt="Foto Usaha"
                        className="w-full h-full object-contain hover:scale-105 transition duration-300 cursor-pointer"
                        onClick={() => window.open(usahaUrl, "_blank")}
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">Foto Usaha Belum Diunggah</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => handleVerify(selectedUser.id)}
                    disabled={actioning}
                    className="flex-1 bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition disabled:opacity-50 text-sm"
                  >
                    {actioning ? "Memproses..." : "✓ Setujui Verifikasi"}
                  </button>
                </div>

                <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 space-y-3">
                  <label className="block text-xs font-semibold text-red-800">Alasan Penolakan (Wajib jika menolak)</label>
                  <textarea
                    rows={2}
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    placeholder="Contoh: Foto KTP blur / Alamat tidak sesuai..."
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 resize-none bg-white"
                  />
                  <button
                    onClick={() => handleReject(selectedUser.id)}
                    disabled={actioning || !rejectNote.trim()}
                    className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-xs"
                  >
                    ✕ Tolak Verifikasi
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 text-center text-gray-400">
              <span className="text-4xl block mb-3">👤</span>
              Pilih salah satu mitra di samping untuk memverifikasi dokumen mereka.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}