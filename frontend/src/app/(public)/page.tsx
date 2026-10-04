"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight, Box, Microscope, ClipboardList, Gamepad2, BookOpen,
  Sparkles, ShieldCheck, Target, Layers, Lightbulb,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

/** Mikroskop ostidagi hujayralarni eslatuvchi sekin suzuvchi shakllar. */
function CellBackdrop() {
  const cells = Array.from({ length: 16 }, (_, i) => ({
    x: (i * 53) % 100,
    y: (i * 37 + 11) % 100,
    r: 60 + ((i * 29) % 120),
    d: 14 + ((i * 7) % 16),
    delay: -((i * 3) % 14),
  }));
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_70%_30%,#0f3d2e_0%,#06110d_70%)]" />
      {cells.map((c, i) => (
        <span
          key={i}
          className="absolute rounded-full border border-emerald-300/20"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: c.r,
            height: c.r,
            background: "radial-gradient(circle at 35% 30%, rgba(110,227,184,0.22), rgba(110,227,184,0.04) 60%, transparent 70%)",
            animation: `drift ${c.d}s ${c.delay}s ease-in-out infinite`,
          }}
        >
          <span className="absolute rounded-full bg-emerald-300/25" style={{ width: c.r * 0.28, height: c.r * 0.28, left: "38%", top: "36%" }} />
        </span>
      ))}
    </div>
  );
}

const NAV = [
  { label: "Mavzular", href: "/topics" },
  { label: "Laboratoriyalar", href: "/labs" },
  { label: "3D modellar", href: "/models" },
  { label: "Testlar", href: "/quizzes" },
];

const STATS = [
  { num: "190", label: "test savoli" },
  { num: "8", label: "virtual laboratoriya" },
  { num: "6", label: "interaktiv model" },
  { num: "93", label: "biologik atama" },
];

const FEATURES = [
  {
    title: "Virtual laboratoriyalar",
    text: "Mikroskop, osmos, fotosintez va boshqa tajribalarni xavfsiz muhitda oʻzingiz bajaring: har bir qadam tekshiriladi.",
    icon: Microscope,
    href: "/labs",
    span: "lg:col-span-2",
  },
  {
    title: "3D modellar",
    text: "Hujayra, DNK va organizmlarning tuzilishini qismlarga ajratib, oʻzbekcha izohlar bilan oʻrganing.",
    icon: Box,
    href: "/models",
    span: "",
  },
  {
    title: "Mavzular va darsliklar",
    text: "Darslik mazmuniga mos, tartibli mavzular, video va qoʻshimcha fayllar.",
    icon: BookOpen,
    href: "/topics",
    span: "",
  },
  {
    title: "Test topshiriqlari",
    text: "Har bir mavzu boʻyicha savollar; natija va toʻplangan ball darhol koʻrinadi.",
    icon: ClipboardList,
    href: "/quizzes",
    span: "",
  },
  {
    title: "Krossvord va oʻyinlar",
    text: "Atamalarni oʻynab yodlash: xotira, soʻz topish, “toʻgʻri yoki notoʻgʻri”.",
    icon: Gamepad2,
    href: "/games",
    span: "lg:col-span-2",
  },
];

const STEPS = [
  { icon: BookOpen, title: "Oʻrganing", text: "Mavzuni oʻqing, video va 3D modellar bilan tuzilishni tushunib oling." },
  { icon: Microscope, title: "Sinab koʻring", text: "Virtual laboratoriyada tajribani oʻzingiz bajaring va natijani kuzating." },
  { icon: Target, title: "Mustahkamlang", text: "Test, krossvord va oʻyinlar bilan bilimingizni tekshirib, ball toʻplang." },
];

