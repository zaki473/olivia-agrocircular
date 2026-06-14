"use client";

import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { ArrowRight, Leaf, BarChart3, Users, Sprout } from "lucide-react";

// --- Variabel Animasi Mewah ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function TentangKamiPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="min-h-screen bg-[#fafcf9] text-slate-900 selection:bg-[#b5e550] selection:text-green-950 overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative min-h-[80vh] md:h-[90vh] flex items-center overflow-hidden bg-black py-20 md:py-0">
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
          <img 
            src="https://ik.imagekit.io/p27ub3udc/agorcircular/Mask%20group.png" 
            className="w-full h-full object-cover opacity-50 scale-110"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#fafcf9]"></div>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#b5e550] text-xs md:text-sm font-medium mb-6">
              <Sprout size={14} className="md:w-4 md:h-4" />
              <span>Pionir Ekonomi Sirkular Indonesia</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl md:text-8xl font-bold text-white leading-[1.1] tracking-tight mb-6 md:mb-8">
              Masa Depan <br />
              <span className="text-[#b5e550] italic font-serif text-5xl sm:text-7xl md:text-9xl">Agrikultur.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-gray-300 text-base md:text-xl max-w-xl leading-relaxed mb-8 md:mb-10">
              Kami menjembatani teknologi dan tradisi untuk menciptakan ekosistem di mana setiap limbah memiliki nilai baru.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Link href="/login" className="group relative inline-flex bg-[#b5e550] text-green-950 px-8 md:px-10 py-3 md:py-4 rounded-full font-bold overflow-hidden transition-all shadow-xl hover:shadow-[#b5e550]/20 w-full sm:w-auto justify-center">
                <span className="relative z-10 flex items-center gap-2">
                  Mulai Sekarang <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div className="absolute inset-0 bg-white" initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.5 }} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="relative z-20 -mt-10 md:-mt-20 container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {[
            { v: "2.4k", l: "Ton Limbah", i: <Leaf className="text-[#b5e550]" /> },
            { v: "147", l: "Kg Karbon Ditekan", i: <BarChart3 className="text-[#b5e550]" /> },
            { v: "25k+", l: "Mitra Petani", i: <Users className="text-[#b5e550]" />, hideMobile: false },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white shadow-lg flex items-center gap-4 md:gap-6"
            >
              <div className="p-3 md:p-4 bg-green-50 rounded-xl md:rounded-2xl">{stat.i}</div>
              <div>
                <h4 className="text-2xl md:text-3xl font-bold text-green-950">{stat.v}</h4>
                <p className="text-xs md:text-sm text-gray-500 font-medium">{stat.l}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section className="py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[#4a7c44] font-bold tracking-widest uppercase text-[10px] md:text-sm mb-4 block text-center lg:text-left">
                Tentang Kami
              </motion.span>
              <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="text-3xl md:text-5xl font-bold text-green-950 mb-6 md:mb-8 leading-tight text-center lg:text-left">
                Menciptakan Harmoni <br className="hidden md:block" /> dalam Lingkaran Pertanian.
              </motion.h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 text-center lg:text-left">
                AgroCircular adalah standar baru dalam manajemen sumber daya agraris, memastikan tidak ada yang terbuang, dan setiap orang mendapatkan manfaat.
              </p>
              <div className="space-y-4 max-w-md mx-auto lg:mx-0">
                {['Sistem Barter Digital Terverifikasi', 'Logistik Limbah Terintegrasi', 'Analitik Dampak Lingkungan'].map((item, idx) => (
                  <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="flex items-center gap-3 font-semibold text-green-900 text-sm md:text-base">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#b5e550] rounded-full shrink-0" /> {item}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative h-[300px] sm:h-[400px] md:h-[500px] order-1 lg:order-2">
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-[70%] h-[180px] sm:h-[280px] md:h-[300px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl z-10 border-4 md:border-8 border-white"
              >
                <img src="https://ik.imagekit.io/p27ub3udc/agorcircular/Group%2017.png" className="w-full h-full object-cover" alt="agri" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 left-0 w-[70%] h-[180px] sm:h-[280px] md:h-[300px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl z-20 border-4 md:border-8 border-white"
              >
                <img src="https://ik.imagekit.io/p27ub3udc/agorcircular/Group%2019.png" className="w-full h-full object-cover" alt="agri" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOLUTIONS (BENTO BOX) --- */}
      <section className="py-16 md:py-24 bg-green-950 text-white rounded-[2rem] md:rounded-[3rem] mx-4 mb-10 overflow-hidden relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Solusi Terintegrasi</h2>
            <p className="text-green-200/60 text-sm md:text-base px-4">Tiga pilar utama dalam merevolusi cara Anda mengelola hasil tani.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { t: "Barter Mikro", d: "Tukarkan limbah dengan kebutuhan mitra sekitar secara presisi.", img: "Group%2018.png" },
              { t: "Jual ke Pabrik", d: "Akses langsung ke rantai pasok industri tanpa perantara.", img: "Group%2016.png" },
              { t: "Lapak Donasi", d: "Ciptakan dampak sosial dengan berbagi ke sesama.", img: "Rectangle%2057-2.png" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group bg-white/5 border border-white/10 p-2 rounded-[2rem] md:rounded-[2.5rem] transition-all"
              >
                <div className="h-48 md:h-64 rounded-[1.8rem] overflow-hidden mb-4 md:mb-6">
                  <img src={`https://ik.imagekit.io/p27ub3udc/agorcircular/${item.img}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="solusi" />
                </div>
                <div className="p-4 md:p-6 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{item.t}</h3>
                  <p className="text-green-100/60 text-xs md:text-sm leading-relaxed mb-6">{item.d}</p>
                  <div className="w-10 h-10 md:w-12 md:h-12 mx-auto md:mx-0 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#b5e550] group-hover:text-green-950 transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 md:py-40 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="container mx-auto px-6">
          <h2 className="text-4xl md:text-7xl font-bold text-green-950 mb-8 md:mb-10 tracking-tight leading-tight">
            Mari Menanam <br /> Kebaikan Bersama.
          </h2>
          <Link href="/login" className="inline-block bg-green-950 text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:scale-105 transition-all shadow-2xl">
            Gabung Sekarang
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}