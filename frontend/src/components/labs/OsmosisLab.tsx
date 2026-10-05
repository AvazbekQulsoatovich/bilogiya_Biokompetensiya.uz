"use client";

import { useRef, useState } from "react";
import { Droplets, Play, RotateCcw, FastForward } from "lucide-react";
import { LabShell, LabProps } from "./LabShell";
import { Briefing, Digit, Quiz, ResultCard, useCanvas, useLabRun, sfx, type Q } from "./kit";

const MISSIONS = [
  { title: "Chuchuk suv", instruction: "Kartoshka boʻlagini distillangan suvga solib, 60 daqiqa kuzating. Hujayra nima boʻladi?" },
  { title: "Shoʻr suv", instruction: "Endi juda konsentrlangan tuz eritmasini (6 % dan yuqori) tanlang va natijani solishtiring." },
  { title: "Izotonik nuqta", instruction: "Kartoshka massasi oʻzgarmaydigan eritma konsentratsiyasini toping (taxminan 0,9 %)." },
];

const QUIZ: Q[] = [
  {
    q: "Shoʻr eritmada kartoshka massasi kamaydi. Suv qayoqqa harakatlandi?",
    options: ["Eritmadan hujayra ichiga", "Hujayradan eritmaga", "Suv umuman harakatlanmadi"],
    answer: 1,
    explain: "Suv konsentratsiyasi past (tuz koʻp) tomonga oʻtadi — ya’ni hujayradan eritmaga. Shuning uchun hujayra suv yoʻqotadi.",
  },
  {
    q: "Protoplastning hujayra devoridan ajralib qolishi nima deb ataladi?",
    options: ["Turgor", "Fotosintez", "Plazmoliz"],
    answer: 2,
    explain: "Plazmoliz — hujayra suv yoʻqotib, protoplast devordan ajralishi. Turgor esa aksincha — hujayraning suvga toʻlib taranglashishi.",
  },
  {
    q: "Nima uchun tuproqqa haddan tashqari koʻp oʻgʻit solish oʻsimlikni qurib qolishiga olib kelishi mumkin?",
    options: ["Ildiz hujayralaridan suv tuproqqa chiqib ketadi", "Oʻsimlik ortiqcha yorugʻlik oladi", "Ildiz havo yetishmasligidan nobud boʻladi"],
    answer: 0,
    explain: "Tuproq eritmasi juda konsentrlangan boʻlsa, osmos tufayli suv ildiz hujayralaridan tuproqqa chiqib ketadi va oʻsimlik soʻlib qoladi.",
  },
];

const LEARNED = [
  "Osmos — suvning yarim oʻtkazuvchan membrana orqali konsentratsiyasi past eritmadan yuqori eritmaga oʻtishi.",
  "Distillangan suvda hujayra suv shimib taranglashadi (turgor), shoʻr eritmada esa plazmoliz yuz beradi.",
  "Izotonik eritmada suv kirishi va chiqishi tenglashadi — massa oʻzgarmaydi (≈ 0,9 % NaCl).",
];

const C_IN = 0.9; // hujayra ichi (NaCl ekvivalenti, %)

/** Muvozanat hajmi: 1 = boshlangʻich, >1 taranglik, <1 plazmoliz */
function vEq(c: number) {
  if (c <= C_IN) return 1 + 0.1 * (1 - c / C_IN);
  return 1 - 0.14 * ((1 - C_IN / c) / (1 - C_IN / 10));
}

type P = { x: number; y: number; vx: number; vy: number };
type Ghost = { x: number; y: number; tx: number; ty: number; p: number };
type Run0 = { c: number; pts: [number, number][] };

