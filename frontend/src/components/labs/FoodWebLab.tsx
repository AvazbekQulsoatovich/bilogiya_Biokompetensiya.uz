"use client";

import { useRef, useState } from "react";
import { Network, ArrowRight, RotateCcw, Check, X } from "lucide-react";
import { LabShell, LabProps } from "./LabShell";
import { Briefing, Digit, Quiz, ResultCard, useCanvas, useLabRun, sfx, type Q } from "./kit";

const MISSIONS = [
  { title: "Oʻsimliklar", instruction: "Oziq zanjirini ishlab chiqaruvchi — oʻsimlikdan boshlang. Har keyingi organizm oldingisini yeyishi kerak." },
  { title: "Oʻtxoʻrlar va yirtqichlar", instruction: "Zanjirni oʻtxoʻr va yirtqichlar bilan davom ettiring. Ikki xil zanjir tuzing, soʻng energiya piramidasini koʻring." },
  { title: "Ekotizim muvozanati", instruction: "Bitta turni yoʻq qilsangiz ekotizimda nima boʻlishini oldindan taxmin qiling va tekshiring." },
];

const QUIZ: Q[] = [
  {
    q: "Oziq zanjiri doim kimdan boshlanadi?",
    options: ["Yirtqichdan", "Ishlab chiqaruvchidan — yashil oʻsimlikdan", "Parchalovchidan"],
    answer: 1,
    explain: "Faqat yashil oʻsimliklar quyosh energiyasidan oziq modda yaratadi (fotosintez). Boshqa barcha organizmlar bu energiyani oziq orqali oladi.",
  },
  {
    q: "Har bir keyingi oziq pogʻonasiga oldingi pogʻonadagi energiyaning taxminan qancha qismi oʻtadi?",
    options: ["Taxminan 10 %", "Taxminan 50 %", "Deyarli hammasi"],
    answer: 0,
    explain: "10 % qoidasi: qolgan energiya nafas olish, harakat va issiqlik sifatida sarflanadi. Shuning uchun yirtqichlar oʻtxoʻrlardan kam boʻladi.",
  },
  {
    q: "Ekotizimdan yirtqichlar butunlay yoʻqolsa, ularning oʻljasi (oʻtxoʻrlar) nima boʻladi?",
    options: ["Koʻpayib, oʻsimliklarni haddan tashqari yeb qoʻyadi", "Hammasi nobud boʻladi", "Hech narsa oʻzgarmaydi"],
    answer: 0,
    explain: "Yirtqichlar oʻtxoʻrlar sonini boshqaradi. Ular yoʻqolsa, oʻtxoʻrlar koʻpayib, oʻsimliklar kamayadi — ekotizim muvozanati buziladi.",
  },
];

const LEARNED = [
  "Oziq zanjiri: ishlab chiqaruvchi → oʻtxoʻr → yirtqich (energiya oqimi strelka bilan koʻrsatiladi).",
  "Energiya piramidasi: har pogʻonada energiyaning ≈10 % i keyingisiga oʻtadi.",
  "Ekotizimdagi turlar bir-biriga bogʻliq: bitta turning yoʻqolishi butun tizimga taʼsir qiladi.",
];

