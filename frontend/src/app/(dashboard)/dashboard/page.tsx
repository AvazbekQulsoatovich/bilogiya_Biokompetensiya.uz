"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen, BookMarked, Microscope, Box, ClipboardList, Grid3x3, Gamepad2, Library,
  Lightbulb, FileText, ArrowRight, Play, Sparkles,
} from "lucide-react";
import { Page } from "@/components/ui";
import type { Tone } from "@/components/tones";

type Module = { title: string; desc: string; href: string; icon: typeof BookOpen; tone: Tone };

const GROUPS: { eyebrow: string; title: string; items: Module[] }[] = [
  {
    eyebrow: "Oʻrganish",
    title: "Bilim olish",
    items: [
      { title: "Mavzular", desc: "Darslik mavzulari, video darslar va qoʻshimcha fayllar.", href: "/topics", icon: BookOpen, tone: "green" },
      { title: "Darsliklar", desc: "Elektron darsliklarni oʻqing yoki yuklab oling.", href: "/books", icon: BookMarked, tone: "orange" },
      { title: "Lugʻat", desc: "Biologik atamalar va ularning ilmiy izohlari.", href: "/glossary", icon: Library, tone: "teal" },
      { title: "Qiziqarli faktlar", desc: "Tabiat sirlari haqida qisqa va qiziqarli maʼlumotlar.", href: "/facts", icon: Lightbulb, tone: "amber" },
    ],
  },
  {
    eyebrow: "Amaliyot",
    title: "Koʻrib va qoʻlda sinab",
    items: [
      { title: "3D modellar", desc: "Hujayra, DNK va organizmlar tuzilishini aylantirib koʻring.", href: "/models", icon: Box, tone: "violet" },
      { title: "Darsdan tashqari", desc: "Mustaqil izlanish va ijodiy topshiriqlar.", href: "/extracurricular", icon: FileText, tone: "blue" },
    ],
  },
  {
    eyebrow: "Sinov va mashq",
    title: "Bilimni mustahkamlash",
    items: [
      { title: "Test topshiriqlari", desc: "Har bir toʻgʻri javob uchun XP yigʻing.", href: "/quizzes", icon: ClipboardList, tone: "rose" },
      { title: "Krossvordlar", desc: "Atamalarni krossvord orqali eslab qoling.", href: "/crosswords", icon: Grid3x3, tone: "blue" },
      { title: "Interaktiv oʻyinlar", desc: "Xotira, soʻz topish va “toʻgʻri/notoʻgʻri”.", href: "/games", icon: Gamepad2, tone: "violet" },
    ],
  },
];

