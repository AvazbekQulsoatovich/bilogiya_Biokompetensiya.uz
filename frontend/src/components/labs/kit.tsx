"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Star, Clock, Target, Lightbulb, RotateCcw, ArrowLeft, CheckCircle2, XCircle, Volume2, VolumeX, NotebookPen, ChevronRight } from "lucide-react";

/* ═════════════════ Tovush effektlari (WebAudio, tashqi fayl yoʻq) ═════════════════ */
let audio: AudioContext | null = null;
let muted = false;
try {
  if (typeof window !== "undefined") muted = localStorage.getItem("lab-muted") === "1";
} catch {}

function ctx() {
  if (typeof window === "undefined") return null;
  try {
    if (!audio) {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      audio = new AC();
    }
    if (audio!.state === "suspended") audio!.resume();
    return audio;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", vol = 0.07) {
  const c = ctx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime + start);
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + start + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + dur + 0.05);
}

export type SfxKind = "ok" | "err" | "click" | "win" | "pop" | "tick" | "whoosh";
export function sfx(kind: SfxKind) {
  if (muted) return;
  switch (kind) {
    case "ok": tone(660, 0, 0.12, "sine"); tone(990, 0.09, 0.2, "sine"); break;
    case "err": tone(180, 0, 0.22, "sawtooth", 0.05); tone(140, 0.1, 0.25, "sawtooth", 0.05); break;
    case "click": tone(520, 0, 0.05, "triangle", 0.05); break;
    case "tick": tone(900, 0, 0.03, "square", 0.025); break;
    case "pop": tone(380 + Math.random() * 240, 0, 0.07, "sine", 0.04); break;
    case "whoosh": tone(300, 0, 0.18, "triangle", 0.03); tone(520, 0.05, 0.18, "triangle", 0.025); break;
    case "win": [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, "sine", 0.08)); break;
  }
}

export function SoundToggle() {
  const [m, setM] = useState(false);
  useEffect(() => setM(muted), []);
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm !px-2.5"
      aria-label={m ? "Tovushni yoqish" : "Tovushni oʻchirish"}
      title={m ? "Tovushni yoqish" : "Tovushni oʻchirish"}
      onClick={() => {
        muted = !muted;
        try { localStorage.setItem("lab-muted", muted ? "1" : "0"); } catch {}
        setM(muted);
        if (!muted) sfx("click");
      }}
    >
      {m ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  );
}

/* ═════════════════ Animatsiya sikli (requestAnimationFrame) ═════════════════ */
/** cb(dt sekund, umumiy vaqt sekund). dt 0.05 dan oshmaydi. */
export function useRaf(cb: (dt: number, t: number) => void, active = true) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const t0 = last;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ref.current(dt, (now - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}

/** Canvas ni qurilma piksel zichligiga moslab, oʻlchamini kuzatadi. Qaytgan qiymat — callback ref. */
export function useCanvas(draw: (g: CanvasRenderingContext2D, w: number, h: number, dt: number, t: number) => void, active = true) {
  const [el, setEl] = useState<HTMLCanvasElement | null>(null);
  const size = useRef({ w: 0, h: 0 });
  useEffect(() => {
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.max(1, Math.round(r.width * dpr));
      el.height = Math.max(1, Math.round(r.height * dpr));
      size.current = { w: r.width, h: r.height };
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [el]);
  useRaf((dt, t) => {
    if (!el) return;
    const g = el.getContext("2d");
    if (!g) return;
    const { w, h } = size.current;
    if (!w || !h) return;
    const k = el.width / w;
    g.setTransform(k, 0, 0, k, 0, 0);
    draw(g, w, h, dt, t);
  }, active);
  return setEl;
}

/* ═════════════════ Tajriba holati: vaqt, xatolar, yulduzlar ═════════════════ */
export type Run = ReturnType<typeof useLabRun>;

export function useLabRun(completeLab: () => void, isCompleted: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hints, setHints] = useState(0);
  const [notes, setNotes] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [toast, setToast] = useState<{ tone: "ok" | "err" | "info"; text: string; id: number } | null>(null);

  useEffect(() => {
    if (finished || isCompleted) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [finished, isCompleted]);

  const say = useCallback((tone: "ok" | "err" | "info", text: string) => {
    setToast({ tone, text, id: Date.now() });
  }, []);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(id);
  }, [toast]);

  const mistake = useCallback((text?: string) => {
    setMistakes((m) => m + 1);
    sfx("err");
    if (text) say("err", text);
  }, [say]);
  const good = useCallback((text?: string) => {
    sfx("ok");
    if (text) say("ok", text);
  }, [say]);
  const hint = useCallback((text: string) => {
    setHints((h) => h + 1);
    sfx("click");
    say("info", text);
  }, [say]);
  const note = useCallback((text: string) => {
    setNotes((n) => (n.includes(text) ? n : [...n, text]));
  }, []);
  const finish = useCallback(() => {
    if (finished) return;
    setFinished(true);
    sfx("win");
    completeLab();
  }, [finished, completeLab]);

  const stars = mistakes <= 1 && hints === 0 ? 3 : mistakes <= 4 ? 2 : 1;
  return { elapsed, mistakes, hints, notes, finished: finished || isCompleted, stars, toast, say, mistake, good, hint, note, finish };
}