type Role = "producer" | "herb" | "carn";
type Org = { id: string; name: string; emoji: string; role: Role; eats: string[]; base: number; pos: [number, number]; color: string };
const ORGS: Org[] = [
  { id: "grass", name: "Oʻt", emoji: "🌿", role: "producer", eats: [], base: 100, pos: [0.17, 0.86], color: "#4be38a" },
  { id: "wheat", name: "Bugʻdoy", emoji: "🌾", role: "producer", eats: [], base: 80, pos: [0.55, 0.86], color: "#e9c46a" },
  { id: "grasshopper", name: "Chigirtka", emoji: "🦗", role: "herb", eats: ["grass"], base: 70, pos: [0.09, 0.6], color: "#9be15d" },
  { id: "mouse", name: "Sichqon", emoji: "🐭", role: "herb", eats: ["wheat", "grass"], base: 60, pos: [0.37, 0.6], color: "#c8b6a6" },
  { id: "rabbit", name: "Quyon", emoji: "🐇", role: "herb", eats: ["grass", "wheat"], base: 50, pos: [0.76, 0.6], color: "#f4e8e0" },
  { id: "frog", name: "Baqa", emoji: "🐸", role: "carn", eats: ["grasshopper"], base: 40, pos: [0.1, 0.36], color: "#5ab0ff" },
  { id: "snake", name: "Ilon", emoji: "🐍", role: "carn", eats: ["mouse", "frog"], base: 25, pos: [0.33, 0.33], color: "#a98bff" },
  { id: "fox", name: "Tulki", emoji: "🦊", role: "carn", eats: ["rabbit", "mouse"], base: 20, pos: [0.76, 0.33], color: "#ff8a5b" },
  { id: "eagle", name: "Burgut", emoji: "🦅", role: "carn", eats: ["snake", "rabbit", "mouse"], base: 12, pos: [0.54, 0.1], color: "#ffc857" },
];
const BY = Object.fromEntries(ORGS.map((o) => [o.id, o])) as Record<string, Org>;
const PREDATORS: Record<string, string[]> = Object.fromEntries(ORGS.map((o) => [o.id, ORGS.filter((x) => x.eats.includes(o.id)).map((x) => x.id)]));

const SCENARIOS = [
  { id: "snake", remove: "snake", target: "mouse", q: "Ilonlar yoʻq boʻlsa, sichqonlar soni…", ans: "up", why: "Sichqonlarni yeydigan ilon yoʻqoldi, shuning uchun sichqonlar koʻpayadi (va oʻsimlikni koʻproq yeydi)." },
  { id: "grasshopper", remove: "grasshopper", target: "frog", q: "Chigirtkalar yoʻq boʻlsa, baqalar soni…", ans: "down", why: "Baqa faqat chigirtka bilan oziqlanadi — oziq yoʻqolgach, baqalar kamayadi." },
  { id: "grass", remove: "grass", target: "grasshopper", q: "Oʻt butunlay yoʻq boʻlsa, chigirtkalar soni…", ans: "down", why: "Chigirtkaning yagona ozigʻi — oʻt. Ishlab chiqaruvchi yoʻqolsa, butun zanjir qulaydi." },
] as const;

/* ═════════════ 1. Zanjir tuzish ═════════════ */
const LEVEL_NAMES = ["Ishlab chiqaruvchi", "1-tartib isteʼmolchi", "2-tartib isteʼmolchi", "3-tartib isteʼmolchi"];

function Token({ o, size = 64, dim = false }: { o: Org; size?: number; dim?: boolean }) {
  return (
    <span className="rounded-full flex items-center justify-center shrink-0" style={{ width: size, height: size, background: `radial-gradient(circle at 35% 30%, ${o.color}55, ${o.color}18)`, border: `2px solid ${o.color}`, boxShadow: dim ? "none" : `0 0 22px ${o.color}55`, fontSize: size * 0.5, opacity: dim ? 0.35 : 1 }}>
      {o.emoji}
    </span>
  );
}

