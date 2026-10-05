"use client";

import { useState, useEffect, useRef, type MouseEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Microscope, Play, Sparkles, CheckCircle2, Clock3, FlaskConical, Zap, Trophy } from "lucide-react";
import { EmptyState } from "@/components/ui";
import { LabScene } from "@/components/labs/LabScene";
import { LAB_META, getDoneLabs } from "@/components/labs/meta";

/** Hero fonidagi suzuvchi biolyuminessent zarrachalar */
function Particles() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const g = el.getContext("2d");
    if (!g) return;
    let w = 0, h = 0, raf = 0;
    const mouse = { x: -999, y: -999 };
    const fit = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      el.width = w * dpr; el.height = h * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    const cols = ["46,230,192", "90,176,255", "169,139,255", "255,200,87"];
    const P = Array.from({ length: 46 }, (_, i) => ({
      x: Math.random() * 1400, y: Math.random() * 520, r: 2 + Math.random() * 9,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      c: cols[i % cols.length], ring: Math.random() < 0.45, ph: Math.random() * 6,
    }));
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    window.addEventListener("pointermove", move);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = (t: number) => {
      g.clearRect(0, 0, w, h);
      for (const p of P) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 14000) { const f = (1 - d2 / 14000) * 0.6; p.vx += (dx / Math.sqrt(d2 + 1)) * f * 0.1; p.vy += (dy / Math.sqrt(d2 + 1)) * f * 0.1; }
        p.vx *= 0.995; p.vy *= 0.995;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20; if (p.y > h + 20) p.y = -20;
        const a = 0.35 + 0.25 * Math.sin(t / 900 + p.ph);
        const grd = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.2);
        grd.addColorStop(0, `rgba(${p.c},${a})`);
        grd.addColorStop(1, `rgba(${p.c},0)`);
        g.fillStyle = grd;
        g.beginPath(); g.arc(p.x, p.y, p.r * 3.2, 0, 6.283); g.fill();
        if (p.ring) {
          g.strokeStyle = `rgba(${p.c},${a + 0.2})`; g.lineWidth = 1.2;
          g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.stroke();
          g.beginPath(); g.arc(p.x + p.r * 0.25, p.y - p.r * 0.2, p.r * 0.32, 0, 6.283); g.stroke();
        }
      }
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener("pointermove", move); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />;
}

function Dots({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-1" aria-hidden>
      {[1, 2, 3].map((k) => (
        <span key={k} className={`w-1.5 h-3 rounded-full ${k <= n ? "bg-accent shadow-[0_0_8px_var(--accent)]" : "bg-line-strong"}`} />
      ))}
    </span>
  );
}

