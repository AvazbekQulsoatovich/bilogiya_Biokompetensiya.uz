"use client";

import type { ReactNode } from "react";
import { Check, FlaskConical, Clock, AlertTriangle, Lightbulb, Crosshair } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SoundToggle, fmtTime, type Run } from "./kit";

export type LabProps = {
  lab: any;
  steps: any[];
  completeLab: () => void;
  isCompleted: boolean;
  restart?: () => void;
};

function stepTitle(s: any, i: number) {
  if (typeof s === "string") return s;
  return s?.title || `${i + 1}-qadam`;
}
function stepText(s: any) {
  if (typeof s === "string") return "";
  return s?.instruction || "";
}

/**
 * Tajriba oynasining umumiy maketi — "boshqaruv markazi":
 * tepada bosqichlar chizigʻi va HUD, markazda katta sahna, oʻngda topshiriq paneli.
 */
export function LabShell({
  heading,
  icon: Icon = FlaskConical,
  steps,
  current,
  done,
  children,
  aside,
  run,
  hint,
  onHint,
  flush = false,
}: {
  heading: string;
  icon?: LucideIcon;
  steps: any[];
  current: number;
  done: boolean;
  children: ReactNode;
  aside?: ReactNode;
  run?: Run;
  hint?: string;
  onHint?: () => void;
  /** sahna ichki boʻshligʻini olib tashlash */
  flush?: boolean;
}) {
  const cur = Math.min(current, Math.max(steps.length - 1, 0));
  return (
    <div className="grid gap-4">
      {/* ── HUD: bosqichlar chizigʻi ── */}
      <div className="glass px-4 md:px-6 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0 shadow-[var(--glow)]">
            <Icon className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow !text-[0.6rem]">Faol tajriba</p>
            <p className="font-display font-semibold leading-tight truncate">{heading}</p>
          </div>
        </div>

        <ol className="flex-1 min-w-[16rem] flex items-center gap-2" aria-label="Bosqichlar">
          {steps.map((s, i) => {
            const isDone = done || i < current;
            const isNow = !done && i === current;
            return (
              <li key={i} aria-current={isNow ? "step" : undefined} className="flex items-center gap-2 flex-1 last:flex-none min-w-0">
                <span
                  title={stepTitle(s, i)}
                  className={`h-8 min-w-8 px-2.5 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold shrink-0 transition-all ${
                    isDone ? "bg-ok text-black" : isNow ? "bg-brand text-brand-ink shadow-[var(--glow)]" : "bg-surface-2 text-muted border border-line"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" strokeWidth={3} /> : i + 1}
                  {isNow && <span className="hidden lg:inline max-w-[8rem] truncate">{stepTitle(s, i)}</span>}
                </span>
                {i < steps.length - 1 && (
                  <span className="h-0.5 flex-1 rounded-full bg-line overflow-hidden min-w-3">
                    <span className="block h-full bg-ok transition-all duration-500" style={{ width: isDone ? "100%" : "0%" }} />
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <div className="flex items-center gap-2 text-sm font-mono font-semibold ml-auto">
          {run && (
            <>
              <span className="chip !bg-black/25" title="Vaqt"><Clock className="w-3.5 h-3.5 text-info" /> {fmtTime(run.elapsed)}</span>
              <span className={`chip !bg-black/25 ${run.mistakes ? "!text-danger" : ""}`} title="Xatolar"><AlertTriangle className="w-3.5 h-3.5" /> {run.mistakes}</span>
            </>
          )}
          <SoundToggle />
        </div>
      </div>

      {/* ── Joriy topshiriq / izoh qatori ── */}
      {!done && steps[cur] && (
        <div className={`glass px-4 md:px-6 py-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 transition-colors ${run?.toast ? (run.toast.tone === "ok" ? "!border-ok/50" : run.toast.tone === "err" ? "!border-danger/50" : "!border-info/50") : "!border-brand/30"}`} aria-live="polite">
          <p className="eyebrow flex items-center gap-2 shrink-0"><Crosshair className="w-3.5 h-3.5" /> {run?.toast ? "Natija" : "Topshiriq"}</p>
          <div className="flex-1 min-w-[14rem] text-sm leading-relaxed">
            {run?.toast ? (
              <p key={run.toast.id} className={`font-semibold anim-pop ${run.toast.tone === "ok" ? "text-ok" : run.toast.tone === "err" ? "text-danger" : "text-info"}`}>{run.toast.text}</p>
            ) : (
              <p><b className="font-display text-base">{stepTitle(steps[cur], cur)}.</b> <span className="text-ink-2">{stepText(steps[cur])}</span></p>
            )}
          </div>
          {onHint && hint && (
            <button type="button" className="btn btn-ghost btn-sm shrink-0" onClick={onHint}>
              <Lightbulb className="w-4 h-4 text-accent" /> Maslahat {run && run.hints > 0 ? `(${run.hints})` : ""}
            </button>
          )}
        </div>
      )}

      {/* ── Sahna ── */}
      <section className={`@container glass brackets relative overflow-hidden min-h-[560px] ${flush ? "" : "p-4 md:p-7"}`}>
        {children}
      </section>

      {aside && <div className="glass p-5">{aside}</div>}
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
    info: "bg-info-soft text-info border-info/25",
    ok: "bg-ok-soft text-ok border-ok/25",
    err: "bg-danger-soft text-danger border-danger/25",
    warn: "bg-accent-soft text-accent border-accent/25",
  } as const;
  return (
    <p role="status" className={`rounded-xl border px-4 py-3 text-sm font-medium leading-relaxed ${map[tone]}`}>
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
    <div className="rounded-2xl border border-line bg-black/25 px-4 py-3 min-w-[7.5rem]">
      <p className="eyebrow !text-muted !text-[0.65rem] mb-0.5">{label}</p>
      <p className={`font-mono text-2xl font-bold tabular-nums ${c}`}>
        {value}
        {unit && <span className="text-sm font-semibold text-muted ml-1">{unit}</span>}
      </p>
    </div>
  );
}
