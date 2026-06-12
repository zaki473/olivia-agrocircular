import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const testimonials = [
  {
    nama: "Roy Kiyoshi",
    peran: "Petani Padi",
    pesan: "Distribusi limbah jadi lebih teratur dan tidak terbuang sia-sia.",
  },
  {
    nama: "Siti Aminah",
    peran: "Peternak",
    pesan: "Platform ini membantu kami mendapatkan pupuk organik dengan lebih mudah.",
  },
  {
    nama: "Budi Santoso",
    peran: "Petani Milenial",
    pesan: "Kolaborasi antara petani dan peternak terasa lebih efisien dan modern.",
  },
];

const jalur = [
  {
    judul: "Barter Mikro",
    desc: "Tukarkan limbah dengan kebutuhan petani sekitar melalui sistem cerdas yang mencocokkan mitra berdasarkan lokasi.",
  },
  {
    judul: "Jual ke Pabrik",
    desc: "Terhubung langsung dengan pengepul dan pabrik terdekat tanpa perantara, sehingga proses jual limbah jadi lebih mudah dan efisien.",
  },
  {
    judul: "Lapak Donasi",
    desc: "Bagikan limbah yang tidak terpakai agar lebih bermanfaat sekaligus membantu menciptakan dampak lingkungan yang lebih baik.",
  },
];

