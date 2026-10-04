"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen, BookMarked, Microscope, Box, ClipboardList, Grid3x3, Gamepad2, Library,
  Lightbulb, FileText, ArrowRight, Play,
} from "lucide-react";
import { Page } from "@/components/ui";

const MODULES = [
  { title: "Mavzular", desc: "Darslik mavzulari, video va qoʻshimcha fayllar.", href: "/topics", icon: BookOpen },
  { title: "Darsliklar", desc: "Elektron darsliklarni oʻqing yoki yuklab oling.", href: "/books", icon: BookMarked },
  { title: "Virtual laboratoriyalar", desc: "Tajribalarni bosqichma-bosqich bajaring.", href: "/labs", icon: Microscope },
  { title: "3D modellar", desc: "Hujayra, DNK va organizmlar tuzilishi.", href: "/models", icon: Box },
  { title: "Test topshiriqlari", desc: "Bilimingizni mavzular boʻyicha tekshiring.", href: "/quizzes", icon: ClipboardList },
  { title: "Krossvordlar", desc: "Atamalarni krossvord orqali mustahkamlang.", href: "/crosswords", icon: Grid3x3 },
  { title: "Interaktiv oʻyinlar", desc: "Xotira, soʻz topish va “toʻgʻri/notoʻgʻri”.", href: "/games", icon: Gamepad2 },
  { title: "Lugʻat", desc: "Biologik atamalar va ularning izohlari.", href: "/glossary", icon: Library },
  { title: "Darsdan tashqari", desc: "Mustaqil izlanish topshiriqlari.", href: "/extracurricular", icon: FileText },
];

export default function DashboardHome() {
  const [fact, setFact] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    fetch("/api/facts")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        const list = Array.isArray(d) ? d : d?.facts || [];
        if (list.length) setFact(list[Math.floor(Math.random() * list.length)]);
      })
      .catch(() => {});
  }, []);

  return (
    <Page>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[1.75rem] bg-[#0a2a1f] text-white p-6 sm:p-8 md:p-12 mb-10"
      >
        <div
          className="absolute inset-0 opacity-80"
          style={{ background: "radial-gradient(60% 100% at 90% 0%, rgba(62,207,155,0.3), transparent 70%)" }}
        />
        <div className="relative grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <p className="eyebrow !text-emerald-300 mb-3">Biokompetensiya</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">Xush kelibsiz, oʻquvchi!</h1>
            <p className="text-white/75 mt-4 max-w-lg leading-relaxed">
              Mavzuni oʻrganing, laboratoriyada tajriba oʻtkazing va testlar bilan bilimingizni mustahkamlang.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/topics" className="btn btn-lg !bg-emerald-400 !text-[#04140d] hover:!bg-emerald-300">
                <Play className="w-4 h-4 fill-current" /> Oʻqishni boshlash
              </Link>
              <Link href="/labs" className="btn btn-lg border border-white/30 text-white hover:bg-white/10">
                Laboratoriyaga oʻtish
              </Link>
            </div>
          </div>

          {fact && (
            <aside className="rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur p-6">
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-amber-300 mb-3">
                <Lightbulb className="w-4 h-4" /> Bugungi fakt
              </p>
              <h2 className="font-display text-xl font-semibold mb-2">{fact.title}</h2>
              <p className="text-white/75 text-sm leading-relaxed line-clamp-5">{fact.content}</p>
              <Link href="/facts" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300 mt-4 hover:underline">
                Barcha faktlar <ArrowRight className="w-4 h-4" />
              </Link>
            </aside>
          )}
        </div>
      </motion.section>

      <div className="mb-6">
        <p className="eyebrow mb-1.5">Boʻlimlar</p>
        <h2 className="font-display text-2xl md:text-3xl font-semibold">Nimani oʻrganmoqchisiz?</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MODULES.map((m, i) => (
          <motion.div key={m.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Link href={m.href} className="card card-hover group flex items-start gap-4 p-6 h-full">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand-soft text-brand flex items-center justify-center">
                <m.icon className="w-6 h-6" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold leading-snug">{m.title}</h3>
                <p className="text-muted text-sm mt-1">{m.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted ml-auto mt-1 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </motion.div>
        ))}
      </div>
    </Page>
  );
}
