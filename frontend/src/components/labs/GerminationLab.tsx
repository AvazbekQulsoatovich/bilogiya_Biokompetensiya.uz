"use client";

import { useState } from "react";
import { Sprout } from "lucide-react";
import { LabShell, LabProps, Note, StageTitle, Readout } from "./LabShell";

type Pot = {
  id: string;
  title: string;
  cond: string;
  water: "nam" | "quruq" | "botirilgan";
  warm: boolean;
  light: boolean;
};

/** Nazorat tajribasi: har bir idishda faqat bitta omil oʻzgartirilgan. */
const POTS: Pot[] = [
  { id: "A", title: "Nazorat", cond: "Nam tuproq · iliq (22 °C) · yorugʻ", water: "nam", warm: true, light: true },
  { id: "B", title: "Suvsiz", cond: "Quruq tuproq · iliq · yorugʻ", water: "quruq", warm: true, light: true },
  { id: "C", title: "Sovuqda", cond: "Nam tuproq · sovuq (+3 °C) · yorugʻ", water: "nam", warm: false, light: true },
  { id: "D", title: "Suv ostida", cond: "Suvga botirilgan · iliq · yorugʻ", water: "botirilgan", warm: true, light: true },
  { id: "E", title: "Qorongʻida", cond: "Nam tuproq · iliq · qorongʻi", water: "nam", warm: true, light: false },
];

const germinates = (p: Pot) => p.water === "nam" && p.warm;

