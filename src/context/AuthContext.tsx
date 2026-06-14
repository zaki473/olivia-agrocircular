"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  nama: string;
  role: "petani" | "pengepul" | "admin";
  lokasi: string | null;
  whatsapp?: string | null;
  nomor_telepon?: string | null;
  nik?: string | null;
  alamat_lengkap?: string | null;
  nama_usaha?: string | null;
  foto_ktp_url?: string | null;
  foto_usaha_url?: string | null;
  status_verifikasi?: "belum_lengkap" | "menunggu" | "terverifikasi" | "ditolak";
  catatan_verifikasi?: string | null;
};

type AuthContextType = {
  user: SupabaseUser | null;
  profile: Profile | null;
  isLoggedIn: boolean;
  loading: boolean;
  register: (email: string, password: string, nama: string, role: "petani" | "pengepul") => Promise<{ error: string | null }>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refetchProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setProfile(data as Profile);
  };

  useEffect(() => {
    // Cek session saat pertama load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    // Listen perubahan auth state (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const register = async (email: string, password: string, nama: string, role: "petani" | "pengepul") => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nama, role },
      },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const refetchProfile = async () => {
  if (user) await fetchProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoggedIn: !!user, loading, register, login, logout, refetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}