"use client";

import { useRef, useState } from "react";
import { Flame, Thermometer, Pause, Play, Check, Droplets } from "lucide-react";
import { LabShell, LabProps } from "./LabShell";
import { Briefing, Digit, Gauge, Quiz, ResultCard, useCanvas, useLabRun, sfx, type Q } from "./kit";

const MISSIONS = [
  { title: "Tayyorgarlik", instruction: "Kolbaga 150–250 mL suv quying, termometrni tushiring va spirtovkani yoqing." },
  { title: "Qizdirish", instruction: "Suv qiziyotganda harorat 40, 60 va 80 °C ga yetganda uni termometrdan yozib oling." },
  { title: "Qaynash", instruction: "Suv qaynaganda haroratni yozing va u 100 °C da oʻzgarmay turishini kuzating. Soʻng spirtovkani oʻchiring." },
];

const QUIZ: Q[] = [
  {
    q: "Suv qaynayotganda harorat nima uchun 100 °C da oʻzgarmay turadi?",
    options: ["Termometr buzilib qoladi", "Berilayotgan issiqlik suvni bugʻga aylantirishga sarflanadi", "Spirtovka olovi pasayib qoladi"],
    answer: 1,
    explain: "Qaynash vaqtida energiya suv molekulalarini bir-biridan ajratib, bugʻga aylantirishga ketadi, shuning uchun harorat koʻtarilmaydi.",
  },
  {
    q: "Qaynayotgan suvdagi katta pufakchalar nimadan iborat?",
    options: ["Havo", "Suv bugʻi", "Vodorod"],
    answer: 1,
    explain: "Qaynashda suv butun hajmi boʻylab bugʻga aylanadi. Bugʻ pufakchalari yuqoriga koʻtarilib, sirtda yoriladi.",
  },
  {
    q: "Spirtovkani toʻgʻri oʻchirish usuli qaysi?",
    options: ["Ustiga kuchli puflash", "Qopqoq bilan yopish", "Ustiga suv sepish"],
    answer: 1,
    explain: "Spirtovka faqat qopqoq bilan yopib oʻchiriladi. Puflash yoki suv sepish xavfli — olov yoki spirt sachrashi mumkin.",
  },
];

const LEARNED = [
  "Suv qizdirilganda harorati bir tekis oshadi, 100 °C ga yetganda qaynaydi.",
  "Qaynash davomida harorat oʻzgarmaydi — issiqlik suvni bugʻga aylantirishga sarflanadi.",
  "Kichik pufakchalar erigan havodan, qaynashdagi katta pufakchalar esa suv bugʻidan hosil boʻladi.",
  "Spirtovkani faqat qopqoq bilan yopib oʻchiriladi.",
];

const ROOM = 22;
const CHECKS = [40, 60, 80, 100];

type Bub = { x: number; y: number; r: number; vy: number; die: number };
type Steam = { x: number; y: number; r: number; vy: number; a: number };

