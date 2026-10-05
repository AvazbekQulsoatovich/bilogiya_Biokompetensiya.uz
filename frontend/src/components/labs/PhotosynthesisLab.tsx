"use client";

import { useRef, useState } from "react";
import { Sun, Power, Timer, FlaskConical } from "lucide-react";
import { LabShell, LabProps } from "./LabShell";
import { Briefing, Digit, Quiz, ResultCard, useCanvas, useLabRun, sfx, type Q } from "./kit";

const MISSIONS = [
  { title: "Yorugʻlik manbai", instruction: "Chiroqni yoqing va elodeya kislorod pufakchalarini ajratishini kuzating. 30 soniyada ularni sanang." },
  { title: "Masofa", instruction: "Chiroqni turli masofaga qoʻyib (yaqin, oʻrta, uzoq) pufakchalar sonini oʻlchang va qonuniyatni toping." },
];

const QUIZ: Q[] = [
  {
    q: "Elodeya ajratayotgan pufakchalarda qaysi gaz bor?",
    options: ["Karbonat angidrid", "Kislorod", "Azot"],
    answer: 1,
    explain: "Fotosintezda yorugʻlik energiyasi ishtirokida CO₂ va suvdan glyukoza va kislorod hosil boʻladi. Kislorod pufakchalar koʻrinishida ajraladi.",
  },
  {
    q: "Chiroq elodeyadan uzoqlashtirilganda pufakchalar soni qanday oʻzgaradi?",
    options: ["Kamayadi — yorugʻlik kuchsizlashadi", "Koʻpayadi", "Oʻzgarmaydi"],
    answer: 0,
    explain: "Yorugʻlik intensivligi masofa ortishi bilan tez kamayadi, shuning uchun fotosintez sekinlashadi va kislorod kamroq ajraladi.",
  },
  {
    q: "Nima uchun suvga ozgina ichimlik sodasi (CO₂ manbai) qoʻshiladi?",
    options: ["Suvni isitish uchun", "Fotosintez uchun CO₂ yetarli boʻlishi uchun", "Elodeyani oʻldirish uchun"],
    answer: 1,
    explain: "Fotosintezning xomashyosi CO₂ va suv. CO₂ yetishmasa, yorugʻlik koʻp boʻlsa ham fotosintez tezlasha olmaydi.",
  },
];

const LEARNED = [
  "Fotosintez: CO₂ + H₂O + yorugʻlik → glyukoza + O₂ (xlorofill ishtirokida).",
  "Yorugʻlik yaqin boʻlsa, pufakchalar koʻp — fotosintez tezroq. Uzoqlashganda tezlik kamayadi.",
  "Qorongʻida fotosintez toʻxtaydi — kislorod ajralmaydi.",
  "CO₂ yetishmasligi ham fotosintezni cheklaydi.",
];

type Row = { d: number; lit: boolean; co2: boolean; count: number };
type Bub = { x: number; y: number; r: number; vy: number };

/** Emish tezligi (pufakcha/daqiqa): yorugʻlik intensivligi 1/d² ga mutanosib, toʻyinish bilan */
function rateAt(d: number, lit: boolean, co2: boolean) {
  if (!lit) return 0;
  const I = (15 / d) ** 2;
  return 110 * (I / (I + 0.4)) * (co2 ? 1 : 0.55);
}