const stats = [
  {
    value: "2.4 Ton",
    label: "Limbah Terselamatkan",
    sub: "Target 2025: 10.000 Ton",
    ikon: "⇄",
  },
  {
    value: "147 Kg",
    label: "CO₂ Ditekan",
    sub: "Pertumbuhan +13% efisiensi",
    ikon: "🌿",
  },
  {
    value: "147",
    label: "Pelaku Agraris",
    sub: "Lebih dari 25.000 Petani",
    ikon: "👁",
  },
];

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section
        className="relative text-white overflow-hidden bg-cover bg-center bg-no-repeat flex items-center"
        style={{
          minHeight: "450px",
          backgroundImage: `url('https://ik.imagekit.io/p27ub3udc/agorcircular/Mask%20group.png?updatedAt=1779503089394')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Dari Sisa <br />
              <span className="text-[#b5e550]">Menjadi Manfaat</span>
            </h1>
            <p className="text-gray-200 text-lg max-w-md mb-8 leading-relaxed">
              Transformasikan Limbah Menjadi Nilai. Membangun ekosistem pertanian
              sirkular yang berkelanjutan untuk masa depan Indonesia.
            </p>
            <Link
              href="/login"
              className="inline-block bg-[#b5e550] text-green-950 font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              Bergabung Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* --- AGROCIRCULAR ABOUT SECTION (LAYOUT SESUAI GAMBAR) --- */}
      {/* --- AGROCIRCULAR ABOUT SECTION --- */}
<section className="relative w-full py-24 px-6 bg-[#f2f9eb] overflow-hidden min-h-[750px] flex items-center justify-center">
  {/* Dekorasi Background */}
  <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#e3f0d7] rounded-full opacity-60 blur-3xl" />
  <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#eaf4e1] rounded-full opacity-60 blur-3xl" />

  {/* Container Utama untuk Konten & Gambar */}
  <div className="container mx-auto relative h-full min-h-[500px] flex items-center justify-center">
    
    {/* BAGIAN TEKS (Layer Tengah) - z-index tinggi agar tidak tertutup */}
    <div className="relative z-30 flex flex-col items-center text-center max-w-xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-[#4a7c44] mb-6">
        AgroCircular
      </h2>
      <h3 className="text-xl md:text-2xl font-bold text-[#2d4d2a] mb-4 leading-tight">
        Solusi Pertanian Berkelanjutan untuk <br className="hidden md:block" /> Masa Depan
      </h3>
      <p className="text-gray-600 text-base leading-relaxed mb-8">
        Platform digital yang membantu komunitas pertanian dalam pengelolaan sumber daya, 
        distribusi limbah, dan kolaborasi pertanian modern.
      </p>
      <Link
        href="/pasar-barter"
        className="bg-[#b5e550] text-[#3d5a1a] font-bold py-3 px-10 rounded-xl shadow-md hover:bg-[#a2d142] transition-all relative z-40"
      >
        Pelajari Sekarang
      </Link>
    </div>

    {/* LAYER GAMBAR (Hanya muncul di Desktop) */}
    <div className="hidden lg:block">
      {/* Gambar 1: Kiri Atas */}
      <div className="absolute -top-10 left-[-5%] w-52 h-36 rounded-2xl border-4 border-white shadow-xl overflow-hidden transform -rotate-3 z-10">
        <img src="https://ik.imagekit.io/p27ub3udc/agorcircular/Group%2018.png?updatedAt=1779503536893" className="w-full h-full object-cover" alt="petani 1" />
      </div>

      {/* Gambar 2: Kiri Bawah */}
      <div className="absolute bottom-[-20px] left-[-2%] w-64 h-44 rounded-2xl border-4 border-white shadow-xl overflow-hidden transform rotate-2 z-10">
        <img src="https://ik.imagekit.io/p27ub3udc/agorcircular/Group%2019.png?updatedAt=1779503537749" className="w-full h-full object-cover" alt="petani 2" />
      </div>

      {/* Gambar 3: Kanan Atas */}
      <div className="absolute top-0 right-[-5%] w-60 h-40 rounded-2xl border-4 border-white shadow-xl overflow-hidden transform rotate-3 z-10">
        <img src="https://ik.imagekit.io/p27ub3udc/agorcircular/Group%2017.png" className="w-full h-full object-cover" alt="kolaborasi" />
      </div>

      {/* Gambar 4: Kanan Bawah */}
      <div className="absolute bottom-10 right-[-8%] w-64 h-48 rounded-2xl border-4 border-white shadow-xl overflow-hidden transform -rotate-2 z-10">
        {/* Pastikan URL ini benar di ImageKit Anda */}
        <img src="https://ik.imagekit.io/p27ub3udc/agorcircular/Group%2016.png?updatedAt=1779503537621" className="w-full h-full object-cover" alt="cek tanah" />
      </div>

      {/* Gambar 5: Bawah Tengah (Diberi margin top agar tidak menabrak tombol) */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-48 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden z-10">
        {/* Pastikan URL ini benar di ImageKit Anda */}
        <img src="https://ik.imagekit.io/p27ub3udc/agorcircular/Rectangle%2057-2.png" className="w-full h-full object-cover" alt="jabat tangan" />
      </div>
    </div>

    {/* Mobile Image Layout (Simple Grid) */}
    <div className="grid grid-cols-2 gap-3 mt-12 lg:hidden relative z-10">
        <img src="https://ik.imagekit.io/p27ub3udc/agorcircular/Group%2019.png" className="rounded-xl border-2 border-white shadow h-28 object-cover w-full" alt="img" />
        <img src="https://ik.imagekit.io/p27ub3udc/agorcircular/Group%2017.png" className="rounded-xl border-2 border-white shadow h-28 object-cover w-full" alt="img" />
    </div>
  </div>
</section>

      {/* --- DAMPAK KOLEKTIF --- */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-[#4a7c44] font-bold text-lg mb-2">Dampak Kolektif Kita</h2>
          <p className="text-gray-400 text-sm mb-12">Data real-time dari seluruh jaringan AgroCircular di Indonesia.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((s, index) => (
              <div key={index} className="bg-[#f8fcf5] rounded-3xl p-8 border border-green-50 hover:shadow-lg transition">
                <div className="w-14 h-14 bg-[#b5e550] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {s.ikon}
                </div>
                <p className="text-4xl font-black text-green-800">{s.value}</p>
                <p className="text-gray-700 font-bold text-base mt-2">{s.label}</p>
                <p className="text-gray-400 text-xs mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TIGA JALUR --- */}
      <section className="py-20 px-6 bg-[#f0f7f0]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-12 leading-tight">
            Tiga Jalur <br className="md:hidden" /> Solusi Terintegrasi
          </h2>
          <div className="grid gap-6">
            {jalur.map((j, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-sm border border-transparent hover:border-green-300 transition group"
              >
                <div className="flex-1 text-center md:text-left">
                  <p className="font-bold text-xl text-green-900 mb-2">{j.judul}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{j.desc}</p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-8 w-12 h-12 bg-[#b5e550] rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                  <span className="text-green-950 font-bold text-xl">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONI --- */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-12">
            Apa Kata <br /> Pengguna Kami?
          </h2>

          <div className="grid md:grid-cols-2 gap-10 mb-12 items-center">
            <div className="relative group">
              <div className="bg-green-100 rounded-3xl h-64 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://ik.imagekit.io/p27ub3udc/agorcircular/Group%2018.png?updatedAt=1779503536893" 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                  alt="Testimonial"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-[#b5e550] rounded-2xl flex items-center justify-center text-4xl shadow-lg">👨‍🌾</div>
            </div>
            <div className="bg-[#f8fcf5] rounded-3xl p-10 relative">
              <span className="text-6xl text-green-200 absolute top-4 left-4 font-serif opacity-50">“</span>
              <p className="text-gray-700 text-xl italic leading-relaxed mb-6 relative z-10">
                "Sejak menggunakan AgroCircular, limbah pertanian kami jadi
                lebih bermanfaat dan mudah disalurkan kepada petani lain yang
                membutuhkan."
              </p>
              <p className="text-green-800 font-bold text-lg">— Juan Lopez</p>
              <p className="text-gray-400 text-sm">Ketua Kelompok Tani Lestari</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:bg-green-50 transition">
                <p className="text-gray-600 text-sm italic mb-6">"{t.pesan}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-bold">
                    {t.nama[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{t.nama}</p>
                    <p className="text-xs text-gray-500">{t.peran}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-6 bg-[#1a3a1a] text-center relative overflow-hidden">
        {/* Background Decorative Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#b5e550] rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Siap Mengubah <br className="md:hidden" /> Limbah Jadi Nilai?
          </h2>
          <p className="text-green-200/80 text-base mb-10 max-w-lg mx-auto">
            Dapatkan update mingguan seputar teknologi tani dan peluang pasar. Bergabunglah dengan ribuan petani modern lainnya.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/login"
              className="bg-[#b5e550] text-green-950 font-bold px-10 py-4 rounded-full hover:shadow-[0_0_20px_rgba(181,229,80,0.4)] transition"
            >
              Daftar Sebagai Petani
            </Link>
            <Link
              href="/login"
              className="bg-transparent border-2 border-white text-white font-bold px-10 py-4 rounded-full hover:bg-white hover:text-green-950 transition"
            >
              Daftar Sebagai Mitra
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}