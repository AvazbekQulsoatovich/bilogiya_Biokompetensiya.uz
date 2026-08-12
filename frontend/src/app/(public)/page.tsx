"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Globe, Gamepad2, FlaskConical, BookMarked, Microscope } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  const { scrollY } = useScroll();
  // Navbar har doim ko'rinadi
  // Tepada — shaffof (video orqali ko'rinadi)
  // Pastga tushganda — oq fon, qaytarilgan burchaklar
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
  });

  const features = [
    { title: "3D Modellar", description: "Hujayra, DNK, amyoba va boshqa biologik ob'yektlarning uch o'lchamli ko'rinishlari.", icon: <Globe className="w-8 h-8" />, gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50", iconColor: "text-blue-600", href: "/models" },
    { title: "Virtual Laboratoriya", description: "Xavfsiz muhitda mikroskop, kimyo va simulyatsiya tajribalari.", icon: <Microscope className="w-8 h-8" />, gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", iconColor: "text-emerald-600", href: "/labs" },
    { title: "Test Topshiriqlari", description: "5–6-sinf biologiyasi bo'yicha 100+ savol bilan bilimingizni tekshiring.", icon: <BookMarked className="w-8 h-8" />, gradient: "from-orange-500 to-amber-600", bg: "bg-orange-50", iconColor: "text-orange-600", href: "/quizzes" },
    { title: "Interaktiv O'yinlar", description: "Biologiya atamalarini o'ynash orqali qiziqarli tarzda o'rganing.", icon: <Gamepad2 className="w-8 h-8" />, gradient: "from-pink-500 to-rose-600", bg: "bg-pink-50", iconColor: "text-pink-600", href: "/games" },
  ];

  const previewCards = [
    { label: "3D Hujayra modeli", image: "/images/plant_cell_3d_1786544055211.jpg" },
    { label: "Infuzoriya-tufelka", image: "/images/paramecium_3d_1786544182313.jpg" },
    { label: "Bargning ichki tuzilishi", image: "/images/leaf_structure_3d_1786544229321.jpg" },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ═══ NAVBAR ═══
          - Dastlab yo'q (opacity 0, y: -100%)
          - 80px pastga tushganda paydo bo'ladi va qaytmaydi
          - Pastki burchaklar qaytarilgan, chiroyli soya
      */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottomLeftRadius: scrolled ? "40px" : "0px",
          borderBottomRightRadius: scrolled ? "40px" : "0px",
          boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.12)" : "none",
          transition: "background 0.4s, border-radius 0.4s, box-shadow 0.4s, backdrop-filter 0.4s",
        }}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-14">
          <div className="flex items-center justify-between" style={{ height: "80px" }}>

            {/* Logo — shaffof holatda oq, oq navbarda normal */}
            <div style={{
              transform: "scale(2.2)",
              transformOrigin: "left center",
              filter: scrolled ? "none" : "brightness(0) invert(1)",
              transition: "filter 0.4s"
            }}>
              <Logo />
            </div>

            {/* Havolalar — qora, katta */}
            <div className="hidden lg:flex items-center gap-9">
              {[
                { label: "Asosiy", href: "/dashboard" },
                { label: "Mavzular", href: "/topics" },
                { label: "Laboratoriyalar", href: "/labs" },
                { label: "3D Modellar", href: "/models" },
              ].map(item => (
                <Link key={item.label} href={item.href}
                  className={`relative text-xl font-black tracking-tight transition-colors group py-1 ${
                    scrolled ? "text-gray-900 hover:text-emerald-600" : "text-white hover:text-emerald-300"
                  }`}>
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 rounded-full transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Tugmalar */}
            <div className="flex items-center gap-4">
              <Link href="/admin" className={`text-sm font-semibold transition-colors ${
                scrolled ? "text-gray-400 hover:text-gray-700" : "text-white/80 hover:text-white"
              }`}>
                Admin
              </Link>
              <Link href="/dashboard"
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg shadow-emerald-500/25 text-sm">
                Boshlash <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ═══ HERO — to'liq ekran, navbar yo'q tepada ═══ */}
      <section className="relative overflow-hidden" style={{ minHeight: "100vh" }}>
        <div className="absolute inset-0 z-0 bg-gray-950">
          <video autoPlay loop muted playsInline
            className="w-full h-full object-cover" style={{ opacity: 0.82 }}>
            <source src="/bg-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, rgba(2,8,18,0.80) 0%, rgba(2,8,18,0.35) 55%, rgba(2,8,18,0.18) 100%)"
          }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center" style={{ minHeight: "100vh" }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">

            {/* CHAP — matn */}
            <div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 px-4 py-2 rounded-full text-sm font-bold tracking-wider uppercase mb-8">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Biologiya o'quv platformasi
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="font-black text-white leading-[1.05] mb-6"
                style={{ fontSize: "clamp(3.5rem, 6vw, 6rem)" }}>
                Zamonaviy<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Biologiya
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="text-gray-200 leading-relaxed mb-10 max-w-md font-medium"
                style={{ fontSize: "1.2rem" }}>
                Maktab o'quvchilari uchun maxsus ishlab chiqilgan —
                3D modellar, virtual laboratoriyalar va qiziqarli
                o'yinlar bilan to'liq o'quv platformasi.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
                className="flex flex-wrap gap-4 mb-12">
                <Link href="/dashboard"
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-9 py-4 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-emerald-500/30 text-lg">
                  Platformaga kirish <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="#features"
                  className="flex items-center bg-white/12 hover:bg-white/20 border border-white/25 text-white font-bold px-9 py-4 rounded-2xl transition-all backdrop-blur-sm text-lg">
                  Ko'proq ma'lumot
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex gap-10">
                {[{ num: "100+", label: "Test savoli" }, { num: "50+", label: "Qiziqarli fakt" }, { num: "10+", label: "Krossvord" }].map(s => (
                  <div key={s.label}>
                    <div className="text-4xl font-black text-white">{s.num}</div>
                    <div className="text-sm text-gray-300 mt-1 font-semibold">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* O'NG — preview kartalar */}
            <div className="hidden lg:flex flex-col gap-4">
              {previewCards.map((card, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.13, type: "spring", stiffness: 85 }}
                  className="flex items-center gap-4 bg-white/10 hover:bg-white/18 border border-white/15 rounded-2xl p-4 group transition-all cursor-pointer backdrop-blur-md shadow-xl">
                  <div className="w-24 h-18 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/15" style={{ height: "72px" }}>
                    <img src={card.image} alt={card.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-base">{card.label}</p>
                    <p className="text-white/50 text-sm mt-1">Interaktiv 3D ko'rinish</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-emerald-500 transition-all">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="inline-block bg-emerald-50 text-emerald-600 font-bold uppercase tracking-widest text-sm px-5 py-2 rounded-full mb-5">
              Platforma haqida
            </span>
            <h2 className="text-5xl font-black text-gray-900 mb-5">Platforma imkoniyatlari</h2>
            <p className="text-gray-600 text-xl max-w-xl mx-auto">
              Biologiyani yangi usulda o'rganing — ko'rgazmali, interaktiv va qiziqarli.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}>
                <Link href={f.href}
                  className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${f.gradient}`} />
                  <div className="p-8 flex flex-col flex-1">
                    <div className={`w-16 h-16 ${f.bg} ${f.iconColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      {f.icon}
                    </div>
                    <h3 className="font-black text-gray-900 text-xl mb-3">{f.title}</h3>
                    <p className="text-gray-500 leading-relaxed flex-1 text-base">{f.description}</p>
                    <div className="mt-6 flex items-center gap-2 text-base font-bold text-emerald-600">
                      Ko'rish <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #064e3b 100%)"
      }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #34d399, transparent 70%)", transform: "translate(30%, -30%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-14 py-20">
          <div className="flex flex-col md:flex-row items-start justify-between gap-14 mb-14">

            {/* Logo + tavsif */}
            <div className="flex flex-col gap-6 max-w-sm">
              {/* Logo oq fonda katta ko'rinadi */}
              <div className="bg-white rounded-3xl p-6 inline-flex w-fit shadow-xl" style={{ minWidth: "240px", minHeight: "140px", alignItems: "center", justifyContent: "center" }}>
                <div style={{ transform: "scale(3.2)", transformOrigin: "center center", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "80px" }}>
                  <Logo />
                </div>
              </div>
              <p className="text-gray-300 text-base leading-relaxed">
                Maktab o'quvchilari uchun biologiya fanini interaktiv va
                qiziqarli tarzda o'rgatuvchi zamonaviy platforma.
              </p>
            </div>

            {/* Havolalar */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-base mb-2 uppercase tracking-wider">Bo'limlar</h4>
              {[
                { label: "Asosiy sahifa", href: "/dashboard" },
                { label: "Mavzular", href: "/topics" },
                { label: "Laboratoriyalar", href: "/labs" },
                { label: "3D Modellar", href: "/models" },
                { label: "Testlar", href: "/quizzes" },
                { label: "O'yinlar", href: "/games" },
              ].map(item => (
                <Link key={item.label} href={item.href}
                  className="text-gray-400 hover:text-white text-base font-medium transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Platforma haqida */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-base mb-2 uppercase tracking-wider">Platforma</h4>
              {[
                { label: "Lug'at", href: "/glossary" },
                { label: "Krossvordlar", href: "/crosswords" },
                { label: "Qiziqarli faktlar", href: "/facts" },
                { label: "Darsliklar", href: "/books" },
              ].map(item => (
                <Link key={item.label} href={item.href}
                  className="text-gray-400 hover:text-white text-base font-medium transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/10 mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-base">© {new Date().getFullYear()} Biokompetensiya. Barcha huquqlar himoyalangan.</p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-gray-400 text-base font-medium">Platforma faol ishlayapti</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
