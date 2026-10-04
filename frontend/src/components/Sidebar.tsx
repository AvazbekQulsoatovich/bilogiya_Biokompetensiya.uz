"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen, Microscope, ClipboardList, Library, Lightbulb, Gamepad2, Box,
  Menu, X, FileText, BookMarked, LayoutDashboard, Grid3x3, ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

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
      <div className="px-5 pt-6 pb-5">
        <div className="rounded-2xl bg-white border border-line px-4 py-3 flex items-center justify-center shadow-[var(--shadow-sm)]">
          <Logo variant="full" size={64} />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Asosiy menyu">
        {groups.map((g) => (
          <div key={g.label} className="mb-5">
            <p className="eyebrow px-3 mb-2 !text-muted">{g.label}</p>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.92rem] font-semibold transition-colors ${
                        active ? "bg-brand-soft text-brand" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-brand"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={active ? 2.2 : 1.8} />
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
        <div className="bg-white rounded-lg px-2 py-0.5 border border-line">
          <Logo variant="mark" size={30} />
        </div>
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
        className={`print-hide w-72 h-screen fixed left-0 top-0 z-50 bg-surface border-r border-line transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {content}
      </aside>
    </>
  );
}
