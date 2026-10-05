"use client";

import { useMemo, useRef, useState } from "react";
import { Ruler, Scale, Thermometer, Minus, Plus, Check, RotateCcw } from "lucide-react";
import { LabShell, LabProps } from "./LabShell";
import { Briefing, Digit, Quiz, ResultCard, useLabRun, useRaf, sfx, type Q, type Run } from "./kit";

const MISSIONS = [
  { title: "Tarozi", instruction: "Obyektning massasini tarozida toping: toshlarni oʻng pallaga qoʻyib, muvozanatga keltiring." },
  { title: "Termometr", instruction: "Uchta idishdagi suvning haroratini termometrdan aniq oʻqing." },
  { title: "Chizgʻich", instruction: "Chizgʻichni 0 belgisiga moslab, kitobning boʻyi va enini santimetrda oʻlchang." },
];

const QUIZ: Q[] = [
  {
    q: "Termometr shkalasini oʻqiyotganda koʻz qayerda boʻlishi kerak?",
    options: ["Termometrdan yuqorida", "Simob ustuni bilan bir sathda (toʻgʻri qarab)", "Termometrdan pastda"],
    answer: 1,
    explain: "Yon tomondan qaralsa, parallaks xatosi paydo boʻladi. Oʻqish uchun koʻz simob ustuni uchi bilan bir sathda boʻlishi kerak.",
  },
  {
    q: "Chizgʻich bilan oʻlchashni qayerdan boshlash kerak?",
    options: ["Chizgʻichning chetidan", "Chizgʻichning 0 belgisidan", "1 sm belgisidan"],
    answer: 1,
    explain: "Obyekt chetini aynan 0 belgisiga moslash kerak. Aks holda natijaga oʻzgarmas xato qoʻshiladi.",
  },
  {
    q: "Pallali tarozida jism massasi qachon aniqlanadi?",
    options: ["Pallalardan biri pastga tushganda", "Pallalar muvozanatda turganda", "Toshlar soni 10 ta boʻlganda"],
    answer: 1,
    explain: "Muvozanatda pallalar bir xil sathda turadi — chap pallada jism massasi oʻng pallaga qoʻyilgan toshlar yigʻindisiga teng.",
  },
];

const LEARNED = [
  "Pallali tarozida massa muvozanat holatida toshlar yigʻindisiga teng boʻladi (gramm).",
  "Termometr shkalasi koʻz simob ustuni bilan bir sathda turib oʻqiladi.",
  "Chizgʻich bilan oʻlchashda obyektning chetini 0 belgisiga moslash kerak.",
];

/* ═════════════ 1. Tarozi ═════════════ */
const STOCK = [100, 50, 20, 20, 10, 5, 2, 1];
const OBJECTS = [
  { name: "Olma", m: 168, color: "#ff5d6c" },
  { name: "Kartoshka", m: 137, color: "#d8b46a" },
  { name: "Limon", m: 93, color: "#ffd84a" },
];

