"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export type Limbah = {
  id: string;
  pemilik_id: string;
  judul: string;
  kategori: string;
  berat: number;
  lokasi: string;
  lat: number;
  lng: number;
  mekanisme: "barter" | "jual";
  harga: number | null;
  barter_dengan: string | null;
  deskripsi: string;
  status: string;
  aktif_di_map: boolean;
  gambar_url: string | null;
  created_at: string;
  profiles?: { nama: string; role: string };
};

type LimbahInput = {
  judul: string;
  kategori: string;
  berat: number;
  lokasi: string;
  mekanisme: "barter" | "jual";
  harga: number | null;
  barter_dengan: string | null;
  deskripsi: string;
};

type Coords = { lat: number; lng: number } | null;

type LimbahContextType = {
  limbahList: Limbah[];
  loading: boolean;
  tambahLimbah: (item: LimbahInput, file?: File | null, coords?: Coords) => Promise<{ error: string | null }>;
  hapusLimbah: (id: string, gambarUrl?: string | null) => Promise<void>;
  toggleAktifMap: (id: string, current: boolean) => Promise<void>;
  refetch: () => Promise<void>;
};

const LimbahContext = createContext<LimbahContextType | null>(null);

const BASE_LAT = -6.9175;
const BASE_LNG = 107.6191;

export function LimbahProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { user } = useAuth();
  const [limbahList, setLimbahList] = useState<Limbah[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLimbah = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("limbah")
      .select("*, profiles(nama, role)")
      .order("created_at", { ascending: false });

    if (!error && data) setLimbahList(data as Limbah[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchLimbah();

    const channel = supabase
      .channel("limbah-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "limbah" }, () => {
        fetchLimbah();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const uploadGambar = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from("limbah-images").upload(fileName, file);

    if (error) {
      console.error("Upload error:", error.message);
      return null;
    }

    const { data } = supabase.storage.from("limbah-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const tambahLimbah = async (item: LimbahInput, file?: File | null, coords?: Coords) => {
    if (!user) return { error: "Anda harus login" };

    let gambarUrl: string | null = null;
    if (file) {
      gambarUrl = await uploadGambar(file);
      if (!gambarUrl) return { error: "Gagal mengupload gambar" };
    }

    const lat = coords?.lat ?? BASE_LAT + (Math.random() - 0.5) * 0.05;
    const lng = coords?.lng ?? BASE_LNG + (Math.random() - 0.5) * 0.05;

    const { error } = await supabase.from("limbah").insert({
      pemilik_id: user.id,
      ...item,
      lat,
      lng,
      status: "tersedia",
      aktif_di_map: true,
      gambar_url: gambarUrl,
    });

    if (error) return { error: error.message };
    await fetchLimbah();
    return { error: null };
  };

  const hapusLimbah = async (id: string, gambarUrl?: string | null) => {
    await supabase.from("limbah").delete().eq("id", id);

    if (gambarUrl) {
      const path = gambarUrl.split("/limbah-images/")[1];
      if (path) {
        await supabase.storage.from("limbah-images").remove([path]);
      }
    }
    await fetchLimbah();
  };

  const toggleAktifMap = async (id: string, current: boolean) => {
    await supabase.from("limbah").update({ aktif_di_map: !current }).eq("id", id);
    await fetchLimbah();
  };

  return (
    <LimbahContext.Provider value={{ limbahList, loading, tambahLimbah, hapusLimbah, toggleAktifMap, refetch: fetchLimbah }}>
      {children}
    </LimbahContext.Provider>
  );
}

export function useLimbah() {
  const ctx = useContext(LimbahContext);
  if (!ctx) throw new Error("useLimbah harus dipakai di dalam LimbahProvider");
  return ctx;
}