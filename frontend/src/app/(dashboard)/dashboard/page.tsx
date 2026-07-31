"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Microscope, BrainCircuit, Star, Trophy, Target, TrendingUp, Flame, Play, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DashboardHome() {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/progress", {
        headers: { ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
      });
      if (res.ok) {
        setProgress(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextLevelXp = progress ? progress.level * 500 : 500;
  const progressPercent = progress ? (progress.totalXp / nextLevelXp) * 100 : 0;
  const xpLeft = progress ? nextLevelXp - progress.totalXp : 500;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 border border-border/50 relative overflow-hidden mb-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/20 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-2">
            Xush kelibsiz, <span className="text-primary-500">O'quvchi!</span> 👋
          </h1>
          <p className="text-foreground/70 text-lg mb-6 max-w-2xl">
            Biologiya olamiga sayohatingizni davom ettirishga tayyormisiz? Yangi mavzular va qiziqarli tajribalar sizni kutmoqda. Har bir o'qilgan mavzu va yechilgan test sizga yangi ballar olib keladi!
          </p>
          <div className="flex gap-4">
            <Link href="/topics" className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-colors text-lg shadow-lg shadow-primary-500/30">
              <Play className="w-5 h-5 fill-white" /> O'qishni boshlash
            </Link>
          </div>
        </div>
      </motion.div>

      {/* HUGE STATISTICS SECTION */}
      {progress && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary-500" />
            Sizning Ko'rsatkichlaringiz
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* XP Card */}
            <div className="glass p-8 rounded-3xl border border-yellow-500/30 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Star className="w-48 h-48 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-6">
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-sm text-foreground/60 uppercase tracking-widest font-bold mb-2">Jami Topilgan XP</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-foreground">{progress.totalXp}</span>
                  <span className="text-xl font-bold text-yellow-500">ball</span>
                </div>
              </div>
            </div>

            {/* Level Card */}
            <div className="glass p-8 rounded-3xl border border-blue-500/30 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Trophy className="w-48 h-48 text-blue-500" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
                  <Trophy className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm text-foreground/60 uppercase tracking-widest font-bold mb-2">Hozirgi Daraja</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-foreground">{progress.level}</span>
                  <span className="text-xl font-bold text-blue-500">- daraja</span>
                </div>
              </div>
            </div>

            {/* Streak Card */}
            <div className="glass p-8 rounded-3xl border border-orange-500/30 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Flame className="w-48 h-48 text-orange-500 fill-orange-500" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6">
                  <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
                </div>
                <p className="text-sm text-foreground/60 uppercase tracking-widest font-bold mb-2">Uzviylik Seriyasi</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-foreground">{progress.streak}</span>
                  <span className="text-xl font-bold text-orange-500">kun</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="glass p-8 rounded-3xl border border-border/50 bg-background/30">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-xl font-bold">Keyingi darajaga o'tish</h3>
                <p className="text-foreground/60 mt-1">Sizga {progress.level + 1}-darajaga o'tish uchun yana <strong className="text-primary-500">{xpLeft} XP</strong> kerak bo'ladi.</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-primary-500">{Math.round(progressPercent)}%</span>
              </div>
            </div>
            <div className="w-full bg-background rounded-full h-6 border-2 border-border overflow-hidden p-1">
              <div 
                className="bg-gradient-primary h-full rounded-full relative transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <div className="flex justify-between text-sm font-bold text-foreground/50 mt-3">
              <span>{progress.level}-daraja ({progress.totalXp} XP)</span>
              <span>{progress.level + 1}-daraja ({nextLevelXp} XP)</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Access Modules */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Target className="w-6 h-6 text-primary-500" />
        Tezkor Bo'limlar
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/topics">
          <motion.div whileHover={{ y: -5 }} className="glass p-6 rounded-3xl border border-border/50 hover:border-primary-500/50 transition-colors cursor-pointer group h-full">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7 text-indigo-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Mavzular</h3>
            <p className="text-sm text-foreground/60">Barcha nazariy bilimlarni shu yerdan o'qib o'rganishingiz mumkin.</p>
          </motion.div>
        </Link>
        <Link href="/quizzes">
          <motion.div whileHover={{ y: -5 }} className="glass p-6 rounded-3xl border border-border/50 hover:border-green-500/50 transition-colors cursor-pointer group h-full">
            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-7 h-7 text-green-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Testlar</h3>
            <p className="text-sm text-foreground/60">Bilimlaringizni sinovdan o'tkazing va tezkor XP ballarini yig'ing.</p>
          </motion.div>
        </Link>
        <Link href="/labs">
          <motion.div whileHover={{ y: -5 }} className="glass p-6 rounded-3xl border border-border/50 hover:border-blue-500/50 transition-colors cursor-pointer group h-full">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Microscope className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Laboratoriya</h3>
            <p className="text-sm text-foreground/60">Amaliy vizual tajribalarni mustaqil ravishda bajarib ko'ring.</p>
          </motion.div>
        </Link>
        <Link href="/crosswords">
          <motion.div whileHover={{ y: -5 }} className="glass p-6 rounded-3xl border border-border/50 hover:border-purple-500/50 transition-colors cursor-pointer group h-full">
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-7 h-7 text-purple-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Krossvordlar</h3>
            <p className="text-sm text-foreground/60">Boshqotirmalarni yechib, xotirani charxlang.</p>
          </motion.div>
        </Link>
      </div>

    </div>
  );
}
