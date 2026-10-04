"use client";

import { useState } from "react";
import { Sun, Trash2 } from "lucide-react";
import { LabShell, LabProps, Note, StageTitle, Readout } from "./LabShell";

type Point = { d: number; n: number };

/** Yorugʻlik intensivligi masofa kvadratiga teskari proporsional: I ∝ 1/d². */
const bubblesPerMinute = (d: number) => Math.max(0, Math.round(3600 / (d * d) + (d < 30 ? (Math.random() - 0.5) * 2 : 0)));

export default function PhotosynthesisLab({ steps, completeLab, isCompleted }: LabProps) {
  const [d, setD] = useState(40);
  const [data, setData] = useState<Point[]>([]);
  const [measuring, setMeasuring] = useState(false);
  const [count, setCount] = useState(0);
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);

  const rate = 3600 / (d * d);
  const stage = data.length < 4 ? 0 : 1;
  const distinct = new Set(data.map((p) => p.d)).size;

  const measure = () => {
    if (measuring) return;
    setMeasuring(true);
    setCount(0);
    const target = bubblesPerMinute(d);
    const steps = 20;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setCount(Math.round((target * i) / steps));
      if (i >= steps) {
        clearInterval(id);
        setMeasuring(false);
        setData((prev) => [...prev.filter((p) => p.d !== d), { d, n: target }].sort((a, b) => a.d - b.d));
      }
    }, 100);
  };

  const finish = (a1: string | null, a2: string | null) => {
    if (a1 === "more" && a2 === "oxygen" && !isCompleted) completeLab();
  };

  /* grafik */
  const W = 340;
  const H = 190;
  const maxN = Math.max(40, ...data.map((p) => p.n));
  const gx = (dd: number) => 36 + ((dd - 10) / 50) * (W - 52);
  const gy = (n: number) => H - 28 - (n / maxN) * (H - 48);

  return (
    <LabShell heading="Fotosintez va yorugʻlik" icon={Sun} steps={steps} current={stage} done={isCompleted}>
      <StageTitle sub="Elodeya shoxchasi suvli idishda. Chiroqni turli masofaga qoʻyib, bir daqiqada ajralgan kislorod pufakchalari sonini sanang.">
        Yorugʻlik fotosintez tezligiga qanday taʼsir qiladi?
      </StageTitle>

      <div className="grid grid-cols-1 2xl:grid-cols-[1fr_21rem] gap-6">
        <div>
          <div className="lab-bench relative h-72 overflow-hidden mb-5">
            {/* chiroq */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4">
              <div className="w-14 h-14 rounded-full bg-amber-300 flex items-center justify-center" style={{ boxShadow: `0 0 ${50 * (rate / 36) + 8}px ${12 * (rate / 36) + 2}px rgba(253,224,71,${0.25 + 0.5 * (rate / 36)})` }}>
                <Sun className="w-7 h-7 text-amber-700" />
              </div>
            </div>
            {/* stakan */}
            <div
              className="absolute bottom-6 transition-all duration-300 w-40 h-48 rounded-b-3xl rounded-t-md border-4 border-[#6aa0b8] bg-[rgba(110,170,230,0.28)] overflow-hidden"
              style={{ left: `${16 + ((d - 10) / 50) * 56}%` }}
            >
              <svg viewBox="0 0 100 130" className="absolute inset-0 w-full h-full" aria-hidden>
                <path d="M50 130 C50 90 48 60 50 25" stroke="#2b7a3b" strokeWidth="3" fill="none" />
                {[28, 48, 68, 88].map((y, i) => (
                  <g key={y}>
                    <ellipse cx={i % 2 ? 62 : 38} cy={y} rx="12" ry="4.2" fill="#3f9d4b" transform={`rotate(${i % 2 ? -20 : 20} ${i % 2 ? 62 : 38} ${y})`} />
                  </g>
                ))}
                {(measuring || data.length > 0) &&
                  Array.from({ length: Math.min(14, Math.max(1, Math.round(rate / 2.5))) }).map((_, i) => (
                    <circle
                      key={i}
                      cx={34 + ((i * 29) % 36)}
                      cy={104}
                      r={1.8 + (i % 3) * 0.6}
                      fill="rgba(255,255,255,0.9)"
                      style={{ animation: `rise ${Math.max(0.8, 3 - rate / 15)}s ${i * 0.17}s infinite ease-in` }}
                    />
                  ))}
              </svg>
            </div>
            <div className="absolute bottom-2 left-4 right-4 h-1 bg-line-strong rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-5 items-end">
            <label className="block">
              <span className="text-sm font-semibold block mb-2">Chiroq va oʻsimlik orasidagi masofa: <b className="text-brand">{d} sm</b></span>
              <input type="range" min={10} max={60} step={5} value={d} onChange={(e) => setD(Number(e.target.value))} className="w-full" aria-label="Masofa" disabled={measuring} />
            </label>
            <button className="btn btn-primary" onClick={measure} disabled={measuring}>
              {measuring ? "Sanalmoqda…" : "1 daqiqa sanash"}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 items-center">
            <Readout label="Pufakchalar (1 daq)" value={measuring ? count : data.find((p) => p.d === d)?.n ?? "—"} tone="info" />
            <Readout label="Oʻlchovlar" value={`${data.length}`} unit={`(${distinct} xil masofa)`} />
          </div>
        </div>

        <div className="grid gap-4 content-start">
          <div className="card p-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Pufakchalar soni va masofa grafigi">
              {[0, 0.5, 1].map((f) => (
                <g key={f}>
                  <line x1="36" x2={W - 12} y1={gy(maxN * f)} y2={gy(maxN * f)} stroke="var(--line)" />
                  <text x="32" y={gy(maxN * f) + 3} fontSize="9" textAnchor="end" fill="var(--muted)">{Math.round(maxN * f)}</text>
                </g>
              ))}
              {[10, 20, 30, 40, 50, 60].map((dd) => (
                <text key={dd} x={gx(dd)} y={H - 10} fontSize="9" textAnchor="middle" fill="var(--muted)">{dd}</text>
              ))}
              <text x={W - 12} y={H - 1} fontSize="9" textAnchor="end" fill="var(--muted)">masofa, sm</text>
              <text x="6" y="12" fontSize="9" fill="var(--muted)">pufakcha / daq</text>
              {data.length > 1 && (
                <path d={data.map((p, i) => `${i ? "L" : "M"}${gx(p.d)} ${gy(p.n)}`).join(" ")} fill="none" stroke="var(--brand)" strokeWidth="2.5" />
              )}
              {data.map((p) => (
                <circle key={p.d} cx={gx(p.d)} cy={gy(p.n)} r="4.5" fill="var(--brand)" stroke="var(--surface)" strokeWidth="2" />
              ))}
            </svg>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted">
                <th className="py-1 font-semibold">Masofa (sm)</th>
                <th className="py-1 font-semibold">Pufakcha / daq</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.d} className="border-t border-line">
                  <td className="py-1.5">{p.d}</td>
                  <td className="py-1.5 font-mono font-semibold">{p.n}</td>
                  <td className="text-right">
                    <button onClick={() => setData((x) => x.filter((y) => y.d !== p.d))} aria-label="Oʻlchovni oʻchirish" className="p-1 text-muted hover:text-danger">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={3} className="py-3 text-muted">Hali oʻlchov yoʻq.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data.length < 4 && <div className="mt-6"><Note tone="info">Kamida 4 xil masofada oʻlchov oling (masalan, 10, 20, 40 va 60 sm), shunda qonuniyat grafikda yaqqol koʻrinadi.</Note></div>}

      {data.length >= 4 && !isCompleted && (
        <div className="grid gap-5 mt-6 max-w-2xl">
          <div>
            <p className="font-semibold mb-2">1. Chiroq oʻsimlikka yaqinlashtirilganda fotosintez tezligi…</p>
            <div className="flex flex-wrap gap-2">
              {[["more", "ortadi"], ["same", "oʻzgarmaydi"], ["less", "kamayadi"]].map(([k, l]) => (
                <button key={k} className={`btn btn-sm ${q1 === k ? (k === "more" ? "btn-primary" : "!bg-danger-soft !text-danger") : "btn-ghost"}`} onClick={() => { setQ1(k); finish(k, q2); }}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold mb-2">2. Elodeyadan ajralayotgan pufakchalar qaysi gaz?</p>
            <div className="flex flex-wrap gap-2">
              {[["oxygen", "Kislorod"], ["co2", "Karbonat angidrid"], ["nitrogen", "Azot"]].map(([k, l]) => (
                <button key={k} className={`btn btn-sm ${q2 === k ? (k === "oxygen" ? "btn-primary" : "!bg-danger-soft !text-danger") : "btn-ghost"}`} onClick={() => { setQ2(k); finish(q1, k); }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="mt-6">
          <Note tone="ok">
            Toʻgʻri! Chiroq qancha yaqin boʻlsa, yorugʻlik shuncha kuchli va fotosintez shuncha tez boradi: ajralayotgan kislorod pufakchalari koʻpayadi. Yorugʻlik intensivligi masofa kvadratiga teskari proporsional ekanini grafikdan koʻrdingiz.
          </Note>
        </div>
      )}
    </LabShell>
  );
}