export function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/* ═════════════════ Kichik bloklar ═════════════════ */
export function Glass({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass ${className}`}>{children}</div>;
}

/** Sahna ichidagi izoh (toast) */
export function Toast({ run }: { run: Run }) {
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-3 z-30 flex justify-center px-3" aria-live="polite">
      <AnimatePresence>
        {run.toast && (
          <motion.div
            key={run.toast.id}
            initial={{ opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className={`glass px-4 py-2.5 text-sm font-semibold flex items-center gap-2.5 max-w-xl ${
              run.toast.tone === "ok" ? "!border-ok/50 text-ok" : run.toast.tone === "err" ? "!border-danger/50 text-danger" : "!border-info/50 text-info"
            }`}
          >
            {run.toast.tone === "ok" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : run.toast.tone === "err" ? <XCircle className="w-4 h-4 shrink-0" /> : <Lightbulb className="w-4 h-4 shrink-0" />}
            <span>{run.toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Aylana koʻrsatkich */
export function Gauge({ value, min = 0, max = 100, label, unit, color = "var(--brand)", size = 112 }: { value: number; min?: number; max?: number; label: string; unit?: string; color?: string; size?: number }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const f = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const arc = c * 0.75;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 110 110" className="w-full h-full -rotate-[225deg]">
        <circle cx="55" cy="55" r={r} fill="none" stroke="var(--line)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${arc} ${c}`} />
        <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${arc * f} ${c}`} style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dasharray .25s" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono text-xl font-bold tabular-nums leading-none" style={{ color }}>
          {Number.isInteger(value) ? value : value.toFixed(1)}
          {unit && <span className="text-[0.65rem] text-muted ml-0.5">{unit}</span>}
        </span>
        <span className="eyebrow !text-muted !text-[0.58rem] !tracking-[0.12em] mt-1">{label}</span>
      </div>
    </div>
  );
}

export function Meter({ label, value, max = 100, color = "var(--brand)", suffix = "" }: { label: string; value: number; max?: number; color?: string; suffix?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted font-semibold">{label}</span>
        <span className="font-mono font-bold tabular-nums" style={{ color }}>{Math.round(value)}{suffix}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`, background: color, boxShadow: `0 0 12px ${color}` }} />
      </div>
    </div>
  );
}

