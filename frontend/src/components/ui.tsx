"use client";

import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SearchX } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ───────── Sahifa sarlavhasi ───────── */
export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  actions,
  children,
}: {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="mb-8 md:mb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div className="flex items-start gap-4 min-w-0">
          {Icon && (
            <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-brand-soft text-brand flex items-center justify-center">
              <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.8} />
            </div>
          )}
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink leading-tight">{title}</h1>
            {subtitle && <p className="text-muted mt-2 max-w-2xl text-[0.98rem]">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
      {children && <div className="mt-6">{children}</div>}
    </header>
  );
}

/* ───────── Sahifa konteyneri ───────── */
export function Page({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10 ${narrow ? "max-w-4xl" : "max-w-7xl"}`}>
      {children}
    </div>
  );
}

/* ───────── Segment tablar ───────── */
export function Segmented<T extends string | number>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; hint?: string }[];
  label?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="seg max-w-full overflow-x-auto">
      {options.map((o) => (
        <button
          key={String(o.value)}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
          {o.hint && <span className="hidden sm:inline text-xs font-medium opacity-70 ml-1.5">{o.hint}</span>}
        </button>
      ))}
    </div>
  );
}

/* ───────── Yuklanmoqda ───────── */
export function Loading({ label = "Yuklanmoqda…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted" role="status" aria-live="polite">
      <div className="spinner" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton h-48" />
      ))}
    </div>
  );
}

/* ───────── Bo‘sh holat ───────── */
export function EmptyState({
  icon: Icon = SearchX,
  title,
  text,
}: {
  icon?: LucideIcon;
  title: string;
  text?: string;
}) {
  return (
    <div className="card border-dashed text-center py-16 px-6 max-w-xl mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-surface-2 text-muted flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7" strokeWidth={1.6} />
      </div>
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      {text && <p className="text-muted mt-1.5">{text}</p>}
    </div>
  );
}

/* ───────── XP belgisi ───────── */
export function XpBadge({ value }: { value: number | string }) {
  return <span className="chip chip-accent">★ +{value} XP</span>;
}

/* ───────── Modal ───────── */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            className="card w-full max-w-md p-6 md:p-7 relative shadow-[var(--shadow-lg)]"
          >
            <button onClick={onClose} aria-label="Yopish" className="absolute top-4 right-4 p-2 rounded-lg text-muted hover:bg-surface-2">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-display text-2xl font-semibold text-ink mb-4 pr-8">{title}</h2>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-semibold text-ink-2 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

/* ───────── Orqaga havola ───────── */
export function BackButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className="btn btn-ghost btn-sm mb-6">
      ← {children}
    </button>
  );
}
