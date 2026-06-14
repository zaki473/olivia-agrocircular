"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export type Transaksi = {
  id: string;
  limbah_id: string;
  pengaju_id: string;
  pemilik_id: string | null;
  endpoint_id: string | null;
  tipe: "barter" | "jual" | "donasi";
  status: "menunggu" | "diterima" | "ditolak";
  item_ditawarkan: string | null;
  pesan: string | null;
  jumlah: number | null;
  total_harga: number | null;
  created_at: string;
  limbah?: {
    judul: string;
    kategori: string;
    berat: number;
    harga: number | null;
    mekanisme: string;
    lokasi: string;
    gambar_url?: string | null;
  };
  pengaju?: { nama: string; whatsapp?: string | null };
  pemilik?: { nama: string; whatsapp?: string | null };
  endpoint?: { nama: string; kontak?: string | null };
};

type TransaksiContextType = {
  masuk: Transaksi[];
  diajukan: Transaksi[];
  loading: boolean;
  ajukanTransaksi: (data: {
    limbah_id: string;
    pemilik_id?: string;
    endpoint_id?: string;
    tipe: "barter" | "jual" | "donasi";
    item_ditawarkan?: string;
    pesan?: string;
    jumlah?: number;
    total_harga?: number;
  }) => Promise<{ error: string | null }>;
  updateStatus: (id: string, status: "diterima" | "ditolak") => Promise<void>;
  refetch: (endpointId?: string | null) => Promise<void>;
};

const TransaksiContext = createContext<TransaksiContextType | null>(null);

export function TransaksiProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { user } = useAuth();
  const [masuk, setMasuk] = useState<Transaksi[]>([]);
  const [diajukan, setDiajukan] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransaksi = async (endpointId?: string | null) => {
  if (!user) {
    setMasuk([]);
    setDiajukan([]);
    setLoading(false);
    return;
  }

  setLoading(true);

  // Transaksi masuk: pemilik (petani) ATAU endpoint milik pengepul ini
  let masukQuery = supabase
    .from("transaksi")
    .select("*, limbah(judul, kategori, berat, harga, mekanisme, lokasi, gambar_url), pengaju:profiles!transaksi_pengaju_id_fkey(nama, whatsapp), endpoint(nama, kontak)")
    .order("created_at", { ascending: false });

  if (endpointId) {
    masukQuery = masukQuery.or(`pemilik_id.eq.${user.id},endpoint_id.eq.${endpointId}`);
  } else {
    masukQuery = masukQuery.eq("pemilik_id", user.id);
  }

  const { data: masukData } = await masukQuery;

  const { data: diajukanData } = await supabase
    .from("transaksi")
    .select("*, limbah(judul, kategori, berat, harga, mekanisme, lokasi, gambar_url), pemilik:profiles!transaksi_pemilik_id_fkey(nama, whatsapp), endpoint(nama, kontak)")
    .eq("pengaju_id", user.id)
    .order("created_at", { ascending: false });

  if (masukData) setMasuk(masukData as Transaksi[]);
  if (diajukanData) setDiajukan(diajukanData as Transaksi[]);
  setLoading(false);
};

useEffect(() => {
  fetchTransaksi();

  if (!user) return;

  const channel = supabase
    .channel("transaksi-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "transaksi" }, () => {
      fetchTransaksi();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user]);

  const ajukanTransaksi = async (data: {
  limbah_id: string;
  pemilik_id?: string;
  endpoint_id?: string;
  tipe: "barter" | "jual" | "donasi";
  item_ditawarkan?: string;
  pesan?: string;
  jumlah?: number;
  total_harga?: number;
}) => {
  if (!user) return { error: "Anda harus login" };

    const { error } = await supabase.from("transaksi").insert({
      ...data,
      pengaju_id: user.id,
      status: "menunggu",
    });

    if (error) return { error: error.message };
    await fetchTransaksi();
    return { error: null };
  };

  const updateStatus = async (id: string, status: "diterima" | "ditolak") => {
    await supabase.from("transaksi").update({ status }).eq("id", id);
    await fetchTransaksi();
  };

return (
  <TransaksiContext.Provider value={{ masuk, diajukan, loading, ajukanTransaksi, updateStatus, refetch: fetchTransaksi }}>
    {children}
  </TransaksiContext.Provider>
);
}

export function useTransaksi() {
  const ctx = useContext(TransaksiContext);
  if (!ctx) throw new Error("useTransaksi harus dipakai di dalam TransaksiProvider");
  return ctx;
}