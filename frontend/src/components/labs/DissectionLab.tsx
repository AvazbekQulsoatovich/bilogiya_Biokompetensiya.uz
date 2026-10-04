"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flower2, Scissors, Check } from "lucide-react";
import { LabShell, LabProps, Note, StageTitle } from "./LabShell";

const PARTS = [
  { id: "sepal", name: "Gulkosabarg", text: "Gulning eng tashqi, odatda yashil barglari. Gul kurtagida uning ichki qismlarini himoya qiladi.", tool: "Skalpel" },
  { id: "petal", name: "Gultojbarg", text: "Yorqin rangli barglar. Rangi va hidi bilan changlatuvchi hasharotlarni oʻziga jalb qiladi.", tool: "Pinset" },
];

const HOTSPOTS = [
  { id: "anther", name: "Chang qopchasi", x: 120, y: 142, text: "Changchining yuqori qismi. Ichida chang donachalari yetiladi." },
  { id: "filament", name: "Changchi ipchasi", x: 138, y: 200, text: "Chang qopchasini ushlab turadigan ingichka ip." },
  { id: "stigma", name: "Urugʻchi tumshuqchasi", x: 160, y: 124, text: "Urugʻchining yopishqoq uchi: chang donachasi shu yerga tushadi (changlanish)." },
  { id: "style", name: "Urugʻchi ustunchasi", x: 160, y: 176, text: "Tumshuqchani tugunchaga bogʻlovchi naycha." },
  { id: "ovary", name: "Urugʻchi tugunchasi", x: 160, y: 238, text: "Pastki kengaygan qismi. Ichida urugʻkurtaklar bor; urugʻlanishdan soʻng tugunchadan meva rivojlanadi." },
];