export default function PhotosynthesisLab({ lab, completeLab, isCompleted, restart }: LabProps) {
  const run = useLabRun(completeLab, isCompleted);
  const [phase, setPhase] = useState<"brief" | "lab" | "quiz" | "done">("brief");
  const [d, setD] = useState(60);
  const [lit, setLit] = useState(false);
  const [co2, setCo2] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [meas, setMeas] = useState<{ on: boolean; t: number; n: number }>({ on: false, t: 0, n: 0 });

  const S = useRef({
    d: 60, lit: false, co2: true, bubs: [] as Bub[], acc: 0, gas: 0, drag: false,
    meas: false, mt: 0, mc: 0, mUi: 0, bx: 0, scale: 1, rays: 0, mDist: 60, mLit: false, mCo2: true,
  });
  const s0 = S.current;
  if (!s0.meas) { s0.d = d; s0.lit = lit; s0.co2 = co2; }

  const litRows = rows.filter((r) => r.lit);
  const bands = new Set(litRows.map((r) => (r.d <= 25 ? "near" : r.d <= 55 ? "mid" : "far")));
  const dark = rows.some((r) => !r.lit);
  const mission = litRows.length === 0 ? 0 : 1;
  const done = bands.size >= 3 && dark;
  const hintTxt = [
    "“Chiroqni yoqish” tugmasini bosing, soʻng “30 s oʻlchash” ni bosib pufakchalar sonini aniqlang.",
    "Chiroqni 3 xil masofada (≤25, 30–55, ≥60 sm) oʻlchang. Qorongʻida (chiroq oʻchiq) ham bitta oʻlchov oling.",
  ];

  const startMeasure = () => {
    const s = S.current;
    if (s.meas) return;
    s.meas = true; s.mt = 0; s.mc = 0;
    s.mDist = s.d; s.mLit = s.lit; s.mCo2 = s.co2;
    sfx("whoosh");
    setMeas({ on: true, t: 0, n: 0 });
  };

  const cv = useCanvas((g, w, h, dt, tt) => {
    const s = S.current;
    const bx = Math.max(w * 0.58, 330);
    const scale = (bx - 14 - 60) / 100;
    s.bx = bx; s.scale = scale;
    const lampX = bx - 14 - s.d * scale;
    const lampY = 330;
    const cxE = bx + 90;

    // fizika
    const speed = s.meas ? 3 : 1;
    const sdt = dt * speed;
    const rate = rateAt(s.meas ? s.mDist : s.d, s.meas ? s.mLit : s.lit, s.meas ? s.mCo2 : s.co2) / 60; // pufakcha/s
    s.acc += rate * sdt * (0.6 + Math.random() * 0.8);
    while (s.acc >= 1) {
      s.acc -= 1;
      s.bubs.push({ x: cxE + (Math.random() - 0.5) * 10, y: 332, r: 2.4 + Math.random() * 1.8, vy: 30 + Math.random() * 20 });
      if (s.meas) s.mc += 1;
    }
    const tubeTop = 150, tubeMouth = 292;
    const gasPx = Math.min(100, s.gas * 1.2);
    for (const b of s.bubs) { b.y -= b.vy * sdt; b.x += Math.sin(tt * 5 + b.r * 9) * 0.25; }
    s.bubs = s.bubs.filter((b) => {
      if (b.y < tubeTop + gasPx + 4) { s.gas += 0.05; return false; }
      return true;
    });
    if (s.meas) {
      s.mt += sdt;
      s.mUi += dt;
      if (s.mUi > 0.1) { s.mUi = 0; setMeas({ on: true, t: s.mt, n: s.mc }); }
      if (s.mt >= 30) {
        s.meas = false;
        const row: Row = { d: s.mDist, lit: s.mLit, co2: s.mCo2, count: s.mc };
        setRows((r) => [...r, row]);
        setMeas({ on: false, t: 0, n: 0 });
        if (row.lit) run.good(`${Math.round(row.d)} sm: 30 s da ${row.count} pufakcha → ${row.count * 2} /min`);
        else run.good(`Qorongʻida ${row.count} pufakcha — fotosintez toʻxtadi.`);
        run.note(row.lit ? `${Math.round(row.d)} sm masofada ${row.count * 2} pufakcha/daq.` : "Qorongʻida pufakcha ajralmadi.");
      }
    }

    /* ── chizish ── */
    g.clearRect(0, 0, w, h);
    g.save(); g.translate(0, -60);
    const intensity = s.lit || s.meas && s.mLit ? Math.min(1, (15 / s.d) ** 2) : 0;
    // xona qorongʻiligi
    g.fillStyle = `rgba(2,6,12,${0.55 * (1 - intensity)})`; g.fillRect(0, 0, w, h + 60);
    // stol
    g.fillStyle = "#0b1a2b"; g.fillRect(0, 410, w, h + 60 - 410);
    g.strokeStyle = "rgba(46,230,192,.4)"; g.beginPath(); g.moveTo(0, 410); g.lineTo(w, 410); g.stroke();
    // reyka (sm shkala)
    g.strokeStyle = "rgba(255,200,87,.8)"; g.lineWidth = 2; g.beginPath(); g.moveTo(50, 440); g.lineTo(bx - 14, 440); g.stroke();
    g.font = "600 10px ui-monospace, monospace"; g.fillStyle = "#ffd98a";
    for (let c = 0; c <= 100; c += 10) {
      const x = bx - 14 - c * scale;
      g.beginPath(); g.moveTo(x, 440); g.lineTo(x, 450); g.stroke();
      if (c >= 10 && c % 20 === 0) g.fillText(`${c}`, x - 6, 464);
    }
    g.fillText("sm", bx - 8, 464);

    // yorugʻlik nuri
    const litNow = s.meas ? s.mLit : s.lit;
    if (litNow) {
      const al = 0.1 + 0.4 * Math.min(1, (15 / s.d) ** 2 + 0.08);
      const gr = g.createLinearGradient(lampX, 0, bx + 40, 0);
      gr.addColorStop(0, `rgba(255,224,120,${al})`); gr.addColorStop(1, `rgba(255,224,120,${al * 0.7})`);
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(lampX + 24, lampY - 14); g.lineTo(bx + 20, lampY - 105); g.lineTo(bx + 20, lampY + 105); g.lineTo(lampX + 24, lampY + 14); g.closePath(); g.fill();
      g.strokeStyle = `rgba(255,224,120,${al * 1.6})`; g.lineWidth = 1.5; g.setLineDash([10, 14]); g.lineDashOffset = -tt * 90;
      for (const k of [-70, -35, 0, 35, 70]) { g.beginPath(); g.moveTo(lampX + 24, lampY + k * 0.15); g.lineTo(bx + 20, lampY + k); g.stroke(); }
      g.setLineDash([]);
    }

    // chiroq
    g.fillStyle = "#4c6a92"; g.fillRect(lampX - 4, lampY + 18, 8, 92);
    g.fillStyle = "#35506f"; g.beginPath(); g.roundRect(lampX - 22, 400, 44, 10, 4); g.fill();
    if (litNow) {
      const gl = g.createRadialGradient(lampX, lampY, 4, lampX, lampY, 90);
      gl.addColorStop(0, "rgba(255,240,170,.9)"); gl.addColorStop(1, "rgba(255,200,87,0)");
      g.fillStyle = gl; g.beginPath(); g.arc(lampX, lampY, 90, 0, 6.283); g.fill();
    }
    g.fillStyle = litNow ? "#fff3b8" : "#5c7390"; g.strokeStyle = "#cfe3ff"; g.lineWidth = 2;
    g.beginPath(); g.arc(lampX, lampY, 22, 0, 6.283); g.fill(); g.stroke();
    g.fillStyle = "#35506f"; g.beginPath(); g.roundRect(lampX - 12, lampY + 18, 24, 12, 3); g.fill();
    if (!s.meas) {
      g.fillStyle = "rgba(4,10,18,.85)"; g.beginPath(); g.roundRect(lampX - 28, lampY - 60, 56, 20, 8); g.fill();
      g.strokeStyle = "rgba(46,230,192,.6)"; g.lineWidth = 1; g.stroke();
      g.fillStyle = "#86f7e0"; g.font = "700 11px Inter, sans-serif"; g.textAlign = "center"; g.fillText("⇆ suring", lampX, lampY - 46); g.textAlign = "left";
    }
    // masofa oʻqi
    g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(lampX, 395); g.lineTo(bx, 395); g.stroke();
    g.beginPath(); g.moveTo(lampX, 390); g.lineTo(lampX, 400); g.moveTo(bx, 390); g.lineTo(bx, 400); g.stroke();
    g.fillStyle = "#fff"; g.font = "700 12px ui-monospace, monospace"; g.textAlign = "center";
    g.fillText(`d = ${Math.round(s.meas ? s.mDist : s.d)} sm`, (lampX + bx) / 2, 388); g.textAlign = "left";

    // stakan (suv)
    const bw = 180, btop = 200, bbot = 405;
    g.fillStyle = "rgba(110,190,255,.28)"; g.fillRect(bx, 228, bw, bbot - 228);
    g.strokeStyle = "rgba(200,235,255,.9)"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(bx, btop); g.lineTo(bx, bbot); g.lineTo(bx + bw, bbot); g.lineTo(bx + bw, btop); g.stroke();
    g.strokeStyle = "rgba(255,255,255,.28)"; g.beginPath(); g.moveTo(bx + 12, btop + 14); g.lineTo(bx + 12, bbot - 14); g.stroke();
    g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(bx, 228 + Math.sin(tt * 2) * 1.2); g.lineTo(bx + bw, 228 + Math.cos(tt * 2) * 1.2); g.stroke();

    // elodeya
    const glow = intensity;
    for (let k = 0; k < 6; k++) {
      const ox = (k - 2.5) * 11;
      const sway = Math.sin(tt * 1.4 + k) * 3 * (1 + glow);
      g.strokeStyle = `rgb(${46 + glow * 40},${150 + glow * 60},${84 + glow * 20})`; g.lineWidth = 3; g.lineCap = "round";
      g.beginPath(); g.moveTo(cxE + ox * 1.6, 404);
      g.bezierCurveTo(cxE + ox + sway, 380, cxE + ox * 0.5 - sway, 350, cxE + ox * 0.15 + sway * 0.4, 325);
      g.stroke();
      for (let j = 0; j < 7; j++) {
        const f = j / 7;
        const px = cxE + ox * (1.6 - 1.45 * f) + sway * f, py = 404 - f * 80;
        g.fillStyle = `rgba(${60 + glow * 60},${190 + glow * 50},${100 + glow * 20},.92)`;
        g.beginPath(); g.ellipse(px - 9, py, 8, 2.8, -0.3 - sway * 0.02, 0, 6.283); g.fill();
        g.beginPath(); g.ellipse(px + 9, py - 3, 8, 2.8, 0.3 + sway * 0.02, 0, 6.283); g.fill();
      }
    }
    g.lineCap = "butt";

    // voronka
    g.fillStyle = "rgba(180,225,255,.14)"; g.strokeStyle = "rgba(200,235,255,.9)"; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(cxE - 8, tubeMouth - 6); g.lineTo(cxE - 8, 300); g.lineTo(cxE - 62, 376); g.lineTo(cxE + 62, 376); g.lineTo(cxE + 8, 300); g.lineTo(cxE + 8, tubeMouth - 6); g.fill(); g.stroke();
    // probirka (suv bilan toʻldirilgan, tepada gaz toʻplanadi)
    const tw = 44;
    g.fillStyle = "rgba(110,190,255,.28)"; g.fillRect(cxE - tw / 2, tubeTop + gasPx, tw, tubeMouth - tubeTop - gasPx);
    g.fillStyle = "rgba(255,255,255,.14)"; g.fillRect(cxE - tw / 2, tubeTop, tw, gasPx);
    g.strokeStyle = "rgba(210,240,255,.95)"; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(cxE - tw / 2, tubeMouth); g.lineTo(cxE - tw / 2, tubeTop + 16); g.arc(cxE, tubeTop + 16, tw / 2, Math.PI, 0); g.lineTo(cxE + tw / 2, tubeMouth); g.stroke();
    if (gasPx > 2) {
      g.fillStyle = "rgba(4,10,18,.85)"; g.beginPath(); g.roundRect(cxE + tw / 2 + 10, tubeTop + 4, 52, 22, 8); g.fill();
      g.fillStyle = "#86f7e0"; g.font = "700 12px Inter, sans-serif"; g.fillText("O₂ gazi", cxE + tw / 2 + 16, tubeTop + 19);
    }

    // pufakchalar
    for (const b of s.bubs) {
      g.fillStyle = "rgba(255,255,255,.2)"; g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 1.4;
      g.shadowColor = "#fff"; g.shadowBlur = 6;
      g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.283); g.fill(); g.stroke();
    }
    g.shadowBlur = 0;

    // yorliqlar
    const tag = (txt: string, x: number, y: number) => {
      g.font = "600 11px Inter, system-ui, sans-serif";
      const wd = g.measureText(txt).width + 14;
      g.fillStyle = "rgba(4,10,18,.85)"; g.beginPath(); g.roundRect(x, y - 12, wd, 22, 8); g.fill();
      g.strokeStyle = "rgba(46,230,192,.5)"; g.lineWidth = 1; g.stroke();
      g.fillStyle = "#e8f4ff"; g.fillText(txt, x + 7, y + 3);
    };
    tag("Elodeya", bx + bw + 12, 380);
    tag("Voronka", bx + bw + 12, 330);
    tag("Probirka", bx + bw + 12, 240);
    tag("Suv + CO₂", bx + 8, 214);
    g.restore();
    // oʻlchov paneli
    if (s.meas) {
      g.fillStyle = "rgba(4,10,18,.88)"; g.beginPath(); g.roundRect(14, 14, 230, 62, 14); g.fill();
      g.strokeStyle = "#2ee6c0"; g.lineWidth = 1.5; g.stroke();
      g.fillStyle = "#86a3bb"; g.font = "700 10px Inter, sans-serif"; g.fillText("OʻLCHASH • PUFAKCHALAR", 28, 34);
      g.fillStyle = "#2ee6c0"; g.font = "800 26px ui-monospace, monospace"; g.fillText(String(s.mc), 28, 64);
      g.fillStyle = "#e8f4ff"; g.font = "700 13px ui-monospace, monospace"; g.fillText(`${Math.min(30, s.mt).toFixed(0)} / 30 s`, 120, 64);
      g.fillStyle = "rgba(46,230,192,.25)"; g.fillRect(28, 70, 200, 3); g.fillStyle = "#2ee6c0"; g.fillRect(28, 70, 200 * Math.min(1, s.mt / 30), 3);
    }
  }, phase === "lab");

  /* ── Grafik: tezlik — masofa ── */
  const chart = useCanvas((g, w, h) => {
    g.clearRect(0, 0, w, h);
    const L = 44, R = 14, T = 30, B = 28;
    const X = (dd: number) => L + ((dd - 0) / 100) * (w - L - R);
    const Y = (r: number) => T + (1 - r / 70) * (h - T - B);
    g.font = "10px ui-monospace, monospace"; g.fillStyle = "#86a3bb"; g.lineWidth = 1;
    for (let r = 0; r <= 60; r += 20) { g.strokeStyle = "rgba(90,176,255,.14)"; g.beginPath(); g.moveTo(L, Y(r)); g.lineTo(w - R, Y(r)); g.stroke(); g.fillText(String(r), 12, Y(r) + 3); }
    for (let dd = 0; dd <= 100; dd += 20) g.fillText(`${dd}`, X(dd) - 6, h - 10);
    g.fillText("masofa, sm →", w - 86, h - 10);
    const pts = litRows.map((r) => ({ x: r.d, y: r.count * 2 })).sort((a, b) => a.x - b.x);
    if (pts.length > 1) {
      g.strokeStyle = "rgba(255,200,87,.8)"; g.lineWidth = 2.2; g.beginPath();
      pts.forEach((p, i) => (i ? g.lineTo(X(p.x), Y(p.y)) : g.moveTo(X(p.x), Y(p.y)))); g.stroke();
    }
    pts.forEach((p) => {
      g.fillStyle = "#2ee6c0"; g.shadowColor = "#2ee6c0"; g.shadowBlur = 10;
      g.beginPath(); g.arc(X(p.x), Y(p.y), 5.5, 0, 6.283); g.fill(); g.shadowBlur = 0;
      g.fillStyle = "#e8f4ff"; g.font = "700 10px ui-monospace, monospace"; g.fillText(String(p.y), X(p.x) - 6, Y(p.y) - 10);
    });
    if (rows.some((r) => !r.lit)) { g.fillStyle = "#ff6b7a"; g.beginPath(); g.arc(X(100), Y(0), 5, 0, 6.283); g.fill(); g.fillText("qorongʻi: 0", X(100) - 64, Y(0) - 9); }
  }, phase === "lab");

  /* ── Chiroqni surish ── */
  const onDown = (e: React.PointerEvent) => {
    if (S.current.meas) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const lampX = S.current.bx - 14 - S.current.d * S.current.scale;
    if (Math.abs(x - lampX) < 46 && Math.abs(y - 270) < 80) { S.current.drag = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }
  };
  const onMove = (e: React.PointerEvent) => {
    const s = S.current;
    if (!s.drag || s.meas) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const nd = Math.max(10, Math.min(100, (s.bx - 14 - (e.clientX - r.left)) / s.scale));
    s.d = nd; setD(Math.round(nd));
  };
  const onUp = () => { S.current.drag = false; };

  return (
    <LabShell
      heading="Fotosintezga yorugʻlik taʼsiri"
      icon={Sun}
      steps={MISSIONS}
      current={phase === "brief" ? 0 : phase === "lab" ? mission : 2}
      done={phase === "done"}
      run={run}
      hint={hintTxt[mission]}
      onHint={() => run.hint(hintTxt[mission])}
    >
      {phase === "brief" && (
        <Briefing
          title="Oʻsimlik yorugʻlikdan nafas oladimi?"
          goals={[
            "Suv ostidagi elodeyani chiroq bilan yoriting va ajralayotgan kislorod pufakchalarini sanang.",
            "Chiroqni yaqinlashtirib va uzoqlashtirib, pufakchalar tezligi qanday oʻzgarishini aniqlang.",
            "Qorongʻida va CO₂ boʻlmaganda nima boʻlishini solishtiring.",
          ]}
          safety="Chiroq qizib ketadi — suv va elektr simlarini bir-biridan uzoqroq tuting."
          onStart={() => setPhase("lab")}
        />
      )}

      {phase === "lab" && (
        <div className="grid gap-4">
          <div className="relative rounded-2xl border border-line overflow-hidden bg-[#050c14] stage-grid">
            <canvas ref={cv} className={`w-full block touch-none ${meas.on ? "" : "cursor-grab"}`} style={{ height: 420 }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} aria-label="Fotosintez tajribasi" />
          </div>

          <div className="grid @3xl:grid-cols-[1fr_1fr] gap-4">
            <div className="glass p-5 grid gap-4 content-start">
              <div className="flex flex-wrap gap-3">
                <button disabled={meas.on} onClick={() => { setLit((v) => !v); S.current.lit = !S.current.lit; sfx("click"); }} className={`btn ${lit ? "btn-primary" : "btn-ghost"}`}>
                  <Power className="w-4 h-4" /> Chiroq: {lit ? "yoniq" : "oʻchiq"}
                </button>
                <button disabled={meas.on} onClick={() => { setCo2((v) => !v); S.current.co2 = !S.current.co2; sfx("click"); }} className={`btn ${co2 ? "btn-soft" : "btn-ghost"}`}>
                  <FlaskConical className="w-4 h-4" /> CO₂ (soda): {co2 ? "bor" : "yoʻq"}
                </button>
              </div>
              <label className="block">
                <span className="text-sm font-semibold flex justify-between mb-2">Chiroq masofasi <span className="font-mono text-accent">{d} sm</span></span>
                <input type="range" min={10} max={100} step={1} disabled={meas.on} value={d} onChange={(e) => { setD(+e.target.value); S.current.d = +e.target.value; }} className="w-full" aria-label="Chiroq masofasi" />
              </label>
              <button className="btn btn-primary btn-lg" disabled={meas.on} onClick={startMeasure}>
                <Timer className="w-5 h-5" /> {meas.on ? `Oʻlchanmoqda… ${Math.round(meas.t)} / 30 s` : "30 soniya oʻlchash"}
              </button>
              <div className="grid grid-cols-3 gap-3">
                <Digit label="Pufakcha" value={meas.on ? meas.n : "—"} tone="brand" />
                <Digit label="Tezlik" value={Math.round(rateAt(d, lit, co2))} unit="/daq" tone="accent" />
                <Digit label="Oʻlchovlar" value={rows.length} tone="info" />
              </div>
              {done && <button className="btn btn-primary btn-lg anim-pop" onClick={() => setPhase("quiz")}>Xulosa va savollar →</button>}
            </div>

            <div className="grid gap-4">
              <div className="h-52 rounded-2xl border border-line bg-black/20 relative">
                <p className="absolute top-2 left-4 text-[0.65rem] font-bold tracking-widest text-muted z-10">PUFAKCHA / DAQIQA — MASOFA</p>
                <canvas ref={chart} className="w-full h-full block" aria-label="Tezlik grafigi" />
              </div>
              <div className="glass p-4">
                <p className="eyebrow !text-muted mb-2">Oʻlchovlar jadvali</p>
                {rows.length === 0 ? (
                  <p className="text-sm text-muted">Hali oʻlchov yoʻq.</p>
                ) : (
                  <div className="grid gap-1.5 text-sm max-h-40 overflow-auto">
                    {rows.map((r, i) => (
                      <div key={i} className="flex justify-between rounded-lg px-3 py-1.5 bg-black/25">
                        <span className="font-semibold">{r.lit ? `${Math.round(r.d)} sm` : "qorongʻi"} {!r.co2 && <span className="text-accent text-xs">(CO₂ yoʻq)</span>}</span>
                        <span className="font-mono text-brand">{r.count} / 30 s → {r.count * 2} /daq</span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted mt-3">Kerak: yaqin, oʻrta, uzoq masofa va qorongʻi nazorat oʻlchovi {done ? "✓" : `(${bands.size}/3 masofa${dark ? " + nazorat ✓" : ""})`}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === "quiz" && <Quiz questions={QUIZ} run={run} onDone={() => { run.finish(); setPhase("done"); }} />}
      {phase === "done" && <ResultCard title="Fotosintez: tajriba muvaffaqiyatli!" xp={lab.rewardXp} run={run} learned={LEARNED} onRepeat={restart} />}
    </LabShell>
  );
}
