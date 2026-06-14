"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("petani" | "pengepul" | "admin")[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Simpan halaman tujuan sebelum diarahkan ke login
        sessionStorage.setItem("redirect_after_login", pathname);
        router.replace("/login");
      } else if (profile) {
        // Jika sudah login tapi perannya tidak diizinkan di rute ini
        if (!allowedRoles.includes(profile.role)) {
          if (profile.role === "petani") {
            router.replace("/dashboard/petani/kelola-limbah");
          } else if (profile.role === "pengepul") {
            router.replace("/dashboard/pengepul/radius-distribusi");
          } else if (profile.role === "admin") {
            router.replace("/dashboard/admin");
          } else {
            router.replace("/login");
          }
        }
      }
    }
  }, [user, profile, loading, allowedRoles, router, pathname]);

  if (loading || !user || !profile || !allowedRoles.includes(profile.role)) {
    return (
      <div className="min-h-screen bg-[#f8faf8] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center max-w-sm text-center">
          {/* Brand Logo or Icon with Spin Effect */}
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-green-100/50 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-50 to-emerald-50/20 animate-pulse"></div>
            <div className="w-8 h-8 rounded-full border-2 border-green-700/20 border-t-green-700 animate-spin relative z-10"></div>
          </div>
          
          <h2 className="text-gray-800 font-bold text-base mb-1">Menyiapkan Akses Aman...</h2>
          <p className="text-gray-400 text-xs leading-relaxed">
            Memverifikasi kredensial enkripsi dan profil akun AgroCircular Anda untuk proteksi data maksimal.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
