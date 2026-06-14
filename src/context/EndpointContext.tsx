"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export type Endpoint = {
  id: string;
  pemilik_id: string;
  nama: string;
  tipe: string;
  lokasi: string;
  lat: number;
  lng: number;
  komoditas: string[];
  kapasitas_sisa: number;
  kontak: string;
  harga_per_kg: number;
  donasi_aktif: boolean;
  created_at: string;
  profiles?: { nama: string; whatsapp?: string | null };
};

type EndpointInput = {
  nama: string;
  lokasi: string;
  komoditas: string[];
  kapasitas_sisa: number;
  kontak: string;
  harga_per_kg: number;
  donasi_aktif: boolean;
};

type EndpointContextType = {
  endpointList: Endpoint[];
  myEndpoint: Endpoint | null;
  loading: boolean;
  saveEndpoint: (data: EndpointInput, coords?: { lat: number; lng: number } | null) => Promise<{ error: string | null }>;
  refetch: () => Promise<void>;
};

const EndpointContext = createContext<EndpointContextType | null>(null);

const BASE_LAT = -7.8;
const BASE_LNG = 110.4;

export function EndpointProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { user } = useAuth();
  const [endpointList, setEndpointList] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEndpoint = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("endpoint")
      .select("*, profiles(nama, whatsapp)")
      .order("created_at", { ascending: false });

    if (!error && data) setEndpointList(data as Endpoint[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchEndpoint();

    const channel = supabase
      .channel("endpoint-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "endpoint" }, () => {
        fetchEndpoint();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const myEndpoint = endpointList.find((e) => e.pemilik_id === user?.id) || null;

  const saveEndpoint = async (data: EndpointInput, coords?: { lat: number; lng: number } | null) => {
    if (!user) return { error: "Anda harus login" };

    const lat = coords?.lat ?? BASE_LAT + (Math.random() - 0.5) * 0.1;
    const lng = coords?.lng ?? BASE_LNG + (Math.random() - 0.5) * 0.1;

    const existing = endpointList.find((e) => e.pemilik_id === user.id);

    if (existing) {
      const { error } = await supabase
        .from("endpoint")
        .update({ ...data, ...(coords ? { lat, lng } : {}) })
        .eq("id", existing.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("endpoint").insert({
        pemilik_id: user.id,
        ...data,
        lat,
        lng,
      });
      if (error) return { error: error.message };
    }

    return { error: null };
  };

  return (
    <EndpointContext.Provider value={{ endpointList, myEndpoint, loading, saveEndpoint, refetch: fetchEndpoint }}>
      {children}
    </EndpointContext.Provider>
  );
}

export function useEndpoint() {
  const ctx = useContext(EndpointContext);
  if (!ctx) throw new Error("useEndpoint harus dipakai di dalam EndpointProvider");
  return ctx;
}