function Cells() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="xMaxYMid slice" aria-hidden>
      <defs>
        <radialGradient id="cg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3ecf9b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3ecf9b" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[
        [470, 90, 90], [540, 250, 60], [380, 300, 70], [300, 60, 40], [560, 40, 30],
      ].map(([x, y, r], i) => (
        <g key={i} className="anim-drift" style={{ animationDelay: `${i * -1.4}s` }}>
          <circle cx={x} cy={y} r={r * 1.7} fill="url(#cg)" />
          <circle cx={x} cy={y} r={r} fill="none" stroke="#6ee3b8" strokeOpacity="0.35" strokeWidth="1.5" />
          <circle cx={x + r * 0.2} cy={y - r * 0.1} r={r * 0.33} fill="#6ee3b8" fillOpacity="0.28" />
        </g>
      ))}
    </svg>
  );
}

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
      <section className="relative overflow-hidden rounded-[2rem] bg-[#082419] text-white p-6 sm:p-9 md:p-12 mb-8 isolate">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 90% at 88% 0%, rgba(62,207,155,0.28), transparent 70%), radial-gradient(40% 60% at 0% 110%, rgba(90,176,255,0.16), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(90% 100% at 70% 30%, #000 20%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(90% 100% at 70% 30%, #000 20%, transparent 80%)",
          }}
        />
        <div className="-z-10 hidden md:block"><Cells /></div>

        <div className="relative grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[0.72rem] font-bold tracking-[0.14em] uppercase text-emerald-300 mb-5">
              <Sparkles className="w-3.5 h-3.5" /> 5–6-sinf biologiyasi
            </p>
            <h1 className="font-display text-[2.1rem] sm:text-5xl md:text-[3.4rem] font-semibold leading-[1.06] text-balance">
              Xush kelibsiz, <span className="text-emerald-300">oʻquvchi!</span>
            </h1>
            <p className="text-white/75 mt-5 max-w-lg leading-relaxed text-[1.02rem]">
              Mavzuni oʻrganing, virtual laboratoriyada tajriba oʻtkazing va testlar bilan bilimingizni mustahkamlang.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/topics" className="btn btn-lg !bg-emerald-400 !text-[#04140d] hover:!bg-emerald-300 !shadow-[0_10px_30px_-10px_rgba(52,211,153,0.8)]">
                <Play className="w-4 h-4 fill-current" /> Oʻqishni boshlash
              </Link>
              <Link href="/labs" className="btn btn-lg border border-white/25 text-white hover:bg-white/10">
                <Microscope className="w-4 h-4" /> Laboratoriyaga oʻtish
              </Link>
            </div>
          </div>

          {fact && (
            <aside className="rounded-3xl border border-white/15 bg-white/[0.07] backdrop-blur-md p-6 md:p-7 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-amber-300 mb-3">
                <Lightbulb className="w-4 h-4" /> Bugungi fakt
              </p>
              <h2 className="font-display text-xl font-semibold mb-2 text-balance">{fact.title}</h2>
              <p className="text-white/75 text-sm leading-relaxed line-clamp-5">{fact.content}</p>
              <Link href="/facts" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300 mt-4 hover:underline">
                Barcha faktlar <ArrowRight className="w-4 h-4" />
              </Link>
            </aside>
          )}
        </div>
      </section>

      {/* Laboratoriya banneri */}
      <Link
        href="/labs"
        className="group relative flex flex-col sm:flex-row sm:items-center gap-5 overflow-hidden rounded-[1.75rem] p-6 md:p-8 mb-12 text-white isolate border border-[#17304a] bg-[#040a12]"
      >
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50% 120% at 0% 0%, rgba(46,230,192,0.22), transparent 65%), radial-gradient(40% 120% at 100% 100%, rgba(169,139,255,0.2), transparent 65%)",
          }}
        />
        <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#2ee6c0] to-[#5ab0ff] text-[#02161a] shadow-[0_10px_30px_-8px_rgba(46,230,192,0.7)]">
          <Microscope className="w-7 h-7" strokeWidth={1.9} />
        </div>
        <div className="min-w-0">
          <p className="text-[0.72rem] font-bold tracking-[0.16em] uppercase text-[#2ee6c0] mb-1">Yangi koʻrinish</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold">Virtual laboratoriyalar</h2>
          <p className="text-white/70 mt-1.5 max-w-xl text-sm md:text-base">
            Mikroskop, fotosintez, osmos, genetika va boshqa tajribalarni xavfsiz muhitda bosqichma-bosqich bajaring.
          </p>
        </div>
        <span className="sm:ml-auto inline-flex items-center gap-2 font-semibold text-[#2ee6c0] shrink-0">
          Boshlash <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>

      {/* Boʻlimlar */}
      <div className="space-y-12">
        {GROUPS.map((g) => (
          <section key={g.eyebrow}>
            <div className="mb-5">
              <p className="eyebrow mb-1">{g.eyebrow}</p>
              <h2 className="font-display text-2xl md:text-[1.75rem] font-semibold">{g.title}</h2>
            </div>
            <div className="stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {g.items.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  className={`tone-${m.tone} card card-hover group relative flex flex-col p-6 overflow-hidden`}
                >
                  <div
                    className="absolute -right-10 -top-10 w-36 h-36 rounded-full opacity-60 transition-opacity group-hover:opacity-100"
                    style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--brand) 18%, transparent), transparent)" }}
                    aria-hidden
                  />
                  <div className="tile w-12 h-12 mb-5 relative">
                    <m.icon className="w-6 h-6" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-display text-lg font-semibold leading-snug relative">{m.title}</h3>
                  <p className="text-muted text-sm mt-1.5 leading-relaxed relative">{m.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand relative">
                    Ochish <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Page>
  );
}
