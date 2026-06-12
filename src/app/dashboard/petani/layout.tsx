import DashboardNavPetani from "@/components/layout/DashboardNavPetani";
import Link from "next/link";

export default function PetaniLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* Top Navbar Dashboard */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AC</span>
              </div>
              <span className="text-green-800 font-bold text-sm">AgroCircular</span>
            </Link>
            <div className="hidden md:flex items-center gap-4 ml-4">
              <Link href="/" className="text-sm text-gray-500 hover:text-green-700">Beranda Publik</Link>
              <span className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-lg">Dashboard Petani</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              Mode: PETANI
            </span>
            <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
              S
            </div>
            <Link href="/login" className="text-gray-400 hover:text-gray-600 text-sm">→</Link>
          </div>
        </div>
      </nav>

      <DashboardNavPetani />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}