export default function OsmosisLab({ lab, completeLab, isCompleted, restart }: LabProps) {
  const run = useLabRun(completeLab, isCompleted);
  const [phase, setPhase] = useState<"brief" | "lab" | "quiz" | "done">("brief");
  const [conc, setConc] = useState(0);
  const [speed, setSpeed] = useState(4);
  const [flags, setFlags] = useState({ turgor: false, plasmo: false, iso: false });
  const [ui, setUi] = useState({ t: 0, v: 1, running: false });
  const S = useRef({
    t: 0, v: 1, running: false, finished: false, conc: 0, speed: 4,
    out: [] as P[], inn: [] as P[], solOut: [] as P[], solIn: [] as P[], ghosts: [] as Ghost[],
    hist: [] as Run0[], cur: null as Run0 | null, acc: 0, ui: 0, init: false, spawn: 0,
  });
  S.current.conc = conc;
  S.current.speed = speed;

  const missionIdx = !flags.turgor ? 0 : !flags.plasmo ? 1 : !flags.iso ? 2 : 3;
  const hints = [
    "Slayderni 0 % ga qoʻying (yoki “Distillangan suv” tugmasi), keyin “Boshlash” ni bosing.",
    "“Konsentrlangan” tugmasini bosing yoki slayderni 6 % dan yuqoriga olib boring.",
    "Massa 10,00 g atrofida qolishi kerak. 0,9 % atrofidagi qiymatlarni sinab koʻring.",
    "",
  ];

  const reset = () => {
    const s = S.current;
    s.t = 0; s.v = 1; s.running = false; s.finished = false; s.ghosts = []; s.cur = null; s.init = false;
    setUi({ t: 0, v: 1, running: false });
  };

  const start = () => {
    const s = S.current;
    if (s.running) return;
    if (s.finished || s.t > 0) reset();
    s.cur = { c: s.conc, pts: [[0, 10]] };
    s.hist = [...s.hist.slice(-2), s.cur];
    s.running = true;
    sfx("whoosh");
  };

  const finishRun = () => {
    const s = S.current;
    s.running = false; s.finished = true;
    const c = s.conc, v = s.v;
    if (c <= 0.3 && v > 1.05) {
      if (!flags.turgor) { run.good("Turgor! Hujayra suv shimib tarang boʻldi (massa ortdi)."); run.note("Distillangan suvda massa ortdi — hujayra turgor holatida."); }
      setFlags((f) => ({ ...f, turgor: true }));
    } else if (c >= 6 && v < 0.92) {
      if (!flags.plasmo) { run.good("Plazmoliz! Protoplast devordan ajraldi (massa kamaydi)."); run.note("Shoʻr eritmada massa kamaydi — plazmoliz kuzatildi."); }
      setFlags((f) => ({ ...f, plasmo: true }));
    } else if (Math.abs(v - 1) < 0.012) {
      if (!flags.iso) { run.good(`Izotonik nuqta topildi: ${c.toFixed(1).replace(".", ",")} % — massa deyarli oʻzgarmadi.`); run.note(`Izotonik eritma ≈ ${c.toFixed(1).replace(".", ",")} % NaCl.`); }
      setFlags((f) => ({ ...f, iso: true }));
    } else {
      run.say("info", `Natija: massa ${(10 * v).toFixed(2).replace(".", ",")} g. Boshqa konsentratsiyani ham sinab koʻring.`);
    }
  };

  /* ───────── Asosiy sahna ───────── */
  const cv = useCanvas((g, w, h, dt, t) => {
    const s = S.current;
    const wallW = Math.min(w * 0.5, 330), wallH = wallW * 0.68;
    const cx = w * 0.5, cy = h * 0.5;
    const wx = cx - wallW / 2, wy = cy - wallH / 2;
    const sc = 0.42 + 0.55 * Math.max(0, Math.min(1, (s.v - 0.8) / 0.3));
    const pw = wallW * 0.94 * sc, ph = wallH * 0.92 * sc;
    const px = cx - pw / 2, py = cy - ph / 2;

    // boshlangʻich zarrachalar
    if (!s.init) {
      s.init = true;
      const mk = (n: number, x0: number, y0: number, x1: number, y1: number): P[] =>
        Array.from({ length: n }, () => ({ x: x0 + Math.random() * (x1 - x0), y: y0 + Math.random() * (y1 - y0), vx: (Math.random() - 0.5) * 60, vy: (Math.random() - 0.5) * 60 }));
      s.out = mk(70, 10, 10, w - 10, h - 10);
      s.solOut = mk(Math.round(s.conc * 6), 10, 10, w - 10, h - 10);
      s.inn = mk(30, px + 6, py + 6, px + pw - 6, py + ph - 6);
      s.solIn = mk(10, px + 6, py + 6, px + pw - 6, py + ph - 6);
    }
    // eritma konsentratsiyasiga qarab tuz zarralari soni
    const wantSol = Math.round(s.conc * 6);
    while (s.solOut.length < wantSol) s.solOut.push({ x: 10 + Math.random() * (w - 20), y: 10 + Math.random() * (h - 20), vx: (Math.random() - 0.5) * 40, vy: (Math.random() - 0.5) * 40 });
    while (s.solOut.length > wantSol) s.solOut.pop();

    // fizika
    let dv = 0;
    if (s.running) {
      const sdt = dt * s.speed; // daqiqa
      const target = vEq(s.conc);
      dv = ((target - s.v) / 18) * sdt;
      s.v += dv;
      s.t += sdt;
      if (s.cur) {
        s.acc += dt;
        if (s.acc > 0.12) { s.acc = 0; s.cur.pts.push([s.t, 10 * s.v]); }
      }
      if (s.t >= 60) {
        s.t = 60;
        if (s.cur) s.cur.pts.push([60, 10 * s.v]);
        finishRun();
      }
    }
    const flowPerSec = s.running ? dv / dt / s.speed : 0; // V/daqiqa
    const base = s.running ? 3 : 0;
    const rate = base + Math.abs(flowPerSec) * 5200;
    s.spawn += rate * dt;
    while (s.spawn >= 1) {
      s.spawn -= 1;
      const into = flowPerSec > 0 ? Math.random() < 0.5 + Math.min(0.5, Math.abs(flowPerSec) * 90) : Math.random() < 0.5 - Math.min(0.5, Math.abs(flowPerSec) * 90);
      const side = Math.floor(Math.random() * 4);
      let bx = px + Math.random() * pw, by = py;
      let nx = 0, ny = -1;
      if (side === 1) { by = py + ph; ny = 1; }
      if (side === 2) { bx = px; by = py + Math.random() * ph; nx = -1; ny = 0; }
      if (side === 3) { bx = px + pw; by = py + Math.random() * ph; nx = 1; ny = 0; }
      const L = 34;
      s.ghosts.push(into
        ? { x: bx + nx * L, y: by + ny * L, tx: bx - nx * L, ty: by - ny * L, p: 0 }
        : { x: bx - nx * L, y: by - ny * L, tx: bx + nx * L, ty: by + ny * L, p: 0 });
    }
    s.ghosts = s.ghosts.filter((q) => (q.p += dt * 1.8) < 1).slice(-120);

    const step = (arr: P[], inside: boolean, sp: number) => {
      for (const p of arr) {
        p.vx += (Math.random() - 0.5) * 380 * dt;
        p.vy += (Math.random() - 0.5) * 380 * dt;
        const m = Math.hypot(p.vx, p.vy) || 1;
        const lim = sp;
        if (m > lim) { p.vx = (p.vx / m) * lim; p.vy = (p.vy / m) * lim; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (inside) {
          if (p.x < px + 5) { p.x = px + 5; p.vx = Math.abs(p.vx); }
          if (p.x > px + pw - 5) { p.x = px + pw - 5; p.vx = -Math.abs(p.vx); }
          if (p.y < py + 5) { p.y = py + 5; p.vy = Math.abs(p.vy); }
          if (p.y > py + ph - 5) { p.y = py + ph - 5; p.vy = -Math.abs(p.vy); }
        } else {
          if (p.x < 6) { p.x = 6; p.vx = Math.abs(p.vx); }
          if (p.x > w - 6) { p.x = w - 6; p.vx = -Math.abs(p.vx); }
          if (p.y < 6) { p.y = 6; p.vy = Math.abs(p.vy); }
          if (p.y > h - 6) { p.y = h - 6; p.vy = -Math.abs(p.vy); }
          if (p.x > px - 2 && p.x < px + pw + 2 && p.y > py - 2 && p.y < py + ph + 2) {
            const dl = p.x - px, dr = px + pw - p.x, dtp = p.y - py, db = py + ph - p.y;
            const mn = Math.min(dl, dr, dtp, db);
            if (mn === dl) { p.x = px - 3; p.vx = -Math.abs(p.vx); }
            else if (mn === dr) { p.x = px + pw + 3; p.vx = Math.abs(p.vx); }
            else if (mn === dtp) { p.y = py - 3; p.vy = -Math.abs(p.vy); }
            else { p.y = py + ph + 3; p.vy = Math.abs(p.vy); }
          }
        }
      }
    };
    step(s.out, false, 70); step(s.solOut, false, 45); step(s.inn, true, 70); step(s.solIn, true, 40);

    /* ── chizish ── */
    g.clearRect(0, 0, w, h);
    // eritma foni: konsentratsiyaga qarab rangi
    const k = Math.min(1, s.conc / 10);
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, `rgba(${40 + 90 * k},${120 - 20 * k},${210 - 120 * k},0.22)`);
    bg.addColorStop(1, `rgba(${30 + 100 * k},${90 - 10 * k},${170 - 100 * k},0.34)`);
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);

    // hujayra devori
    g.lineWidth = 9;
    g.strokeStyle = "#2f9e44";
    g.shadowColor = "rgba(75,227,138,.5)"; g.shadowBlur = 16;
    g.beginPath(); g.roundRect(wx, wy, wallW, wallH, 22); g.stroke();
    g.shadowBlur = 0;
    g.lineWidth = 2; g.strokeStyle = "rgba(190,255,200,.55)";
    g.beginPath(); g.roundRect(wx + 4, wy + 4, wallW - 8, wallH - 8, 18); g.stroke();

    // protoplast
    const grad = g.createRadialGradient(cx, cy, 10, cx, cy, Math.max(pw, ph) * 0.6);
    grad.addColorStop(0, "rgba(180,240,200,.34)");
    grad.addColorStop(1, "rgba(90,200,140,.2)");
    g.fillStyle = grad;
    g.beginPath(); g.roundRect(px, py, pw, ph, 18); g.fill();
    g.lineWidth = 2.5; g.strokeStyle = "#7bf0b5"; g.setLineDash([7, 5]); g.lineDashOffset = -t * 14;
    g.beginPath(); g.roundRect(px, py, pw, ph, 18); g.stroke(); g.setLineDash([]);
    // vakuola va xloroplastlar
    g.fillStyle = "rgba(120,200,255,.18)";
    g.beginPath(); g.ellipse(cx, cy, pw * 0.26, ph * 0.26, 0, 0, 6.283); g.fill();
    g.fillStyle = "#2fbf5b";
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * 6.283 + t * 0.15;
      g.beginPath(); g.ellipse(cx + Math.cos(a) * pw * 0.36, cy + Math.sin(a) * ph * 0.34, 7 * sc + 2, 4 * sc + 1.5, a, 0, 6.283); g.fill();
    }

    // zarrachalar
    g.fillStyle = "rgba(110,190,255,.95)";
    for (const p of s.out) { g.beginPath(); g.arc(p.x, p.y, 3.2, 0, 6.283); g.fill(); }
    for (const p of s.inn) { g.beginPath(); g.arc(p.x, p.y, 3.2, 0, 6.283); g.fill(); }
    g.fillStyle = "rgba(255,200,87,.95)";
    g.shadowColor = "rgba(255,200,87,.8)"; g.shadowBlur = 8;
    for (const p of s.solOut) { g.beginPath(); g.arc(p.x, p.y, 5, 0, 6.283); g.fill(); }
    for (const p of s.solIn) { g.beginPath(); g.arc(p.x, p.y, 5, 0, 6.283); g.fill(); }
    g.shadowBlur = 0;
    // membranadan oʻtayotgan suv
    for (const q of s.ghosts) {
      const e = q.p * q.p * (3 - 2 * q.p);
      const x = q.x + (q.tx - q.x) * e, y = q.y + (q.ty - q.y) * e;
      g.fillStyle = `rgba(160,235,255,${1 - q.p * 0.6})`;
      g.shadowColor = "#7fe8ff"; g.shadowBlur = 12;
      g.beginPath(); g.arc(x, y, 4.2, 0, 6.283); g.fill();
      g.strokeStyle = `rgba(160,235,255,${0.35 * (1 - q.p)})`; g.lineWidth = 2;
      g.beginPath(); g.moveTo(q.x + (q.tx - q.x) * Math.max(0, e - 0.25), q.y + (q.ty - q.y) * Math.max(0, e - 0.25)); g.lineTo(x, y); g.stroke();
    }
    g.shadowBlur = 0;

    // yozuvlar
    g.font = "600 12px Inter, system-ui, sans-serif";
    const label = (txt: string, x: number, y: number, tx: number, ty: number) => {
      g.strokeStyle = "rgba(255,255,255,.4)"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x, y); g.lineTo(tx, ty); g.stroke();
      const wlab = g.measureText(txt).width + 16;
      g.fillStyle = "rgba(4,10,18,.85)"; g.beginPath(); g.roundRect(x - 4, y - 12, wlab, 22, 8); g.fill();
      g.strokeStyle = "rgba(46,230,192,.5)"; g.stroke();
      g.fillStyle = "#e8f4ff"; g.fillText(txt, x + 4, y + 3);
    };
    label("Hujayra devori", wx - 6 - 116 < 6 ? 8 : wx - 124, wy - 4, wx + 6, wy + 14);
    label("Membrana (yarim oʻtkazuvchan)", px + pw + 30 > w - 200 ? w - 214 : px + pw + 30, py + ph + 18 > h - 12 ? h - 14 : py + ph + 18, px + pw - 4, py + ph - 4);
    label("Protoplast", cx - 34, cy + 2, cx, cy + 2);
    if (s.v < 0.93) label("Plazmoliz!", wx + 6, wy + wallH + 24 > h - 6 ? h - 12 : wy + wallH + 24, wx + 14, py + ph + 4);
    if (s.v > 1.05) label("Turgor", wx + 6, wy + wallH + 24 > h - 6 ? h - 12 : wy + wallH + 24, wx + 14, wy + wallH - 8);

    // eritma yorligʻi
    g.fillStyle = "rgba(4,10,18,.75)";
    g.beginPath(); g.roundRect(12, 12, 190, 44, 12); g.fill();
    g.fillStyle = "#86a3bb"; g.font = "600 11px Inter, system-ui, sans-serif"; g.fillText("TASHQI ERITMA (NaCl)", 24, 30);
    g.fillStyle = "#ffc857"; g.font = "700 18px ui-monospace, monospace"; g.fillText(s.conc.toFixed(1).replace(".", ",") + " %", 24, 49);

    // UI ni siyraklashtirib yangilash
    s.ui += dt;
    if (s.ui > 0.1) { s.ui = 0; setUi({ t: s.t, v: s.v, running: s.running }); }
  }, phase === "lab");

  /* ───────── Grafik ───────── */
  const chart = useCanvas((g, w, h) => {
    const s = S.current;
    g.clearRect(0, 0, w, h);
    const L = 40, R = 10, T = 26, B = 24;
    const lo = 8.4, hi = 11.2;
    g.strokeStyle = "rgba(90,176,255,.15)"; g.fillStyle = "#86a3bb"; g.font = "10px ui-monospace, monospace"; g.lineWidth = 1;
    for (let m = 8.5; m <= 11; m += 0.5) {
      const y = T + (1 - (m - lo) / (hi - lo)) * (h - T - B);
      g.beginPath(); g.moveTo(L, y); g.lineTo(w - R, y); g.stroke();
      g.fillText(m.toFixed(1), 6, y + 3);
    }
    for (let m = 0; m <= 60; m += 15) {
      const x = L + (m / 60) * (w - L - R);
      g.fillText(`${m}'`, x - 6, h - 8);
    }
    const y10 = T + (1 - (10 - lo) / (hi - lo)) * (h - T - B);
    g.strokeStyle = "rgba(255,200,87,.5)"; g.setLineDash([4, 4]);
    g.beginPath(); g.moveTo(L, y10); g.lineTo(w - R, y10); g.stroke(); g.setLineDash([]);
    const cols = ["rgba(169,139,255,.55)", "rgba(90,176,255,.6)", "#2ee6c0"];
    s.hist.forEach((r, i) => {
      const col = cols[cols.length - s.hist.length + i];
      g.strokeStyle = col; g.lineWidth = i === s.hist.length - 1 ? 3 : 2;
      g.shadowColor = col; g.shadowBlur = i === s.hist.length - 1 ? 10 : 0;
      g.beginPath();
      r.pts.forEach(([tt, m], k) => {
        const x = L + (tt / 60) * (w - L - R), y = T + (1 - (m - lo) / (hi - lo)) * (h - T - B);
        k ? g.lineTo(x, y) : g.moveTo(x, y);
      });
      g.stroke(); g.shadowBlur = 0;
      const last = r.pts[r.pts.length - 1];
      if (last) {
        g.fillStyle = col;
        g.fillText(`${r.c.toFixed(1).replace(".", ",")}%`, Math.min(w - 42, L + (last[0] / 60) * (w - L - R) + 6), T + (1 - (last[1] - lo) / (hi - lo)) * (h - T - B) - 6);
      }
    });
  }, phase === "lab");

  const mass = 10 * ui.v;
  const delta = mass - 10;
  const allDone = flags.turgor && flags.plasmo && flags.iso;

  return (
    <LabShell
      heading="Osmos hodisasi"
      icon={Droplets}
      steps={MISSIONS}
      current={phase === "brief" ? 0 : phase === "lab" ? missionIdx : 3}
      done={phase === "done"}
      run={run}
      hint={hints[Math.min(missionIdx, 3)] || undefined}
      onHint={() => run.hint(hints[Math.min(missionIdx, 3)])}
    >
      {phase === "brief" && (
        <Briefing
          title="Hujayra suvni qanday “biladi”?"
          goals={[
            "Kartoshka boʻlagini (10,00 g) turli konsentratsiyali eritmalarga joylab, 60 daqiqa davomida kuzating.",
            "Suv zarrachalari membrana orqali qaysi tomonga oʻtayotganini koʻring.",
            "Massa oʻzgarmaydigan (izotonik) eritmani toping.",
          ]}
          safety="Bu virtual tajriba — real hayotda ham kartoshka va tuz bilan xavfsiz bajariladi."
          onStart={() => setPhase("lab")}
        />
      )}

      {phase === "lab" && (
        <div className="grid gap-4">
          <div className="relative rounded-2xl border border-line overflow-hidden bg-[#050c14] stage-grid">
            <canvas ref={cv} className="w-full block" style={{ height: 400 }} aria-label="Osmos simulyatsiyasi" />
          </div>

          <div className="grid grid-cols-2 @2xl:grid-cols-4 gap-3">
            <Digit label="Kartoshka massasi" value={mass.toFixed(2).replace(".", ",")} unit="g" tone={delta > 0.02 ? "info" : delta < -0.02 ? "danger" : "brand"} />
            <Digit label="Oʻzgarish" value={`${delta >= 0 ? "+" : ""}${delta.toFixed(2).replace(".", ",")}`} unit="g" tone={delta > 0.02 ? "info" : delta < -0.02 ? "danger" : "accent"} />
            <Digit label="Hujayra ichi" value={(C_IN / ui.v).toFixed(2).replace(".", ",")} unit="% NaCl" tone="violet" />
            <div className="rounded-2xl border border-line bg-black/25 px-4 py-2.5 text-sm grid gap-1">
              {[["Turgor", flags.turgor], ["Plazmoliz", flags.plasmo], ["Izotonik", flags.iso]].map(([l, ok]) => (
                <p key={l as string} className={`flex items-center gap-2 font-semibold text-xs ${ok ? "text-ok" : "text-muted"}`}>
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[0.55rem] ${ok ? "bg-ok border-ok text-black" : "border-line-strong"}`}>{ok ? "✓" : ""}</span>{l}
                </p>
              ))}
            </div>
          </div>

          <div className="glass p-5 grid @3xl:grid-cols-2 gap-6">
            <div className="grid gap-5 content-start">
              <div>
                <div className="flex justify-between items-baseline mb-2 gap-3">
                  <label htmlFor="conc" className="font-semibold">Tashqi eritma konsentratsiyasi</label>
                  <span className="font-mono font-bold text-accent text-lg whitespace-nowrap">{conc.toFixed(1).replace(".", ",")} %</span>
                </div>
                <input
                  id="conc" type="range" min={0} max={10} step={0.1} value={conc}
                  disabled={ui.running}
                  onChange={(e) => { setConc(+e.target.value); const s = S.current; if (s.finished || s.t > 0) reset(); }}
                  className="w-full"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {[["Distillangan suv", 0], ["Fiziologik (0,9 %)", 0.9], ["Konsentrlangan", 10]].map(([l, v]) => (
                    <button key={l as string} disabled={ui.running} className="btn btn-ghost btn-sm" onClick={() => { setConc(v as number); const s = S.current; if (s.finished || s.t > 0) reset(); sfx("click"); }}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="btn btn-primary" disabled={ui.running} onClick={start}>
                  <Play className="w-4 h-4 fill-current" /> {S.current.finished ? "Qayta oʻtkazish" : "Boshlash"}
                </button>
                <button className="btn btn-ghost" onClick={() => { reset(); sfx("click"); }}><RotateCcw className="w-4 h-4" /> Tiklash</button>
                <div className="flex items-center gap-1.5 ml-auto text-sm text-muted font-semibold">
                  <FastForward className="w-4 h-4" />
                  {[2, 4, 8].map((k) => (
                    <button key={k} onClick={() => setSpeed(k)} className={`btn btn-sm ${speed === k ? "btn-soft" : "btn-ghost"}`}>×{k / 2}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted font-semibold mb-1.5"><span>Vaqt</span><span className="font-mono">{Math.round(ui.t)} / 60 daq</span></div>
                <div className="h-2 rounded-full bg-surface-2 overflow-hidden"><div className="h-full bg-gradient-to-r from-brand to-info transition-all" style={{ width: `${(ui.t / 60) * 100}%` }} /></div>
              </div>
              {allDone && (
                <button className="btn btn-primary btn-lg anim-pop" onClick={() => setPhase("quiz")}>Bilimni tekshirish →</button>
              )}
            </div>
            <div className="h-56 rounded-2xl border border-line bg-black/20 relative">
              <p className="absolute top-2 left-4 text-[0.65rem] font-bold tracking-widest text-muted z-10">MASSA (g) — VAQT (daq)</p>
              <canvas ref={chart} className="w-full h-full block" aria-label="Massa grafigi" />
            </div>
          </div>
        </div>
      )}

      {phase === "quiz" && <Quiz questions={QUIZ} run={run} onDone={() => { run.finish(); setPhase("done"); }} />}

      {phase === "done" && <ResultCard title="Osmos: tajriba muvaffaqiyatli!" xp={lab.rewardXp} run={run} learned={LEARNED} onRepeat={restart} />}
    </LabShell>
  );
}
