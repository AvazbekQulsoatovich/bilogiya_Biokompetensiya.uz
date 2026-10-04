"use client";

import { useEffect, useRef, useState } from "react";
import { Droplets, Clock } from "lucide-react";
import { LabShell, LabProps, Note, StageTitle, Readout } from "./LabShell";

type Sol = { id: string; title: string; sub: string; delta: number; color: string; cell: "turgor" | "norm" | "plasmo" };

/** Boshlangʻich massa 10,0 g. Oʻzgarish (g) 60 daqiqadan keyin. */
const SOLS: Sol[] = [
  { id: "water", title: "Distillangan suv", sub: "0 % NaCl (gipotonik)", delta: +0.9, color: "rgba(90,160,235,0.45)", cell: "turgor" },
  { id: "iso", title: "Fiziologik eritma", sub: "0,9 % NaCl (izotonik)", delta: 0.0, color: "rgba(110,175,215,0.5)", cell: "norm" },
  { id: "salt", title: "Konsentrlangan tuz", sub: "10 % NaCl (gipertonik)", delta: -1.1, color: "rgba(60,120,200,0.6)", cell: "plasmo" },
];

function Cell({ kind }: { kind: Sol["cell"] }) {
  // hujayra devori qattiq, membrana (protoplast) hajmi oʻzgaradi
  const inset = kind === "turgor" ? 3 : kind === "norm" ? 9 : 24;
  return (
    <svg viewBox="0 0 90 70" className="w-full max-w-[7rem]" role="img" aria-label={kind === "plasmo" ? "Plazmoliz" : kind === "turgor" ? "Turgor holati" : "Normal hujayra"}>
      <rect x="4" y="4" width="82" height="62" rx="4" fill="none" stroke="#2b7a3b" strokeWidth="3" />
      <rect x={4 + inset} y={4 + inset * 0.8} width={82 - inset * 2} height={62 - inset * 1.6} rx="12" fill="rgba(196,232,168,0.7)" stroke="#6fbf73" strokeWidth="1.5" />
      <ellipse cx="45" cy="35" rx={Math.max(6, 20 - inset * 0.45)} ry={Math.max(4, 12 - inset * 0.3)} fill="rgba(160,215,235,0.8)" />
      <circle cx="30" cy="22" r="3" fill="#2f9e44" />
      <circle cx="60" cy="48" r="3" fill="#2f9e44" />
    </svg>
  );
}

export default function OsmosisLab({ steps, completeLab, isCompleted }: LabProps) {
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const done = t >= 60;
  const stage = !done ? 0 : 1;

  useEffect(() => {
    if (!running) return;
    timer.current = window.setInterval(() => {
      setT((x) => {
        if (x >= 60) return x;
        const n = x + 2;
        if (n >= 60) setRunning(false);
        return n;
      });
    }, 150);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [running]);

  const mass = (s: Sol) => 10 + s.delta * (t / 60);

  useEffect(() => {
    if (q1 === "from-cell" && q2 === "plasmolysis" && !isCompleted) completeLab();
  }, [q1, q2, isCompleted, completeLab]);

  return (
    <LabShell heading="Osmos hodisasi" icon={Droplets} steps={steps} current={stage} done={isCompleted}>
      <StageTitle sub="Bir xil kartoshka boʻlaklari (har biri 10,0 g) turli konsentratsiyali eritmalarga solindi. 60 daqiqadan keyin massa va hujayralar holatini solishtiring.">
        Kartoshka boʻlaklari: suv va tuz eritmalarida
      </StageTitle>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {SOLS.map((s) => {
          const m = mass(s);
          const w = 54 + (m - 10) * 18;
          return (
            <div key={s.id} className="lab-bench p-4 text-center">
              <p className="font-display font-semibold leading-tight">{s.title}</p>
              <p className="text-xs text-muted mb-3">{s.sub}</p>
              <svg viewBox="0 0 140 130" className="w-full max-w-[9rem] mx-auto" role="img" aria-label={`${s.title} stakani`}>
                <path d="M20 10 h100 l-8 108 q-1 8 -9 8 h-66 q-8 0 -9 -8 z" fill="rgba(200,230,255,0.2)" stroke="#6aa0b8" strokeWidth="2.5" />
                <path d="M24 44 h92 l-6 74 q-1 8 -9 8 h-62 q-8 0 -9 -8 z" fill={s.color} />
                <rect x={70 - w / 2} y={72} width={w} height={34 + (m - 10) * 6} rx="6" fill="#f0d9a0" stroke="#c9a45a" strokeWidth="2" />
              </svg>
              <div className="mt-2 flex justify-center">
                <Readout label="Massa" value={m.toFixed(2)} unit="g" tone={s.delta > 0 ? "info" : s.delta < 0 ? "danger" : "brand"} />
              </div>
              {done && (
                <div className="mt-3 flex flex-col items-center gap-1">
                  <Cell kind={s.cell} />
                  <p className="text-xs text-muted">
                    {s.cell === "turgor" ? "Turgor: hujayra suv bilan toʻlgan" : s.cell === "norm" ? "Hujayra normal holatda" : "Plazmoliz: protoplast devordan ajralgan"}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button className="btn btn-primary" disabled={running || done} onClick={() => setRunning(true)}>
          <Clock className="w-4 h-4" /> {t === 0 ? "Tajribani boshlash" : "Davom etilmoqda…"}
        </button>
        <Readout label="Oʻtgan vaqt" value={t} unit="daq" tone="info" />
        <div className="flex-1 min-w-[12rem] h-2 rounded-full bg-surface-2 overflow-hidden">
          <div className="h-full bg-brand transition-all" style={{ width: `${(t / 60) * 100}%` }} />
        </div>
      </div>

      {done && (
        <div className="grid gap-5 max-w-2xl">
          <Note tone="info">
            Osmos — suvning yarim oʻtkazuvchan membrana orqali eritmaning konsentratsiyasi past tomonidan konsentratsiyasi yuqori tomoniga oʻtishidir.
          </Note>

          <div>
            <p className="font-semibold mb-2">1. Konsentrlangan tuz eritmasida kartoshka massasi kamaydi. Suv qayoqqa oʻtdi?</p>
            <div className="flex flex-wrap gap-2">
              {[
                ["from-cell", "Hujayradan eritmaga"],
                ["into-cell", "Eritmadan hujayra ichiga"],
                ["none", "Suv harakatlanmadi"],
              ].map(([k, l]) => (
                <button key={k} onClick={() => setQ1(k)} className={`btn btn-sm ${q1 === k ? (k === "from-cell" ? "btn-primary" : "!bg-danger-soft !text-danger") : "btn-ghost"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold mb-2">2. Protoplastning hujayra devoridan ajralishi nima deyiladi?</p>
            <div className="flex flex-wrap gap-2">
              {[
                ["plasmolysis", "Plazmoliz"],
                ["turgor", "Turgor"],
                ["photosynthesis", "Fotosintez"],
              ].map(([k, l]) => (
                <button key={k} onClick={() => setQ2(k)} className={`btn btn-sm ${q2 === k ? (k === "plasmolysis" ? "btn-primary" : "!bg-danger-soft !text-danger") : "btn-ghost"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {isCompleted && <Note tone="ok">Toʻgʻri! Distillangan suvda hujayralar suv shimib taranglashadi (turgor), tuzli eritmada esa suv yoʻqotib plazmoliz yuz beradi.</Note>}
        </div>
      )}
    </LabShell>
  );
}
