import Link from "next/link";

const adminNav = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/users", label: "Pengguna" },
  { href: "/dashboard/admin/verifikasi", label: "Verifikasi" },
  { href: "/dashboard/admin/laporan", label: "Laporan" },
  { href: "/dashboard/admin/monitoring", label: "Monitoring" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">AC</span>
            </div>
            <span className="text-green-800 font-bold text-sm">AgroCircular</span>
            <span className="ml-3 bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">ADMIN</span>
          </div>
          <div className="hidden md:flex gap-1">
            {adminNav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-sm text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition"
              >
                {n.label}
              </Link>
            ))}
          </div>
          <Link href="/login" className="text-gray-400 text-sm hover:text-gray-600">Keluar →</Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}