"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface NavLink {
  href: string;
  label: string;
  icon?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const publicLinks: NavLink[] = [
    { href: "/", label: "Beranda" },
    { href: "/tentang-kami", label: "Tentang Kami" },
    { href: "/pasar-barter", label: "Pasar Barter" },
  ];

  const petaniLinks: NavLink[] = [
  { href: "/dashboard/petani/kelola-limbah", label: "Kelola Limbah" },
  { href: "/dashboard/petani/kotak-transaksi", label: "Transaksi" },
  { href: "/dashboard/petani/riwayat", label: "Riwayat" },
  { href: "/dashboard/petani/profile", label: "Profil" },
];

  const pengepulLinks: NavLink[] = [
  { href: "/dashboard/pengepul/radius-distribusi", label: "Radius Distribusi" },
  { href: "/dashboard/pengepul/katalog-serapan", label: "Katalog Serapan" },
  { href: "/dashboard/pengepul/kotak-transaksi", label: "Transaksi" },
  { href: "/dashboard/pengepul/riwayat", label: "Riwayat" },
  { href: "/dashboard/pengepul/profile", label: "Profil" },
];

  let links: NavLink[] = publicLinks;
  if (user && profile) {
    if (profile.role === "petani") {
      links = [...publicLinks, ...petaniLinks];
    } else if (profile.role === "pengepul") {
      links = [...publicLinks, ...pengepulLinks];
    }
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const closeMobile = () => setIsOpen(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-[100] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={closeMobile}>
          <div className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center">
            <img src="https://ik.imagekit.io/p27ub3udc/agorcircular/Union.png?updatedAt=1779503214194" className="w-3.5 h-3.5 object-contain" alt="logo" />
          </div>
          <div>
            <p className="text-green-800 font-bold text-xs leading-none">AgroCircular</p>
            <p className="text-gray-400 text-[9px] leading-none mt-0.5">SINERGI AGRIKULTUR SIRKULAR</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
                pathname === link.href
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-600 hover:text-green-700 hover:bg-gray-50"
              }`}
            >
              {link.icon && <span className="text-sm">{link.icon}</span>}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side: User Info / Login Button + Hamburger */}
        <div className="flex items-center gap-2">
          {/* User Info - Desktop Only */}
          {user && profile ? (
            <div className="hidden lg:flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">{profile.nama}</p>
                <p className="text-[10px] text-gray-500 capitalize">{profile.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-red-100 transition border border-red-200"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-block bg-green-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-green-800 transition"
            >
              Masuk
            </Link>
          )}

          {/* Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5 flex flex-col justify-center items-center">
              <span
                className={`block h-0.5 w-5 bg-gray-700 rounded-full transition-all duration-300 absolute ${
                  isOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-gray-700 rounded-full transition-all duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-gray-700 rounded-full transition-all duration-300 absolute ${
                  isOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 bg-white space-y-1">
          {/* User Info - Mobile */}
          {user && profile && (
            <div className="flex items-center justify-between px-3 py-2 mb-2 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-gray-800">{profile.nama}</p>
                <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-red-100 transition border border-red-200"
              >
                Keluar
              </button>
            </div>
          )}

          {/* Menu Links */}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                pathname === link.href
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {link.icon && <span className="text-base">{link.icon}</span>}
              {link.label}
            </Link>
          ))}

          {/* Login Button - Mobile Only */}
          {!user && (
            <Link
              href="/login"
              onClick={closeMobile}
              className="block w-full text-center bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-green-800 transition mt-2"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}