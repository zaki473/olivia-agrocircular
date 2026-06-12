import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <img src="https://ik.imagekit.io/p27ub3udc/agorcircular/Union.png?updatedAt=1779503214194" className="w-4 h-4 object-contain" alt="logo" />
            </div>
            <p className="font-bold">AgroCircular</p>
          </div>
          <p className="text-green-200 text-sm leading-relaxed">
            © 2026 AgroCircular. Sinergi Agrikultur Sirkular.
            Mewujudkan pertanian berkelanjutan untuk masa depan Indonesia.
          </p>
        </div>

        <div>
          <p className="font-semibold mb-3 text-green-100">Platform</p>
          <div className="flex flex-col gap-2">
            <Link href="/pasar-barter" className="text-green-300 text-sm hover:text-white">Pasar Barter</Link>
            <Link href="/tentang-kami" className="text-green-300 text-sm hover:text-white">Tentang Kami</Link>
            <Link href="/login" className="text-green-300 text-sm hover:text-white">Masuk / Daftar</Link>
          </div>
        </div>

        <div>
          <p className="font-semibold mb-3 text-green-100">Tentang</p>
          <div className="flex flex-col gap-2">
            <Link href="/tentang-kami" className="text-green-300 text-sm hover:text-white">Tentang Kami</Link>
            <span className="text-green-300 text-sm">Syarat Layanan</span>
            <span className="text-green-300 text-sm">Pusat Bantuan</span>
            <span className="text-green-300 text-sm">Kontak Kami</span>
          </div>
        </div>
      </div>
    </footer>
  );
}