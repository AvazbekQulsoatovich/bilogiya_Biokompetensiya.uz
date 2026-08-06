"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Microscope, ArrowRight, BrainCircuit, Activity, Globe } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  const features = [
    {
      title: "Zamonaviy 3D Modellar",
      description: "Biologik obyektlarni barcha tomondan o'rganish uchun interaktiv 3D vizualizatsiya.",
      icon: <Globe className="w-6 h-6 text-blue-500" />
    },
    {
      title: "Virtual Laboratoriyalar",
      description: "Xavfsiz va qiziqarli muhitda amaliy tajribalar o'tkazish imkoniyati.",
      icon: <Microscope className="w-6 h-6 text-green-500" />
    },
    {
      title: "Sun'iy Idrok Yordamchisi",
      description: "Tushunmagan joylaringizni tushuntirib beruvchi aqlli AI repetitor.",
      icon: <BrainCircuit className="w-6 h-6 text-purple-500" />
    },
    {
      title: "Gamifikatsiya tizimi",
      description: "Testlar ishlash va faollik uchun XP va tangalar yig'ib, darajangizni oshiring.",
      icon: <Activity className="w-6 h-6 text-orange-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Logo isDark={true} />
            </div>

            <div className="hidden lg:flex items-center gap-8">
              <Link href="/dashboard" className="text-white/80 hover:text-secondary-400 font-medium transition-colors">Asosiy</Link>
              <Link href="/topics" className="text-white/80 hover:text-secondary-400 font-medium transition-colors">Mavzular</Link>
              <Link href="/labs" className="text-white/80 hover:text-secondary-400 font-medium transition-colors">Laboratoriyalar</Link>
              <Link href="/models" className="text-white/80 hover:text-secondary-400 font-medium transition-colors">3D Modellar</Link>
              <Link href="/quizzes" className="text-white/80 hover:text-secondary-400 font-medium transition-colors">Testlar</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="text-white/80 hover:text-white font-medium px-4 py-2 transition-colors">
                Tizimga kirish
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-secondary-500 to-secondary-400 hover:from-secondary-400 hover:to-secondary-300 text-primary-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-secondary-500/20">
                Boshlash
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-24 pb-16 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-800 to-primary-900 border-b-4 border-secondary-500 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>
        
        {/* Floating Biology Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-20 text-primary-200/50"
          >
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M5 4.5l14 15"/><path d="M5 19.5l14-15"/><path d="M3.5 12h17"/></svg>
          </motion.div>
          <motion.div
            animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-40 right-20 text-secondary-500/30"
          >
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
          </motion.div>
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-40 right-40 text-primary-300/40"
          >
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M4.5 12.5l3-3a5 5 0 0 1 7.07 0l3 3M4.5 16.5l3-3a5 5 0 0 1 7.07 0l3 3M4.5 8.5l3-3a5 5 0 0 1 7.07 0l3 3"/></svg>
          </motion.div>
        </div>

        <div className="text-center py-24 px-4 max-w-7xl mx-auto relative z-10">
          <p className="inline-flex items-center gap-2 text-secondary-400 font-bold tracking-[0.2em] text-sm uppercase mb-6 px-4 py-1.5 bg-background/10 border border-white/20 rounded-full backdrop-blur-md">
            <Globe className="w-4 h-4" /> Ilmiy Ta'lim Platformasi
          </p>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold font-serif tracking-tight mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-100"
          >
            BIOLOGIYA
          </motion.h1>
          <div className="w-16 h-1 bg-secondary-500 mx-auto mb-6 rounded-full"></div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 italic font-serif"
          >
            Maktab o'quvchilari uchun maxsus ishlab chiqilgan, interaktiv 3D modellar, virtual laboratoriyalar va sun'iy idrokka asoslangan o'quv platformasi.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/register" className="flex items-center gap-2 bg-gradient-to-r from-secondary-500 to-secondary-400 text-primary-950 hover:shadow-[0_4px_20px_rgba(200,168,75,0.4)] hover:-translate-y-1 font-bold px-8 py-4 rounded-xl transition-all text-lg">
              Bepul boshlash <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-xl transition-all text-lg backdrop-blur-md">
              Ko'proq ma'lumot
            </Link>
          </motion.div>
        </div>
      </main>

        {/* Features Section */}
        <div id="features" className="py-24 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 relative">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary-700 dark:text-white inline-block pb-3 border-b-4 border-secondary-500">Platforma Imkoniyatlari</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col"
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-primary-600 to-primary-400"></div>
                <div className="p-8 text-center flex flex-col items-center flex-1">
                  <div className="w-16 h-16 bg-background rounded-full border border-border flex items-center justify-center mb-6 text-secondary-500 shadow-sm group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold font-serif text-primary-700 dark:text-white mb-3 group-hover:text-primary-500 transition-colors">{feature.title}</h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">{feature.description}</p>
                </div>
                <div className="bg-background/50 border-t border-border px-6 py-4 mt-auto text-center">
                  <span className="text-sm font-semibold text-secondary-600 dark:text-secondary-400 hover:underline cursor-pointer">Batafsil o'qish &rarr;</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      {/* Footer */}
      <footer className="glass border-t border-border/50 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-foreground/50">
          <p>&copy; {new Date().getFullYear()} Biokompetensiya. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </div>
  );
}