export default function ChemistryLab({ lab, completeLab, isCompleted, restart }: LabProps) {
  const run = useLabRun(completeLab, isCompleted);
  const [phase, setPhase] = useState<"brief" | "lab" | "quiz" | "done">("brief");
  const [stage, setStage] = useState(0); // 0 suv, 1 termometr, 2 yoqish, 3 qizdirish, 4 oʻchirish, 5 tayyor
  const [volume, setVolume] = useState(120);
  const [speed, setSpeed] = useState(15);
  const [paused, setPaused] = useState(false);
  const [readings, setReadings] = useState<{ c: number; t: number; T: number }[]>([]);
  const [ui, setUi] = useState({ T: ROOM, t: 0, vol: 0, lit: false, boil: 0, wait: -1 as number });

  const S = useRef({
    T: ROOM, t: 0, lit: false, vol: 0, volVis: 0, boil: 0, speed: 15, paused: false, thermo: false, stage: 0,
    wait: -1, // kutilayotgan nazorat nuqtasi indeksi
    done: [] as number[], hist: [] as [number, number][], histAcc: 0, bubs: [] as Bub[], steam: [] as Steam[],
    spawn: 0, sSpawn: 0, ui: 0, flame: 0, ripples: [] as { x: number; y: number; p: number }[], cap: 0,
  });
  const s0 = S.current;
  s0.speed = speed; s0.paused = paused; s0.stage = stage; s0.thermo = stage >= 1;
  if (stage === 0) s0.vol = volume;

  const mission = stage <= 2 ? 0 : stage === 3 && readings.length < 3 ? 1 : stage === 3 ? 2 : 2;
  const hintsArr = [
    "Suv hajmini 150 va 250 mL oraligʻiga qoʻying (kolbadagi yashil chiziqlar). Juda kam suv tez qizib, kolba yorilib ketishi mumkin.",
    "Harorat nazorat nuqtasiga yetganda vaqt toʻxtaydi — termometrni oʻqib, “Yozib olish” tugmasini bosing.",
    "Qaynash boshlangach harorat oʻzgarmasligini grafikdan kuzating. Soʻng spirtovkani qopqoq bilan oʻchiring.",
  ];

  /* ── Hodisalar ── */
  const confirmWater = () => {
    if (volume < 150 || volume > 250) {
      run.mistake(volume < 150 ? "Suv juda kam: kolba tez qizib yorilishi mumkin. 150–250 mL quying." : "Suv juda koʻp: qaynash uzoq davom etadi va toshib ketishi mumkin. 150–250 mL quying.");
      return;
    }
    S.current.vol = volume;
    run.good(`${volume} mL suv quyildi.`);
    setStage(1);
  };
  const putThermo = () => { sfx("click"); run.good("Termometr oʻrnatildi (u idish tubiga tegmasligi kerak)."); setStage(2); };
  const ignite = () => { S.current.lit = true; sfx("whoosh"); run.good("Spirtovka yoqildi!"); setStage(3); };
  const record = () => {
    const s = S.current;
    if (s.wait < 0) return;
    const c = CHECKS[s.wait];
    setReadings((r) => [...r, { c, t: Math.round(s.t), T: Math.round(s.T * 10) / 10 }]);
    s.done.push(s.wait);
    run.good(`${c} °C yozib olindi.`);
    run.note(`${Math.round(s.t)} s da harorat ${s.T.toFixed(0)} °C.`);
    s.wait = -1;
    s.paused = false; setPaused(false);
  };
  const extinguish = () => {
    S.current.lit = false; S.current.cap = 1;
    sfx("click"); run.good("Spirtovka qopqoq bilan yopildi.");
    setStage(5);
  };

  /* ── Sahna ── */
  const cv = useCanvas((g, w, h, dt, tt) => {
    const s = S.current;
    const cx = w / 2 - 20;
    const y0 = 36, y1 = 118, y2 = 272;
    const nw = 27, bw = 118;

    /* fizika */
    if (s.stage >= 2 && !s.paused && s.wait < 0) {
      let rem = dt * s.speed;
      while (rem > 0) {
        const st = Math.min(0.5, rem); rem -= st;
        const m = Math.max(s.vol, 20);
        const P = s.lit ? 170 : 0;
        const loss = 0.6 * Math.max(0, s.T - ROOM);
        if (s.T >= 99.95 && s.lit) {
          s.T = 100;
          s.boil += st;
          s.vol -= (Math.max(0, P - loss) / 2260) * st;
        } else {
          s.T += ((P - loss) / (m * 4.18)) * st;
          if (s.T > 100) s.T = 100;
          if (s.T < ROOM) s.T = ROOM;
        }
        s.t += st;
      }
      s.histAcc += dt;
      if (s.histAcc > 0.08) { s.histAcc = 0; s.hist.push([s.t, s.T]); }
      // nazorat nuqtasi
      for (let k = 0; k < CHECKS.length; k++) {
        if (!s.done.includes(k) && s.T >= CHECKS[k] - 0.4) {
          s.wait = k; s.paused = true; sfx("ok");
          setPaused(true);
          break;
        }
      }
    }
    s.volVis += (s.vol - s.volVis) * Math.min(1, dt * 4);
    s.flame += dt;
    if (s.cap > 0 && s.cap < 1.5) s.cap += dt;

    const PX = (y2 - y1 + 20) / 400; // piksel / mL
    const yW = y2 - Math.max(0, s.volVis) * PX;
    const hw = (y: number) => (y <= y1 ? nw : nw + ((bw - nw) * (y - y1)) / (y2 - y1));

    const T = s.T;
    const boiling = T >= 99.9 && s.lit;
    // pufakchalar
    const rate = T < 45 ? 0 : T < 70 ? (T - 45) * 0.25 : T < 99.9 ? 6 + (T - 70) * 0.7 : boiling ? 46 : 0;
    s.spawn += (s.paused ? 0 : rate * dt * Math.min(2, s.speed / 12));
    while (s.spawn >= 1 && s.volVis > 25) {
      s.spawn -= 1;
      const big = boiling ? 3.5 + Math.random() * 6 : T > 80 ? 2.2 + Math.random() * 2.6 : 1.4 + Math.random() * 1.6;
      s.bubs.push({ x: cx + (Math.random() - 0.5) * (bw * 1.2), y: y2 - 6, r: big, vy: 40 + Math.random() * 60 + big * 5, die: boiling ? -1 : y2 - (40 + Math.random() * (T > 85 ? 120 : 50)) });
    }
    if (s.spawn > 50) s.spawn = 0;
    for (const b of s.bubs) {
      b.y -= b.vy * dt * (s.paused ? 0 : 1);
      b.x += Math.sin(tt * 6 + b.r * 7) * 0.3;
      if (boiling && b.r < 7) b.r += dt * 1.5;
    }
    s.bubs = s.bubs.filter((b) => {
      if (b.y < yW + 2) {
        if (boiling && Math.abs(b.x - cx) < hw(yW) - 6) s.ripples.push({ x: b.x, y: yW, p: 0 });
        return false;
      }
      return b.die < 0 || b.y > b.die;
    });
    s.ripples = s.ripples.filter((r) => (r.p += dt * 2.4) < 1);
    // bugʻ
    const sr = T < 78 ? 0 : (T - 78) * (boiling ? 2.2 : 0.9);
    s.sSpawn += s.paused ? 0 : sr * dt * 2;
    while (s.sSpawn >= 1) {
      s.sSpawn -= 1;
      s.steam.push({ x: cx + (Math.random() - 0.5) * 30, y: y0 - 4, r: 8 + Math.random() * 8, vy: 36 + Math.random() * 30, a: 0.38 });
    }
    s.steam = s.steam.filter((p) => (p.y -= p.vy * dt * (s.paused ? 0 : 1), p.r += dt * 14, p.a -= dt * 0.15, p.a > 0));
    s.steam = s.steam.slice(-90);

    /* ── chizish ── */
    g.clearRect(0, 0, w, h);
    g.save(); g.translate(0, 34);
    // taglik / stol
    const floor = g.createLinearGradient(0, 410, 0, h);
    floor.addColorStop(0, "#0e2236"); floor.addColorStop(1, "#06101b");
    g.fillStyle = floor; g.fillRect(0, 410, w, h - 410);
    g.strokeStyle = "rgba(46,230,192,.45)"; g.beginPath(); g.moveTo(0, 410); g.lineTo(w, 410); g.stroke();
    // isitish yorugʻligi
    if (s.lit) {
      const gl = g.createRadialGradient(cx, 330, 10, cx, 330, 190);
      gl.addColorStop(0, "rgba(255,170,60,.28)"); gl.addColorStop(1, "rgba(255,170,60,0)");
      g.fillStyle = gl; g.fillRect(0, 150, w, 300);
    }

    // shtativ
    const rodX = cx + 200;
    g.fillStyle = "#6a86ad"; g.fillRect(rodX - 4, 60, 8, 352);
    g.fillStyle = "#3e5878"; g.beginPath(); g.roundRect(rodX - 70, 404, 140, 12, 5); g.fill();
    g.strokeStyle = "#8aa7cf"; g.lineWidth = 6; g.lineCap = "round";
    g.beginPath(); g.moveTo(rodX, y1 - 6); g.lineTo(cx + nw + 6, y1 - 6); g.stroke();
    g.lineWidth = 3; g.beginPath(); g.arc(cx, y1 - 6, nw + 6, 0, Math.PI, false); g.stroke();
    g.lineCap = "butt";
    // simli to'r (setka)
    g.strokeStyle = "rgba(200,220,255,.55)"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx - bw - 14, y2 + 8); g.lineTo(cx + bw + 14, y2 + 8); g.stroke();
    g.strokeStyle = "rgba(200,220,255,.25)"; g.lineWidth = 1;
    for (let i = -bw; i <= bw; i += 14) { g.beginPath(); g.moveTo(cx + i, y2 + 6); g.lineTo(cx + i, y2 + 10); g.stroke(); }
    g.fillStyle = "#3e5878"; g.fillRect(cx - bw - 14, y2 + 8, 14, 90);
    g.fillRect(cx + bw, y2 + 8, 14, 90);

    // spirtovka
    const lx = cx, ly = 338;
    const bodyG = g.createLinearGradient(lx - 46, 0, lx + 46, 0);
    bodyG.addColorStop(0, "rgba(160,210,255,.35)"); bodyG.addColorStop(0.5, "rgba(160,210,255,.12)"); bodyG.addColorStop(1, "rgba(160,210,255,.32)");
    g.fillStyle = bodyG; g.strokeStyle = "rgba(180,225,255,.8)"; g.lineWidth = 2;
    g.beginPath(); g.roundRect(lx - 46, ly + 18, 92, 54, 16); g.fill(); g.stroke();
    g.fillStyle = "rgba(255,200,87,.35)"; g.beginPath(); g.roundRect(lx - 42, ly + 40, 84, 28, 12); g.fill();
    g.fillStyle = "#8aa7cf"; g.fillRect(lx - 11, ly + 4, 22, 16);
    g.fillStyle = "#e8d3a8"; g.fillRect(lx - 3, ly - 6, 6, 12);
    if (s.cap > 0) {
      const cp = Math.min(1, s.cap);
      g.fillStyle = "#8aa7cf"; g.beginPath(); g.roundRect(lx - 14, ly - 26 + (1 - cp) * -26, 28, 26, 5); g.fill();
    }
    if (s.lit) {
      const fl = 40 + Math.sin(s.flame * 22) * 3 + Math.sin(s.flame * 37) * 2;
      const fw = 13 + Math.sin(s.flame * 17) * 1.5;
      const fg = g.createLinearGradient(0, ly - fl, 0, ly);
      fg.addColorStop(0, "rgba(255,120,40,0)"); fg.addColorStop(0.4, "rgba(255,170,60,.9)"); fg.addColorStop(1, "rgba(120,170,255,.95)");
      g.fillStyle = fg; g.shadowColor = "rgba(255,170,60,.9)"; g.shadowBlur = 24;
      g.beginPath(); g.moveTo(lx, ly - fl); g.bezierCurveTo(lx + fw * 1.3, ly - fl * 0.55, lx + fw, ly - 2, lx, ly + 2); g.bezierCurveTo(lx - fw, ly - 2, lx - fw * 1.3, ly - fl * 0.55, lx, ly - fl); g.fill();
      g.shadowBlur = 0;
      g.fillStyle = "rgba(255,240,200,.95)"; g.beginPath(); g.ellipse(lx, ly - 8, 3.2, 12, 0, 0, 6.283); g.fill();
    }

    // kolba shakli
    const flask = new Path2D();
    flask.moveTo(cx - nw, y0); flask.lineTo(cx - nw, y1);
    flask.lineTo(cx - bw + 8, y2 - 12); flask.quadraticCurveTo(cx - bw, y2, cx - bw + 18, y2);
    flask.lineTo(cx + bw - 18, y2); flask.quadraticCurveTo(cx + bw, y2, cx + bw - 8, y2 - 12);
    flask.lineTo(cx + nw, y1); flask.lineTo(cx + nw, y0);
    // suv
    if (s.volVis > 5) {
      g.save(); g.clip(flask);
      const wg = g.createLinearGradient(0, yW, 0, y2);
      const warm = Math.max(0, (T - ROOM) / 78);
      wg.addColorStop(0, `rgba(${90 + warm * 70},${170 - warm * 20},255,.55)`);
      wg.addColorStop(1, `rgba(${50 + warm * 80},${110 + warm * 10},${210 - warm * 50},.75)`);
      g.fillStyle = wg;
      g.beginPath(); g.moveTo(cx - 200, yW + Math.sin(tt * 3) * (boiling ? 2.5 : 0.8));
      for (let x = -200; x <= 200; x += 10) g.lineTo(cx + x, yW + Math.sin(tt * 3 + x * 0.05) * (boiling ? 2.5 : 0.8));
      g.lineTo(cx + 200, y2 + 4); g.lineTo(cx - 200, y2 + 4); g.closePath(); g.fill();
      // pufakchalar
      for (const b of s.bubs) {
        g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 1.2;
        g.fillStyle = "rgba(255,255,255,.14)";
        g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.283); g.fill(); g.stroke();
        g.fillStyle = "rgba(255,255,255,.7)"; g.beginPath(); g.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, 6.283); g.fill();
      }
      // sirt sachrashi
      for (const r of s.ripples) {
        g.strokeStyle = `rgba(255,255,255,${0.7 * (1 - r.p)})`; g.lineWidth = 1.5;
        g.beginPath(); g.ellipse(r.x, r.y, 5 + r.p * 12, 2 + r.p * 3, 0, 0, 6.283); g.stroke();
      }
      g.restore();
    }
    // shisha
    g.strokeStyle = "rgba(190,230,255,.85)"; g.lineWidth = 3; g.stroke(flask);
    g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - bw + 22, y2 - 30); g.lineTo(cx - nw - 8, y1 + 14); g.stroke();
    // hajm shkalasi
    g.font = "600 10px ui-monospace, monospace"; g.fillStyle = "rgba(190,230,255,.8)";
    for (const mL of [100, 200, 300]) {
      const yy = y2 - mL * PX;
      const hh = hw(yy);
      g.strokeStyle = "rgba(190,230,255,.6)"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(cx + hh - 16, yy); g.lineTo(cx + hh - 4, yy); g.stroke();
      g.fillText(`${mL}`, cx + hh + 4, yy + 3);
    }
    if (s.stage === 0) {
      const yA = y2 - 150 * PX, yB = y2 - 250 * PX;
      g.fillStyle = "rgba(75,227,138,.12)"; g.fillRect(cx - bw - 26, yB, 2 * (bw + 26), yA - yB);
      g.strokeStyle = "rgba(75,227,138,.8)"; g.setLineDash([6, 4]); g.lineWidth = 1.5;
      g.strokeRect(cx - bw - 26, yB, 2 * (bw + 26), yA - yB); g.setLineDash([]);
      g.fillStyle = "#4be38a"; g.font = "700 11px Inter, system-ui, sans-serif"; g.fillText("Nishon: 150–250 mL", cx - bw - 20, yB - 6);
    }

    // termometr (kolbaga tushirilgan)
    if (s.thermo) {
      const tx = cx - 6, top = y0 - 30, bot = y2 - 34;
      g.fillStyle = "rgba(220,240,255,.25)"; g.strokeStyle = "rgba(230,245,255,.9)"; g.lineWidth = 1.6;
      g.beginPath(); g.roundRect(tx - 4, top, 8, bot - top, 4); g.fill(); g.stroke();
      g.beginPath(); g.arc(tx, bot + 6, 8, 0, 6.283); g.fillStyle = "#ff4d5e"; g.fill(); g.stroke();
      const mh = ((T - 0) / 120) * (bot - top - 20);
      g.fillStyle = "#ff4d5e"; g.fillRect(tx - 2, bot - mh, 4, mh + 4);
      g.fillStyle = "rgba(255,255,255,.7)";
      for (let d = 0; d <= 120; d += 20) {
        const yy = bot - (d / 120) * (bot - top - 20);
        g.fillRect(tx + 5, yy, d % 40 === 0 ? 8 : 5, 1.4);
      }
    }

    // bugʻ
    for (const p of s.steam) {
      const gg = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      gg.addColorStop(0, `rgba(235,245,255,${p.a})`); gg.addColorStop(1, "rgba(235,245,255,0)");
      g.fillStyle = gg; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill();
    }

    // yozuvlar
    const tag = (txt: string, x: number, y: number, tx: number, ty: number) => {
      g.font = "600 11px Inter, system-ui, sans-serif";
      const tw = g.measureText(txt).width + 14;
      g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(tx, ty); g.stroke();
      g.fillStyle = "rgba(4,10,18,.85)"; g.beginPath(); g.roundRect(x - tw + 2, y - 11, tw, 22, 8); g.fill();
      g.strokeStyle = "rgba(46,230,192,.5)"; g.stroke();
      g.fillStyle = "#e8f4ff"; g.fillText(txt, x - tw + 9, y + 4);
    };
    if (w > 520) {
      tag("Kolba", cx - bw - 30, y1 + 40, cx - bw + 20, y1 + 70);
      tag("Spirtovka", lx - 60, ly + 50, lx - 46, ly + 50);
      tag("Shtativ", rodX - 12, 140, rodX - 4, 140);
      if (s.thermo) tag("Termometr", cx - 52, y0 + 20, cx - 10, y0 + 20);
    }
    if (boiling) {
      g.font = "800 13px Inter, system-ui, sans-serif"; g.fillStyle = "#ffc857"; g.shadowColor = "#ffc857"; g.shadowBlur = 14;
      g.fillText("QAYNASH!", cx + bw + 20 > w - 90 ? w - 96 : cx + bw + 20, y1 + 60); g.shadowBlur = 0;
    }
    g.restore();
    if (s.wait >= 0) {
      g.fillStyle = "rgba(255,200,87,.92)"; g.beginPath(); g.roundRect(w / 2 - 120, 10, 240, 30, 15); g.fill();
      g.fillStyle = "#1b1200"; g.font = "800 12px Inter, system-ui, sans-serif"; g.textAlign = "center";
      g.fillText(`⏸ ${CHECKS[s.wait]} °C — haroratni yozib oling`, w / 2, 30); g.textAlign = "left";
    }

    s.ui += dt;
    if (s.ui > 0.1) { s.ui = 0; setUi({ T: s.T, t: s.t, vol: s.vol, lit: s.lit, boil: s.boil, wait: s.wait }); }

    // bosqich avtomatik oʻtishi
    if (s.stage === 3 && s.boil >= 60 && s.done.includes(3)) { s.stage = 4; setStage(4); run.good("Qaynash barqaror: harorat 100 °C da turibdi. Spirtovkani oʻchiring."); }
  }, phase === "lab");

  /* ── Grafik ── */
  const chart = useCanvas((g, w, h) => {
    const s = S.current;
    g.clearRect(0, 0, w, h);
    const L = 38, R = 12, Tp = 34, B = 24;
    const tMax = Math.max(300, Math.ceil(s.t / 100) * 100 + 60);
    const X = (t: number) => L + (t / tMax) * (w - L - R);
    const Y = (T: number) => Tp + (1 - (T - 0) / 120) * (h - Tp - B);
    g.font = "10px ui-monospace, monospace"; g.fillStyle = "#86a3bb"; g.lineWidth = 1;
    for (let T = 0; T <= 120; T += 20) {
      g.strokeStyle = "rgba(90,176,255,.13)"; g.beginPath(); g.moveTo(L, Y(T)); g.lineTo(w - R, Y(T)); g.stroke();
      g.fillText(`${T}°`, 6, Y(T) + 3);
    }
    for (let t = 0; t <= tMax; t += tMax > 400 ? 200 : 100) g.fillText(`${t}s`, X(t) - 8, h - 8);
    g.strokeStyle = "rgba(255,200,87,.6)"; g.setLineDash([5, 4]); g.beginPath(); g.moveTo(L, Y(100)); g.lineTo(w - R, Y(100)); g.stroke(); g.setLineDash([]);
    g.fillStyle = "rgba(255,200,87,.9)"; g.fillText("qaynash nuqtasi 100 °C", L + 8, Y(100) - 5);
    if (s.hist.length > 1) {
      g.strokeStyle = "#ff6b7a"; g.lineWidth = 2.8; g.shadowColor = "#ff6b7a"; g.shadowBlur = 10; g.beginPath();
      s.hist.forEach(([t, T], i) => (i ? g.lineTo(X(t), Y(T)) : g.moveTo(X(t), Y(T))));
      g.stroke(); g.shadowBlur = 0;
    }
    readings.forEach((r, i) => {
      g.fillStyle = "#2ee6c0"; g.beginPath(); g.arc(X(r.t), Y(r.T), 5, 0, 6.283); g.fill();
      g.fillStyle = "#04140d"; g.font = "700 8px Inter, sans-serif"; g.fillText(String(i + 1), X(r.t) - 2.5, Y(r.T) + 3);
    });
  }, phase === "lab");

  const T = ui.T;
  const gaugeColor = T > 95 ? "var(--danger)" : T > 60 ? "var(--accent)" : "var(--info)";
  const finishedBoil = stage >= 4;

  return (
    <LabShell
      heading="Suvning qaynash jarayoni"
      icon={Flame}
      steps={MISSIONS}
      current={phase === "brief" ? 0 : phase === "lab" ? mission : 3}
      done={phase === "done"}
      run={run}
      hint={hintsArr[Math.min(mission, 2)]}
      onHint={() => run.hint(hintsArr[Math.min(mission, 2)])}
    >
      {phase === "brief" && (
        <Briefing
          title="Suv qanday qaynaydi?"
          goals={[
            "Kolbaga oʻlchab suv quying va termometrni tushiring.",
            "Spirtovkani yoqib, suv haroratini 40, 60 va 80 °C da yozib oling.",
            "Qaynash vaqtida harorat nima boʻlishini grafikdan aniqlang va spirtovkani toʻgʻri oʻchiring.",
          ]}
          safety="Spirtovka yonayotganda uni siljitmang, ustiga engashmang. Oʻchirishda faqat qopqoqdan foydalaning."
          onStart={() => setPhase("lab")}
        />
      )}

      {phase === "lab" && (
        <div className="grid gap-4">
          <div className="grid @3xl:grid-cols-[1fr_17rem] gap-4">
            <div className="relative rounded-2xl border border-line overflow-hidden bg-[#050c14] stage-grid">
              <canvas ref={cv} className="w-full block" style={{ height: 480 }} aria-label="Qaynash tajribasi qurilmasi" />
            </div>
            <div className="grid gap-3 content-start">
              <div className="glass p-4 flex justify-center">
                <Gauge value={T} min={0} max={120} label="Harorat" unit="°C" color={gaugeColor} size={170} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Digit label="Vaqt" value={`${Math.floor(ui.t / 60)}:${String(Math.floor(ui.t % 60)).padStart(2, "0")}`} tone="info" />
                <Digit label="Suv" value={Math.round(stage === 0 ? volume : ui.vol)} unit="mL" tone="brand" />
              </div>
              {stage >= 3 && (
                <div className="glass p-4">
                  <p className="eyebrow !text-muted mb-2.5">Oʻlchovlar jadvali</p>
                  <div className="grid gap-1.5 text-sm">
                    {CHECKS.map((c, i) => {
                      const r = readings.find((x) => x.c === c);
                      return (
                        <div key={c} className={`flex items-center justify-between rounded-lg px-3 py-1.5 ${r ? "bg-ok-soft text-ok" : ui.wait === i ? "bg-accent-soft text-accent animate-pulse" : "bg-black/20 text-muted"}`}>
                          <span className="font-semibold">{r ? <Check className="inline w-3.5 h-3.5 mr-1" /> : null}{c} °C</span>
                          <span className="font-mono text-xs">{r ? `${r.t} s · ${r.T.toFixed(1)}°` : "—"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="glass p-5 grid @3xl:grid-cols-2 gap-6">
            <div className="grid gap-4 content-start">
              {stage === 0 && (
                <>
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <label htmlFor="vol" className="font-semibold flex items-center gap-2"><Droplets className="w-4 h-4 text-info" /> Suv hajmi</label>
                      <span className={`font-mono font-bold text-lg ${volume >= 150 && volume <= 250 ? "text-ok" : "text-accent"}`}>{volume} mL</span>
                    </div>
                    <input id="vol" type="range" min={20} max={320} step={5} value={volume} onChange={(e) => setVolume(+e.target.value)} className="w-full" />
                  </div>
                  <button className="btn btn-primary" onClick={confirmWater}>Suvni tasdiqlash</button>
                </>
              )}
              {stage === 1 && (
                <button className="btn btn-primary btn-lg" onClick={putThermo}><Thermometer className="w-5 h-5" /> Termometrni tushirish</button>
              )}
              {stage === 2 && (
                <button className="btn btn-primary btn-lg" onClick={ignite}><Flame className="w-5 h-5" /> Spirtovkani yoqish</button>
              )}
              {stage >= 3 && stage < 5 && (
                <>
                  {ui.wait >= 0 ? (
                    <button className="btn btn-primary btn-lg anim-pop" onClick={record}><Thermometer className="w-5 h-5" /> Yozib olish: {T.toFixed(1).replace(".", ",")} °C</button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-muted mr-1">Tezlik</span>
                      {[5, 15, 40].map((k) => (
                        <button key={k} onClick={() => setSpeed(k)} className={`btn btn-sm ${speed === k ? "btn-soft" : "btn-ghost"}`}>×{k}</button>
                      ))}
                      <button className="btn btn-ghost btn-sm ml-auto" onClick={() => setPaused((p) => !p)}>{paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />} {paused ? "Davom" : "Pauza"}</button>
                    </div>
                  )}
                  {finishedBoil && (
                    <button className="btn btn-primary btn-lg anim-pop" onClick={extinguish}><Flame className="w-5 h-5" /> Spirtovkani qopqoq bilan oʻchirish</button>
                  )}
                  {!finishedBoil && ui.boil > 0 && (
                    <p className="text-sm text-accent font-medium">Qaynash davom etmoqda: {Math.round(ui.boil)} / 60 s. Harorat oʻzgarmayaptimi?</p>
                  )}
                </>
              )}
              {stage === 5 && (
                <button className="btn btn-primary btn-lg anim-pop" onClick={() => setPhase("quiz")}>Bilimni tekshirish →</button>
              )}
            </div>
            <div className="h-52 rounded-2xl border border-line bg-black/20 relative">
              <p className="absolute top-2 left-4 text-[0.65rem] font-bold tracking-widest text-muted z-10">HARORAT (°C) — VAQT (s)</p>
              <canvas ref={chart} className="w-full h-full block" aria-label="Harorat grafigi" />
            </div>
          </div>
        </div>
      )}

      {phase === "quiz" && <Quiz questions={QUIZ} run={run} onDone={() => { run.finish(); setPhase("done"); }} />}
      {phase === "done" && <ResultCard title="Qaynash: tajriba muvaffaqiyatli!" xp={lab.rewardXp} run={run} learned={LEARNED} onRepeat={restart} />}
    </LabShell>
  );
}
