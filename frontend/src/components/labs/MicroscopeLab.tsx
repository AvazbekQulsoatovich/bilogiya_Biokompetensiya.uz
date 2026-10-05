"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Microscope, Camera, Sun, Crosshair, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { LabShell, LabProps } from "./LabShell";
import { Briefing, Digit, Quiz, ResultCard, useCanvas, useLabRun, sfx, type Q } from "./kit";

const MISSIONS = [
  { title: "Preparat", instruction: "Elodeya bargidan vaqtinchalik preparat tayyorlang: buyum oynasi → barg → suv → qoplagich oyna." },
  { title: "Yoritish", instruction: "Koʻzguni burib, yorugʻlik nurini aynan preparat orqali yuqoriga yoʻnaltiring." },
  { title: "Kuzatish", instruction: "Tasvirni fokusga keltiring, ×40 ga oʻting va hujayra qismlarini belgilang." },
];

const QUIZ: Q[] = [
  {
    q: "Mikroskopning umumiy kattalashtirishi qanday hisoblanadi?",
    options: ["Obyektiv va okulyar kattalashtirishlari yigʻindisi", "Obyektiv va okulyar kattalashtirishlari koʻpaytmasi", "Faqat obyektivning kattalashtirishi"],
    answer: 1,
    explain: "Umumiy kattalashtirish = obyektiv × okulyar. Masalan, 40 × 10 = 400 marta.",
  },
  {
    q: "Nima uchun ×40 obyektivda faqat mikrovint (aniqlik vinti) bilan ishlanadi?",
    options: ["Mikrovint tasvirni yorqinroq qiladi", "Obyektiv preparatga juda yaqin boʻladi — makrovint bilan oyna sinishi mumkin", "Makrovint ×40 da ishlamaydi"],
    answer: 1,
    explain: "Kuchli obyektiv preparatga deyarli tegib turadi. Makrovintni burish preparat va linzani shikastlashi mumkin.",
  },
  {
    q: "Elodeya hujayrasidagi yashil donachalar qanday vazifa bajaradi?",
    options: ["Hujayrani himoya qiladi", "Fotosintez — yorugʻlik energiyasidan oziq moddalar hosil qiladi", "Hujayraga suv zaxirasini toʻplaydi"],
    answer: 1,
    explain: "Xloroplastlarda xlorofill bor. Ular yorugʻlikni tutib, fotosintez orqali organik moddalar va kislorod hosil qiladi.",
  },
];

const LEARNED = [
  "Vaqtinchalik preparat: buyum oynasi → obyekt → suv tomchisi → qoplagich oyna (havo pufakchasiz).",
  "Yorugʻlik koʻzgu orqali preparatga yoʻnaltiriladi, aks holda tasvir qorongʻi boʻladi.",
  "Elodeya hujayrasida hujayra devori, markaziy vakuola va aylanib harakatlanuvchi xloroplastlar koʻrinadi.",
  "Umumiy kattalashtirish = obyektiv × okulyar.",
];

/* ═════════════════ 1. Preparat tayyorlash ═════════════════ */
type ItemId = "slide" | "leaf" | "drop" | "cover" | "iodine" | "scissors";
const SEQ: ItemId[] = ["slide", "leaf", "drop", "cover"];
const ITEM_LABEL: Record<ItemId, string> = {
  slide: "Buyum oynasi", leaf: "Elodeya bargi", drop: "Pipetka (suv)", cover: "Qoplagich oyna", iodine: "Yod eritmasi", scissors: "Qaychi",
};
const STEP_HINT = [
  "Avval toza buyum oynasini stolga qoʻying.",
  "Endi elodeya bargini oyna ustiga joylashtiring.",
  "Bargga pipetka bilan bir tomchi suv tomizing.",
  "Oxirida qoplagich oynani qiya tutib, sekin yoping.",
];

function ItemIcon({ id }: { id: ItemId }) {
  const c = { className: "w-14 h-14", viewBox: "0 0 64 64", fill: "none" as const };
  switch (id) {
    case "slide": return (<svg {...c}><rect x="6" y="24" width="52" height="16" rx="2" fill="#9fd8ff" fillOpacity=".25" stroke="#9fd8ff" strokeWidth="2" /><rect x="10" y="27" width="14" height="10" fill="#fff" fillOpacity=".25" /></svg>);
    case "leaf": return (<svg {...c}><path d="M10 40 C 16 14, 44 10, 56 20 C 52 42, 28 54, 10 40Z" fill="#4be38a" fillOpacity=".8" stroke="#bff7d6" strokeWidth="2" /><path d="M12 40 C 26 34, 38 28, 52 22" stroke="#bff7d6" strokeWidth="1.5" /></svg>);
    case "drop": return (<svg {...c}><rect x="28" y="4" width="8" height="26" rx="3" fill="#9fd8ff" fillOpacity=".4" stroke="#9fd8ff" strokeWidth="2" /><path d="M32 30 v10" stroke="#9fd8ff" strokeWidth="3" strokeLinecap="round" /><path d="M32 60 c-8 -8 -8 -12 0 -18 c8 6 8 10 0 18z" fill="#5ab0ff" /></svg>);
    case "cover": return (<svg {...c}><rect x="14" y="26" width="36" height="12" rx="2" transform="rotate(-14 32 32)" fill="#fff" fillOpacity=".18" stroke="#fff" strokeOpacity=".8" strokeWidth="2" /></svg>);
    case "iodine": return (<svg {...c}><path d="M24 10 h16 v10 l8 12 v22 a4 4 0 0 1 -4 4 H20 a4 4 0 0 1 -4 -4 V32 l8 -12z" fill="#b8742c" fillOpacity=".65" stroke="#ffc857" strokeWidth="2" /></svg>);
    case "scissors": return (<svg {...c}><circle cx="20" cy="46" r="7" stroke="#c9d6e5" strokeWidth="2.5" /><circle cx="44" cy="46" r="7" stroke="#c9d6e5" strokeWidth="2.5" /><path d="M24 40 L44 10 M40 40 L20 10" stroke="#c9d6e5" strokeWidth="2.5" strokeLinecap="round" /></svg>);
  }
}

