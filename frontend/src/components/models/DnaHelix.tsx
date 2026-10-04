"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { DiagramProps, PartDef } from "./diagrams";

export const DNA_PARTS: PartDef[] = [
  { id: "backbone", name: "Shakar–fosfat „umurtqa“", color: "#8896ad", text: "Dezoksiriboza (shakar) va fosfat qoldigʻi navbatlashib zanjir hosil qiladi. Ikki zanjir bir-biriga qarama-qarshi (antiparallel) yoʻnalgan." },
  { id: "bases", name: "Azotli asoslar", color: "#e9b44c", text: "DNKda 4 xil asos bor: adenin (A), timin (T), guanin (G) va sitozin (S, inglizcha C). Axborot shu asoslarning ketma-ketligida yozilgan." },
  { id: "pairs", name: "Komplementar juftlar", color: "#3ecf9b", text: "Asoslar qatʼiy juft boʻlib bogʻlanadi: A–T (2 ta vodorod bogʻi) va G–S (3 ta vodorod bogʻi). Shu sababli bir zanjir ketma-ketligi ikkinchisini aniqlaydi." },
  { id: "helix", name: "Qoʻsh spiral", color: "#2b5fb4", text: "Ikki zanjir bir oʻq atrofida oʻng tomonga buralgan. Bir toʻliq burilishda taxminan 10 juft asos boʻladi (≈ 3,4 nm)." },
];

const COL = {
  A: "#d6577a",
  T: "#e9b44c",
  G: "#2b5fb4",
  S: "#3ecf9b",
} as const;
const SEQ: (keyof typeof COL)[] = ["A", "G", "S", "T", "T", "A", "G", "S", "A", "T", "S", "G", "A", "T", "G", "S", "T", "A", "S", "G", "A", "T"];
const PAIR = { A: "T", T: "A", G: "S", S: "G" } as const;

export function DnaHelix({ active }: Pick<DiagramProps, "active">) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [auto, setAuto] = useState(true);
  const phase = useRef(0);
  const drag = useRef<{ x: number; p: number } | null>(null);
  const activeRef = useRef<string | null>(active);
  const autoRef = useRef(true);

  activeRef.current = active;
  autoRef.current = auto;

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = 420;
    const H = 440;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    let raf = 0;

    const draw = () => {
      const a = activeRef.current;
      if (autoRef.current && !drag.current) phase.current += 0.012;
      ctx.clearRect(0, 0, W, H);

      const N = SEQ.length;
      const R = 72;
      const cx = W / 2;
      const top = 24;
      const step = (H - 48) / (N - 1);
      const dimBackbone = a === "bases" || a === "pairs";
      const dimBases = a === "backbone";

      type Op = { z: number; run: () => void };
      const ops: Op[] = [];

      const pts1: { x: number; y: number; z: number }[] = [];
      const pts2: { x: number; y: number; z: number }[] = [];

      for (let i = 0; i < N; i++) {
        const th = phase.current + (i * 2 * Math.PI) / 10.5;
        const y = top + i * step;
        const x1 = cx + R * Math.cos(th);
        const z1 = Math.sin(th);
        const x2 = cx - R * Math.cos(th);
        const z2 = -Math.sin(th);
        pts1.push({ x: x1, y, z: z1 });
        pts2.push({ x: x2, y, z: z2 });

        const b1 = SEQ[i];
        const b2 = PAIR[b1];
        const zr = (z1 + z2) / 2;
        const alpha = (dimBases ? 0.18 : 0.55 + 0.45 * ((zr + 1) / 2)) * (a === "pairs" ? 1.15 : 1);
        ops.push({
          z: zr,
          run: () => {
            ctx.lineCap = "round";
            ctx.globalAlpha = Math.min(1, alpha);
            ctx.lineWidth = a === "pairs" ? 7 : 5;
            const mx = (x1 + x2) / 2;
            ctx.strokeStyle = COL[b1];
            ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(mx, y); ctx.stroke();
            ctx.strokeStyle = COL[b2];
            ctx.beginPath(); ctx.moveTo(mx, y); ctx.lineTo(x2, y); ctx.stroke();
            // vodorod bogʻlari
            if (a === "pairs") {
              ctx.strokeStyle = "#fff";
              ctx.lineWidth = 1.6;
              ctx.setLineDash([2, 3]);
              ctx.beginPath(); ctx.moveTo(mx - 3, y - 6); ctx.lineTo(mx + 3, y - 6); ctx.stroke();
              if (b1 === "G" || b1 === "S") { ctx.beginPath(); ctx.moveTo(mx - 3, y + 6); ctx.lineTo(mx + 3, y + 6); ctx.stroke(); }
              ctx.beginPath(); ctx.moveTo(mx - 3, y); ctx.lineTo(mx + 3, y); ctx.stroke();
              ctx.setLineDash([]);
            }
            ctx.globalAlpha = 1;
          },
        });
      }

      const strand = (pts: typeof pts1, color: string) => {
        for (let i = 0; i < N - 1; i++) {
          const p = pts[i];
          const q = pts[i + 1];
          const zz = (p.z + q.z) / 2;
          ops.push({
            z: zz - 0.01,
            run: () => {
              ctx.globalAlpha = dimBackbone ? 0.2 : 0.5 + 0.5 * ((zz + 1) / 2);
              ctx.strokeStyle = color;
              ctx.lineWidth = 6 + 2.5 * ((zz + 1) / 2);
              ctx.lineCap = "round";
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
              ctx.globalAlpha = 1;
            },
          });
        }
        pts.forEach((p) =>
          ops.push({
            z: p.z,
            run: () => {
              ctx.globalAlpha = dimBackbone ? 0.2 : 0.65 + 0.35 * ((p.z + 1) / 2);
              ctx.fillStyle = "#e9eef7";
              ctx.strokeStyle = color;
              ctx.lineWidth = 2.5;
              ctx.beginPath(); ctx.arc(p.x, p.y, 5.5 + 1.8 * ((p.z + 1) / 2), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
              ctx.globalAlpha = 1;
            },
          })
        );
      };

      strand(pts1, "#6b7a99");
      strand(pts2, "#8c99b5");

      ops.sort((m, n) => m.z - n.z).forEach((o) => o.run());

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, p: phase.current };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    phase.current = drag.current.p + (e.clientX - drag.current.x) * 0.012;
  };
  const onUp = () => (drag.current = null);

  return (
    <div className="relative">
      <canvas
        ref={ref}
        role="img"
        aria-label="DNK qoʻsh spiralining aylanuvchi 3D modeli. Sichqoncha bilan aylantirish mumkin."
        className="w-full h-auto touch-none cursor-grab active:cursor-grabbing select-none"
        style={{ aspectRatio: "420 / 440" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <button className="btn btn-ghost btn-sm" onClick={() => setAuto((a) => !a)} aria-pressed={auto}>
          {auto ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {auto ? "Toʻxtatish" : "Aylantirish"}
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-semibold mt-1">
        {(
          [["A", "Adenin"], ["T", "Timin"], ["G", "Guanin"], ["S", "Sitozin"]] as const
        ).map(([k, n]) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: COL[k] }} /> {k} — {n}
          </span>
        ))}
      </div>
    </div>
  );
}