function BalanceStage({ run, onDone }: { run: Run; onDone: () => void }) {
  const obj = useMemo(() => OBJECTS[Math.floor(Math.random() * OBJECTS.length)], []);
  const [used, setUsed] = useState<number[]>([]);
  const [angle, setAngle] = useState(-12);
  const [balanced, setBalanced] = useState(false);
  const sum = used.reduce((s, i) => s + STOCK[i], 0);
  const diff = obj.m - sum;
  const target = -Math.max(-1, Math.min(1, diff / 25)) * 12;
  const tgt = useRef(target); tgt.current = target;
  const ang = useRef(angle);

  useRaf((dt) => {
    ang.current += (tgt.current - ang.current) * Math.min(1, dt * 5);
    setAngle(Math.abs(ang.current - angle) > 0.01 ? ang.current : angle);
  }, true);

  const toggle = (i: number) => {
    if (balanced) return;
    sfx("pop");
    const n = used.includes(i) ? used.filter((x) => x !== i) : [...used, i];
    setUsed(n);
    const s = n.reduce((acc, k) => acc + STOCK[k], 0);
    if (!used.includes(i) && s > obj.m + 40) run.mistake("Juda koʻp tosh qoʻydingiz. Kattasini olib, kichik toshlar bilan aniqlashtiring.");
    if (s === obj.m) {
      setBalanced(true);
      run.good(`Muvozanat! ${obj.name} massasi = ${obj.m} g`);
      run.note(`${obj.name} massasi ${obj.m} g ekanligi aniqlandi.`);
    }
  };

  const a = (angle * Math.PI) / 180;
  const L = 190, px = 280, py = 100;
  const lx = px - L * Math.cos(a), ly = py - L * Math.sin(a);
  const rx = px + L * Math.cos(a), ry = py + L * Math.sin(a);

  return (
    <div className="grid @3xl:grid-cols-[1fr_17rem] gap-5 items-start">
      <div className="rounded-2xl border border-line bg-[#050c14] stage-grid overflow-hidden">
        <svg viewBox="0 0 560 360" className="w-full" role="img" aria-label="Pallali tarozi">
          <defs>
            <linearGradient id="bl-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4e6f9c" /><stop offset=".5" stopColor="#8fb0dc" /><stop offset="1" stopColor="#3b587f" /></linearGradient>
          </defs>
          <rect x="120" y="328" width="320" height="16" rx="8" fill="url(#bl-metal)" />
          <rect x="272" y="104" width="16" height="228" rx="6" fill="url(#bl-metal)" />
          <path d="M240 328 L280 250 L320 328" fill="#2c4566" fillOpacity=".6" />
          {/* tebranish */}
          <g transform={`rotate(${angle} ${px} ${py})`}>
            <rect x={px - L} y={py - 6} width={2 * L} height="12" rx="6" fill="url(#bl-metal)" style={{ filter: "drop-shadow(0 0 8px rgba(90,176,255,.5))" }} />
            <circle cx={px - L} cy={py} r="8" fill="#c9d6e5" /><circle cx={px + L} cy={py} r="8" fill="#c9d6e5" />
          </g>
          <circle cx={px} cy={py} r="13" fill="#e8f4ff" stroke="#5ab0ff" strokeWidth="3" />
          <path d={`M${px} ${py - 10} L${px} ${py - 52}`} stroke="#ffc857" strokeWidth="3" strokeLinecap="round" />
          {/* oʻqlar */}
          <path d={`M${px - 16} ${py - 62} h32`} stroke="#86a3bb" strokeWidth="2" />
          {/* chap pallasi */}
          <g>
            <path d={`M${lx} ${ly} L${lx - 56} ${ly + 120} M${lx} ${ly} L${lx + 56} ${ly + 120}`} stroke="#8fb0dc" strokeWidth="1.5" />
            <path d={`M${lx - 66} ${ly + 120} h132 a66 14 0 0 1 -132 0z`} fill="#8fb0dc" fillOpacity=".3" stroke="#cfe3ff" strokeWidth="2" />
            <circle cx={lx} cy={ly + 94} r="24" fill={obj.color} stroke="#fff" strokeOpacity=".5" strokeWidth="2" />
            <path d={`M${lx} ${ly + 70} q6 -12 14 -12`} stroke="#4be38a" strokeWidth="3" fill="none" strokeLinecap="round" />
            <text x={lx} y={ly + 160} textAnchor="middle" fill="#e8f4ff" fontSize="14" fontWeight="700">{obj.name}</text>
          </g>
          {/* oʻng pallasi */}
          <g>
            <path d={`M${rx} ${ry} L${rx - 56} ${ry + 120} M${rx} ${ry} L${rx + 56} ${ry + 120}`} stroke="#8fb0dc" strokeWidth="1.5" />
            <path d={`M${rx - 66} ${ry + 120} h132 a66 14 0 0 1 -132 0z`} fill="#8fb0dc" fillOpacity=".3" stroke="#cfe3ff" strokeWidth="2" />
            {used.map((i, k) => {
              const wgt = STOCK[i];
              const hgt = 12 + Math.min(14, wgt / 8);
              const wid = 24 + Math.min(34, wgt / 2.5);
              const yTop = ry + 120 - (k + 1) * 0 - hgt;
              const col = k % 2 ? 36 : -36;
              return (
                <g key={i} transform={`translate(${rx + (k % 3 - 1) * (wid / 1.6)} ${yTop - Math.floor(k / 3) * 22})`}>
                  <rect x={-wid / 2} y="0" width={wid} height={hgt} rx="4" fill="#ffc857" stroke="#fff3c4" strokeWidth="1.5" />
                  <text x="0" y={hgt / 2 + 4} textAnchor="middle" fill="#2a1d00" fontSize="10" fontWeight="800">{wgt}</text>
                </g>
              );
            })}
          </g>
          {balanced && <text x="280" y="40" textAnchor="middle" fill="#4be38a" fontSize="18" fontWeight="800" style={{ filter: "drop-shadow(0 0 10px #4be38a)" }}>MUVOZANAT ✓</text>}
        </svg>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Digit label="Toshlar" value={sum} unit="g" tone="accent" />
          <Digit label="Holat" value={balanced ? "teng" : Math.abs(diff) < 1 ? "teng" : diff > 0 ? "chap" : "oʻng"} tone={balanced ? "brand" : "info"} />
        </div>
        <div className="glass p-4">
          <p className="eyebrow !text-muted mb-3">Toshlar (bosing)</p>
          <div className="flex flex-wrap gap-2">
            {STOCK.map((w, i) => (
              <button key={i} disabled={balanced && !used.includes(i)} onClick={() => toggle(i)} className={`w-12 h-12 rounded-xl font-mono font-extrabold text-sm border transition-all ${used.includes(i) ? "bg-line border-line-strong text-muted scale-90" : "bg-accent-soft border-accent/50 text-accent hover:-translate-y-0.5 hover:shadow-[0_0_14px_rgba(255,200,87,.5)]"}`}>
                {w}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted mt-3 leading-relaxed">Avval katta toshdan boshlang. Pallalar tenglashguncha qoʻying yoki olib tashlang.</p>
        </div>
        {balanced ? (
          <button className="btn btn-primary btn-lg anim-pop" onClick={onDone}>Termometrga oʻtish →</button>
        ) : (
          <button className="btn btn-ghost" onClick={() => { setUsed([]); sfx("click"); }}><RotateCcw className="w-4 h-4" /> Toshlarni olib tashlash</button>
        )}
      </div>
    </div>
  );
}

/* ═════════════ 2. Termometr ═════════════ */
const CUPS = [
  { name: "Sovuq suv", t: 8.5, color: "#5ab0ff", ice: true },
  { name: "Xona suvi", t: 23, color: "#7ee0d0", ice: false },
  { name: "Iliq suv", t: 41.5, color: "#ffb35a", ice: false },
];

function ThermoStage({ run, onDone }: { run: Run; onDone: () => void }) {
  const [sel, setSel] = useState(1);
  const [vals, setVals] = useState<number[]>([20, 20, 20]);
  const [ok, setOk] = useState<boolean[]>([false, false, false]);
  const [merc, setMerc] = useState(20);
  const mercT = useRef(CUPS[1].t); mercT.current = CUPS[sel].t;
  const m = useRef(20);
  useRaf((dt) => {
    m.current += (mercT.current - m.current) * Math.min(1, dt * 2.2);
    setMerc(Math.abs(m.current - merc) > 0.01 ? m.current : merc);
  }, true);

  const allOk = ok.every(Boolean);
  const check = () => {
    const good = Math.abs(vals[sel] - CUPS[sel].t) <= 0.5;
    if (good) {
      setOk((o) => o.map((v, i) => (i === sel ? true : v)));
      run.good(`${CUPS[sel].name}: ${CUPS[sel].t} °C — toʻgʻri oʻqildi!`);
      run.note(`${CUPS[sel].name} harorati ${CUPS[sel].t} °C.`);
    } else {
      run.mistake(`Notoʻgʻri. Koʻz simob uchi bilan bir sathda boʻlsin: ${vals[sel] > CUPS[sel].t ? "haroratni pastroq" : "haroratni yuqoriroq"} oʻqing.`);
    }
  };
  const step = (d: number) => setVals((v) => v.map((x, i) => (i === sel ? Math.max(-10, Math.min(60, Math.round((x + d) * 2) / 2)) : x)));

  const top = 40, bot = 300; // shkala (0..50 °C)
  const Y = (t: number) => bot - (t / 50) * (bot - top);

  return (
    <div className="grid @3xl:grid-cols-[1fr_17rem] gap-5 items-start">
      <div className="rounded-2xl border border-line bg-[#050c14] stage-grid overflow-hidden">
        <svg viewBox="0 0 640 360" className="w-full" role="img" aria-label="Termometr va uchta idish">
          {/* idishlar */}
          {CUPS.map((c, i) => {
            const x = 70 + i * 130;
            return (
              <g key={c.name} onClick={() => { setSel(i); sfx("click"); }} style={{ cursor: "pointer" }}>
                <rect x={x - 54} y="196" width="108" height="130" rx="10" fill="rgba(160,210,255,.07)" stroke={sel === i ? "#2ee6c0" : "rgba(190,230,255,.6)"} strokeWidth={sel === i ? 3 : 2} style={sel === i ? { filter: "drop-shadow(0 0 12px rgba(46,230,192,.6))" } : undefined} />
                <rect x={x - 51} y="226" width="102" height="97" rx="7" fill={c.color} fillOpacity=".5" />
                {c.ice && [0, 1, 2].map((k) => (<rect key={k} x={x - 34 + k * 26} y={232 + (k % 2) * 8} width="20" height="20" rx="4" fill="#e8f7ff" fillOpacity=".75" transform={`rotate(${k * 12 - 10} ${x - 24 + k * 26} ${242})`} />))}
                <text x={x} y="352" textAnchor="middle" fill={sel === i ? "#86f7e0" : "#86a3bb"} fontSize="13" fontWeight="700">{c.name}</text>
                {ok[i] && <text x={x} y="186" textAnchor="middle" fill="#4be38a" fontSize="16" fontWeight="800">✓ {c.t} °C</text>}
              </g>
            );
          })}
          {/* termometr tushirilgan */}
          <g transform={`translate(${70 + sel * 130 + 20} 0)`} style={{ transition: "transform .5s cubic-bezier(.2,.8,.2,1)" }}>
            <rect x="-5" y="60" width="10" height="240" rx="5" fill="rgba(230,245,255,.2)" stroke="#e8f4ff" strokeWidth="1.5" />
            <circle cx="0" cy="300" r="9" fill="#ff4d5e" stroke="#e8f4ff" strokeWidth="1.5" />
            <rect x="-2" y={60 + 240 - ((merc + 10) / 70) * 230} width="4" height={((merc + 10) / 70) * 230 + 4} fill="#ff4d5e" />
          </g>
          {/* katta shkala */}
          <g transform="translate(535 0)">
            <rect x="-26" y={top - 14} width="52" height={bot - top + 38} rx="26" fill="rgba(230,245,255,.1)" stroke="#e8f4ff" strokeOpacity=".8" strokeWidth="2" />
            <circle cx="0" cy={bot + 22} r="17" fill="#ff4d5e" />
            <rect x="-5" y={Y(merc)} width="10" height={bot + 22 - Y(merc)} fill="#ff4d5e" style={{ filter: "drop-shadow(0 0 8px #ff4d5e)" }} />
            {Array.from({ length: 51 }).map((_, t) => (
              <g key={t}>
                <line x1="30" x2={t % 10 === 0 ? 46 : t % 5 === 0 ? 40 : 35} y1={Y(t)} y2={Y(t)} stroke="#e8f4ff" strokeOpacity=".85" />
                {t % 10 === 0 && <text x="52" y={Y(t) + 4} textAnchor="start" fill="#e8f4ff" fontSize="12" fontWeight="700">{t}</text>}
              </g>
            ))}
            <text x="0" y={top - 24} textAnchor="middle" fill="#86a3bb" fontSize="12" fontWeight="700">°C</text>
          </g>
        </svg>
      </div>

      <div className="grid gap-4">
        <div className="glass p-4">
          <p className="eyebrow !text-muted mb-3">Siz oʻqigan qiymat: {CUPS[sel].name}</p>
          <div className="flex items-center justify-between gap-3 mb-4">
            <button className="btn btn-ghost !px-3" onClick={() => step(-0.5)} aria-label="0,5 ga kamaytirish" disabled={ok[sel]}><Minus className="w-4 h-4" /></button>
            <span className="font-mono text-3xl font-bold text-accent tabular-nums">{vals[sel].toFixed(1).replace(".", ",")}<span className="text-sm text-muted ml-1">°C</span></span>
            <button className="btn btn-ghost !px-3" onClick={() => step(0.5)} aria-label="0,5 ga oshirish" disabled={ok[sel]}><Plus className="w-4 h-4" /></button>
          </div>
          <button className="btn btn-primary w-full" onClick={check} disabled={ok[sel]}>{ok[sel] ? <><Check className="w-4 h-4" /> Qabul qilindi</> : "Tekshirish"}</button>
        </div>
        <div className="glass p-4 grid gap-2 text-sm">
          {CUPS.map((c, i) => (
            <button key={c.name} onClick={() => setSel(i)} className={`flex justify-between rounded-lg px-3 py-2 font-semibold ${ok[i] ? "bg-ok-soft text-ok" : sel === i ? "bg-brand-soft text-brand" : "bg-black/20 text-muted"}`}>
              <span>{c.name}</span><span className="font-mono">{ok[i] ? `${c.t} °C` : "?"}</span>
            </button>
          ))}
        </div>
        {allOk && <button className="btn btn-primary btn-lg anim-pop" onClick={onDone}>Chizgʻichga oʻtish →</button>}
      </div>
    </div>
  );
}

/* ═════════════ 3. Chizgʻich ═════════════ */
const PX = 27; // 1 sm = 27 birlik
const X0 = 60;
const BOOK = { L: 21.4, W: 14.8 };

function RulerStage({ run, onDone }: { run: Run; onDone: () => void }) {
  const [off, setOff] = useState(-2.3); // chizgʻich 0 belgisining kitob chetiga nisbatan siljishi (sm)
  const [cur, setCur] = useState(10);
  const [aligned, setAligned] = useState(false);
  const [which, setWhich] = useState<"L" | "W">("L");
  const [got, setGot] = useState<{ L?: number; W?: number }>({});
  const target = BOOK[which];
  const vertical = which === "W";

  const tryAlign = () => {
    if (Math.abs(off) <= 0.1) { setAligned(true); run.good("Chizgʻichning 0 belgisi kitob chetiga toʻgʻri qoʻyildi."); }
    else run.mistake(`Hali 0 belgisi kitob chetiga mos kelmadi (${off > 0 ? "chapga" : "oʻngga"} suring).`);
  };
  const confirm = () => {
    const reading = cur;
    if (Math.abs(reading - target) <= 0.15) {
      run.good(`${which === "L" ? "Boʻyi" : "Eni"}: ${target.toFixed(1).replace(".", ",")} sm — toʻgʻri!`);
      run.note(`Kitob ${which === "L" ? "boʻyi" : "eni"} ${target} sm.`);
      setGot((g) => ({ ...g, [which]: target }));
      if (which === "L") { setWhich("W"); setCur(8); }
    } else run.mistake(`Hairline kitob chetida emas. Hozir ${reading.toFixed(1).replace(".", ",")} sm koʻrsatyapti.`);
  };

  const bookW = BOOK.L * PX, bookH = BOOK.W * PX;
  return (
    <div className="grid @3xl:grid-cols-[1fr_17rem] gap-5 items-start">
      <div className="rounded-2xl border border-line bg-[#050c14] stage-grid overflow-hidden">
        <svg viewBox="0 0 700 330" className="w-full" role="img" aria-label="Chizgʻich va kitob">
          {/* kitob */}
          <g>
            {!vertical ? (
              <>
                <rect x={X0} y="30" width={bookW} height="130" rx="6" fill="#2a5db0" stroke="#7aa7ee" strokeWidth="2" />
                <rect x={X0 + 10} y="40" width={bookW - 20} height="110" rx="3" fill="none" stroke="#9fc2ff" strokeOpacity=".5" />
                <text x={X0 + bookW / 2} y="105" textAnchor="middle" fill="#e8f4ff" fontSize="26" fontWeight="800" fontFamily="var(--font-display)">BIOLOGIYA</text>
              </>
            ) : (
              <>
                <rect x={X0} y="14" width={BOOK.W * PX} height="150" rx="6" fill="#2a5db0" stroke="#7aa7ee" strokeWidth="2" transform="translate(0 0)" />
                <text x={X0 + (BOOK.W * PX) / 2} y="96" textAnchor="middle" fill="#e8f4ff" fontSize="22" fontWeight="800" fontFamily="var(--font-display)">BIOLOGIYA</text>
              </>
            )}
          </g>
          {/* chizgʻich */}
          <g transform={`translate(${X0 + off * PX} 176)`}>
            <rect x="0" y="0" width={25 * PX} height="64" rx="5" fill="#ffc857" fillOpacity=".16" stroke="#ffc857" strokeWidth="2" />
            {Array.from({ length: 251 }).map((_, mm) => (
              <line key={mm} x1={mm * (PX / 10)} x2={mm * (PX / 10)} y1="0" y2={mm % 10 === 0 ? 28 : mm % 5 === 0 ? 20 : 12} stroke="#ffc857" strokeWidth={mm % 10 === 0 ? 1.6 : 1} />
            ))}
            {Array.from({ length: 26 }).map((_, cm) => (
              <text key={cm} x={cm * PX} y="46" textAnchor="middle" fill="#ffd98a" fontSize="12" fontWeight="700">{cm}</text>
            ))}
            <text x={25 * PX - 10} y="60" textAnchor="end" fill="#ffd98a" fontSize="10" fontWeight="700">sm</text>
            <path d="M0 0 v-20" stroke="#ff6b7a" strokeWidth="3" strokeLinecap="round" />
            <text x="0" y="-26" textAnchor="middle" fill="#ff6b7a" fontSize="11" fontWeight="800">0</text>
          </g>
          {/* oʻqish chizigʻi */}
          {aligned && (
            <g>
              <line x1={X0 + cur * PX} x2={X0 + cur * PX} y1="0" y2="250" stroke="#2ee6c0" strokeWidth="2" strokeDasharray="5 4" style={{ filter: "drop-shadow(0 0 8px #2ee6c0)" }} />
              <rect x={X0 + cur * PX - 36} y="252" width="72" height="22" rx="8" fill="#04140d" stroke="#2ee6c0" />
              <text x={X0 + cur * PX} y="268" textAnchor="middle" fill="#86f7e0" fontSize="13" fontWeight="800" fontFamily="ui-monospace, monospace">{cur.toFixed(1).replace(".", ",")} sm</text>
            </g>
          )}
        </svg>
      </div>

      <div className="grid gap-4 content-start">
        <div className="grid grid-cols-2 gap-3">
          <Digit label="Boʻyi" value={got.L ? got.L.toFixed(1).replace(".", ",") : "?"} unit="sm" tone={got.L ? "brand" : "info"} />
          <Digit label="Eni" value={got.W ? got.W.toFixed(1).replace(".", ",") : "?"} unit="sm" tone={got.W ? "brand" : "info"} />
        </div>
        {!aligned ? (
          <div className="glass p-4 grid gap-4">
            <label className="block">
              <span className="text-sm font-semibold flex justify-between mb-2">Chizgʻichni siljitish <span className="font-mono text-accent">{off.toFixed(1).replace(".", ",")} sm</span></span>
              <input type="range" min={-4} max={4} step={0.1} value={off} onChange={(e) => setOff(+e.target.value)} className="w-full" aria-label="Chizgʻichni siljitish" />
            </label>
            <p className="text-xs text-muted leading-relaxed">Qizil 0 belgisini kitobning chap chetiga aniq moslang.</p>
            <button className="btn btn-primary" onClick={tryAlign}>Moslashni tasdiqlash</button>
          </div>
        ) : (
          <div className="glass p-4 grid gap-4">
            <label className="block">
              <span className="text-sm font-semibold flex justify-between mb-2">{which === "L" ? "Boʻyi" : "Eni"} — oʻqish chizigʻi <span className="font-mono text-accent">{cur.toFixed(1).replace(".", ",")} sm</span></span>
              <input type="range" min={0} max={25} step={0.1} value={cur} onChange={(e) => setCur(+e.target.value)} className="w-full" aria-label="Oʻqish chizigʻi" />
            </label>
            <p className="text-xs text-muted leading-relaxed">Chiziqni kitobning {which === "L" ? "oʻng" : "oʻng"} chetiga keltiring (santimetr va millimetr aniqligida).</p>
            <button className="btn btn-primary" onClick={confirm} disabled={!!got[which]}>Oʻlchovni qabul qilish</button>
          </div>
        )}
        {got.L && got.W && <button className="btn btn-primary btn-lg anim-pop" onClick={onDone}>Bilimni tekshirish →</button>}
      </div>
    </div>
  );
}

/* ═════════════ Asosiy ═════════════ */
export default function MeasurementLab({ lab, completeLab, isCompleted, restart }: LabProps) {
  const run = useLabRun(completeLab, isCompleted);
  const [phase, setPhase] = useState<"brief" | "balance" | "thermo" | "ruler" | "quiz" | "done">("brief");
  const cur = phase === "brief" || phase === "balance" ? 0 : phase === "thermo" ? 1 : phase === "ruler" ? 2 : 3;
  const hint: Record<string, string> = {
    balance: "Avval 100 g toshdan boshlang; pallalar qaysi tomonga ogʻsa, shu tomonga qarab toshlarni qoʻshing yoki ayiring.",
    thermo: "Idishni bosing, simob koʻtarilishini kuting va shkaladan raqamni oʻqing (har kichik boʻlak = 1 °C).",
    ruler: "Avval 0 belgisini kitob chetiga moslang, keyin yashil chiziqni kitobning narigi chetiga keltiring.",
  };
  return (
    <LabShell
      heading="Oʻlchov asboblari"
      icon={Ruler}
      steps={MISSIONS}
      current={cur}
      done={phase === "done"}
      run={run}
      hint={hint[phase]}
      onHint={() => run.hint(hint[phase])}
    >
      {phase === "brief" && (
        <Briefing
          title="Aniq oʻlchash — fanning asosi"
          goals={[
            "Pallali tarozida jism massasini toping.",
            "Termometr bilan uchta idishdagi suv haroratini oʻlchang.",
            "Chizgʻich yordamida kitobning boʻyi va enini aniqlang.",
          ]}
          onStart={() => setPhase("balance")}
        />
      )}
      {phase === "balance" && <BalanceStage run={run} onDone={() => setPhase("thermo")} />}
      {phase === "thermo" && <ThermoStage run={run} onDone={() => setPhase("ruler")} />}
      {phase === "ruler" && <RulerStage run={run} onDone={() => setPhase("quiz")} />}
      {phase === "quiz" && <Quiz questions={QUIZ} run={run} onDone={() => { run.finish(); setPhase("done"); }} />}
      {phase === "done" && <ResultCard title="Oʻlchash: tajriba muvaffaqiyatli!" xp={lab.rewardXp} run={run} learned={LEARNED} onRepeat={restart} />}
    </LabShell>
  );
}
