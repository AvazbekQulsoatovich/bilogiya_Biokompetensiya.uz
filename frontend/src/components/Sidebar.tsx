"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen, Microscope, ClipboardList, Library, Lightbulb, Gamepad2, Box,
  Menu, X, FileText, BookMarked, LayoutDashboard, Grid3x3, ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { SECTION_TONE } from "./tones";

const groups = [
  {
    label: "Oʻrganish",
    items: [
      { name: "Asosiy sahifa", href: "/dashboard", icon: LayoutDashboard },
      { name: "Mavzular", href: "/topics", icon: BookOpen },
      { name: "Darsliklar", href: "/books", icon: BookMarked },
      { name: "Lugʻat", href: "/glossary", icon: Library },
      { name: "Qiziqarli faktlar", href: "/facts", icon: Lightbulb },
    ],
  },
  {
    label: "Amaliyot",
    items: [
      { name: "Virtual laboratoriyalar", href: "/labs", icon: Microscope },
      { name: "3D modellar", href: "/models", icon: Box },
      { name: "Darsdan tashqari", href: "/extracurricular", icon: FileText },
    ],
  },
  {
    label: "Sinov va mashq",
    items: [
      { name: "Test topshiriqlari", href: "/quizzes", icon: ClipboardList },
      { name: "Krossvordlar", href: "/crosswords", icon: Grid3x3 },
      { name: "Interaktiv oʻyinlar", href: "/games", icon: Gamepad2 },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setIsOpen(false), [pathname]);

  const content = (
    <div className="flex flex-col h-full">
      <Link href="/" className="mx-4 mt-5 mb-4 flex items-center gap-3 rounded-2xl border border-line bg-surface-2/60 p-3 hover:border-line-strong transition-colors" aria-label="Biokompetensiya — bosh sahifa">
        <span className="shrink-0 w-11 h-11 rounded-xl bg-white border border-line flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" width={30} height={30} style={{ height: 30, width: "auto" }} />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block font-display text-[1.05rem] font-semibold text-ink truncate">Biokompetensiya</span>
          <span className="block text-[0.7rem] font-semibold tracking-wide text-muted">5–6-sinf biologiya · .uz</span>
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Asosiy menyu">
        {groups.map((g) => (
          <div key={g.label} className="mb-4">
            <p className="px-3 mb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted">{g.label}</p>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                const tone = SECTION_TONE[item.href.slice(1)] ?? "green";
                return (
                  <li key={item.href} className={`tone-${tone}`}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex items-center gap-3 px-2.5 py-2 rounded-xl text-[0.92rem] font-semibold transition-colors ${
                        active ? "bg-brand-soft text-brand" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                      }`}
                    >
                      <span
                        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          active ? "bg-brand text-brand-ink shadow-[0_6px_14px_-6px_var(--brand)]" : "bg-brand-soft text-brand group-hover:bg-brand group-hover:text-brand-ink"
                        }`}
                      >
                        <Icon className="w-[17px] h-[17px]" strokeWidth={2} />
                      </span>
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-5 pt-3 border-t border-line">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted hover:bg-surface-2 hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-[18px] h-[18px]" /> Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden print-hide fixed top-0 inset-x-0 z-[60] h-14 flex items-center justify-between px-3 bg-bg/90 backdrop-blur-md border-b border-line">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Menyuni yopish" : "Menyuni ochish"}
          aria-expanded={isOpen}
          className="w-10 h-10 rounded-xl flex items-center justify-center border border-line bg-surface"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link href="/" className="flex items-center gap-2" aria-label="Bosh sahifa">
          <span className="bg-white rounded-lg p-1 border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="" width={26} height={26} style={{ height: 26, width: "auto" }} />
          </span>
          <span className="font-display font-semibold text-ink">Biokompetensiya</span>
        </Link>
        <ThemeToggle />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`print-hide w-72 h-screen fixed left-0 top-0 z-50 bg-surface border-r border-line shadow-[var(--shadow-sm)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {content}
      </aside>
    </>
  );
}
