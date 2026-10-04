"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Microscope, Sun, Search } from "lucide-react";
import { LabShell, LabProps, Note, StageTitle, Readout } from "./LabShell";

/* ───────── Preparat tayyorlash ketma-ketligi ───────── */
const SEQUENCE = ["oyna", "elodeya", "tomizgich", "qoplagich"] as const;
type Tool = (typeof SEQUENCE)[number] | "lupa" | "ildiz";

const TOOL_LABEL: Record<Tool, string> = {
  oyna: "Buyum oynasi",
  elodeya: "Elodeya bargi",
  tomizgich: "Tomizgich (suv)",
  qoplagich: "Qoplagich oyna",
  lupa: "Lupa",
  ildiz: "Ildiz boʻlagi",
};

const HINT: Record<string, string> = {
  oyna: "Avval toza buyum oynasini stolga qoʻying.",
  elodeya: "Endi elodeya bargini oyna ustiga joylashtiring.",
  tomizgich: "Bargga bir tomchi suv tomizing, shunda hujayralar qurib qolmaydi.",
  qoplagich: "Oxirida qoplagich oynani qiya tutib, havo pufakchalari qolmasligi uchun sekin yoping.",
};

/* ───────── Taxminan tasodifiy, ammo barqaror son ───────── */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CELL_W = 46;
const CELL_H = 27;

type CellDef = { cx: number; cy: number; chloro: { a: number; k: number; dur: number; delay: number }[] };

function buildCells(): CellDef[] {
  const cells: CellDef[] = [];
  for (let r = -10; r <= 10; r++) {
    for (let c = -6; c <= 6; c++) {
      const rand = rng((r + 20) * 1000 + (c + 20) + 7);
      const off = Math.abs(r) % 2 ? CELL_W / 2 : 0;
      const n = 9 + Math.floor(rand() * 4);
      cells.push({
        cx: 200 + c * CELL_W + off,
        cy: 200 + r * CELL_H,
        chloro: Array.from({ length: n }, () => ({
          a: rand() * Math.PI * 2,
          k: 0.74 + rand() * 0.18,
          dur: 22 + rand() * 14,
          delay: -rand() * 20,
        })),
      });
    }
  }
  return cells;
}

const RX = CELL_W / 2 - 3;
const RY = CELL_H / 2 - 3;

