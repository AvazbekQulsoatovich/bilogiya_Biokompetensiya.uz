"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Microscope, BrainCircuit, Star, Trophy, Target,
  TrendingUp, Flame, Play, CheckCircle2, LayoutGrid, Lightbulb,
  Gamepad2, Library, FileText, ArrowRight, FlaskConical, Scroll
} from "lucide-react";
import Link from "next/link";

const MODULES = [
  {
    title: "Mavzular",
    desc: "Barcha nazariy mavzularni o'qib o'rganing.",
    href: "/topics",
    icon: <BookOpen className="w-7 h-7" />,
    color: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    title: "Darsliklar",
    desc: "Elektron darsliklar va qo'llanmalar.",
    href: "/books",
    icon: <Scroll className="w-7 h-7" />,
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    title: "Testlar",
    desc: "Bilimlaringizni sinovdan o'tkazing.",
    href: "/quizzes",
    icon: <CheckCircle2 className="w-7 h-7" />,
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    title: "Laboratoriyalar",
    desc: "Virtual tajribalar va amaliy mashg'ulotlar.",
    href: "/labs",
    icon: <FlaskConical className="w-7 h-7" />,
    color: "from-green-500 to-teal-500",
    bg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "3D Modellar",
    desc: "Biologik obyektlarning uch o'lchamli ko'rinishlari.",
    href: "/models",
    icon: <Target className="w-7 h-7" />,
    color: "from-purple-500 to-indigo-500",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Krossvordlar",
    desc: "Biologik atamalar bilan boshqotirmalar.",
    href: "/crosswords",
    icon: <LayoutGrid className="w-7 h-7" />,
    color: "from-cyan-500 to-sky-500",
    bg: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    title: "O'yinlar",
    desc: "O'ynash orqali bilimlarni mustahkamlang.",
    href: "/games",
    icon: <Gamepad2 className="w-7 h-7" />,
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    title: "Lug'at",
    desc: "Biologik atamalar va ularning izohlari.",
    href: "/glossary",
    icon: <Library className="w-7 h-7" />,
    color: "from-rose-500 to-red-500",
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    title: "Qiziqarli faktlar",
    desc: "Biologiya olamidagi hayratlanarli faktlar.",
    href: "/facts",
    icon: <Lightbulb className="w-7 h-7" />,
    color: "from-amber-500 to-yellow-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "Qo'shimcha topshiriqlar",
    desc: "Darsdan tashqari kengaytirilgan vazifalar.",
    href: "/extracurricular",
    icon: <FileText className="w-7 h-7" />,
    color: "from-teal-500 to-emerald-500",
    bg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    title: "Interaktiv mashqlar",
    desc: "Mikroskop, kimyo va simulyatsiya tajribalari.",
    href: "/labs",
    icon: <Microscope className="w-7 h-7" />,
    color: "from-sky-500 to-blue-500",
    bg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
];

export default function DashboardHome() {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/progress`, {
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
  const progressPercent = progress ? Math.min((progress.totalXp / nextLevelXp) * 100, 100) : 0;
  const xpLeft = progress ? nextLevelXp - progress.totalXp : 500;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-10">

      {/* ── HERO BANNER ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2.5rem] overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #2563eb 45%, #0ea5e9 100%)"
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #93c5fd 0%, transparent 70%)" }} />
        <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #e0f2fe 0%, transparent 70%)" }} />

        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Biologiya o'quv platformasi
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Xush kelibsiz,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-sky-200">
                O'quvchi!
              </span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed">
              Biologiya fanini qiziqarli usulda o'rganing. 3D modellar,
              virtual laboratoriyalar, testlar va o'yinlar sizni kutmoqda.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/topics"
                className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-7 py-3.5 rounded-2xl transition-all hover:scale-105 shadow-xl"
              >
                <Play className="w-5 h-5 fill-white" /> O'qishni boshlash
              </Link>
              <Link
                href="/quizzes"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-2xl transition-all backdrop-blur-sm"
              >
                Test ishlash <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-1 gap-4 md:w-48">
            {[
              { icon: <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />, value: progress?.totalXp ?? "—", label: "Umumiy XP" },
              { icon: <Trophy className="w-5 h-5 text-blue-400" />, value: progress ? `${progress.level}-daraja` : "—", label: "Daraja" },
              { icon: <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />, value: progress ? `${progress.streak} kun` : "—", label: "Ketma-ketlik" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center">
                {s.icon}
                <span className="text-white font-black text-xl mt-1">{s.value}</span>
                <span className="text-gray-400 text-xs font-medium mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* XP Progress bar */}
        {progress && (
          <div className="relative z-10 px-8 md:px-12 pb-8">
            <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
              <span>{progress.level}-daraja · {progress.totalXp} XP</span>
              <span>{progress.level + 1}-darajaga {xpLeft} XP qoldi</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* ── MODULES GRID ── */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-emerald-500" />
          Bo'limlar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {MODULES.map((mod, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Link
                href={mod.href}
                className="group flex flex-col h-full bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Icon */}
                <div className={`w-14 h-14 ${mod.bg} rounded-2xl flex items-center justify-center mb-5 ${mod.iconColor} group-hover:scale-110 transition-transform`}>
                  {mod.icon}
                </div>

                {/* Gradient top bar appears on hover */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r ${mod.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                <h3 className="font-black text-gray-900 text-base mb-2 group-hover:text-emerald-600 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{mod.desc}</p>

                <div className={`mt-5 inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r ${mod.color} bg-clip-text text-transparent`}>
                  Kirish <ArrowRight className="w-3.5 h-3.5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
