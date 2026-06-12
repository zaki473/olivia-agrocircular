"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { limbahList as initialData, Limbah } from "@/data/limbah";

type LimbahContextType = {
  limbahList: Limbah[];
  tambahLimbah: (item: Omit<Limbah, "id" | "lat" | "lng">) => void;
  hapusLimbah: (id: number) => void;
  toggleAktifMap: (id: number) => void;
};

const LimbahContext = createContext<LimbahContextType | null>(null);

const BASE_LAT = -6.9175;
const BASE_LNG = 107.6191;

export function LimbahProvider({ children }: { children: ReactNode }) {
  const [limbahList, setLimbahList] = useState<Limbah[]>(
    initialData.map((l) => ({ ...l, aktif_di_map: l.aktif_di_map ?? true }))
  );

  const tambahLimbah = (item: Omit<Limbah, "id" | "lat" | "lng">) => {
    const offsetLat = (Math.random() - 0.5) * 0.05;
    const offsetLng = (Math.random() - 0.5) * 0.05;

    const newItem: Limbah = {
      ...item,
      id: Date.now(),
      lat: BASE_LAT + offsetLat,
      lng: BASE_LNG + offsetLng,
    };
    setLimbahList((prev) => [newItem, ...prev]);
  };

  const hapusLimbah = (id: number) => {
    setLimbahList((prev) => prev.filter((l) => l.id !== id));
  };

  const toggleAktifMap = (id: number) => {
    setLimbahList((prev) =>
      prev.map((l) => (l.id === id ? { ...l, aktif_di_map: !l.aktif_di_map } : l))
    );
  };

  return (
    <LimbahContext.Provider value={{ limbahList, tambahLimbah, hapusLimbah, toggleAktifMap }}>
      {children}
    </LimbahContext.Provider>
  );
}

export function useLimbah() {
  const ctx = useContext(LimbahContext);
  if (!ctx) throw new Error("useLimbah harus dipakai di dalam LimbahProvider");
  return ctx;
}