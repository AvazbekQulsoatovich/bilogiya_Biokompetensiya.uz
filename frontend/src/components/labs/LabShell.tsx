"use client";

import type { ReactNode } from "react";
import { Check, FlaskConical } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type LabProps = {
  lab: any;
  steps: any[];
  completeLab: () => void;
  isCompleted: boolean;
};

function stepTitle(s: any, i: number) {
  if (typeof s === "string") return s;
  return s?.title || `${i + 1}-qadam`;
}
function stepText(s: any) {
  if (typeof s === "string") return "";
  return s?.instruction || "";
}

/** Tajriba oynasining umumiy maketi: chapda qadamlar, oʻngda ish maydoni. */
export function LabShell({
  heading,
  icon: Icon = FlaskConical,
  steps,
  current,
  done,
  children,
  aside,
}: {
  heading: string;
  icon?: LucideIcon;
  steps: any[];
  current: number;
  done: boolean;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[21rem_1fr] gap-6 items-start">
      <aside className="lab-panel p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-semibold flex items-center gap-2.5 mb-5">
          <span className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </span>
          {heading}
        </h2>

        <ol className="grid gap-2.5">
          {steps.map((s, i) => {
            const isDone = done || i < current;
            const isNow = !done && i === current;
            return (
              <li
                key={i}
                aria-current={isNow ? "step" : undefined}
                className={`flex gap-3.5 rounded-2xl border p-3.5 transition-all ${
                  isNow
                    ? "border-brand bg-brand-soft"
                    : isDone
                    ? "border-line bg-surface-2/60"
                    : "border-line bg-transparent opacity-60"
                }`}
              >
                <span
                  className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDone ? "bg-ok text-white" : isNow ? "bg-brand text-brand-ink" : "bg-surface-2 text-muted"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" strokeWidth={3} /> : i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm leading-snug">{stepTitle(s, i)}</p>
                  {stepText(s) && <p className="text-[0.82rem] text-muted mt-0.5 leading-relaxed">{stepText(s)}</p>}
                </div>
              </li>
            );
          })}
        </ol>

        {aside && <div className="mt-5 pt-5 border-t border-line">{aside}</div>}
      </aside>

      <section className="lab-panel p-5 md:p-8 min-h-[520px] relative overflow-hidden">{children}</section>
    </div>
  );
}

/** Natija / izoh qutisi */
export function Note({
  tone = "info",
  children,
}: {
  tone?: "info" | "ok" | "err" | "warn";
  children: ReactNode;
}) {
  const map = {
    info: "bg-info-soft text-info",
    ok: "bg-ok-soft text-ok",
    err: "bg-danger-soft text-danger",
    warn: "bg-accent-soft text-accent",
  } as const;
  return (
    <p role="status" className={`rounded-xl px-4 py-3 text-sm font-medium leading-relaxed ${map[tone]}`}>
      {children}
    </p>
  );
}

export function StageTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="font-display text-xl md:text-2xl font-semibold">{children}</h3>
      {sub && <p className="text-muted mt-1.5 max-w-2xl">{sub}</p>}
    </div>
  );
}

/** Kichik oʻlchov koʻrsatkichi (raqamli displey) */
export function Readout({ label, value, unit, tone = "brand" }: { label: string; value: ReactNode; unit?: string; tone?: "brand" | "accent" | "info" | "danger" }) {
  const c = { brand: "text-brand", accent: "text-accent", info: "text-info", danger: "text-danger" }[tone];
  return (
    <div className="rounded-2xl border border-line bg-surface-2 px-4 py-3 min-w-[7.5rem]">
      <p className="eyebrow !text-muted !text-[0.65rem] mb-0.5">{label}</p>
      <p className={`font-mono text-2xl font-bold tabular-nums ${c}`}>
        {value}
        {unit && <span className="text-sm font-semibold text-muted ml-1">{unit}</span>}
      </p>
    </div>
  );
}