export default function DissectionLab({ steps, completeLab, isCompleted }: LabProps) {
  const [removed, setRemoved] = useState<string[]>([]);
  const [seen, setSeen] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

  const phase = removed.length; // 0 gulkosabarg, 1 gultojbarg, 2 oʻrganish
  const allSeen = seen.length === HOTSPOTS.length;
  const activeSpot = HOTSPOTS.find((h) => h.id === active);

  const visit = (id: string) => {
    setActive(id);
    setSeen((s) => (s.includes(id) ? s : [...s, id]));
  };

  const answerQ = (a: string) => {
    setAnswer(a);
    if (a === "fruit") completeLab();
  };

  return (
    <LabShell heading="Gulning tuzilishi" icon={Flower2} steps={steps} current={phase} done={isCompleted}>
      <StageTitle sub="Gulni tashqi qismlaridan boshlab ketma-ket ajrating, soʻng changchi va urugʻchi tuzilishini oʻrganing.">
        Gulni qismlarga ajratish
      </StageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,22rem)_1fr] gap-8 items-start">
        <div className="lab-bench p-4">
          <svg viewBox="0 0 320 390" className="w-full" role="img" aria-label="Gulning boʻylama kesimi">
            {/* poya */}
            <path d="M160 390 V250" stroke="#3f9d4b" strokeWidth="12" strokeLinecap="round" />
            <ellipse cx="160" cy="252" rx="22" ry="11" fill="#2b7a3b" />

            {/* urugʻchi */}
            <ellipse cx="160" cy="238" rx="15" ry="20" fill="#8fd18b" stroke="#3f9d4b" strokeWidth="2" />
            <path d="M160 220 V130" stroke="#8fd18b" strokeWidth="7" strokeLinecap="round" />
            <circle cx="160" cy="124" r="10" fill="#d9e86a" stroke="#a9b83a" strokeWidth="2" />

            {/* changchilar */}
            {[-1, 1].map((s) => (
              <g key={s}>
                <path d={`M${160 + s * 8} 246 Q${160 + s * 34} 200 ${160 + s * 40} 150`} stroke="#c7d86a" strokeWidth="3.4" fill="none" strokeLinecap="round" />
                <ellipse cx={160 + s * 40} cy="144" rx="7" ry="12" fill="#f1c232" stroke="#b8860b" strokeWidth="2" transform={`rotate(${s * -8} ${160 + s * 40} 144)`} />
              </g>
            ))}

            {/* gultojbarglar */}
            <AnimatePresence>
              {!removed.includes("petal") && (
                <motion.g key="petals" exit={{ opacity: 0, y: -40, x: 30, rotate: 10 }} transition={{ duration: 0.7 }}>
                  <path d="M156 248 C90 236 52 150 92 104 C132 124 152 190 156 248Z" fill="#f08cb0" stroke="#d4577f" strokeWidth="2.5" />
                  <path d="M164 248 C230 236 268 150 228 104 C188 124 168 190 164 248Z" fill="#f08cb0" stroke="#d4577f" strokeWidth="2.5" />
                  <path d="M140 232 C118 200 108 160 112 130" stroke="#d4577f" strokeWidth="1.2" fill="none" opacity="0.6" />
                  <path d="M180 232 C202 200 212 160 208 130" stroke="#d4577f" strokeWidth="1.2" fill="none" opacity="0.6" />
                </motion.g>
              )}
            </AnimatePresence>

            {/* gulkosabarglar */}
            <AnimatePresence>
              {!removed.includes("sepal") && (
                <motion.g key="sepals" exit={{ opacity: 0, y: 50, x: -30, rotate: -12 }} transition={{ duration: 0.7 }}>
                  <path d="M158 256 C120 270 90 252 84 224 C112 232 140 234 158 244Z" fill="#3f9d4b" stroke="#2b7a3b" strokeWidth="2.5" />
                  <path d="M162 256 C200 270 230 252 236 224 C208 232 180 234 162 244Z" fill="#3f9d4b" stroke="#2b7a3b" strokeWidth="2.5" />
                </motion.g>
              )}
            </AnimatePresence>

            {/* faol nuqtalar */}
            {phase >= 2 &&
              HOTSPOTS.map((h) => {
                const on = seen.includes(h.id);
                return (
                  <g
                    key={h.id}
                    role="button"
                    tabIndex={0}
                    aria-label={h.name}
                    onClick={() => visit(h.id)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && visit(h.id)}
                    className="cursor-pointer outline-none"
                  >
                    <circle cx={h.x + (h.id === "anther" ? -18 : h.id === "ovary" || h.id === "filament" ? 30 : 24)} cy={h.y} r="12" fill={active === h.id ? "#0e2119" : on ? "#1e8a4c" : "#0b7a5c"} stroke="#fff" strokeWidth="2.5" />
                    <text x={h.x + (h.id === "anther" ? -18 : h.id === "ovary" || h.id === "filament" ? 30 : 24)} y={h.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
                      {HOTSPOTS.indexOf(h) + 1}
                    </text>
                  </g>
                );
              })}
          </svg>
        </div>

        <div className="grid gap-5">
          {phase < 2 && (
            <div className="grid gap-3">
              <Note tone="info">
                {phase === 0
                  ? "Gul eng tashqi qismi — gulkosabargdan boshlab ajratiladi. Skalpel yordamida gulkosabarglarni ehtiyotkorlik bilan ajrating."
                  : "Endi yorqin gultojbarglarni pinset bilan ehtiyotkorlik bilan olib tashlang."}
              </Note>
              <button className="btn btn-primary w-fit" onClick={() => setRemoved((r) => [...r, PARTS[phase].id])}>
                <Scissors className="w-4 h-4" /> {PARTS[phase].name}ni ajratish ({PARTS[phase].tool})
              </button>
            </div>
          )}

          {removed.length > 0 && (
            <div>
              <p className="eyebrow !text-muted mb-2">Ajratilgan qismlar</p>
              <ul className="grid gap-2">
                {removed.map((id) => {
                  const p = PARTS.find((x) => x.id === id)!;
                  return (
                    <li key={id} className="card px-4 py-3 flex gap-3 items-start">
                      <Check className="w-4 h-4 text-ok mt-1 shrink-0" strokeWidth={3} />
                      <p className="text-sm">
                        <b>{p.name}.</b> <span className="text-muted">{p.text}</span>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {phase >= 2 && (
            <div className="grid gap-4">
              <Note tone="info">Rasmdagi raqamlangan nuqtalarni bosib, changchi va urugʻchi qismlarini oʻrganing ({seen.length}/{HOTSPOTS.length}).</Note>

              <div className="flex flex-wrap gap-2">
                {HOTSPOTS.map((h, i) => (
                  <button key={h.id} onClick={() => visit(h.id)} className={`chip cursor-pointer ${active === h.id ? "chip-brand" : ""}`}>
                    {seen.includes(h.id) && <Check className="w-3 h-3" strokeWidth={3} />} {i + 1}. {h.name}
                  </button>
                ))}
              </div>

              {activeSpot && (
                <div className="card p-4 border-brand">
                  <p className="font-display font-semibold text-brand mb-1">{activeSpot.name}</p>
                  <p className="text-sm text-ink-2">{activeSpot.text}</p>
                </div>
              )}

              {allSeen && !isCompleted && (
                <div className="grid gap-2.5">
                  <p className="font-semibold">Urugʻlanishdan soʻng urugʻchining tugunchasidan nima rivojlanadi?</p>
                  <div className="flex flex-wrap gap-2">
                    {[["fruit", "Meva"], ["petal", "Gultojbarg"], ["root", "Ildiz"]].map(([k, l]) => (
                      <button key={k} onClick={() => answerQ(k)} className={`btn btn-sm ${answer === k ? (k === "fruit" ? "btn-primary" : "!bg-danger-soft !text-danger") : "btn-ghost"}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                  {answer && answer !== "fruit" && <Note tone="err">Tugunchaning ichida urugʻkurtaklar bor. Urugʻlangach, tugunchaning oʻzi nimaga aylanadi?</Note>}
                </div>
              )}

              {isCompleted && <Note tone="ok">Toʻgʻri! Tuguncha meva boʻlib, urugʻkurtaklar esa urugʻga aylanadi. Gul — yopiq urugʻli oʻsimliklarning koʻpayish organi.</Note>}
            </div>
          )}
        </div>
      </div>
    </LabShell>
  );
}