function Bench({ made }: { made: number }) {
  return (
    <svg viewBox="0 0 640 300" className="w-full h-full" role="img" aria-label="Laboratoriya stoli">
      <defs>
        <linearGradient id="bn-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#12304a" /><stop offset="1" stopColor="#081522" /></linearGradient>
        <radialGradient id="bn-spot" cx=".5" cy=".4" r=".6"><stop offset="0" stopColor="#2ee6c0" stopOpacity=".28" /><stop offset="1" stopColor="#2ee6c0" stopOpacity="0" /></radialGradient>
        <linearGradient id="bn-slide" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#cdeaff" stopOpacity=".5" /><stop offset=".5" stopColor="#9fd8ff" stopOpacity=".16" /><stop offset="1" stopColor="#cdeaff" stopOpacity=".42" /></linearGradient>
        <radialGradient id="bn-leaf" cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#7bf0a8" /><stop offset="1" stopColor="#1f9d55" /></radialGradient>
      </defs>
      <rect width="640" height="300" fill="url(#bn-top)" />
      <rect width="640" height="300" fill="url(#bn-spot)" />
      <path d="M0 232 H640" stroke="#2ee6c0" strokeOpacity=".35" />
      {/* jonli sirt chizigʻi */}
      {Array.from({ length: 14 }).map((_, i) => (<path key={i} d={`M${i * 50} 232 L${i * 50 - 40} 300`} stroke="#5ab0ff" strokeOpacity=".07" />))}
      <ellipse cx="320" cy="232" rx="230" ry="14" fill="#000" fillOpacity=".4" />

      {/* buyum oynasi */}
      {made >= 1 && (
        <motion.g initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 16 }}>
          <rect x="170" y="196" width="300" height="38" rx="3" fill="#000" fillOpacity=".35" transform="translate(6 8)" />
          <rect x="170" y="190" width="300" height="40" rx="3" fill="url(#bn-slide)" stroke="#cdeaff" strokeOpacity=".8" strokeWidth="2" />
          <rect x="176" y="196" width="60" height="28" rx="2" fill="#fff" fillOpacity=".16" />
          <path d="M180 194 H460" stroke="#fff" strokeOpacity=".5" />
        </motion.g>
      )}
      {/* barg */}
      {made >= 2 && (
        <motion.g initial={{ scale: 0.3, opacity: 0, y: -50 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 140, damping: 14 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <path d="M256 214 C 276 168, 372 164, 396 200 C 372 232, 288 236, 256 214Z" fill="url(#bn-leaf)" stroke="#c9ffe0" strokeWidth="1.5" />
          <path d="M262 212 C 300 200, 350 190, 392 200" stroke="#d7ffe6" strokeWidth="1.6" fill="none" />
          {[0, 1, 2, 3, 4, 5].map((i) => (<path key={i} d={`M${290 + i * 17} ${204 - (i % 2 ? 0 : 2)} l${i % 2 ? 6 : -6} ${i % 2 ? 18 : -16}`} stroke="#d7ffe6" strokeOpacity=".6" strokeWidth="1" fill="none" />))}
        </motion.g>
      )}
      {/* suv tomchisi */}
      {made >= 3 && (
        <g>
          <motion.circle cx="326" cy="150" r="7" fill="#7fc8ff" initial={{ cy: 90, opacity: 0.9 }} animate={{ cy: 190, opacity: 0 }} transition={{ duration: 0.6, ease: "easeIn" }} />
          <motion.ellipse cx="326" cy="204" rx="88" ry="18" fill="#7fc8ff" fillOpacity=".3" stroke="#9fd8ff" strokeOpacity=".8" strokeWidth="1.5" initial={{ scaleX: 0.1, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        </g>
      )}
      {/* qoplagich */}
      {made >= 4 && (
        <motion.g initial={{ rotate: -24, y: -34, opacity: 0 }} animate={{ rotate: 0, y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 90, damping: 14 }} style={{ transformBox: "fill-box", transformOrigin: "left center" }}>
          <rect x="270" y="176" width="112" height="22" rx="2" fill="#fff" fillOpacity=".14" stroke="#fff" strokeOpacity=".85" strokeWidth="2" />
          <path d="M276 180 H340" stroke="#fff" strokeOpacity=".6" />
        </motion.g>
      )}
      <text x="320" y="272" textAnchor="middle" fill="#86a3bb" fontSize="13" fontWeight="600">
        {made === 0 ? "Preparat hali tayyor emas" : made < 4 ? `Preparat tayyorlanmoqda… (${made}/4)` : "Preparat tayyor!"}
      </text>
    </svg>
  );
}

function PrepStage({ run, onDone }: { run: ReturnType<typeof useLabRun>; onDone: () => void }) {
  const [made, setMade] = useState(0);
  const [drag, setDrag] = useState<{ id: ItemId; x: number; y: number } | null>(null);
  const [shake, setShake] = useState<ItemId | null>(null);
  const zone = useRef<HTMLDivElement | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const dragRef = useRef(drag);
  dragRef.current = drag;

  const attempt = useCallback((id: ItemId) => {
    if (made >= 4) return;
    if (id === SEQ[made]) {
      const n = made + 1;
      setMade(n);
      run.good(n < 4 ? "Toʻgʻri!" : "Preparat tayyor! Endi uni mikroskop stoliga qoʻying.");
    } else {
      setShake(id);
      setTimeout(() => setShake(null), 450);
      run.mistake(SEQ.includes(id) ? `Hozir bu emas. Keyingi qadam: ${ITEM_LABEL[SEQ[made]]}.` : `${ITEM_LABEL[id]} bu tajribada kerak emas.`);
    }
  }, [made, run]);

  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d));
    const up = (e: PointerEvent) => {
      const d = dragRef.current;
      const s = start.current;
      setDrag(null);
      if (!d || !s) return;
      const moved = Math.hypot(e.clientX - s.x, e.clientY - s.y);
      const r = zone.current?.getBoundingClientRect();
      const over = r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (moved < 6 || over) attempt(d.id);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [!!drag, attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  const items: ItemId[] = ["iodine", "leaf", "cover", "scissors", "slide", "drop"];

  return (
    <div className="grid gap-5">
      <div ref={zone} className={`relative rounded-2xl border overflow-hidden h-[300px] md:h-[340px] transition-colors ${drag ? "border-brand shadow-[var(--glow)]" : "border-line"}`}>
        <Bench made={made} />
        {drag && <div className="absolute inset-0 border-2 border-dashed border-brand/60 rounded-2xl pointer-events-none flex items-start justify-center pt-3 text-xs font-bold tracking-widest text-brand">STOLGA TASHLANG</div>}
      </div>

      <div className="grid grid-cols-3 @xl:grid-cols-6 gap-3" aria-label="Laboratoriya buyumlari">
        {items.map((id) => {
          const used = SEQ.indexOf(id) >= 0 && SEQ.indexOf(id) < made;
          return (
            <button
              key={id}
              type="button"
              disabled={used || made >= 4}
              onPointerDown={(e) => { if (used) return; start.current = { x: e.clientX, y: e.clientY }; setDrag({ id, x: e.clientX, y: e.clientY }); }}
              className={`touch-none select-none rounded-2xl border p-3 flex flex-col items-center gap-1.5 transition-all cursor-grab active:cursor-grabbing ${used ? "border-ok/40 bg-ok-soft opacity-60" : "border-line bg-black/25 hover:border-brand hover:bg-brand-soft hover:-translate-y-0.5"} ${shake === id ? "animate-shake !border-danger" : ""}`}
            >
              {used ? <Check className="w-14 h-14 text-ok p-3" /> : <ItemIcon id={id} />}
              <span className="text-xs font-semibold text-center leading-tight">{ITEM_LABEL[id]}</span>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-muted text-center">{made < 4 ? <>Buyumni stolga <b className="text-ink">sudrab tashlang</b> (yoki bosing). {STEP_HINT[made]}</> : "Barcha qadamlar bajarildi."}</p>

      {made >= 4 && (
        <div className="flex justify-center anim-pop">
          <button className="btn btn-primary btn-lg" onClick={() => { sfx("whoosh"); onDone(); }}>
            <Microscope className="w-5 h-5" /> Preparatni mikroskop stoliga qoʻyish
          </button>
        </div>
      )}

      {drag && (
        <div className="fixed z-[100] pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-90 scale-110 drop-shadow-[0_10px_20px_rgba(0,0,0,.6)]" style={{ left: drag.x, top: drag.y }}>
          <ItemIcon id={drag.id} />
        </div>
      )}
    </div>
  );
}

/* ═════════════════ 2. Yoritish ═════════════════ */
function LightStage({ run, angle, setAngle, onDone }: { run: ReturnType<typeof useLabRun>; angle: number; setAngle: (n: number) => void; onDone: () => void }) {
  const q = Math.max(0, 1 - Math.abs(2 * angle - 90) / 36);
  const lit = q >= 0.9;
  const rad = (2 * angle * Math.PI) / 180;
  const mx = 240, my = 330;
  const len = 210;
  const ex = mx + Math.cos(rad) * len, ey = my - Math.sin(rad) * len;
  const told = useRef(false);
  useEffect(() => {
    if (lit && !told.current) { told.current = true; run.good("Nur aynan preparatga tushdi!"); }
  }, [lit]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grid @3xl:grid-cols-[1fr_18rem] gap-5 items-stretch">
      <div className="rounded-2xl border border-line overflow-hidden bg-[#050c14] relative h-[420px]">
        <div className="absolute inset-0 stage-grid opacity-50" />
        <svg viewBox="0 0 480 420" className="w-full h-full relative" role="img" aria-label="Mikroskop va koʻzgu">
          <defs>
            <linearGradient id="mt-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a5578" /><stop offset=".5" stopColor="#5d7fae" /><stop offset="1" stopColor="#2b415f" /></linearGradient>
            <linearGradient id="mt-beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ffe9a0" stopOpacity=".95" /><stop offset="1" stopColor="#ffe9a0" stopOpacity=".1" /></linearGradient>
            <radialGradient id="mt-lamp" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff2b8" /><stop offset="1" stopColor="#ffc857" stopOpacity="0" /></radialGradient>
          </defs>
          {/* shtativ */}
          <rect x="96" y="372" width="288" height="22" rx="8" fill="url(#mt-metal)" />
          <path d="M340 372 C 440 340 450 150 380 96 L 346 118 C 396 168 392 316 316 372 Z" fill="url(#mt-metal)" />
          <rect x="300" y="52" width="62" height="40" rx="8" fill="url(#mt-metal)" transform="rotate(-8 330 70)" />
          <rect x="196" y="92" width="52" height="70" rx="6" fill="#26405f" stroke="#7ba3d6" strokeOpacity=".5" />
          <rect x="190" y="30" width="64" height="62" rx="8" fill="url(#mt-metal)" />
          <rect x="204" y="162" width="26" height="22" rx="3" fill="#7ba3d6" />
          {/* stolcha */}
          <rect x="130" y="208" width="190" height="12" rx="3" fill="url(#mt-metal)" />
          <rect x="176" y="198" width="96" height="9" rx="1.5" fill="#cdeaff" fillOpacity=".5" stroke="#cdeaff" strokeOpacity=".8" />
          <ellipse cx="224" cy="196" rx="20" ry="3.5" fill="#4be38a" />
          {/* lampa */}
          <circle cx="40" cy={my} r="34" fill="url(#mt-lamp)" className="anim-glow" />
          <circle cx="40" cy={my} r="11" fill="#fff6c8" />
          <rect x="20" y={my + 14} width="40" height="30" rx="5" fill="#26405f" />
          {/* gorizontal nur */}
          <path d={`M52 ${my} H ${mx}`} stroke="#ffe9a0" strokeWidth="5" strokeOpacity=".7" strokeLinecap="round" />
          {/* qaytgan nur */}
          <line x1={mx} y1={my} x2={ex} y2={ey} stroke="#ffe9a0" strokeWidth={6 + q * 10} strokeOpacity={0.35 + q * 0.5} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px #ffc857)" }} />
          {lit && <polygon points={`${mx - 18},${my - 10} ${mx + 18},${my - 10} 232,200 216,200`} fill="url(#mt-beam)" opacity=".7" />}
          {/* koʻzgu */}
          <g transform={`rotate(${-angle} ${mx} ${my})`}>
            <rect x={mx - 36} y={my - 4} width="72" height="8" rx="3" fill="#cfe3ff" stroke="#fff" strokeOpacity=".8" style={{ filter: "drop-shadow(0 0 8px #9fd8ff)" }} />
          </g>
          <rect x={mx - 5} y={my + 4} width="10" height="40" fill="#3a5578" />
          <text x="40" y={my + 66} textAnchor="middle" fill="#86a3bb" fontSize="11" fontWeight="700">LAMPA</text>
          <text x={mx} y={my + 62} textAnchor="middle" fill="#86a3bb" fontSize="11" fontWeight="700">KOʻZGU</text>
          <text x="224" y="236" textAnchor="middle" fill="#86a3bb" fontSize="11" fontWeight="700">PREPARAT</text>
        </svg>
      </div>

      <div className="grid gap-4 content-start">
        <Digit label="Yoritilganlik" value={Math.round(q * 100)} unit="%" tone={lit ? "brand" : q > 0.4 ? "accent" : "danger"} />
        <label className="block glass p-4">
          <span className="text-sm font-semibold flex items-center gap-2 mb-3"><Sun className="w-4 h-4 text-accent" /> Koʻzgu burchagi: <span className="font-mono text-accent">{angle}°</span></span>
          <input type="range" min={10} max={80} value={angle} onChange={(e) => setAngle(+e.target.value)} className="w-full" aria-label="Koʻzgu burchagi" />
        </label>
        <p className={`rounded-xl border px-4 py-3 text-sm font-medium ${lit ? "border-ok/30 bg-ok-soft text-ok" : "border-accent/30 bg-accent-soft text-accent"}`}>
          {lit ? "Maydon yaxshi yoritildi. Davom etishingiz mumkin." : q < 0.4 ? "Nur preparatga tushmayapti. Koʻzguni sekin buring." : "Yaqinlashdingiz! Nur toʻgʻri yuqoriga ketishi kerak."}
        </p>
        <button className="btn btn-primary" disabled={!lit} onClick={onDone}>Kuzatishga oʻtish</button>
      </div>
    </div>
  );
}

/* ═════════════════ 3. Kuzatish ═════════════════ */
type Obj = 4 | 10 | 40;
const ZOOM: Record<Obj, number> = { 4: 1, 10: 2.5, 40: 7.2 };
const IDEAL: Record<Obj, number> = { 4: 28, 10: 50, 40: 72 };
const BLURK: Record<Obj, number> = { 4: 0.5, 10: 0.9, 40: 1.7 };
const W0 = 26, H0 = 15;
type Label = "Hujayra devori" | "Xloroplast" | "Vakuola";
type Mark = { label: Label; wx: number; wy: number };

function hash(i: number, j: number) {
  let a = (i * 73856093) ^ (j * 19349663);
  a = Math.imul(a ^ (a >>> 15), 0x2c1b3c6d);
  a = Math.imul(a ^ (a >>> 12), 0x297a2d39);
  return ((a ^ (a >>> 15)) >>> 0) / 4294967296;
}

function ScopeStage({ run, light, setLight, onDone }: { run: ReturnType<typeof useLabRun>; light: number; setLight: (n: number) => void; onDone: () => void }) {
  const [obj, setObj] = useState<Obj>(10);
  const [coarse, setCoarse] = useState(8);
  const [fine, setFine] = useState(0);
  const [pick, setPick] = useState<Label | null>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [shots, setShots] = useState<string[]>([]);
  const [flags, setFlags] = useState({ f10: false, f40: false });
  const S = useRef({ ox: 0, oy: 0, hits: { chl: [] as { x: number; y: number; r: number }[], vac: [] as { x: number; y: number; rx: number; ry: number }[], cells: [] as { x: number; y: number; w: number; h: number }[] }, size: 440, drag: null as null | { x: number; y: number; ox: number; oy: number; moved: number } });
  const cvEl = useRef<HTMLCanvasElement | null>(null);

  const eff = coarse + fine * 0.5;
  const blur = Math.min(16, Math.abs(eff - IDEAL[obj]) * 0.45 * BLURK[obj]);
  const sharp = blur < 1.1;
  const lightOk = light >= 40 && light <= 88;
  const bright = 0.12 + (light / 100) * 1.05;
  const washed = light > 88;

  const live = useRef({ obj, marks, sharp });
  live.current = { obj, marks, sharp };

  const setCv = useCanvas((g, w, h, dt, t) => {
    const s = S.current;
    s.size = w;
    const { obj: o, marks: mk } = live.current;
    const zoom = ZOOM[o] * (w / 440);
    const cx = w / 2, cy = h / 2;
    g.fillStyle = "#e4f3cf";
    g.fillRect(0, 0, w, h);
    const bgG = g.createRadialGradient(cx, cy, 20, cx, cy, w * 0.75);
    bgG.addColorStop(0, "rgba(255,255,230,.55)"); bgG.addColorStop(1, "rgba(150,190,120,.25)");
    g.fillStyle = bgG; g.fillRect(0, 0, w, h);

    const halfW = cx / zoom + W0, halfH = cy / zoom + H0;
    const i0 = Math.floor((s.ox - halfW) / W0) - 1, i1 = Math.ceil((s.ox + halfW) / W0) + 1;
    const j0 = Math.floor((s.oy - halfH) / H0) - 1, j1 = Math.ceil((s.oy + halfH) / H0) + 1;
    const hits = { chl: [] as { x: number; y: number; r: number }[], vac: [] as { x: number; y: number; rx: number; ry: number }[], cells: [] as { x: number; y: number; w: number; h: number }[] };
    const cw = W0 * zoom, ch = H0 * zoom;
    const detail = cw > 44;

    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const wx = i * W0 + (j & 1 ? W0 / 2 : 0) + W0 / 2;
        const wy = j * H0 + H0 / 2;
        const sx = cx + (wx - s.ox) * zoom, sy = cy + (wy - s.oy) * zoom;
        const rx = hash(i, j), ry = hash(j + 7, i - 3);
        // hujayra
        g.fillStyle = `rgba(${150 + rx * 20},${210 + ry * 20},${110 + rx * 15},.5)`;
        g.strokeStyle = "#4a8f3c";
        g.lineWidth = Math.max(1, cw * 0.035);
        g.beginPath(); g.roundRect(sx - cw / 2 + 0.5, sy - ch / 2 + 0.5, cw - 1, ch - 1, Math.min(6, cw * 0.06)); g.fill(); g.stroke();
        hits.cells.push({ x: sx, y: sy, w: cw, h: ch });
        if (detail) {
          // vakuola
          const vrx = cw * 0.3, vry = ch * 0.26;
          const vg = g.createRadialGradient(sx, sy, 2, sx, sy, vrx);
          vg.addColorStop(0, "rgba(245,255,238,.85)"); vg.addColorStop(1, "rgba(215,240,205,.6)");
          g.fillStyle = vg; g.strokeStyle = "rgba(90,150,80,.35)"; g.lineWidth = 1;
          g.beginPath(); g.ellipse(sx, sy, vrx, vry, 0, 0, 6.283); g.fill(); g.stroke();
          hits.vac.push({ x: sx, y: sy, rx: vrx, ry: vry });
        }
        // xloroplastlar (sitoplazma aylanishi)
        const n = 8 + Math.floor(rx * 4);
        const dir = ry > 0.5 ? 1 : -1;
        for (let k = 0; k < n; k++) {
          const a = (k / n) * 6.283 + rx * 6 + t * 0.35 * dir;
          const jit = 0.82 + 0.12 * Math.sin(k * 3.1 + rx * 9);
          const px = sx + Math.cos(a) * cw * 0.39 * jit, py = sy + Math.sin(a) * ch * 0.37 * jit;
          const pr = Math.max(1.2, cw * 0.06);
          g.fillStyle = "#2f9e44"; g.strokeStyle = "#1b6b2c"; g.lineWidth = Math.max(0.5, cw * 0.008);
          g.beginPath(); g.ellipse(px, py, pr * 1.25, pr * 0.85, a + 1.57, 0, 6.283); g.fill();
          if (detail) {
            g.stroke();
            g.fillStyle = "rgba(190,255,180,.55)";
            g.beginPath(); g.ellipse(px - pr * 0.3, py - pr * 0.25, pr * 0.45, pr * 0.28, a + 1.57, 0, 6.283); g.fill();
            hits.chl.push({ x: px, y: py, r: pr * 1.25 });
          }
        }
      }
    }
    s.hits = hits;

    // belgilar
    for (const m of mk) {
      const x = cx + (m.wx - s.ox) * zoom, y = cy + (m.wy - s.oy) * zoom;
      if (x < -50 || y < -50 || x > w + 50 || y > h + 50) continue;
      g.strokeStyle = "#0b1b2a"; g.lineWidth = 2.5; g.fillStyle = "#fff";
      g.beginPath(); g.arc(x, y, 8, 0, 6.283); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(x, y - 8); g.lineTo(x + 26, y - 30); g.stroke();
      g.font = "700 12px Inter, system-ui, sans-serif";
      const tw = g.measureText(m.label).width + 14;
      g.fillStyle = "#0b1b2a"; g.beginPath(); g.roundRect(x + 24, y - 44, tw, 22, 8); g.fill();
      g.fillStyle = "#86f7e0"; g.fillText(m.label, x + 31, y - 29);
    }

    // koʻrish maydoni uchun masshtab chizigʻi
    const bar = (50 / 4) * zoom; // ≈ 50 mkm
    g.fillStyle = "rgba(10,25,20,.8)"; g.fillRect(16, h - 30, bar + 2, 4);
    g.font = "700 11px ui-monospace, monospace"; g.fillText("50 µm", 16, h - 38);
  }, true);

  const setRefs = useCallback((el: HTMLCanvasElement | null) => { cvEl.current = el; setCv(el); }, [setCv]);

  /* fokus holatini kuzatish */
  useEffect(() => {
    if (!sharp || !lightOk) return;
    if (obj === 10 && !flags.f10) { setFlags((f) => ({ ...f, f10: true })); run.good("×100 da tasvir aniq! Endi ×400 ga oʻting."); }
    if (obj === 40 && !flags.f40) { setFlags((f) => ({ ...f, f40: true })); run.good("×400 da tasvir aniq. Endi qismlarni belgilang."); }
  }, [sharp, lightOk, obj]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeObj = (o: Obj) => {
    if (o === obj) return;
    sfx("whoosh");
    setObj(o);
    if (o === 40 && coarse > 85) run.mistake("Obyektiv preparatga juda yaqin! ×40 da faqat mikrovintdan foydalaning.");
  };

  /* sichqoncha: surish va bosish */
  const onDown = (e: React.PointerEvent) => {
    S.current.drag = { x: e.clientX, y: e.clientY, ox: S.current.ox, oy: S.current.oy, moved: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = S.current.drag;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    d.moved = Math.max(d.moved, Math.hypot(dx, dy));
    const zoom = ZOOM[obj] * (S.current.size / 440);
    S.current.ox = d.ox - dx / zoom;
    S.current.oy = d.oy - dy / zoom;
  };
  const onUp = (e: React.PointerEvent) => {
    const d = S.current.drag;
    S.current.drag = null;
    if (!d || d.moved > 5) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    click(e.clientX - r.left, e.clientY - r.top, r.width);
  };

  const click = (x: number, y: number, size: number) => {
    if (!pick) { run.say("info", "Avval pastdan nomni tanlang, keyin rasmdagi qismni bosing."); return; }
    if (obj !== 40 || !sharp || !lightOk) { run.mistake("Belgilash uchun ×40 obyektivda aniq va yorugʻ tasvir kerak."); return; }
    const sc = size / S.current.size;
    x /= sc; y /= sc;
    const hs = S.current.hits;
    const hitChl = hs.chl.find((c) => Math.hypot(c.x - x, c.y - y) <= c.r + 4);
    const hitVac = hs.vac.find((v) => ((x - v.x) / v.rx) ** 2 + ((y - v.y) / v.ry) ** 2 <= 1);
    const hitWall = hs.cells.find((c) => {
      const dx = Math.abs(x - c.x) - c.w / 2, dy = Math.abs(y - c.y) - c.h / 2;
      return Math.max(Math.abs(dx), Math.abs(dy)) <= 7 && (dx > -9 || dy > -9);
    });
    const kind: Label | null = hitChl ? "Xloroplast" : hitWall ? "Hujayra devori" : hitVac ? "Vakuola" : null;
    if (kind === pick) {
      const zoom = ZOOM[obj] * (S.current.size / 440);
      const wx = S.current.ox + (x - S.current.size / 2) / zoom, wy = S.current.oy + (y - S.current.size / 2) / zoom;
      setMarks((m) => [...m.filter((q) => q.label !== kind), { label: kind, wx, wy }]);
      run.good(`${kind} toʻgʻri belgilandi!`);
      run.note(`${kind} aniqlandi (×400).`);
      setPick(null);
    } else if (kind) {
      run.mistake(`Bu ${kind.toLowerCase()}, siz tanlagan “${pick}” emas.`);
    } else {
      run.mistake(`Bu yerda ${pick.toLowerCase()} yoʻq. ${pick === "Hujayra devori" ? "Hujayra chegarasidagi qalin chiziqni qidiring." : pick === "Xloroplast" ? "Yashil donachalarni qidiring." : "Hujayra markazidagi rangsiz boʻshliqni qidiring."}`);
    }
  };

  const nudge = (dx: number, dy: number) => {
    const zoom = ZOOM[obj];
    S.current.ox += (dx * 40) / zoom; S.current.oy += (dy * 40) / zoom;
    sfx("tick");
  };

  const snap = () => {
    const el = cvEl.current;
    if (!el) return;
    const tmp = document.createElement("canvas");
    tmp.width = 240; tmp.height = 240;
    tmp.getContext("2d")?.drawImage(el, 0, 0, 240, 240);
    setShots((s) => [...s.slice(-2), tmp.toDataURL("image/jpeg", 0.8)]);
    sfx("click");
    run.note(`Mikroskop rasmi olindi (×${obj * 10}).`);
  };

  const allMarked = marks.length === 3;
  const LABELS: Label[] = ["Hujayra devori", "Xloroplast", "Vakuola"];

  return (
    <div className="grid @3xl:grid-cols-[minmax(0,28rem)_1fr] gap-6 items-start">
      <div>
        <div className="relative mx-auto w-full max-w-[30rem] aspect-square rounded-full border-[12px] border-[#0c1b2b] shadow-[0_0_0_2px_#24506f,0_0_60px_-10px_rgba(46,230,192,.45)] overflow-hidden bg-black">
          <canvas
            ref={setRefs}
            className={`w-full h-full block touch-none ${pick ? "cursor-crosshair" : "cursor-grab"}`}
            style={{ filter: `blur(${blur}px) brightness(${bright}) contrast(${washed ? 0.65 : 1})`, transition: "filter .12s" }}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
            aria-label="Mikroskop koʻrish maydoni"
          />
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: "inset 0 0 70px 16px rgba(0,0,0,.78)" }} />
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "linear-gradient(#fff0 49.8%, #fff 50%, #fff0 50.2%), linear-gradient(90deg,#fff0 49.8%, #fff 50%, #fff0 50.2%)" }} />
          {!sharp && <div className="absolute bottom-[12%] inset-x-0 text-center text-xs font-bold tracking-widest text-danger drop-shadow">TASVIR XIRA</div>}
        </div>
        <div className="flex justify-center gap-2 mt-4 text-xs text-muted font-semibold">
          <Crosshair className="w-3.5 h-3.5" /> Tasvirni sudrab surish mumkin
        </div>
        {shots.length > 0 && (
          <div className="flex justify-center gap-2.5 mt-3">
            {shots.map((s, i) => (<img key={i} src={s} alt={`Mikroskop rasmi ${i + 1}`} className="w-16 h-16 rounded-xl border border-line-strong object-cover" />))}
          </div>
        )}
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-3 gap-3">
          <Digit label="Kattalashtirish" value={`×${obj * 10}`} tone="info" />
          <Digit label="Aniqlik" value={sharp ? "aniq" : "xira"} tone={sharp ? "brand" : "danger"} />
          <Digit label="Yorugʻlik" value={lightOk ? "yaxshi" : light < 40 ? "qorongʻi" : "ortiqcha"} tone={lightOk ? "brand" : "accent"} />
        </div>

        <div className="glass p-5 grid gap-5">
          <div>
            <p className="eyebrow !text-muted mb-2.5">Obyektiv (revolver)</p>
            <div className="grid grid-cols-3 gap-2">
              {([4, 10, 40] as Obj[]).map((o) => (
                <button key={o} onClick={() => changeObj(o)} className={`btn ${obj === o ? "btn-primary" : "btn-ghost"} !flex-col !gap-0.5 !py-2.5`}>
                  <span className="font-mono text-lg font-bold">×{o}</span>
                  <span className="text-[0.65rem] opacity-75 font-semibold">{o === 4 ? "kichik" : o === 10 ? "oʻrta" : "katta"}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block">
              <span className="text-sm font-semibold flex justify-between mb-2">Makrovint (qoʻpol) <span className="font-mono text-muted">{coarse}</span></span>
              <input type="range" min={0} max={100} value={coarse} onChange={(e) => setCoarse(+e.target.value)} className="w-full" aria-label="Makrovint" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold flex justify-between mb-2">Mikrovint (aniq) <span className="font-mono text-muted">{fine}</span></span>
              <input type="range" min={-10} max={10} step={1} value={fine} onChange={(e) => setFine(+e.target.value)} className="w-full" aria-label="Mikrovint" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-semibold flex justify-between mb-2"><span className="flex items-center gap-2"><Sun className="w-4 h-4 text-accent" /> Yorugʻlik</span> <span className="font-mono text-muted">{light}%</span></span>
            <input type="range" min={0} max={100} value={light} onChange={(e) => setLight(+e.target.value)} className="w-full" aria-label="Yorugʻlik" />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <div className="grid grid-cols-3 gap-1 w-[7.5rem]" aria-label="Stolcha harakati">
              <span /><button className="btn btn-ghost btn-sm !px-0" onClick={() => nudge(0, -1)} aria-label="Yuqoriga"><ArrowUp className="w-4 h-4" /></button><span />
              <button className="btn btn-ghost btn-sm !px-0" onClick={() => nudge(-1, 0)} aria-label="Chapga"><ArrowLeft className="w-4 h-4" /></button>
              <button className="btn btn-ghost btn-sm !px-0" onClick={() => nudge(0, 1)} aria-label="Pastga"><ArrowDown className="w-4 h-4" /></button>
              <button className="btn btn-ghost btn-sm !px-0" onClick={() => nudge(1, 0)} aria-label="Oʻngga"><ArrowRight className="w-4 h-4" /></button>
            </div>
            <button className="btn btn-ghost" onClick={snap}><Camera className="w-4 h-4" /> Suratga olish</button>
          </div>
        </div>

        <div className="glass p-5">
          <p className="eyebrow mb-1">Belgilash topshirigʻi</p>
          <p className="text-sm text-muted mb-3">Nomni tanlang, soʻng ×400 tasvirda shu qismni bosing.</p>
          <div className="flex flex-wrap gap-2">
            {LABELS.map((l) => {
              const done = marks.some((m) => m.label === l);
              return (
                <button key={l} disabled={done} onClick={() => { setPick(l); sfx("click"); }} className={`btn btn-sm ${done ? "!bg-ok-soft !text-ok" : pick === l ? "btn-primary" : "btn-ghost"}`}>
                  {done ? <Check className="w-3.5 h-3.5" /> : null} {l}
                </button>
              );
            })}
          </div>
          {allMarked && (
            <button className="btn btn-primary btn-lg mt-5 anim-pop" onClick={onDone}>Bilimni tekshirish →</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════ Asosiy komponent ═════════════════ */
export default function MicroscopeLab({ lab, completeLab, isCompleted, restart }: LabProps) {
  const run = useLabRun(completeLab, isCompleted);
  const [phase, setPhase] = useState<"brief" | "prep" | "light" | "scope" | "quiz" | "done">("brief");
  const [angle, setAngle] = useState(20);
  const [light, setLight] = useState(55);

  const cur = phase === "brief" || phase === "prep" ? 0 : phase === "light" ? 1 : 2;
  const hintText: Record<string, string> = {
    prep: "Tartib: buyum oynasi → elodeya bargi → pipetka (suv) → qoplagich oyna.",
    light: "Nur preparatga tik yuqoriga tushishi uchun koʻzgu burchagi 45° ga yaqin boʻlishi kerak.",
    scope: "Avval ×10 da makrovint bilan tasvirni aniqlang, keyin ×40 ga oʻtib faqat mikrovintni ishlating.",
  };

  let body: ReactNode = null;
  if (phase === "brief")
    body = (
      <Briefing
        title="Mikroskop ostida hayotni koʻring"
        goals={[
          "Elodeya bargidan vaqtinchalik preparat tayyorlang.",
          "Koʻzgu yordamida preparatni yoriting.",
          "Mikroskopda hujayrani aniqlab, uning qismlarini toping va belgilang.",
        ]}
        safety="Buyum va qoplagich oynalar nozik — ehtiyotkorlik bilan ishlang. Mikroskopni faqat ikki qoʻllab tutib koʻchiring."
        onStart={() => setPhase("prep")}
      />
    );
  if (phase === "prep") body = <PrepStage run={run} onDone={() => setPhase("light")} />;
  if (phase === "light") body = <LightStage run={run} angle={angle} setAngle={setAngle} onDone={() => setPhase("scope")} />;
  if (phase === "scope") body = <ScopeStage run={run} light={light} setLight={setLight} onDone={() => setPhase("quiz")} />;
  if (phase === "quiz") body = <Quiz questions={QUIZ} run={run} onDone={() => { run.finish(); setPhase("done"); }} />;
  if (phase === "done") body = <ResultCard title="Mikroskop: tajriba muvaffaqiyatli!" xp={lab.rewardXp} run={run} learned={LEARNED} onRepeat={restart} />;

  return (
    <LabShell
      heading="Mikroskop bilan ishlash"
      icon={Microscope}
      steps={MISSIONS}
      current={cur}
      done={phase === "done"}
      run={run}
      hint={hintText[phase]}
      onHint={() => run.hint(hintText[phase])}
    >
      {body}
    </LabShell>
  );
}
