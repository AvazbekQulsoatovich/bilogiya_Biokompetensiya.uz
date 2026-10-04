"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Ruler } from "lucide-react";
import { LabShell, LabProps, Note, StageTitle, Readout } from "./LabShell";

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

/* ───────── 1. Pallali tarozi ───────── */
const WEIGHTS = [500, 200, 200, 100, 50, 20, 20, 10];

function BalanceStage({ onDone }: { onDone: (mass: number) => void }) {
  const mass = useMemo(() => pick([130, 170, 240, 280, 350, 420, 460]), []);
  const objectName = useMemo(() => pick(["olma", "kartoshka", "limon", "nok"]), []);
  const [placed, setPlaced] = useState<number[]>([]); // WEIGHTS indekslari
  const sum = placed.reduce((s, i) => s + WEIGHTS[i], 0);
  const diff = mass - sum; // >0: chap pallada ogʻirroq
  const tilt = Math.max(-14, Math.min(14, diff / 12));
  const balanced = diff === 0;

  return (
    <div>
      <StageTitle sub={`Chap pallada ${objectName} turibdi. Oʻng pallaga toshlar (gir) qoʻyib, tarozini muvozanatga keltiring va massani aniqlang.`}>
        Tarozida tortish
      </StageTitle>

      <div className="lab-bench p-4 md:p-6 mb-5">
        <svg viewBox="0 0 440 230" className="w-full max-w-xl mx-auto" role="img" aria-label="Pallali tarozi">
          <rect x="205" y="60" width="30" height="150" rx="6" fill="#4a5f86" />
          <rect x="150" y="204" width="140" height="14" rx="6" fill="#2b3a55" />
          <motion.g animate={{ rotate: tilt }} style={{ originX: "220px", originY: "62px" }} transition={{ type: "spring", stiffness: 90, damping: 11 }}>
            <rect x="60" y="56" width="320" height="10" rx="5" fill="#33466a" />
            <circle cx="220" cy="61" r="9" fill="#e9b44c" />
            {/* chap palla */}
            <motion.g animate={{ rotate: -tilt }} style={{ originX: "60px", originY: "66px" }}>
              <line x1="60" y1="66" x2="20" y2="140" stroke="#6a85b5" strokeWidth="2" />
              <line x1="60" y1="66" x2="100" y2="140" stroke="#6a85b5" strokeWidth="2" />
              <path d="M10 140 h100 q-10 24 -50 24 q-40 0 -50 -24z" fill="#9fb4d6" stroke="#6a85b5" strokeWidth="2" />
              <ellipse cx="60" cy="128" rx="20" ry="14" fill={objectName === "limon" ? "#e8d44d" : objectName === "olma" ? "#d6453d" : objectName === "nok" ? "#b8c24a" : "#b98a55"} />
            </motion.g>
            {/* oʻng palla */}
            <motion.g animate={{ rotate: -tilt }} style={{ originX: "380px", originY: "66px" }}>
              <line x1="380" y1="66" x2="340" y2="140" stroke="#6a85b5" strokeWidth="2" />
              <line x1="380" y1="66" x2="420" y2="140" stroke="#6a85b5" strokeWidth="2" />
              <path d="M330 140 h100 q-10 24 -50 24 q-40 0 -50 -24z" fill="#9fb4d6" stroke="#6a85b5" strokeWidth="2" />
              {placed.map((wi, k) => (
                <g key={wi}>
                  <rect x={338 + (k % 4) * 21} y={140 - 14 - Math.floor(k / 4) * 15} width="19" height="13" rx="3" fill="#2b3a55" />
                  <text x={338 + (k % 4) * 21 + 9.5} y={140 - 4.5 - Math.floor(k / 4) * 15} fontSize="7" textAnchor="middle" fill="#fff" fontWeight="700">
                    {WEIGHTS[wi]}
                  </text>
                </g>
              ))}
            </motion.g>
          </motion.g>
        </svg>
      </div>

      <p className="text-sm font-semibold mb-2">Toshlar (gramm):</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {WEIGHTS.map((w, i) => {
          const on = placed.includes(i);
          return (
            <button
              key={i}
              onClick={() => setPlaced((p) => (on ? p.filter((x) => x !== i) : [...p, i]))}
              className={`btn btn-sm ${on ? "btn-primary" : "btn-ghost"}`}
              aria-pressed={on}
            >
              {w} g
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Readout label="Oʻng pallada" value={sum} unit="g" />
        <div className="flex-1 min-w-[14rem]">
          <Note tone={balanced ? "ok" : sum === 0 ? "info" : "warn"}>
            {balanced
              ? `Tarozi muvozanatda. ${objectName[0].toUpperCase() + objectName.slice(1)}ning massasi ${mass} g.`
              : sum === 0
              ? "Tarozi chap tomonga ogʻgan: obyekt ogʻirroq."
              : diff > 0
              ? "Chap palla ogʻirroq: yana tosh qoʻying."
              : "Oʻng palla ogʻirroq: ortiqcha toshni olib tashlang."}
          </Note>
        </div>
        <button className="btn btn-primary" disabled={!balanced} onClick={() => onDone(mass)}>
          Natijani qayd etish
        </button>
      </div>
    </div>
  );
}

/* ───────── 2. Termometr ───────── */
function ThermometerStage({ onDone }: { onDone: (t: number) => void }) {
  const temp = useMemo(() => pick([18, 19, 20, 21, 22, 23, 24, 25, 26, 27]), []);
  const [val, setVal] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const MIN = 10;
  const MAX = 40;
  const H = 200;
  const y = (t: number) => 230 - ((t - MIN) / (MAX - MIN)) * H;

  const check = () => {
    const n = Number(val.replace(",", "."));
    if (Number.isNaN(n)) return setMsg({ ok: false, text: "Haroratni raqam bilan yozing." });
    if (Math.abs(n - temp) < 0.01) {
      setMsg({ ok: true, text: `Toʻgʻri! Xona harorati ${temp} °C.` });
      setTimeout(() => onDone(temp), 600);
    } else {
      setMsg({ ok: false, text: "Notoʻgʻri oʻqildi. Simob ustuni tepasi qaysi chiziqqa toʻgʻri kelishiga eʼtibor bering (har bir chiziq — 1 °C)." });
    }
  };

  return (
    <div>
      <StageTitle sub="Simob ustuni tepasidagi shkala qiymatini oʻqing. Shkaladagi har bir mayda chiziq 1 °C ni bildiradi.">
        Xona haroratini aniqlash
      </StageTitle>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center">
        <div className="lab-bench p-5 flex justify-center">
          <svg viewBox="0 0 150 260" className="h-72" role="img" aria-label="Termometr">
            <rect x="52" y="20" width="26" height="220" rx="13" fill="rgba(255,255,255,0.7)" stroke="#6a85b5" strokeWidth="2" />
            <circle cx="65" cy="232" r="19" fill="#d6453d" stroke="#6a85b5" strokeWidth="2" />
            <rect x="60" y={y(temp)} width="10" height={232 - y(temp)} fill="#d6453d" />
            {Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i).map((t) => (
              <g key={t}>
                <line x1="84" x2={t % 5 === 0 ? 100 : 93} y1={y(t)} y2={y(t)} stroke="currentColor" strokeWidth={t % 5 === 0 ? 1.4 : 0.8} opacity={t % 5 === 0 ? 0.9 : 0.5} />
                {t % 5 === 0 && (
                  <text x="104" y={y(t) + 3.5} fontSize="10" fill="currentColor" fontWeight="600">
                    {t}
                  </text>
                )}
              </g>
            ))}
            <text x="128" y="14" fontSize="10" fill="currentColor" opacity="0.6">°C</text>
          </svg>
        </div>

        <div className="grid gap-4 max-w-sm">
          <label className="block">
            <span className="text-sm font-semibold block mb-2">Termometr koʻrsatkichi (°C)</span>
            <input
              className="input !text-xl !font-mono"
              inputMode="decimal"
              value={val}
              onChange={(e) => {
                setVal(e.target.value);
                setMsg(null);
              }}
              placeholder="masalan, 22"
            />
          </label>
          <button className="btn btn-primary" onClick={check} disabled={!val}>Tekshirish</button>
          {msg && <Note tone={msg.ok ? "ok" : "err"}>{msg.text}</Note>}
        </div>
      </div>
    </div>
  );
}

/* ───────── 3. Chizgʻich ───────── */
function RulerStage({ onDone }: { onDone: () => void }) {
  const dims = useMemo(() => ({ L: pick([21, 22, 23, 24, 25]), W: pick([14, 15, 16, 17, 18]) }), []);
  const [part, setPart] = useState<0 | 1>(0);
  const [val, setVal] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const real = part === 0 ? dims.L : dims.W;
  const PX = 12; // 1 sm = 12 birlik
  const label = part === 0 ? "boʻyi" : "eni";

  const check = () => {
    const n = Number(val.replace(",", "."));
    if (Number.isNaN(n)) return setMsg({ ok: false, text: "Uzunlikni raqam bilan yozing." });
    if (Math.abs(n - real) <= 0.2) {
      if (part === 0) {
        setMsg({ ok: true, text: `Toʻgʻri! Kitobning boʻyi ${real} sm. Endi enini oʻlchang.` });
        setTimeout(() => {
          setPart(1);
          setVal("");
          setMsg(null);
        }, 900);
      } else {
        setMsg({ ok: true, text: `Toʻgʻri! Kitobning eni ${real} sm.` });
        setTimeout(onDone, 700);
      }
    } else {
      setMsg({ ok: false, text: "Notoʻgʻri. Kitobning bir chetini chizgʻichning 0 belgisiga moslang va ikkinchi chet qaysi belgiga toʻgʻri kelishini oʻqing." });
    }
  };

  return (
    <div>
      <StageTitle sub="Kitobning bir cheti chizgʻichning 0 belgisida turibdi. Ikkinchi cheti turgan belgini santimetrda oʻqing.">
        Chizgʻich bilan uzunlikni oʻlchash — kitobning {label}
      </StageTitle>

      <div className="lab-bench p-4 md:p-6 mb-6 overflow-x-auto">
        <svg viewBox={`0 0 ${30 * PX + 40} 150`} className="min-w-[440px] w-full" role="img" aria-label="Chizgʻich va kitob">
          <rect x="20" y="14" width={real * PX} height="64" rx="3" fill="#2b5fb4" opacity="0.9" />
          <rect x="20" y="14" width={real * PX} height="64" rx="3" fill="none" stroke="#1d3f7a" strokeWidth="2" />
          <text x={20 + (real * PX) / 2} y="52" textAnchor="middle" fill="#fff" fontWeight="700" fontSize="13">BIOLOGIYA</text>
          <rect x="14" y="84" width={30 * PX + 12} height="50" rx="4" fill="#f3e3a6" stroke="#c9b25a" strokeWidth="1.5" />
          {Array.from({ length: 301 }, (_, i) => i).map((mm) => {
            const x = 20 + (mm / 10) * PX;
            const isCm = mm % 10 === 0;
            const isHalf = mm % 5 === 0;
            return <line key={mm} x1={x} x2={x} y1="84" y2={isCm ? 108 : isHalf ? 100 : 94} stroke="#5a4a12" strokeWidth={isCm ? 1.3 : 0.7} />;
          })}
          {Array.from({ length: 31 }, (_, cm) => (
            <text key={cm} x={20 + cm * PX} y="123" textAnchor="middle" fontSize="9" fill="#5a4a12" fontWeight="700">{cm}</text>
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 max-w-lg">
        <label className="block">
          <span className="text-sm font-semibold block mb-2">Kitobning {label} (sm)</span>
          <input
            className="input !text-xl !font-mono"
            inputMode="decimal"
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
              setMsg(null);
            }}
            placeholder="masalan, 23"
          />
        </label>
        <button className="btn btn-primary self-end" onClick={check} disabled={!val}>Tekshirish</button>
      </div>
      {msg && <div className="mt-4 max-w-lg"><Note tone={msg.ok ? "ok" : "err"}>{msg.text}</Note></div>}
    </div>
  );
}

export default function MeasurementLab({ steps, completeLab, isCompleted }: LabProps) {
  const [step, setStep] = useState(0);

  return (
    <LabShell heading="Oʻlchov asboblari" icon={Ruler} steps={steps} current={step} done={isCompleted}>
      {isCompleted ? (
        <div className="text-center py-16">
          <p className="font-display text-2xl font-semibold mb-2">Barcha oʻlchovlar bajarildi</p>
          <p className="text-muted">Tarozi, termometr va chizgʻich bilan ishlash koʻnikmasini egalladingiz.</p>
        </div>
      ) : step === 0 ? (
        <BalanceStage onDone={() => setStep(1)} />
      ) : step === 1 ? (
        <ThermometerStage onDone={() => setStep(2)} />
      ) : (
        <RulerStage onDone={completeLab} />
      )}
    </LabShell>
  );
}
