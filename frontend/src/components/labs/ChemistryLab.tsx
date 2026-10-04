"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Flame, Droplets } from "lucide-react";
import { LabShell, LabProps, Note, StageTitle, Readout } from "./LabShell";

/** Suvning qaynash jarayoni: isitish egri chizigʻi va qaynash vaqtidagi plato. */
export default function ChemistryLab({ steps, completeLab, isCompleted }: LabProps) {
  const [filled, setFilled] = useState(false);
  const [burning, setBurning] = useState(false);
  const [temp, setTemp] = useState(22);
  const [minutes, setMinutes] = useState(0);
  const [history, setHistory] = useState<{ t: number; T: number }[]>([{ t: 0, T: 22 }]);
  const [boilTicks, setBoilTicks] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);

  const tempRef = useRef(22);
  const minRef = useRef(0);

  const boiling = temp >= 100;
  const stage = !filled ? 0 : boilTicks < 8 ? 1 : 2; // qadamlar paneli uchun

  useEffect(() => {
    if (!burning) return;
    const id = setInterval(() => {
      minRef.current += 0.25;
      if (tempRef.current < 100) {
        // Nyuton isish qonuniga yaqin: kolba qizishi sekinlashib boradi
        tempRef.current = Math.min(100, tempRef.current + (100 - tempRef.current) * 0.05 + 0.55);
        if (tempRef.current > 99.6) tempRef.current = 100;
      } else {
        setBoilTicks((b) => b + 1);
      }
      setTemp(Math.round(tempRef.current * 10) / 10);
      setMinutes(Math.round(minRef.current * 100) / 100);
      setHistory((h) => [...h, { t: minRef.current, T: tempRef.current }]);
    }, 250);
    return () => clearInterval(id);
  }, [burning]);

  const reset = () => {
    setBurning(false);
    tempRef.current = 22;
    minRef.current = 0;
    setTemp(22);
    setMinutes(0);
    setHistory([{ t: 0, T: 22 }]);
    setBoilTicks(0);
    setAnswer(null);
  };

  const answerQ = (a: string) => {
    setAnswer(a);
    if (a === "const") completeLab();
  };

  /* grafik */
  const W = 360;
  const Hh = 170;
  const tMax = Math.max(8, minutes + 1);
  const gx = (t: number) => 34 + (t / tMax) * (W - 46);
  const gy = (T: number) => Hh - 22 - ((T - 20) / 90) * (Hh - 40);
  const path = history.map((p, i) => `${i ? "L" : "M"}${gx(p.t).toFixed(1)} ${gy(p.T).toFixed(1)}`).join(" ");

  const waterTop = filled ? 118 : 205;

  return (
    <LabShell heading="Suvning qaynashi" icon={FlaskConical} steps={steps} current={stage} done={isCompleted}>
      <StageTitle sub="Kolbadagi suvni spirtovkada qizdiring, haroratni kuzating va qaynash vaqtida u qanday oʻzgarishini aniqlang.">
        Suvning qaynash jarayonini kuzatish
      </StageTitle>

      <div className="grid grid-cols-1 2xl:grid-cols-[1fr_22rem] gap-6">
        <div className="lab-bench p-4 flex justify-center">
          <svg viewBox="0 0 300 300" className="w-full max-w-sm" role="img" aria-label="Kolba, spirtovka va termometr">
            {/* shtativ */}
            <rect x="40" y="40" width="8" height="240" fill="#4a5f86" />
            <rect x="20" y="276" width="110" height="10" rx="3" fill="#2b3a55" />
            <rect x="40" y="130" width="120" height="6" fill="#4a5f86" />
            {/* kolba */}
            <clipPath id="flask"><path d="M112 70 h34 v62 l40 74 q8 18 -10 18 h-94 q-18 0 -10 -18 l40 -74 z" /></clipPath>
            <path d="M112 70 h34 v62 l40 74 q8 18 -10 18 h-94 q-18 0 -10 -18 l40 -74 z" fill="rgba(200,230,255,0.25)" stroke="#6a85b5" strokeWidth="3" />
            <g clipPath="url(#flask)">
              <motion.rect x="80" width="120" height="120" fill="rgba(80,150,230,0.55)" initial={false} animate={{ y: waterTop }} transition={{ duration: 1.2 }} />
              {boiling &&
                Array.from({ length: 14 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={104 + (i * 37) % 80}
                    cy={220}
                    r={2 + (i % 3)}
                    fill="rgba(255,255,255,0.85)"
                    style={{ animation: `rise ${1.2 + (i % 5) * 0.3}s ${i * 0.15}s infinite ease-in` }}
                  />
                ))}
            </g>
            {/* termometr */}
            <rect x="126" y="56" width="6" height="140" rx="3" fill="#fff" stroke="#6a85b5" />
            <rect x="127.5" y={190 - ((temp - 20) / 90) * 120} width="3" height={((temp - 20) / 90) * 120 + 6} fill="#d6453d" />
            {/* spirtovka */}
            <rect x="105" y="262" width="62" height="26" rx="8" fill="#9aa8c4" stroke="#6a85b5" strokeWidth="2" />
            <rect x="130" y="250" width="12" height="14" fill="#4a5f86" />
            {burning && (
              <g style={{ transformOrigin: "136px 250px", animation: "flicker 0.5s infinite" }}>
                <path d="M136 214 q-16 18 -6 32 q6 6 12 0 q10 -14 -6 -32z" fill="#ff9a1f" />
                <path d="M136 228 q-8 10 -3 18 q3 3 6 0 q5 -8 -3 -18z" fill="#ffe27a" />
              </g>
            )}
          </svg>
        </div>

        <div className="grid gap-4 content-start">
          <div className="flex flex-wrap gap-3">
            <Readout label="Harorat" value={temp.toFixed(1)} unit="°C" tone={boiling ? "danger" : "accent"} />
            <Readout label="Vaqt" value={minutes.toFixed(1)} unit="daq" tone="info" />
          </div>

          <div className="card p-3">
            <svg viewBox={`0 0 ${W} ${Hh}`} className="w-full" role="img" aria-label="Harorat — vaqt grafigi">
              {[20, 40, 60, 80, 100].map((T) => (
                <g key={T}>
                  <line x1="34" x2={W - 12} y1={gy(T)} y2={gy(T)} stroke="var(--line)" />
                  <text x="30" y={gy(T) + 3} fontSize="9" textAnchor="end" fill="var(--muted)">{T}</text>
                </g>
              ))}
              <line x1="34" x2="34" y1={gy(20)} y2={gy(100) - 6} stroke="var(--line-strong)" />
              <path d={path} fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinejoin="round" />
              <text x={W - 12} y={Hh - 4} fontSize="9" textAnchor="end" fill="var(--muted)">vaqt, daqiqa</text>
              <text x="6" y="12" fontSize="9" fill="var(--muted)">T, °C</text>
            </svg>
          </div>

          {!filled && (
            <button className="btn btn-primary" onClick={() => setFilled(true)}>
              <Droplets className="w-4 h-4" /> Kolbaga suv quyish
            </button>
          )}
          {filled && !burning && !boiling && (
            <button className="btn btn-primary" onClick={() => setBurning(true)}>
              <Flame className="w-4 h-4" /> Spirtovkani yoqish
            </button>
          )}
          {burning && (
            <button className="btn btn-ghost" onClick={() => setBurning(false)}>
              Spirtovkani oʻchirish
            </button>
          )}
          {filled && (
            <button className="btn btn-ghost btn-sm" onClick={reset}>Tajribani qaytadan boshlash</button>
          )}

          {filled && !burning && temp === 22 && <Note tone="warn">Ehtiyot boʻling: spirtovka yongan paytda kolbaga qoʻl tekkizmang.</Note>}
          {burning && !boiling && <Note tone="info">Suv qizimoqda. Termometr koʻrsatkichi va grafik oʻzgarishini kuzating.</Note>}
          {boiling && boilTicks < 8 && <Note tone="warn">Suv qaynay boshladi! Pufakchalar butun hajm boʻylab koʻtarilmoqda. Isitishni davom ettiring va haroratga qarang.</Note>}

          {boiling && boilTicks >= 8 && !isCompleted && (
            <div className="grid gap-2.5">
              <Note tone="info">Savol: suv qaynab turgan paytda, spirtovka yonib turishiga qaramay, harorat qanday oʻzgaradi?</Note>
              {[
                ["up", "Yana koʻtarilaveradi"],
                ["const", "Taxminan 100 °C da oʻzgarmay qoladi"],
                ["down", "Pasayadi"],
              ].map(([k, label]) => (
                <button key={k} className={`btn btn-ghost justify-start ${answer === k ? (k === "const" ? "!border-ok" : "!border-danger") : ""}`} onClick={() => answerQ(k)}>
                  {label}
                </button>
              ))}
              {answer && answer !== "const" && <Note tone="err">Grafikka qarang: qaynash boshlangach chiziq gorizontal boʻlib qoldi. Qayta urinib koʻring.</Note>}
            </div>
          )}

          {isCompleted && (
            <Note tone="ok">
              Toʻgʻri! Qaynash vaqtida berilayotgan issiqlik suv molekulalarini bugʻga aylantirishga sarflanadi, shuning uchun harorat (normal atmosfera bosimida 100 °C) oʻzgarmaydi.
            </Note>
          )}
        </div>
      </div>
    </LabShell>
  );
}
