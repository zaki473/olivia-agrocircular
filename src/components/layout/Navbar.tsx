"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Beranda" },
    { href: "/tentang-kami", label: "Tentang Kami" },
    { href: "/pasar-barter", label: "Pasar Barter" },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
            <img src="https://ik.imagekit.io/p27ub3udc/agorcircular/Union.png?updatedAt=1779503214194" className="w-4 h-4 object-contain" alt="logo" />
          </div>
          <div>
            <p className="text-green-800 font-bold text-sm leading-none">AgroCircular</p>
            <p className="text-gray-400 text-[10px] leading-none mt-0.5">SINERGI AGRIKULTUR SIRKULAR</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                pathname === link.href
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-600 hover:text-green-700 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/login"
          className="bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-green-800 transition"
        >
          Masuk
        </Link>
      </div>
    </nav>
  );
}