function PotSvg({ pot, day, started, planted }: { pot: Pot; day: number; started: boolean; planted: boolean }) {
  const ok = germinates(pot);
  const root = started && ok && day >= 2 ? Math.min(34, (day - 1) * 7) : 0;
  const shoot = started && ok && day >= 4 ? Math.min(pot.light ? 46 : 60, (day - 3) * (pot.light ? 11 : 15)) : 0;
  const seedSwell = started && ok && day >= 1;
  const rotten = started && pot.water === "botirilgan" && day >= 4;
  const soilFill = pot.water === "quruq" ? "#a8855a" : "#6b4a2b";

  return (
    <svg viewBox="0 0 120 170" className="w-full" role="img" aria-label={`${pot.title} idishi, ${day}-kun`}>
      {/* shisha stakan */}
      <path d="M18 24 h84 l-8 130 q-1 8 -9 8 h-50 q-8 0 -9 -8 z" fill="rgba(190,225,245,0.25)" stroke="#6aa0b8" strokeWidth="2" />
      {/* suv / tuproq */}
      {pot.water === "botirilgan" ? (
        <path d="M21 40 h78 l-6 112 q-1 6 -7 6 h-52 q-6 0 -7 -6 z" fill="rgba(80,150,230,0.4)" />
      ) : null}
      <path d={`M24 ${pot.water === "botirilgan" ? 118 : 96} h72 l-4 ${pot.water === "botirilgan" ? 34 : 56} q-1 6 -7 6 h-50 q-6 0 -7 -6 z`} fill={soilFill} />
      {pot.water === "nam" && <path d="M28 100 h64" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeDasharray="2 6" />}
      {/* ildiz */}
      {root > 0 && <path d={`M60 108 q-3 ${root / 2} 3 ${root}`} stroke="#f0e6cf" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
      {/* poyacha */}
      {shoot > 0 && (
        <g>
          <path d={`M60 106 L60 ${106 - shoot}`} stroke={pot.light ? "#3f9d4b" : "#efe3a1"} strokeWidth={pot.light ? 3.2 : 1.8} strokeLinecap="round" />
          {shoot > 28 && (
            <>
              <ellipse cx="53" cy={106 - shoot + 2} rx="7" ry="3.6" fill={pot.light ? "#4cae5c" : "#f4ecb3"} transform={`rotate(-30 53 ${106 - shoot + 2})`} />
              <ellipse cx="67" cy={106 - shoot + 2} rx="7" ry="3.6" fill={pot.light ? "#4cae5c" : "#f4ecb3"} transform={`rotate(30 67 ${106 - shoot + 2})`} />
            </>
          )}
        </g>
      )}
      {/* urugʻ */}
      {planted && <ellipse cx="60" cy="106" rx={seedSwell ? 6.5 : 5} ry={seedSwell ? 4.4 : 3.4} fill={rotten ? "#5a4630" : "#c9a45a"} stroke="#8a6a2f" strokeWidth="1" />}
      {rotten && <text x="60" y="140" textAnchor="middle" fontSize="8" fill="#d6c7a8">chirimoqda</text>}
      {started && !pot.warm && <text x="60" y="140" textAnchor="middle" fontSize="8" fill="#a8d4f0">❄</text>}
      {/* qorongʻi qopqoq */}
      {!pot.light && <rect x="14" y="14" width="92" height="22" rx="5" fill="#222b3b" />}
    </svg>
  );
}

const FACTORS = ["Suv", "Havo", "Issiqlik", "Yorugʻlik", "Tuproq"];

export default function GerminationLab({ steps, completeLab, isCompleted }: LabProps) {
  const [planted, setPlanted] = useState(false);
  const [started, setStarted] = useState(false);
  const [day, setDay] = useState(0);
  const [maxDay, setMaxDay] = useState(0);
  const [sel, setSel] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<{ ok: boolean; text: string } | null>(null);

  const stage = !planted ? 0 : !started || maxDay < 7 ? 1 : 2;

  const check = () => {
    const need = ["Suv", "Havo", "Issiqlik"].sort().join();
    if (sel.slice().sort().join() === need) {
      setVerdict({
        ok: true,
        text: "Toʻgʻri! Urugʻning unib chiqishi uchun suv, havo (kislorod) va yetarli issiqlik kerak. Yorugʻlik unishga shart emas: qorongʻidagi urugʻ ham undi, ammo uning poyasi rangsiz boʻldi. Yorugʻlik keyinchalik, fotosintez uchun zarur.",
      });
      completeLab();
    } else if (sel.includes("Yorugʻlik") || sel.includes("Tuproq")) {
      setVerdict({ ok: false, text: "E idishdagi (qorongʻi) urugʻga qarang va suv ostidagi D idish bilan solishtiring. Yorugʻlik va tuproq shart omillar emas." });
    } else {
      setVerdict({ ok: false, text: "Nazorat idishi (A) bilan boshqalarni solishtiring: qaysi omillar yetishmaganda urugʻ unmadi?" });
    }
  };

  return (
    <LabShell heading="Urugʻning unib chiqishi" icon={Sprout} steps={steps} current={stage} done={isCompleted}>
      <StageTitle sub="Beshta idishda urugʻlar turli sharoitga qoʻyilgan. Har bir idishda faqat bitta omil oʻzgartirilgan. Natijalarni solishtirib, urugʻ unishi uchun nima kerakligini aniqlang.">
        Nazorat tajribasi: loviya urugʻi
      </StageTitle>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        {POTS.map((p) => (
          <div key={p.id} className="lab-bench p-3 text-center">
            <p className="font-display font-semibold">{p.id}. {p.title}</p>
            <div className="max-w-[7.5rem] mx-auto my-1">
              <PotSvg pot={p} day={day} started={started} planted={planted} />
            </div>
            <p className="text-[0.72rem] leading-snug text-muted min-h-[2.2rem]">{p.cond}</p>
            {started && day >= 7 && (
              <p className={`text-xs font-bold mt-1 ${germinates(p) ? "text-ok" : "text-danger"}`}>
                {germinates(p) ? "undi" : "unmadi"}
              </p>
            )}
          </div>
        ))}
      </div>

      {!planted && (
        <button className="btn btn-primary btn-lg" onClick={() => setPlanted(true)}>
          <Sprout className="w-5 h-5" /> Urugʻlarni qadash
        </button>
      )}

      {planted && !started && (
        <div className="grid gap-3 max-w-xl">
          <Note tone="info">Urugʻlar qadaldi. Endi har bir idishga koʻrsatilgan sharoitni yarating va tajribani boshlang.</Note>
          <button className="btn btn-primary" onClick={() => setStarted(true)}>Sharoitlarni yaratib, tajribani boshlash</button>
        </div>
      )}

      {started && (
        <div className="grid gap-5 max-w-2xl">
          <div className="flex flex-wrap items-end gap-5">
            <Readout label="Kun" value={day} unit="/ 7" tone="info" />
            <label className="flex-1 min-w-[14rem]">
              <span className="text-sm font-semibold block mb-2">Vaqtni oldinga siljiting</span>
              <input
                type="range"
                min={0}
                max={7}
                value={day}
                onChange={(e) => {
                  const d = Number(e.target.value);
                  setDay(d);
                  setMaxDay((m) => Math.max(m, d));
                }}
                className="w-full"
                aria-label="Kunlar"
              />
            </label>
          </div>

          {maxDay < 7 && <Note tone="info">Toʻliq natijani koʻrish uchun 7-kungacha kuzating.</Note>}

          {maxDay >= 7 && !isCompleted && (
            <div className="grid gap-3">
              <p className="font-semibold">Xulosa: urugʻning unib chiqishi uchun qaysi omillar zarur? (bir nechtasini tanlang)</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Omillar">
                {FACTORS.map((f) => {
                  const on = sel.includes(f);
                  return (
                    <button
                      key={f}
                      aria-pressed={on}
                      onClick={() => {
                        setSel((s) => (on ? s.filter((x) => x !== f) : [...s, f]));
                        setVerdict(null);
                      }}
                      className={`btn btn-sm ${on ? "btn-primary" : "btn-ghost"}`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
              <button className="btn btn-primary w-fit" onClick={check} disabled={!sel.length}>Xulosani tekshirish</button>
            </div>
          )}

          {verdict && <Note tone={verdict.ok ? "ok" : "err"}>{verdict.text}</Note>}
        </div>
      )}
    </LabShell>
  );
}