function ChainStage({ run, onDone }: { run: ReturnType<typeof useLabRun>; onDone: (chain: string[]) => void }) {
  const [chain, setChain] = useState<string[]>([]);
  const [built, setBuilt] = useState<string[][]>([]);

  const place = (id: string) => {
    const o = BY[id];
    if (chain.includes(id)) return;
    if (chain.length === 0) {
      if (o.role !== "producer") return run.mistake(`${o.name} — ${o.role === "herb" ? "oʻtxoʻr" : "yirtqich"}. Zanjir ishlab chiqaruvchi — oʻsimlikdan boshlanadi.`);
    } else {
      const prev = BY[chain[chain.length - 1]];
      if (o.role === "producer") return run.mistake("Oʻsimlik oziq zanjirining boshida turadi, davomida emas.");
      if (!o.eats.includes(prev.id)) {
        const real = o.eats.map((e) => BY[e].name.toLowerCase()).join(" yoki ");
        return run.mistake(`${o.name} ${prev.name.toLowerCase()}ni yemaydi. ${o.name} ${real}ni yeydi.`);
      }
    }
    sfx("pop");
    if (chain.length >= 3) return run.say("info", "Zanjir 4 boʻgʻinli boʻldi. Tasdiqlang yoki bittasini olib tashlang.");
    setChain([...chain, id]);
  };

  const confirm = () => {
    if (chain.length < 3) return run.mistake("Zanjirda kamida 3 ta boʻgʻin boʻlishi kerak.");
    const key = chain.join(">");
    if (built.some((b) => b.join(">") === key)) return run.mistake("Bu zanjirni allaqachon tuzgansiz. Boshqa organizmlardan foydalaning.");
    const nb = [...built, chain];
    setBuilt(nb);
    run.good(`Zanjir tuzildi: ${chain.map((c) => BY[c].name).join(" → ")}`);
    run.note(`Zanjir: ${chain.map((c) => BY[c].name).join(" → ")}.`);
    setChain([]);
    if (nb.length >= 2) setTimeout(() => onDone(nb[nb.length - 1]), 700);
  };

  return (
    <div className="grid gap-6">
      <div className="glass p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="eyebrow">Oziq zanjiri ({built.length}/2 tuzildi)</p>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm" onClick={() => setChain(chain.slice(0, -1))} disabled={!chain.length}><RotateCcw className="w-3.5 h-3.5" /> Oxirgisini olish</button>
          </div>
        </div>
        <div className="grid grid-cols-2 @2xl:grid-cols-4 gap-3 items-stretch">
          {[0, 1, 2, 3].map((k) => {
            const id = chain[k];
            const o = id ? BY[id] : null;
            return (
              <div key={k} className="relative">
                <div className={`rounded-2xl border p-4 h-full flex flex-col items-center gap-2 text-center transition-all ${o ? "border-brand/60 bg-brand-soft" : k === chain.length ? "border-dashed border-brand/70 bg-black/20 animate-pulse" : "border-dashed border-line bg-black/10"}`}>
                  <p className="text-[0.65rem] font-bold tracking-widest text-muted uppercase">{LEVEL_NAMES[k]}</p>
                  {o ? (<><Token o={o} size={72} /><p className="font-semibold">{o.name}</p></>) : (<div className="w-[72px] h-[72px] rounded-full border-2 border-dashed border-line-strong flex items-center justify-center text-muted text-2xl">?</div>)}
                </div>
                {k < 3 && <ArrowRight className="hidden @2xl:block absolute -right-[1.15rem] top-1/2 -translate-y-1/2 w-5 h-5 text-brand z-10" />}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className="btn btn-primary" onClick={confirm} disabled={chain.length < 3}><Check className="w-4 h-4" /> Zanjirni tasdiqlash</button>
          <p className="text-xs text-muted">Strelka — energiya yoʻnalishi (oʻljadan yirtqichga).</p>
        </div>
      </div>

      <div>
        <p className="eyebrow !text-muted mb-3">Organizmlar (bosing)</p>
        <div className="grid grid-cols-3 @xl:grid-cols-5 @3xl:grid-cols-9 gap-3">
          {ORGS.map((o) => (
            <button key={o.id} onClick={() => place(o.id)} disabled={chain.includes(o.id)} className="rounded-2xl border border-line bg-black/25 p-3 flex flex-col items-center gap-1.5 hover:border-brand hover:-translate-y-1 transition-all disabled:opacity-30 disabled:hover:translate-y-0">
              <Token o={o} size={52} />
              <span className="text-xs font-semibold">{o.name}</span>
              <span className="text-[0.6rem] text-muted uppercase tracking-wider">{o.role === "producer" ? "oʻsimlik" : o.role === "herb" ? "oʻtxoʻr" : "yirtqich"}</span>
            </button>
          ))}
        </div>
      </div>
      {built.length > 0 && (
        <div className="grid gap-2">
          {built.map((b, i) => (
            <div key={i} className="flex items-center gap-2 flex-wrap text-sm rounded-xl bg-ok-soft text-ok px-4 py-2 font-semibold">
              <Check className="w-4 h-4" /> {b.map((c) => BY[c].emoji + " " + BY[c].name).join("  →  ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═════════════ 2. Energiya piramidasi ═════════════ */
function PyramidStage({ chain, run, onDone }: { chain: string[]; run: ReturnType<typeof useLabRun>; onDone: () => void }) {
  const energies = [10000, 1000, 100, 10].slice(0, chain.length);
  const [ans, setAns] = useState<number | null>(null);
  const qi = Math.min(2, chain.length - 1);
  const correct = energies[qi];
  const opts = [10, 100, 1000, 5000].sort((a, b) => a - b);

  const pick = (v: number) => {
    if (ans === correct) return;
    if (v === correct) { setAns(v); run.good("Toʻgʻri! Har pogʻonada energiya 10 marta kamayadi."); run.note("Energiya piramidasi: har pogʻonada ≈10 % oʻtadi."); }
    else run.mistake(`Yoʻq. Har bir pogʻonada energiyaning faqat 10 % i oʻtadi: ${v > correct ? "kamroq" : "koʻproq"} boʻlishi kerak.`);
  };

  return (
    <div className="grid @3xl:grid-cols-2 gap-6 items-center">
      <div className="grid gap-2 justify-items-center">
        {[...chain].reverse().map((id, ri) => {
          const i = chain.length - 1 - ri;
          const o = BY[id];
          const w = 28 + (chain.length - 1 - ri === 0 ? 72 : 0) + i * 24;
          const wd = Math.max(26, 100 - ri * 20);
          void w;
          return (
            <div key={id} className="flex items-center justify-center gap-3 rounded-xl py-3 px-4 font-semibold transition-all" style={{ width: `${wd}%`, minWidth: 180, background: `linear-gradient(90deg, ${o.color}33, ${o.color}18)`, border: `1.5px solid ${o.color}` }}>
              <span className="text-2xl">{o.emoji}</span>
              <span className="text-sm">{o.name}</span>
              <span className="ml-auto font-mono text-sm" style={{ color: o.color }}>{(ans === correct || i < qi ? energies[i] : "?").toLocaleString("en-US").replace(",", " ")} kJ</span>
            </div>
          );
        })}
        <p className="text-xs text-muted mt-2">Piramidaning kengligi — pogʻonadagi energiya miqdori.</p>
      </div>
      <div className="glass p-5 grid gap-4">
        <p className="eyebrow">Energiya hisobi</p>
        <p className="font-display text-lg leading-snug">
          {BY[chain[0]].name}da <b className="text-accent">10 000 kJ</b> energiya bor. Uni yeguvchi {BY[chain[1]].name.toLowerCase()}ga ≈10 % oʻtadi. {BY[chain[qi]].name}ga qancha energiya yetib boradi?
        </p>
        <div className="flex flex-wrap gap-2">
          {opts.map((v) => (
            <button key={v} onClick={() => pick(v)} className={`btn ${ans === v ? "btn-primary" : "btn-ghost"} font-mono`}>{v.toLocaleString("en-US").replace(",", " ")} kJ</button>
          ))}
        </div>
        {ans === correct && <button className="btn btn-primary btn-lg anim-pop" onClick={onDone}>Ekotizimni sinash →</button>}
      </div>
    </div>
  );
}

/* ═════════════ 3. Ekotizim simulyatsiyasi ═════════════ */
type SimState = { P: Record<string, number>; removed: Set<string>; hist: Record<string, number>[]; acc: number; ui: number; t: number };

function relax(s: SimState) {
  const next: Record<string, number> = {};
  for (const o of ORGS) {
    if (s.removed.has(o.id)) { next[o.id] = s.P[o.id] * 0.55 < 0.5 ? 0 : s.P[o.id] * 0.55; continue; }
    // oziq
    let food = 1;
    if (o.eats.length) food = o.eats.reduce((a, e) => a + s.P[e] / BY[e].base, 0) / o.eats.length;
    // yirtqichlar bosimi
    const pr = PREDATORS[o.id];
    let pressure = 1;
    if (pr.length) {
      const sum = pr.reduce((a, k) => a + s.P[k] / BY[k].base, 0) / pr.length;
      pressure = 0.4 + 0.6 * sum;
    }
    let target = (o.base * Math.pow(Math.max(food, 0), 0.85)) / Math.max(pressure, 0.25);
    target = Math.min(target, o.base * 2.2);
    const cur = s.P[o.id] < 4 && target > 0 ? 4 : s.P[o.id];
    next[o.id] = cur + (target - cur) * 0.22;
  }
  s.P = next;
}

function SimStage({ run, onDone }: { run: ReturnType<typeof useLabRun>; onDone: () => void }) {
  const S = useRef<SimState>({ P: Object.fromEntries(ORGS.map((o) => [o.id, o.base])), removed: new Set(), hist: [], acc: 0, ui: 0, t: 0 });
  const [, force] = useState(0);
  const [sc, setSc] = useState<number | null>(null);
  const [pred, setPred] = useState<"up" | "down" | "same" | null>(null);
  const [verdict, setVerdict] = useState<null | { ok: boolean; pct: number }>(null);
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const wait = useRef<{ target: string; at: number; pred: string; ans: string } | null>(null);

  const resetAll = () => {
    const s = S.current;
    s.removed = new Set(); s.P = Object.fromEntries(ORGS.map((o) => [o.id, o.base])); s.hist = []; s.t = 0;
    setPred(null); setVerdict(null); wait.current = null; force((x) => x + 1);
  };

  const start = () => {
    if (sc === null || !pred) return;
    const scn = SCENARIOS[sc];
    const s = S.current;
    s.removed = new Set([scn.remove]);
    wait.current = { target: scn.target, at: s.t + 70, pred, ans: scn.ans };
    sfx("whoosh");
    force((x) => x + 1);
  };

  const toggle = (id: string) => {
    if (wait.current) return;
    const s = S.current;
    if (s.removed.has(id)) { s.removed.delete(id); s.P[id] = Math.max(s.P[id], 6); }
    else s.removed.add(id);
    sfx("click");
    force((x) => x + 1);
  };

  const cv = useCanvas((g, w, h, dt, tt) => {
    const s = S.current;
    s.acc += dt;
    while (s.acc > 1 / 14) { s.acc -= 1 / 14; relax(s); s.t += 1; s.hist.push({ ...s.P }); if (s.hist.length > 120) s.hist.shift(); }
    // kutilayotgan natija
    const wt = wait.current;
    if (wt && s.t >= wt.at) {
      wait.current = null;
      const base = BY[wt.target].base;
      const now = s.P[wt.target];
      const pct = Math.round((now / base - 1) * 100);
      const real = pct > 8 ? "up" : pct < -8 ? "down" : "same";
      const ok = real === wt.pred;
      setVerdict({ ok, pct });
      if (ok) run.good("Toʻgʻri taxmin!"); else run.mistake("Taxmin toʻgʻri chiqmadi — natijani va tushuntirishni oʻqing.");
      setDoneIds((d) => (sc !== null && !d.includes(SCENARIOS[sc].id) ? [...d, SCENARIOS[sc].id] : d));
      if (sc !== null) run.note(`${BY[SCENARIOS[sc].remove].name} yoʻqolsa: ${BY[wt.target].name} ${pct >= 0 ? "+" : ""}${pct}%.`);
    }

    g.clearRect(0, 0, w, h);
    // aloqa chiziqlari (strelka: oʻljadan yirtqichga)
    for (const o of ORGS) {
      for (const e of o.eats) {
        const a = BY[e], b = o;
        const ax = a.pos[0] * w, ay = a.pos[1] * h, bx = b.pos[0] * w, by = b.pos[1] * h;
        const alive = !s.removed.has(a.id) && !s.removed.has(b.id);
        const ang = Math.atan2(by - ay, bx - ax);
        const ra = 12 + Math.sqrt(s.P[a.id] / a.base) * 20, rb = 12 + Math.sqrt(s.P[b.id] / b.base) * 20;
        const x1 = ax + Math.cos(ang) * ra, y1 = ay + Math.sin(ang) * ra, x2 = bx - Math.cos(ang) * (rb + 4), y2 = by - Math.sin(ang) * (rb + 4);
        g.strokeStyle = alive ? "rgba(46,230,192,.5)" : "rgba(134,163,187,.18)"; g.lineWidth = alive ? 1.8 : 1;
        g.setLineDash(alive ? [7, 6] : [3, 6]); g.lineDashOffset = alive ? -tt * 22 : 0;
        g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.setLineDash([]);
        g.fillStyle = g.strokeStyle; g.beginPath(); g.moveTo(x2, y2); g.lineTo(x2 - Math.cos(ang - 0.4) * 9, y2 - Math.sin(ang - 0.4) * 9); g.lineTo(x2 - Math.cos(ang + 0.4) * 9, y2 - Math.sin(ang + 0.4) * 9); g.closePath(); g.fill();
      }
    }
    // tugunlar
    for (const o of ORGS) {
      const x = o.pos[0] * w, y = o.pos[1] * h;
      const ratio = s.P[o.id] / o.base;
      const r = 14 + Math.sqrt(Math.max(ratio, 0)) * 20;
      const dead = s.removed.has(o.id) && s.P[o.id] < 1;
      const gr = g.createRadialGradient(x, y, 2, x, y, r * 1.8);
      gr.addColorStop(0, dead ? "rgba(120,130,150,.15)" : o.color + "66"); gr.addColorStop(1, o.color + "00");
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * 1.8, 0, 6.283); g.fill();
      g.fillStyle = dead ? "rgba(20,30,45,.9)" : "rgba(6,14,24,.88)";
      g.strokeStyle = dead ? "#4a5a70" : ratio > 1.15 ? "#ffc857" : ratio < 0.85 ? "#ff6b7a" : o.color;
      g.lineWidth = 2.5; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.stroke();
      g.font = `${Math.round(r * 1.05)}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;
      g.textAlign = "center"; g.textBaseline = "middle"; g.globalAlpha = dead ? 0.25 : 1;
      g.fillText(o.emoji, x, y + 1); g.globalAlpha = 1;
      if (s.removed.has(o.id)) { g.fillStyle = "#ff6b7a"; g.font = "800 22px Inter, sans-serif"; g.fillText("✕", x, y); }
      g.textBaseline = "alphabetic";
      g.font = "700 11px Inter, system-ui, sans-serif";
      const pc = Math.round(ratio * 100);
      const label = `${o.name} ${pc}%`;
      const tw = g.measureText(label).width + 12;
      g.fillStyle = "rgba(4,10,18,.85)"; g.beginPath(); g.roundRect(x - tw / 2, y + r + 5, tw, 18, 7); g.fill();
      g.fillStyle = pc > 115 ? "#ffc857" : pc < 85 ? "#ff6b7a" : "#e8f4ff"; g.fillText(label, x, y + r + 18);
    }
    g.textAlign = "left";
  }, true);

  const chart = useCanvas((g, w, h) => {
    const s = S.current;
    g.clearRect(0, 0, w, h);
    const L = 34, R = 8, T = 10, B = 16;
    g.font = "10px ui-monospace, monospace"; g.fillStyle = "#86a3bb";
    for (let p = 0; p <= 200; p += 50) {
      const y = T + (1 - p / 220) * (h - T - B);
      g.strokeStyle = p === 100 ? "rgba(255,200,87,.5)" : "rgba(90,176,255,.12)"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(L, y); g.lineTo(w - R, y); g.stroke(); g.fillText(`${p}%`, 4, y + 3);
    }
    const n = s.hist.length;
    for (const o of ORGS) {
      g.strokeStyle = o.color; g.lineWidth = s.removed.has(o.id) ? 1.2 : 2; g.globalAlpha = s.removed.has(o.id) ? 0.5 : 0.95; g.beginPath();
      s.hist.forEach((hh, i) => {
        const x = L + (i / 119) * (w - L - R);
        const y = T + (1 - Math.min(hh[o.id] / o.base * 100, 220) / 220) * (h - T - B);
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      });
      g.stroke(); g.globalAlpha = 1;
    }
    void n;
  }, true);

  const onClick = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    let best: Org | null = null, bd = 1e9;
    for (const o of ORGS) { const d = Math.hypot(o.pos[0] * r.width - x, o.pos[1] * r.height - y); if (d < bd) { bd = d; best = o; } }
    if (best && bd < 44) toggle(best.id);
  };

  const scn = sc !== null ? SCENARIOS[sc] : null;
  const running = !!wait.current;

  return (
    <div className="grid gap-4">
      <div className="grid @3xl:grid-cols-[1fr_20rem] gap-4">
        <div className="relative rounded-2xl border border-line overflow-hidden bg-[#050c14] stage-grid">
          <canvas ref={cv} onPointerUp={onClick} className="w-full block cursor-pointer" style={{ height: 460 }} aria-label="Ekotizim simulyatsiyasi" />
          <p className="absolute bottom-2 left-3 text-[0.68rem] text-muted font-semibold">Turni bosib yoʻq qilish / qaytarish mumkin. Doira kattaligi — son.</p>
        </div>
        <div className="grid gap-3 content-start">
          <div className="glass p-4 grid gap-3">
            <p className="eyebrow">Taxmin qiling</p>
            <div className="grid gap-2">
              {SCENARIOS.map((s2, i) => (
                <button key={s2.id} disabled={running} onClick={() => { resetAll(); setSc(i); }} className={`text-left rounded-xl border px-3 py-2.5 text-sm font-semibold flex items-center gap-2 transition-all ${doneIds.includes(s2.id) ? "border-ok/40 bg-ok-soft text-ok" : sc === i ? "border-brand bg-brand-soft" : "border-line bg-black/20 hover:border-brand"}`}>
                  <span className="text-lg">{BY[s2.remove].emoji}</span> {BY[s2.remove].name} yoʻq qilinsa {doneIds.includes(s2.id) && <Check className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </div>
            {scn && (
              <div className="grid gap-2.5 anim-pop">
                <p className="text-sm font-semibold leading-snug">{scn.q}</p>
                <div className="grid grid-cols-3 gap-2">
                  {([["up", "Koʻpayadi"], ["same", "Oʻzgarmaydi"], ["down", "Kamayadi"]] as const).map(([k, l]) => (
                    <button key={k} disabled={running || !!verdict} onClick={() => setPred(k)} className={`btn btn-sm ${pred === k ? "btn-primary" : "btn-ghost"} !px-1`}>{l}</button>
                  ))}
                </div>
                {!verdict && <button className="btn btn-primary" disabled={!pred || running} onClick={start}>{running ? "Kuzatilmoqda…" : "Turni yoʻq qilish va kuzatish"}</button>}
                {verdict && (
                  <div className={`rounded-xl border px-3 py-3 text-sm leading-relaxed ${verdict.ok ? "border-ok/40 bg-ok-soft text-ok" : "border-danger/40 bg-danger-soft text-danger"}`}>
                    <p className="font-bold mb-1">{verdict.ok ? <Check className="inline w-4 h-4" /> : <X className="inline w-4 h-4" />} {BY[scn.target].name}: {verdict.pct >= 0 ? "+" : ""}{verdict.pct} %</p>
                    <p className="text-ink-2">{scn.why}</p>
                    <button className="btn btn-ghost btn-sm mt-2" onClick={resetAll}><RotateCcw className="w-3.5 h-3.5" /> Tiklash</button>
                  </div>
                )}
              </div>
            )}
          </div>
          <Digit label="Bajarildi" value={`${doneIds.length}/2`} tone={doneIds.length >= 2 ? "brand" : "accent"} />
          {doneIds.length >= 2 && <button className="btn btn-primary btn-lg anim-pop" onClick={onDone}>Bilimni tekshirish →</button>}
        </div>
      </div>
      <div className="glass p-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
          {ORGS.map((o) => (<span key={o.id} className="text-xs font-semibold flex items-center gap-1.5"><span className="w-3 h-1 rounded" style={{ background: o.color }} />{o.name}</span>))}
        </div>
        <div className="h-44 relative"><canvas ref={chart} className="w-full h-full block" aria-label="Populyatsiyalar grafigi" /></div>
      </div>
    </div>
  );
}

export default function FoodWebLab({ lab, completeLab, isCompleted, restart }: LabProps) {
  const run = useLabRun(completeLab, isCompleted);
  const [phase, setPhase] = useState<"brief" | "chain" | "pyramid" | "sim" | "quiz" | "done">("brief");
  const [chain, setChain] = useState<string[]>([]);
  const hint: Record<string, string> = {
    chain: "Masalan: Oʻt → Chigirtka → Baqa → Ilon. Har bir organizm oldingisini yeyishi shart.",
    pyramid: "Har pogʻonada energiya 10 marta kamayadi: 10 000 → 1 000 → 100 → 10.",
    sim: "Yirtqich yoʻqolsa uning ovi koʻpayadi; oʻsimlik yoʻqolsa hamma oʻtxoʻr va yirtqichlar kamayadi.",
  };
  return (
    <LabShell
      heading="Oziq zanjiri va ekotizim"
      icon={Network}
      steps={MISSIONS}
      current={phase === "brief" || phase === "chain" ? 0 : phase === "pyramid" ? 1 : phase === "sim" ? 2 : 3}
      done={phase === "done"}
      run={run}
      hint={hint[phase]}
      onHint={() => run.hint(hint[phase])}
    >
      {phase === "brief" && (
        <Briefing
          title="Tabiatda hamma narsa bir-biriga bogʻliq"
          goals={[
            "Oʻsimlikdan boshlab ikki xil oziq zanjirini tuzing.",
            "Energiya piramidasi va 10 % qoidasini hisoblang.",
            "Bitta turni yoʻq qilib, butun ekotizim qanday oʻzgarishini taxmin qiling va tekshiring.",
          ]}
          onStart={() => setPhase("chain")}
        />
      )}
      {phase === "chain" && <ChainStage run={run} onDone={(c) => { setChain(c); setPhase("pyramid"); }} />}
      {phase === "pyramid" && <PyramidStage chain={chain} run={run} onDone={() => setPhase("sim")} />}
      {phase === "sim" && <SimStage run={run} onDone={() => setPhase("quiz")} />}
      {phase === "quiz" && <Quiz questions={QUIZ} run={run} onDone={() => { run.finish(); setPhase("done"); }} />}
      {phase === "done" && <ResultCard title="Ekotizim: tajriba muvaffaqiyatli!" xp={lab.rewardXp} run={run} learned={LEARNED} onRepeat={restart} />}
    </LabShell>
  );
}
