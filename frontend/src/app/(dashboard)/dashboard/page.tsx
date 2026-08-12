"use client";

import { motion } from "framer-motion";
import {
  BookOpen, CheckCircle2, FlaskConical, Scroll,
  ArrowRight, Play
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const MODULES = [
  {
    title: "Mavzular",
    desc: "Barcha mavzuv mavzularni o'rganing.",
    href: "/topics",
    icon: BookOpen,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    linkColor: "text-blue-500",
  },
  {
    title: "Darsliklar",
    desc: "Elektron darsliklar va o'qish materiallari.",
    href: "/books",
    icon: Scroll,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    linkColor: "text-purple-500",
  },
  {
    title: "Testlar",
    desc: "Bilimingizni sinovdan o'tkazing.",
    href: "/quizzes",
    icon: CheckCircle2,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    linkColor: "text-orange-500",
  },
  {
    title: "Laboratoriyalar",
    desc: "Virtual tajribalar va amaliy mashg'ulotlar.",
    href: "/labs",
    icon: FlaskConical,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    linkColor: "text-green-500",
  },
];

export default function DashboardHome() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 bg-gray-50/50 min-h-screen">

      {/* ── HERO ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-stretch h-full">

          {/* Left: Content */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 w-fit bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Biologiya o'quv platformasi
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-[#1e293b] leading-tight mb-4">
              Xush kelibsiz, O'quvchi!
            </h1>
            <p className="text-gray-500 text-base max-w-md leading-relaxed mb-8">
              Biologiya fanini qiziqarli usulda o'rganing. 3D modellar, virtual
              laboratoriyalar, testlar va o'yinlar sizni kutmoqda.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/topics"
                className="inline-flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-md shadow-blue-200 hover:shadow-lg text-sm"
              >
                <Play className="w-4 h-4 fill-white" /> O'qishni boshlash
              </Link>
              <Link
                href="/quizzes"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm"
              >
                Test ishlash <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Generated Illustration */}
          <div className="hidden md:flex flex-1 items-center justify-center p-6 relative min-h-[300px]">
             {/* Using the generated image that perfectly matches the biology theme */}
             <div className="relative w-full h-full max-w-md" style={{ minHeight: "280px" }}>
               <Image 
                 src="/hero-illustration.jpg" 
                 alt="Biology education illustration" 
                 fill
                 className="object-contain"
                 priority
               />
             </div>
          </div>
        </div>
      </motion.div>

      {/* ── MODULES GRID ── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2"/>
            <circle cx="12" cy="12" r="4" fill="#22c55e"/>
            <circle cx="12" cy="4" r="2" fill="#4ade80"/>
            <circle cx="12" cy="20" r="2" fill="#4ade80"/>
            <circle cx="4" cy="12" r="2" fill="#4ade80"/>
            <circle cx="20" cy="12" r="2" fill="#4ade80"/>
          </svg>
          Bo'limlar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MODULES.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <Link
                  href={mod.href}
                  className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 h-full"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 ${mod.iconBg} rounded-xl flex items-center justify-center mb-5 ${mod.iconColor} transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-bold text-gray-900 text-base mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">
                    {mod.desc}
                  </p>

                  <div className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${mod.linkColor}`}>
                    Kirish <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