/* ───────── Koʻrish maydoni (elodeya hujayralari) ───────── */
function Field({ zoom, animate }: { zoom: number; animate: boolean }) {
  const cells = useMemo(buildCells, []);
  const rx = RX;
  const ry = RY;
  const visible = cells.filter((c) => {
    const dx = c.cx - 200;
    const dy = c.cy - 200;
    const lim = 215 / zoom + CELL_W;
    return dx * dx + dy * dy < lim * lim;
  });

  return (
    <g transform={`translate(200 200) scale(${zoom}) translate(-200 -200)`}>
      {visible.map((cell, i) => (
        <g key={i} transform={`translate(${cell.cx} ${cell.cy})`}>
          {/* hujayra devori */}
          <rect x={-CELL_W / 2} y={-CELL_H / 2} width={CELL_W} height={CELL_H} rx={2.5} fill="rgba(196,232,168,0.45)" stroke="#2b7a3b" strokeWidth={1.4 / Math.sqrt(zoom)} />
          {/* markaziy vakuola */}
          <rect x={-CELL_W / 2 + 6} y={-CELL_H / 2 + 5} width={CELL_W - 12} height={CELL_H - 10} rx={5} fill="rgba(226,244,222,0.55)" />
          {/* xloroplastlar — devor boʻylab joylashadi */}
          {cell.chloro.map((p, j) => {
            const px = Math.cos(p.a) * rx * p.k;
            const py = Math.sin(p.a) * ry * p.k;
            const ell = (
              <ellipse rx={3.1} ry={1.9} fill="#2f9e44" stroke="#1d6b2b" strokeWidth={0.45} />
            );
            const isCenter = cell.cx === 200 && cell.cy === 200;
            if (animate && !isCenter) {
              const R = p.k;
              const path = `M ${rx * R} 0 a ${rx * R} ${ry * R} 0 1 0 ${-2 * rx * R} 0 a ${rx * R} ${ry * R} 0 1 0 ${2 * rx * R} 0`;
              return (
                <g key={j}>
                  <g>
                    {ell}
                    <animateMotion dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" path={path} />
                  </g>
                </g>
              );
            }
            return (
              <g key={j} transform={`translate(${px} ${py})`}>
                {ell}
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

/* ───────── Preparat chizmasi ───────── */
function Slide({ done }: { done: number }) {
  return (
    <svg viewBox="0 0 320 120" className="w-full max-w-md" role="img" aria-label="Preparat tayyorlanish holati">
      <rect x="20" y="64" width="280" height="14" rx="3" fill="rgba(160,200,220,0.35)" stroke="#6aa0b8" strokeWidth="1.5" style={{ opacity: done >= 1 ? 1 : 0.15 }} />
      {done >= 2 && <path d="M 110 62 q 20 -28 50 -20 q 28 6 50 20 z" fill="#4cae5c" stroke="#2b7a3b" strokeWidth="1.5" />}
      {done >= 3 && <ellipse cx="160" cy="56" rx="48" ry="9" fill="rgba(110,190,235,0.45)" stroke="#4aa3d8" strokeWidth="1" />}
      {done >= 4 && <rect x="104" y="44" width="112" height="6" rx="1.5" fill="rgba(220,240,250,0.7)" stroke="#6aa0b8" strokeWidth="1.2" />}
      <text x="160" y="104" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.6">
        {done === 0 ? "Preparat hali tayyor emas" : done < 4 ? "Preparat tayyorlanmoqda…" : "Preparat tayyor"}
      </text>
    </svg>
  );
}

export default function MicroscopeLab({ steps, completeLab, isCompleted }: LabProps) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  // 0 — preparat
  const [made, setMade] = useState(0);
  const [shake, setShake] = useState<Tool | null>(null);
  const [hint, setHint] = useState<string | null>(HINT.oyna);

  // 1 — yoritish
  const [mirror, setMirror] = useState(5);
  const brightness = Math.max(0, 1 - Math.abs(mirror - 45) / 45);
  const lit = brightness >= 0.85;

  // 2 — kuzatish
  const [zoom, setZoom] = useState<1 | 3.4>(1);
  const [focus, setFocus] = useState(8);
  const target = zoom === 1 ? 36 : 64;
  const blur = Math.min(7, Math.abs(focus - target) * 0.22);
  const sharp = blur < 0.9;
  const marker2 = useMemo(() => {
    const centre = buildCells().find((c) => c.cx === 200 && c.cy === 200)!;
    const p = centre.chloro[0];
    return { x: 200 + Math.cos(p.a) * RX * p.k * zoom, y: 200 + Math.sin(p.a) * RY * p.k * zoom };
  }, [zoom]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [verdict, setVerdict] = useState<{ ok: boolean; text: string } | null>(null);

  const tools: Tool[] = ["tomizgich", "lupa", "oyna", "ildiz", "qoplagich", "elodeya"];

  const pick = (t: Tool) => {
    const need = SEQUENCE[made];
    if (t === need) {
      const next = made + 1;
      setMade(next);
      setHint(next < 4 ? HINT[SEQUENCE[next]] : "Preparat tayyor. Endi uni mikroskop stoliga qoʻying.");
    } else {
      setShake(t);
      setTimeout(() => setShake(null), 400);
      setHint(
        SEQUENCE.includes(t as any)
          ? `Notoʻgʻri ketma-ketlik. Hozir kerakli narsa: ${TOOL_LABEL[need]}.`
          : `${TOOL_LABEL[t]} bu tajribada kerak emas.`
      );
    }
  };

  const check = () => {
    const correct: Record<number, string> = { 1: "Hujayra devori", 2: "Xloroplast", 3: "Vakuola" };
    const bad = Object.entries(correct).filter(([k, v]) => answers[Number(k)] !== v);
    if (bad.length === 0) {
      setVerdict({ ok: true, text: "Toʻgʻri! Elodeya hujayrasida zich devor, yashil xloroplastlar va markaziy vakuola koʻrinadi." });
      completeLab();
    } else {
      setVerdict({ ok: false, text: "Baʼzi nomlar notoʻgʻri. Rasmga diqqat bilan qarang: yashil donachalar fotosintez qiladi, devor esa hujayrani tashqaridan oʻrab turadi." });
    }
  };

  return (
    <LabShell heading="Mikroskop bilan ishlash" icon={Microscope} steps={steps} current={phase} done={isCompleted}>
      <AnimatePresence mode="wait">
        {/* ───────── 1. PREPARAT ───────── */}
        {phase === 0 && (
          <motion.div key="p0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StageTitle sub="Kerakli buyumlarni toʻgʻri ketma-ketlikda tanlang: buyum oynasi → elodeya bargi → suv tomchisi → qoplagich oyna.">
              Vaqtinchalik preparat tayyorlash
            </StageTitle>

            <div className="lab-bench p-6 mb-6 flex justify-center">
              <Slide done={made} />
            </div>

            <div className="flex flex-wrap gap-2.5 mb-5" aria-label="Laboratoriya buyumlari">
              {tools.map((t) => {
                const used = SEQUENCE.includes(t as any) && SEQUENCE.indexOf(t as any) < made;
                return (
                  <button
                    key={t}
                    disabled={used || made >= 4}
                    onClick={() => pick(t)}
                    className={`btn btn-ghost ${shake === t ? "animate-shake !border-danger" : ""} ${used ? "!bg-ok-soft !text-ok" : ""}`}
                  >
                    {used ? "✓ " : ""}
                    {TOOL_LABEL[t]}
                  </button>
                );
              })}
            </div>

            {hint && <Note tone={made >= 4 ? "ok" : "info"}>{hint}</Note>}

            {made >= 4 && (
              <button className="btn btn-primary btn-lg mt-6" onClick={() => setPhase(1)}>
                <Microscope className="w-5 h-5" /> Preparatni mikroskop stoliga qoʻyish
              </button>
            )}
          </motion.div>
        )}

        {/* ───────── 2. YORITISH ───────── */}
        {phase === 1 && (
          <motion.div key="p1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StageTitle sub="Ko‘zguni buring: yorug‘lik preparat orqali oʻtib, koʻrish maydonini tekis yoritishi kerak.">
              Koʻrish maydonini yoritish
            </StageTitle>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
              <div className="lab-bench p-6 flex justify-center">
                <svg viewBox="0 0 260 260" className="w-full max-w-xs" role="img" aria-label="Mikroskop va koʻzgu">
                  {/* shtativ */}
                  <path d="M150 20 l30 0 l0 18 l-30 0 z" fill="#2b3a55" />
                  <rect x="158" y="38" width="14" height="86" rx="4" fill="#33466a" transform="rotate(14 165 80)" />
                  <path d="M185 70 q50 20 22 110 l-38 0 q26 -56 -8 -88 z" fill="#2b3a55" />
                  <rect x="82" y="148" width="104" height="9" rx="2" fill="#4a5f86" />
                  <rect x="70" y="214" width="150" height="14" rx="5" fill="#2b3a55" />
                  {/* preparat */}
                  <rect x="102" y="141" width="64" height="7" rx="1.5" fill="rgba(160,210,230,0.8)" stroke="#6aa0b8" />
                  <ellipse cx="134" cy="140" rx="16" ry="3" fill="#4cae5c" />
                  {/* yorugʻlik nuri */}
                  <polygon
                    points={`134,205 112,148 156,148`}
                    fill="rgba(255,220,100,0.8)"
                    style={{ opacity: brightness * 0.9 }}
                  />
                  {/* koʻzgu */}
                  <g transform={`rotate(${(mirror - 45) * 0.9} 134 212)`}>
                    <ellipse cx="134" cy="212" rx="30" ry="6" fill="#9fb4d6" stroke="#6a85b5" strokeWidth="2" />
                  </g>
                  <rect x="130" y="212" width="8" height="14" fill="#33466a" />
                </svg>
              </div>

              <div className="grid gap-4 min-w-[15rem]">
                <Readout label="Yoritilganlik" value={Math.round(brightness * 100)} unit="%" tone={lit ? "brand" : "accent"} />
                <label className="block">
                  <span className="text-sm font-semibold flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4 text-accent" /> Koʻzgu burchagi
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={90}
                    value={mirror}
                    onChange={(e) => setMirror(Number(e.target.value))}
                    className="w-full"
                    aria-label="Koʻzgu burchagi"
                  />
                </label>
                <Note tone={lit ? "ok" : "warn"}>
                  {lit ? "Maydon yaxshi yoritildi. Davom etishingiz mumkin." : brightness < 0.4 ? "Juda qorongʻi: koʻzguni yorugʻlik manbai tomon buring." : "Yaxshiroq yoritish uchun koʻzguni sal burib koʻring."}
                </Note>
                <button className="btn btn-primary" disabled={!lit} onClick={() => setPhase(2)}>
                  Kuzatishga oʻtish
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ───────── 3. KUZATISH ───────── */}
        {phase === 2 && (
          <motion.div key="p2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StageTitle sub="Obyektivni tanlang va aniqlik vintini burab tasvirni fokusga keltiring. Soʻng raqamlangan tuzilmalarni nomlang.">
              Hujayralarni kuzatish
            </StageTitle>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,26rem)_1fr] gap-8 items-start">
              <div>
                <div className="relative mx-auto w-full max-w-[26rem] aspect-square rounded-full border-[10px] border-[#1c2433] bg-[#e9f4e4] overflow-hidden shadow-[var(--shadow-lg)]">
                  <svg
                    viewBox="0 0 400 400"
                    className="w-full h-full"
                    style={{ filter: `blur(${blur}px) brightness(${0.35 + brightness * 0.75})`, transition: "filter 0.2s" }}
                    role="img"
                    aria-label="Mikroskopdagi elodeya hujayralari"
                  >
                    <rect width="400" height="400" fill="#eef7ea" />
                    <Field zoom={zoom} animate={zoom > 1 && sharp} />
                    {zoom > 1 && sharp && !isCompleted && (
                      <g fontFamily="var(--font-sans)" fontWeight={700} fontSize="13" textAnchor="middle">
                        {[
                          { n: 1, x: 200 - (CELL_W / 2) * zoom, y: 200 },
                          { n: 2, x: marker2.x, y: marker2.y },
                          { n: 3, x: 200, y: 200 },
                        ].map((m) => (
                          <g key={m.n}>
                            <circle cx={m.x} cy={m.y} r={11} fill="#0e2119" stroke="#fff" strokeWidth={2} />
                            <text x={m.x} y={m.y + 4.5} fill="#fff">{m.n}</text>
                          </g>
                        ))}
                      </g>
                    )}
                  </svg>
                  <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.55)" }} />
                </div>
              </div>

              <div className="grid gap-5">
                <div className="flex flex-wrap gap-3">
                  <Readout label="Kattalashtirish" value={`×${zoom === 1 ? 10 : 40}`} />
                  <Readout label="Aniqlik" value={sharp ? "yaxshi" : "xira"} tone={sharp ? "brand" : "danger"} />
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">Obyektiv</p>
                  <div className="flex gap-2">
                    {([1, 3.4] as const).map((z) => (
                      <button
                        key={z}
                        onClick={() => {
                          setZoom(z);
                          setVerdict(null);
                        }}
                        className={`btn btn-sm ${zoom === z ? "btn-primary" : "btn-ghost"}`}
                      >
                        <Search className="w-4 h-4" /> ×{z === 1 ? 10 : 40}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold block mb-2">Aniqlik vinti (mikrovint)</span>
                  <input type="range" min={0} max={100} value={focus} onChange={(e) => setFocus(Number(e.target.value))} className="w-full" aria-label="Aniqlik vinti" />
                </label>

                {!sharp && <Note tone="warn">Tasvir xira. Vintni sekin burab, hujayra devorlari aniq koʻringunicha sozlang. ×40 obyektivda fokus boshqa joyda boʻladi.</Note>}
                {sharp && zoom === 1 && <Note tone="info">Hujayralar koʻrinyapti. Tuzilmalarni nomlash uchun ×40 obyektivga oʻting.</Note>}

                {sharp && zoom > 1 && !isCompleted && (
                  <div className="grid gap-3">
                    <p className="text-sm font-semibold">Rasmdagi raqamlangan qismlarni nomlang:</p>
                    {[1, 2, 3].map((n) => (
                      <label key={n} className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-ink text-bg text-sm font-bold flex items-center justify-center shrink-0">{n}</span>
                        <select
                          className="input !py-2.5"
                          value={answers[n] || ""}
                          onChange={(e) => {
                            setAnswers((a) => ({ ...a, [n]: e.target.value }));
                            setVerdict(null);
                          }}
                          aria-label={`${n}-qism nomi`}
                        >
                          <option value="">Tanlang…</option>
                          {["Hujayra devori", "Xloroplast", "Vakuola", "Yadro", "Sitoplazma"].map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </label>
                    ))}
                    <button className="btn btn-primary" onClick={check} disabled={Object.keys(answers).length < 3}>
                      Tekshirish
                    </button>
                  </div>
                )}

                {verdict && <Note tone={verdict.ok ? "ok" : "err"}>{verdict.text}</Note>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LabShell>
  );
}