export default function LabsPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<0 | 5 | 6>(0);
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    setDone(getDoneLabs());
    (async () => {
      try {
        const res = await fetch(`/api/labs`);
        const data = await res.json();
        setLabs(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Laboratoriyalarni yuklab boʻlmadi", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = labs
    .filter((l) => activeTab === 0 || l.gradeLevel === activeTab)
    .sort((a, b) => a.gradeLevel - b.gradeLevel || String(a.title).localeCompare(String(b.title)));
  const totalXp = labs.reduce((s, l) => s + (l.rewardXp || 0), 0);
  const doneCount = labs.filter((l) => done.includes(l.id)).length;

  const glow = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div className="lab-room min-h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* ───── Hero ───── */}
      <section className="relative">
        <Particles />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-12 md:pt-20 pb-10 md:pb-14">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="chip chip-brand mb-6 !py-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Virtual laboratoriya · 2026
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="font-display text-4xl sm:text-5xl md:text-7xl font-semibold leading-[1.02] max-w-4xl">
            Fan kashf etiladigan joy <span className="neon-text">sizning qoʻlingizda</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="text-muted text-lg md:text-xl mt-6 max-w-2xl">
            Mikroskopda hujayra koʻring, suvni qaynating, oʻsimlik nafas olishini oʻlchang. Haqiqiy fizika bilan ishlaydigan tajribalar — xavfsiz va qiziqarli.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-10 flex flex-wrap gap-3">
            {[
              { icon: FlaskConical, v: labs.length, l: "tajriba", c: "var(--brand)" },
              { icon: CheckCircle2, v: `${doneCount}/${labs.length}`, l: "bajarildi", c: "var(--ok)" },
              { icon: Zap, v: totalXp, l: "XP mavjud", c: "var(--accent)" },
            ].map((s) => (
              <div key={s.l} className="glass px-5 py-3.5 flex items-center gap-3.5">
                <s.icon className="w-6 h-6" style={{ color: s.c, filter: `drop-shadow(0 0 8px ${s.c})` }} />
                <div>
                  <p className="font-mono text-2xl font-bold leading-none tabular-nums">{s.v}</p>
                  <p className="text-xs text-muted font-semibold mt-1">{s.l}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── Ro'yxat ───── */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
          <h2 className="font-display text-2xl md:text-3xl font-semibold flex items-center gap-3">
            <Trophy className="w-6 h-6 text-accent" /> Tajribalar
          </h2>
          <div role="tablist" aria-label="Sinf" className="seg">
            {([[0, "Barchasi"], [5, "5-sinf"], [6, "6-sinf"]] as const).map(([v, l]) => (
              <button key={v} role="tab" aria-selected={activeTab === v} onClick={() => setActiveTab(v)}>{l}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden>
            {[0, 1, 2].map((i) => <div key={i} className="skeleton h-96 !rounded-3xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Microscope} title="Bu sinf uchun hali tajribalar yoʻq" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((lab, i) => {
              const meta = LAB_META[lab.type] || LAB_META.MICROSCOPE;
              const [, ...rest] = String(lab.title).split(": ");
              const title = rest.length ? rest.join(": ") : lab.title;
              const isDone = done.includes(lab.id);
              return (
                <motion.div key={lab.id} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.07 }}>
                  <Link href={`/labs/${lab.id}`} onMouseMove={glow} className="lab-card flex flex-col h-full group" aria-label={`${title} tajribasini boshlash`}>
                    <div className="relative h-48 m-3 mb-0 rounded-[18px] overflow-hidden border border-line bg-[#050c14] scanlines">
                      <div className="absolute inset-0 stage-grid opacity-60" />
                      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                        <LabScene type={lab.type} />
                      </div>
                      <span className="absolute top-3 left-3 chip chip-brand font-mono !bg-black/50 backdrop-blur">{`LAB-${String(i + 1).padStart(2, "0")}`}</span>
                      <span className="absolute top-3 right-3 chip chip-accent !bg-black/50 backdrop-blur font-mono">+{lab.rewardXp} XP</span>
                      {isDone && (
                        <span className="absolute bottom-3 right-3 chip !bg-ok-soft !text-ok backdrop-blur"><CheckCircle2 className="w-3.5 h-3.5" /> Bajarilgan</span>
                      )}
                      <span className="absolute bottom-3 left-3 chip !bg-black/50 backdrop-blur">{meta.tag}</span>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-muted font-semibold mb-3">
                        <span className="inline-flex items-center gap-1.5"><Clock3 className="w-3.5 h-3.5" /> ~{meta.minutes} daq</span>
                        <span className="inline-flex items-center gap-2"><Dots n={meta.dots} /> {meta.level}</span>
                        <span className="ml-auto">{lab.gradeLevel}-sinf</span>
                      </div>
                      <h3 className="font-display text-xl font-semibold leading-snug mb-2">{title}</h3>
                      <p className="text-muted text-sm leading-relaxed flex-1 mb-6">{lab.description}</p>
                      <span className="btn btn-primary w-full">
                        <Play className="w-4 h-4 fill-current" /> {isDone ? "Qayta bajarish" : "Tajribani boshlash"}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