/** Raqamli displey */
export function Digit({ label, value, unit, tone = "brand" }: { label: string; value: ReactNode; unit?: string; tone?: "brand" | "accent" | "info" | "danger" | "violet" }) {
  const col = { brand: "var(--brand)", accent: "var(--accent)", info: "var(--info)", danger: "var(--danger)", violet: "var(--violet)" }[tone];
  return (
    <div className="rounded-2xl border border-line bg-black/25 px-4 py-2.5 min-w-0">
      <p className="eyebrow !text-muted !text-[0.6rem] mb-0.5 truncate">{label}</p>
      <p className="font-mono text-xl font-bold tabular-nums leading-tight" style={{ color: col, textShadow: `0 0 14px ${col}55` }}>
        {value}
        {unit && <span className="text-xs font-semibold text-muted ml-1">{unit}</span>}
      </p>
    </div>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-info/30 bg-info-soft px-4 py-3 text-sm text-ink-2 leading-relaxed">
      <Lightbulb className="w-4 h-4 text-info shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

/* ═════════════════ Bilim tekshiruvi ═════════════════ */
export type Q = { q: string; options: string[]; answer: number; explain: string };

export function Quiz({ questions, run, onDone, title = "Bilimni tekshirish" }: { questions: Q[]; run: Run; onDone: () => void; title?: string }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);
  const q = questions[i];
  const solved = picked === q.answer;

  const pick = (k: number) => {
    if (solved) return;
    if (k === q.answer) {
      setPicked(k);
      run.good();
    } else {
      setWrong((w) => (w.includes(k) ? w : [...w, k]));
      run.mistake();
    }
  };
  const next = () => {
    sfx("click");
    if (i + 1 >= questions.length) return onDone();
    setI(i + 1);
    setPicked(null);
    setWrong([]);
  };

  return (
    <div className="glass p-5 md:p-7 max-w-3xl mx-auto anim-pop">
      <div className="flex items-center justify-between mb-4">
        <p className="eyebrow flex items-center gap-2"><Target className="w-3.5 h-3.5" /> {title}</p>
        <div className="flex gap-1.5">
          {questions.map((_, k) => (
            <span key={k} className={`h-1.5 w-8 rounded-full ${k < i || (k === i && solved) ? "bg-ok" : k === i ? "bg-brand" : "bg-line-strong"}`} />
          ))}
        </div>
      </div>
      <h3 className="font-display text-xl md:text-2xl font-semibold leading-snug mb-5">{q.q}</h3>
      <div className="grid gap-2.5">
        {q.options.map((o, k) => {
          const isRight = solved && k === q.answer;
          const isWrong = wrong.includes(k);
          return (
            <button
              key={k}
              type="button"
              onClick={() => pick(k)}
              className={`text-left rounded-2xl border px-4 py-3.5 font-medium transition-all flex items-center gap-3 ${
                isRight ? "border-ok bg-ok-soft text-ok" : isWrong ? "border-danger/60 bg-danger-soft text-danger animate-shake" : "border-line bg-black/20 hover:border-brand hover:bg-brand-soft"
              }`}
            >
              <span className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${isRight ? "bg-ok text-black" : isWrong ? "bg-danger text-black" : "bg-surface-2 text-muted"}`}>
                {isRight ? "✓" : isWrong ? "✕" : String.fromCharCode(65 + k)}
              </span>
              {o}
            </button>
          );
        })}
      </div>
      {solved && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
          <p className="rounded-2xl bg-ok-soft text-ok px-4 py-3 text-sm font-medium leading-relaxed mb-4">{q.explain}</p>
          <button type="button" className="btn btn-primary" onClick={next}>
            {i + 1 >= questions.length ? "Tajribani yakunlash" : "Keyingi savol"} <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ═════════════════ Yakuniy natija ═════════════════ */
export function ResultCard({ title, xp, run, onRepeat, onBack, learned }: { title: string; xp: number; run: Run; onRepeat?: () => void; onBack?: () => void; learned?: string[] }) {
  const router = useRouter();
  const back = onBack || (() => router.push("/labs"));
  const acc = Math.max(0, 100 - run.mistakes * 8 - run.hints * 4);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass brackets p-6 md:p-10 max-w-3xl mx-auto text-center relative overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] rounded-full bg-brand/10 blur-3xl pointer-events-none" />
      <p className="eyebrow mb-2 relative">Tajriba yakunlandi</p>
      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6 relative">{title}</h2>
      <div className="flex justify-center gap-3 mb-8 relative">
        {[1, 2, 3].map((n) => (
          <motion.div key={n} initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2 + n * 0.18, type: "spring", stiffness: 260, damping: 14 }}>
            <Star className={`w-14 h-14 md:w-16 md:h-16 ${n <= run.stars ? "text-accent fill-accent drop-shadow-[0_0_18px_rgba(255,200,87,.8)]" : "text-line-strong"}`} strokeWidth={1.4} />
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 relative">
        <Digit label="Mukofot" value={`+${xp}`} unit="XP" tone="accent" />
        <Digit label="Vaqt" value={fmtTime(run.elapsed)} tone="info" />
        <Digit label="Aniqlik" value={acc} unit="%" tone="brand" />
        <Digit label="Xatolar" value={run.mistakes} tone={run.mistakes ? "danger" : "brand"} />
      </div>

      {learned && learned.length > 0 && (
        <div className="text-left rounded-2xl border border-line bg-black/20 p-5 mb-6 relative">
          <p className="eyebrow flex items-center gap-2 mb-3"><NotebookPen className="w-3.5 h-3.5" /> Laboratoriya daftari</p>
          <ul className="grid gap-2 text-sm text-ink-2">
            {learned.map((l, i) => (
              <li key={i} className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-ok shrink-0 mt-0.5" /> {l}</li>
            ))}
            {run.notes.map((l, i) => (
              <li key={`n${i}`} className="flex gap-2.5"><span className="w-4 h-4 shrink-0 mt-0.5 text-center text-info font-bold leading-none">•</span> {l}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-center relative">
        {onRepeat && (
          <button type="button" className="btn btn-ghost" onClick={onRepeat}>
            <RotateCcw className="w-4 h-4" /> Qayta bajarish
          </button>
        )}
        <button type="button" className="btn btn-primary btn-lg" onClick={back}>
          <ArrowLeft className="w-4 h-4" /> Boshqa tajribalar
        </button>
      </div>
    </motion.div>
  );
}

/** Kirish (briefing) ekrani */
export function Briefing({ title, goals, safety, onStart }: { title: string; goals: string[]; safety?: string; onStart: () => void }) {
  return (
    <div className="glass brackets p-6 md:p-10 max-w-3xl mx-auto anim-pop">
      <p className="eyebrow mb-2">Topshiriq</p>
      <h3 className="font-display text-2xl md:text-3xl font-semibold mb-5">{title}</h3>
      <ul className="grid gap-3 mb-6">
        {goals.map((g, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="w-7 h-7 rounded-lg bg-brand-soft text-brand font-mono font-bold text-sm flex items-center justify-center shrink-0">{i + 1}</span>
            <span className="text-ink-2 leading-relaxed pt-0.5">{g}</span>
          </li>
        ))}
      </ul>
      {safety && (
        <p className="rounded-2xl border border-accent/30 bg-accent-soft text-accent px-4 py-3 text-sm font-medium mb-6">⚠ Xavfsizlik: {safety}</p>
      )}
      <button type="button" className="btn btn-primary btn-lg" onClick={() => { sfx("whoosh"); onStart(); }}>
        Tajribani boshlash <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export { Clock };
