"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard/pengepul/radius-distribusi", label: "Radius Distribusi", icon: "→" },
  { href: "/dashboard/pengepul/katalog-serapan", label: "Katalog Serapan Komoditas", icon: "🗂" },
];

export default function DashboardNavPengepul() {
  const pathname = usePathname();
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex gap-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                isActive
                  ? "border-green-700 text-green-700 bg-green-50"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}