export default function LandingPage() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* ───────── Navigatsiya ───────── */}
      <header
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${
          scrolled ? "bg-surface/90 backdrop-blur-xl border-b border-line shadow-[var(--shadow-sm)]" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-[72px] flex items-center justify-between">
          <div className="bg-white rounded-xl px-3 py-1.5 shadow-[var(--shadow-sm)]">
            <Logo variant="full" size={44} />
          </div>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Asosiy">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`px-4 py-2 rounded-xl text-[0.95rem] font-semibold transition-colors ${
                  scrolled ? "text-ink-2 hover:bg-surface-2" : "text-white/90 hover:bg-white/10"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className={scrolled ? "" : "!bg-white/10 !border-white/20 !text-white hover:!bg-white/20"} />
            <Link href="/dashboard" className="btn btn-primary">
              Boshlash <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden bg-[#06110d] text-white">
        <CellBackdrop />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(4,16,11,0.85) 0%, rgba(4,16,11,0.5) 55%, rgba(4,16,11,0.15) 100%), radial-gradient(60% 80% at 80% 20%, rgba(62,207,155,0.18), transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-10 pt-36 pb-24 md:pt-44 md:pb-32 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-bold tracking-[0.14em] uppercase text-emerald-200 mb-7"
            >
              <Sparkles className="w-3.5 h-3.5" /> 5–6-sinf biologiyasi uchun
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="font-display font-semibold leading-[1.04] text-[clamp(2.6rem,6vw,5rem)]"
            >
              Biologiyani <em className="not-italic text-emerald-300">koʻrib, sinab</em> va
              tushunib oʻrganing
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="mt-6 max-w-xl text-lg text-white/80 leading-relaxed"
            >
              Biokompetensiya — mavzular, virtual laboratoriyalar, 3D modellar, testlar va oʻquv oʻyinlarini bir joyga
              jamlagan interaktiv platforma. Darslik mazmuniga mos, oʻzbek tilida.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link href="/dashboard" className="btn btn-primary btn-lg !bg-emerald-400 !text-[#04140d] hover:!bg-emerald-300">
                Platformaga kirish <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#imkoniyatlar" className="btn btn-lg border border-white/30 text-white hover:bg-white/10">
                Imkoniyatlar bilan tanishish
              </Link>
            </motion.div>
          </div>

          {/* Oʻng tomon: platforma qismlari */}
          <div className="hidden lg:grid gap-3">
            {[
              { icon: Microscope, t: "Mikroskop laboratoriyasi", s: "Preparat tayyorlash va kuzatish" },
              { icon: Box, t: "Hujayra va DNK modellari", s: "Qismlarni bosib oʻrganing" },
              { icon: ClipboardList, t: "Mavzuli testlar", s: "Natija va ball darhol" },
            ].map((c, i) => (
              <motion.div
                key={c.t}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.1, type: "spring", stiffness: 90 }}
                className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-md p-4"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-400/15 text-emerald-300 flex items-center justify-center">
                  <c.icon className="w-6 h-6" strokeWidth={1.7} />
                </div>
                <div>
                  <p className="font-semibold">{c.t}</p>
                  <p className="text-sm text-white/60">{c.s}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Statistika */}
        <div className="relative border-t border-white/10 bg-black/30 backdrop-blur">
          <dl className="max-w-7xl mx-auto px-5 lg:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="font-display text-3xl md:text-4xl font-semibold text-white">{s.num}</span>
                  <span className="block text-sm text-white/60">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────── Imkoniyatlar ───────── */}
      <section id="imkoniyatlar" className="py-24 md:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="max-w-2xl mb-14">
            <p className="eyebrow mb-3">Platforma imkoniyatlari</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
              Bitta joyda — toʻliq oʻquv jarayoni
            </h2>
            <p className="text-muted mt-4 text-lg">
              Nazariya, amaliyot va oʻzini tekshirish: oʻquvchi har bir bosqichni bir-biriga bogʻlangan holda bosib oʻtadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className={f.span}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={f.href} className="card card-hover group flex flex-col h-full p-7 min-h-[220px]">
                  <div className="w-12 h-12 rounded-2xl bg-brand-soft text-brand flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <f.icon className="w-6 h-6" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted leading-relaxed flex-1">{f.text}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                    Ochish <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Qanday ishlaydi ───────── */}
      <section className="py-24 md:py-28 bg-surface border-y border-line">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="max-w-2xl mb-14">
            <p className="eyebrow mb-3">Oʻqitish yondashuvi</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
              Bilimdan koʻnikmagacha: uch qadam
            </h2>
          </div>

          <ol className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative card p-7">
                <span className="absolute top-6 right-7 font-display text-6xl font-semibold text-line-strong/70 select-none">
                  {i + 1}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-brand text-brand-ink flex items-center justify-center mb-5">
                  <s.icon className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-muted leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 grid sm:grid-cols-3 gap-4 text-sm">
            {[
              { icon: ShieldCheck, t: "Ilmiy aniqlik", s: "Atamalar va izohlar darslik asosida" },
              { icon: Layers, t: "5 va 6-sinf", s: "Har bir sinf uchun alohida boʻlim" },
              { icon: Lightbulb, t: "Oʻz ustida ishlash", s: "Qoʻshimcha topshiriq va faktlar" },
            ].map((x) => (
              <div key={x.t} className="flex items-start gap-3">
                <x.icon className="w-5 h-5 text-brand mt-0.5 shrink-0" />
                <p>
                  <span className="font-semibold text-ink">{x.t}.</span> <span className="text-muted">{x.s}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-5 lg:px-10">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0a2a1f] text-white p-10 md:p-16 text-center">
            <div
              className="absolute inset-0 opacity-70"
              style={{ background: "radial-gradient(70% 90% at 50% 0%, rgba(62,207,155,0.35), transparent 70%)" }}
            />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight">
                Bugunoq birinchi tajribangizni bajaring
              </h2>
              <p className="text-white/75 mt-4 max-w-xl mx-auto text-lg">
                Roʻyxatdan oʻtish shart emas — platformaning barcha boʻlimlari ochiq.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/labs" className="btn btn-lg !bg-emerald-400 !text-[#04140d] hover:!bg-emerald-300">
                  <Microscope className="w-5 h-5" /> Laboratoriyaga kirish
                </Link>
                <Link href="/quizzes" className="btn btn-lg border border-white/30 text-white hover:bg-white/10">
                  Test ishlash
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Pastki qism ───────── */}
      <footer className="border-t border-line bg-surface">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-14 grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="inline-block bg-white rounded-xl px-3 py-2 border border-line">
              <Logo variant="full" size={52} />
            </div>
            <p className="text-muted mt-5 leading-relaxed">
              Maktab oʻquvchilari uchun biologiyani interaktiv, koʻrgazmali va tushunarli qilib oʻrgatadigan platforma.
            </p>
          </div>

          <div>
            <h4 className="eyebrow !text-ink mb-4">Oʻrganish</h4>
            <ul className="space-y-2.5 text-muted">
              {[
                ["Mavzular", "/topics"],
                ["Darsliklar", "/books"],
                ["Lugʻat", "/glossary"],
                ["Qiziqarli faktlar", "/facts"],
              ].map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="hover:text-brand transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow !text-ink mb-4">Amaliyot</h4>
            <ul className="space-y-2.5 text-muted">
              {[
                ["Virtual laboratoriyalar", "/labs"],
                ["3D modellar", "/models"],
                ["Testlar", "/quizzes"],
                ["Krossvordlar", "/crosswords"],
                ["Oʻyinlar", "/games"],
              ].map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="hover:text-brand transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-line">
          <p className="max-w-7xl mx-auto px-5 lg:px-10 py-5 text-sm text-muted">
            © {new Date().getFullYear()} Biokompetensiya. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </footer>
    </div>
  );
}
