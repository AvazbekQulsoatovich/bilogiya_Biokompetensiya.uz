"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Flower2, Minus, Plus, Check, Search } from "lucide-react";
import { LabShell, LabProps } from "./LabShell";
import { Briefing, Digit, Quiz, ResultCard, useLabRun, sfx, type Q } from "./kit";

const MISSIONS = [
  { title: "Gulkosabarg", instruction: "Gulni tashqaridan boshlab ajrating: avval himoya qiluvchi gulkosabarglarni pinset bilan torting." },
  { title: "Gultojibarg", instruction: "Hasharotlarni jalb qiluvchi yorqin gultojibarglarni ajrating." },
  { title: "Changchi va urugʻchi", instruction: "Changchilarni va urugʻchini ajrating, soʻng lupa ostida changlar va urugʻkurtaklarni kuzating." },
];

const QUIZ: Q[] = [
  {
    q: "Gulkosabarglarning asosiy vazifasi nima?",
    options: ["Hasharotlarni jalb qilish", "Gul tomurchagini himoya qilish", "Chang hosil qilish"],
    answer: 1,
    explain: "Gulkosabarglar yashil rangda boʻlib, ochilmagan tomurchakni sovuq va zararkunandalardan himoya qiladi.",
  },
  {
    q: "Gultojibarglar nima uchun yorqin va xushboʻy?",
    options: ["Hasharotlarni jalb qilib, changlanishga yordam berish uchun", "Fotosintez qilish uchun", "Suv saqlash uchun"],
    answer: 0,
    explain: "Yorqin rang va hid hasharotlarni jalb qiladi. Ular gulga qoʻngach, changni bir guldan boshqasiga olib oʻtadi.",
  },
  {
    q: "Changchining boshchasida (anter) nima hosil boʻladi?",
    options: ["Urugʻkurtak", "Chang donachalari", "Nektar"],
    answer: 1,
    explain: "Changchi ipchasi va boshchasidan iborat. Boshchada chang donachalari — erkak jinsiy hujayralar yetiladi.",
  },
  {
    q: "Urugʻlangandan keyin gulning qaysi qismi mevaga aylanadi?",
    options: ["Gultojibarg", "Changchi", "Urugʻchining tugunchagi"],
    answer: 2,
    explain: "Tugunchak ichidagi urugʻkurtaklardan urugʻ, tugunchakning oʻzidan esa meva hosil boʻladi.",
  },
];

const LEARNED = [
  "Gul qismlari tashqaridan ichkariga: gulkosabarg → gultojibarg → changchi → urugʻchi.",
  "Gulkosabarg himoya qiladi, gultojibarg hasharotlarni jalb qiladi.",
  "Changchi boshchasida chang hosil boʻladi, urugʻchi tugunchagida urugʻkurtaklar joylashgan.",
  "Urugʻlanishdan soʻng urugʻkurtaklardan urugʻ, tugunchakdan meva yetiladi.",
];

type PartId = "sepalL" | "sepalR" | "petalL" | "petalR" | "petalB" | "stamL" | "stamC" | "stamR" | "pistil";
type Group = 0 | 1 | 2 | 3;
const PARTS: { id: PartId; group: Group; c: [number, number]; name: string }[] = [
  { id: "sepalL", group: 0, c: [215, 315], name: "Gulkosabarg" },
  { id: "sepalR", group: 0, c: [305, 315], name: "Gulkosabarg" },
  { id: "petalL", group: 1, c: [205, 225], name: "Gultojibarg" },
  { id: "petalR", group: 1, c: [315, 225], name: "Gultojibarg" },
  { id: "petalB", group: 1, c: [260, 190], name: "Gultojibarg" },
  { id: "stamL", group: 2, c: [236, 250], name: "Changchi" },
  { id: "stamC", group: 2, c: [250, 262], name: "Changchi" },
  { id: "stamR", group: 2, c: [292, 252], name: "Changchi" },
  { id: "pistil", group: 3, c: [260, 240], name: "Urugʻchi" },
];
const GROUP_INFO = [
  "Gulkosabarglar ajratildi — ular tomurchakni himoya qiladi.",
  "Gultojibarglar ajratildi — ular hasharotlarni jalb qiladi.",
  "Changchilar ajratildi — boshchalarida chang hosil boʻladi.",
  "Urugʻchi ajratildi — tugunchagida urugʻkurtaklar bor.",
];
const GROUP_NAMES = ["Gulkosabarglar", "Gultojibarglar", "Changchilar", "Urugʻchi"];
const SLOT_Y = [104, 212, 330, 448];

function slotFor(id: PartId): [number, number] {
  const p = PARTS.find((x) => x.id === id)!;
  const sameGroup = PARTS.filter((x) => x.group === p.group);
  const k = sameGroup.findIndex((x) => x.id === id);
  const n = sameGroup.length;
  const x0 = 715 - ((n - 1) * 78) / 2;
  return [x0 + k * 78, SLOT_Y[p.group] + 8];
}

function PartShape({ id }: { id: PartId }) {
  switch (id) {
    case "sepalL": return <path d="M258 338 C 214 336, 186 312, 176 280 C 206 296, 236 304, 258 312 Z" fill="url(#fl-sepal)" stroke="#a6ffb8" strokeWidth="1.6" />;
    case "sepalR": return <path d="M262 338 C 306 336, 334 312, 344 280 C 314 296, 284 304, 262 312 Z" fill="url(#fl-sepal)" stroke="#a6ffb8" strokeWidth="1.6" />;
    case "petalL": return (<g><path d="M256 322 C 186 304, 140 226, 168 138 C 212 168, 252 232, 262 300 Z" fill="url(#fl-petal)" stroke="#ffd2e2" strokeWidth="1.6" /><path d="M250 300 C 210 250, 188 200, 176 160" stroke="#ffd2e2" strokeOpacity=".6" fill="none" /></g>);
    case "petalR": return (<g><path d="M264 322 C 334 304, 380 226, 352 138 C 308 168, 268 232, 258 300 Z" fill="url(#fl-petal)" stroke="#ffd2e2" strokeWidth="1.6" /><path d="M270 300 C 310 250, 332 200, 344 160" stroke="#ffd2e2" strokeOpacity=".6" fill="none" /></g>);
    case "petalB": return (<g><path d="M238 300 C 214 214, 244 124, 260 84 C 276 124, 306 214, 282 300 Z" fill="url(#fl-petal2)" stroke="#ffd2e2" strokeWidth="1.6" /><path d="M260 292 C 258 220, 258 150, 260 100" stroke="#ffd2e2" strokeOpacity=".55" fill="none" /></g>);
    case "stamL": return (<g><path d="M254 320 C 236 270, 226 226, 222 196" stroke="#eaf7d0" strokeWidth="3" fill="none" strokeLinecap="round" /><ellipse cx="222" cy="186" rx="8" ry="15" transform="rotate(-6 222 186)" fill="#ffc857" stroke="#fff0b3" strokeWidth="1.4" /></g>);
    case "stamC": return (<g><path d="M258 320 C 250 270, 244 240, 242 214" stroke="#eaf7d0" strokeWidth="3" fill="none" strokeLinecap="round" /><ellipse cx="242" cy="204" rx="8" ry="15" fill="#ffb347" stroke="#fff0b3" strokeWidth="1.4" /></g>);
    case "stamR": return (<g><path d="M266 320 C 276 272, 294 232, 300 206" stroke="#eaf7d0" strokeWidth="3" fill="none" strokeLinecap="round" /><ellipse cx="301" cy="196" rx="8" ry="15" transform="rotate(8 301 196)" fill="#ffc857" stroke="#fff0b3" strokeWidth="1.4" /></g>);
    case "pistil": return (<g><path d="M260 284 C 262 240, 258 200, 260 172" stroke="#d6f5a8" strokeWidth="6" fill="none" strokeLinecap="round" /><ellipse cx="260" cy="308" rx="23" ry="28" fill="url(#fl-ovary)" stroke="#d8ffd0" strokeWidth="1.6" /><circle cx="260" cy="162" r="11" fill="#9be15d" stroke="#e5ffc4" strokeWidth="1.5" />{[0, 1, 2, 3, 4].map((i) => (<line key={i} x1="260" y1="162" x2={260 + Math.cos(i * 1.256 - 1.4) * 17} y2={162 + Math.sin(i * 1.256 - 1.4) * 17} stroke="#e5ffc4" strokeWidth="2" strokeLinecap="round" />))}</g>);
  }
}

/* ═════════════ 1. Ajratish ═════════════ */
function DissectStage({ run, onDone }: { run: ReturnType<typeof useLabRun>; onDone: () => void }) {
  const [removed, setRemoved] = useState<PartId[]>([]);
  const [drag, setDrag] = useState<{ id: PartId; sx: number; sy: number; dx: number; dy: number } | null>(null);
  const [shake, setShake] = useState<PartId | null>(null);
  const svg = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef(drag); dragRef.current = drag;
  const remRef = useRef(removed); remRef.current = removed;

  const groupDone = (g: Group, list = removed) => PARTS.filter((p) => p.group === g).every((p) => list.includes(p.id));
  const allowed = (id: PartId, list = removed) => {
    const g = PARTS.find((p) => p.id === id)!.group;
    for (let k = 0; k < g; k++) if (!groupDone(k as Group, list)) return false;
    return true;
  };

  const tryRemove = (id: PartId) => {
    const list = remRef.current;
    if (list.includes(id)) return;
    if (!allowed(id, list)) {
      setShake(id); setTimeout(() => setShake(null), 450);
      const g = PARTS.find((p) => p.id === id)!.group;
      const need = [0, 1, 2, 3].find((k) => !groupDone(k as Group, list))!;
      run.mistake(`${PARTS.find((p) => p.id === id)!.name} ichkarida joylashgan. Avval tashqaridagi ${GROUP_NAMES[need].toLowerCase()}ni ajrating.`);
      return g;
    }
    sfx("whoosh");
    const n = [...list, id];
    setRemoved(n);
    const g = PARTS.find((p) => p.id === id)!.group;
    if (groupDone(g, n)) { run.good(GROUP_INFO[g]); run.note(GROUP_INFO[g]); }
  };

  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      const r = svg.current?.getBoundingClientRect();
      const k = r ? 900 / r.width : 1;
      setDrag((d) => (d ? { ...d, dx: (e.clientX - d.sx) * k, dy: (e.clientY - d.sy) * k } : d));
    };
    const up = () => {
      const d = dragRef.current;
      setDrag(null);
      if (!d) return;
      if (Math.hypot(d.dx, d.dy) < 8 || Math.hypot(d.dx, d.dy) > 110) tryRemove(d.id);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [!!drag]); // eslint-disable-line react-hooks/exhaustive-deps

  const done = removed.length === PARTS.length;
  const order: PartId[] = ["sepalL", "sepalR", "petalB", "petalL", "petalR", "stamC", "stamL", "stamR", "pistil"];
  // chizish tartibi: orqadan oldinga
  const draw: PartId[] = ["petalB", "pistil", "stamC", "stamL", "stamR", "petalL", "petalR", "sepalL", "sepalR"];
  void order;

  return (
    <div className="grid gap-4">
      <div className="relative rounded-2xl border border-line overflow-hidden bg-[#050c14] stage-grid">
        <svg ref={svg} viewBox="0 0 900 540" className="w-full touch-none select-none" role="img" aria-label="Gul va ajratilgan qismlar laganbi">
          <defs>
            <linearGradient id="fl-sepal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4be38a" /><stop offset="1" stopColor="#1f8a4d" /></linearGradient>
            <linearGradient id="fl-petal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff9fc0" /><stop offset="1" stopColor="#d9457f" /></linearGradient>
            <linearGradient id="fl-petal2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb4cf" /><stop offset="1" stopColor="#b8346c" /></linearGradient>
            <radialGradient id="fl-ovary" cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#d3ff8a" /><stop offset="1" stopColor="#4fa83a" /></radialGradient>
            <radialGradient id="fl-glow" cx=".5" cy=".45" r=".5"><stop offset="0" stopColor="#ff8fb8" stopOpacity=".3" /><stop offset="1" stopColor="#ff8fb8" stopOpacity="0" /></radialGradient>
          </defs>
          <circle cx="260" cy="230" r="230" fill="url(#fl-glow)" />
          {/* poya */}
          <path d="M254 340 C 252 400, 260 460, 256 540" stroke="#2c9a55" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M256 450 C 300 430, 340 440, 360 470 C 320 480, 286 470, 256 450Z" fill="#2c9a55" stroke="#a6ffb8" strokeOpacity=".5" />
          <ellipse cx="260" cy="334" rx="26" ry="9" fill="#2c9a55" />
          {/* lagan */}
          <rect x="528" y="40" width="352" height="470" rx="22" fill="rgba(255,255,255,.03)" stroke="rgba(46,230,192,.35)" strokeDasharray="6 6" />
          {GROUP_NAMES.map((n, i) => (<text key={n} x="544" y={SLOT_Y[i] - 48} fill="#86a3bb" fontSize="12" fontWeight="700" letterSpacing="1.5">{n.toUpperCase()}</text>))}
          {[0, 1, 2, 3].map((g) => groupDone(g as Group) && <text key={g} x="860" y={SLOT_Y[g] - 48} textAnchor="end" fill="#4be38a" fontSize="13" fontWeight="800">✓</text>)}

          {draw.map((id) => {
            const p = PARTS.find((x) => x.id === id)!;
            const isRem = removed.includes(id);
            const [tx, ty] = slotFor(id);
            const dragging = drag?.id === id;
            const can = !isRem && allowed(id);
            return (
              <motion.g
                key={id}
                animate={isRem ? { x: tx - p.c[0], y: ty - p.c[1], scale: 0.46, rotate: 0 } : dragging ? { x: drag!.dx, y: drag!.dy, scale: 1.04 } : { x: 0, y: 0, scale: 1, rotate: shake === id ? [0, -3, 3, -2, 0] : 0 }}
                transition={dragging ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 16 }}
                style={{ transformBox: "fill-box", transformOrigin: "center", cursor: isRem ? "default" : "grab", filter: dragging ? "drop-shadow(0 10px 14px rgba(0,0,0,.6))" : can ? undefined : undefined }}
                onPointerDown={(e) => { if (isRem) return; setDrag({ id, sx: e.clientX, sy: e.clientY, dx: 0, dy: 0 }); }}
              >
                <PartShape id={id} />
                {!isRem && can && <rect x={p.c[0] - 3} y={p.c[1] - 3} width="6" height="6" opacity="0" />}
              </motion.g>
            );
          })}

          <text x="260" y="40" textAnchor="middle" fill="#86a3bb" fontSize="13" fontWeight="700">Qismlarni sudrang yoki bosing →</text>
        </svg>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Digit label="Ajratildi" value={`${removed.length}/${PARTS.length}`} tone={done ? "brand" : "accent"} />
        <p className="text-sm text-muted flex-1 min-w-[14rem]">Tartib: <b className="text-ink">gulkosabarg → gultojibarg → changchi → urugʻchi</b>. Tashqi qismlarni olmasdan ichkarisiga yetib boʻlmaydi.</p>
        {done && <button className="btn btn-primary btn-lg anim-pop" onClick={onDone}><Search className="w-5 h-5" /> Lupa ostida kuzatish</button>}
      </div>
    </div>
  );
}

/* ═════════════ 2. Lupa ostida ═════════════ */
function Pollen({ n = 70 }: { n?: number }) {
  const dots = useMemo(() => Array.from({ length: n }, (_, i) => {
    const a = i * 2.399963, r = Math.sqrt(i / n) * 118;
    return { x: 150 + Math.cos(a) * r, y: 150 + Math.sin(a) * r, s: 0.8 + ((i * 37) % 10) / 12 };
  }), [n]);
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[320px] mx-auto" role="img" aria-label="Chang donachalari (lupa ostida)">
      <defs><radialGradient id="pl-bg" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff6c8" /><stop offset="1" stopColor="#e0c26a" /></radialGradient></defs>
      <circle cx="150" cy="150" r="144" fill="url(#pl-bg)" stroke="#0b1b2a" strokeWidth="10" />
      {dots.map((d, i) => (
        <g key={i} transform={`translate(${d.x} ${d.y}) scale(${d.s})`}>
          <g className="anim-drift" style={{ animationDelay: `${-i * 0.2}s` }}>
            <circle r="7.5" fill="#ffb300" stroke="#8a5a00" strokeWidth="1" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (<line key={k} x1={Math.cos(k * 0.785) * 7} y1={Math.sin(k * 0.785) * 7} x2={Math.cos(k * 0.785) * 10} y2={Math.sin(k * 0.785) * 10} stroke="#8a5a00" strokeWidth="1.4" />))}
          </g>
        </g>
      ))}
    </svg>
  );
}

function OvarySection({ cut }: { cut: boolean }) {
  const ovules = [[132, 118], [168, 118], [118, 152], [182, 152], [132, 186], [168, 186]];
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[320px] mx-auto" role="img" aria-label="Tugunchak kesimi">
      <defs><radialGradient id="ov-bg" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#e9ffc8" /><stop offset="1" stopColor="#8fd05a" /></radialGradient></defs>
      <circle cx="150" cy="150" r="144" fill="#0b1b2a" />
      <ellipse cx="150" cy="150" rx="84" ry="112" fill="url(#ov-bg)" stroke="#d8ffd0" strokeWidth="3" />
      {cut && (
        <g>
          <ellipse cx="150" cy="150" rx="62" ry="88" fill="#cdeaa0" stroke="#7bb046" strokeWidth="2" />
          {ovules.map(([x, y], i) => (
            <g key={i} className="anim-pop" style={{ animationDelay: `${i * 0.12}s`, transformBox: "fill-box", transformOrigin: "center" }}>
              <ellipse cx={x} cy={y} rx="13" ry="16" fill="#fff0b8" stroke="#c99a1e" strokeWidth="2" />
              <ellipse cx={x} cy={y} rx="5" ry="6.5" fill="#f1c24a" />
            </g>
          ))}
          <path d="M150 62 V238" stroke="#7bb046" strokeWidth="2" strokeDasharray="4 4" />
        </g>
      )}
    </svg>
  );
}

function ObserveStage({ run, onDone }: { run: ReturnType<typeof useLabRun>; onDone: () => void }) {
  const [look, setLook] = useState(false);
  const [cut, setCut] = useState(false);
  const [cnt, setCnt] = useState(3);
  const [ok, setOk] = useState(false);
  const check = () => {
    if (cnt === 6) { setOk(true); run.good("Toʻgʻri! Tugunchakda 6 ta urugʻkurtak bor."); run.note("Tugunchakda 6 ta urugʻkurtak sanaldi."); }
    else run.mistake(cnt > 6 ? "Kamroq. Rasmdagi sariq tuxumsimon donachalarni birma-bir sanang." : "Koʻproq. Rasmdagi sariq tuxumsimon donachalarni birma-bir sanang.");
  };
  return (
    <div className="grid @3xl:grid-cols-2 gap-5">
      <div className="glass p-5 grid gap-4 content-start">
        <p className="eyebrow">1. Changchi boshchasi</p>
        {look ? <Pollen /> : <div className="aspect-square max-w-[320px] mx-auto w-full rounded-full border-[10px] border-[#0b1b2a] bg-black/30 flex items-center justify-center text-muted text-sm px-8 text-center">Lupani yoqing — changchi boshchasini kattalashtirib koʻring</div>}
        <button className="btn btn-primary" onClick={() => { setLook(true); sfx("whoosh"); run.good("Mayda sariq donachalar — chang. Ular juda koʻp!"); run.note("Changchi boshchasida koʻplab chang donachalari koʻrindi."); }} disabled={look}><Search className="w-4 h-4" /> Lupa bilan koʻrish</button>
      </div>
      <div className="glass p-5 grid gap-4 content-start">
        <p className="eyebrow">2. Urugʻchi tugunchagi</p>
        <OvarySection cut={cut} />
        {!cut ? (
          <button className="btn btn-primary" onClick={() => { setCut(true); sfx("pop"); }}>Tugunchakni uzunasiga kesish</button>
        ) : (
          <div className="grid gap-3">
            <p className="text-sm font-semibold">Nechta urugʻkurtak (sariq donacha) koʻrinyapti?</p>
            <div className="flex items-center gap-3">
              <button className="btn btn-ghost !px-3" onClick={() => setCnt(Math.max(0, cnt - 1))} disabled={ok} aria-label="Kamaytirish"><Minus className="w-4 h-4" /></button>
              <span className="font-mono text-3xl font-bold text-accent w-12 text-center">{cnt}</span>
              <button className="btn btn-ghost !px-3" onClick={() => setCnt(cnt + 1)} disabled={ok} aria-label="Oshirish"><Plus className="w-4 h-4" /></button>
              <button className="btn btn-primary ml-auto" onClick={check} disabled={ok}>{ok ? <><Check className="w-4 h-4" /> Toʻgʻri</> : "Tekshirish"}</button>
            </div>
          </div>
        )}
      </div>
      {look && ok && <div className="@3xl:col-span-2 flex justify-center"><button className="btn btn-primary btn-lg anim-pop" onClick={onDone}>Bilimni tekshirish →</button></div>}
    </div>
  );
}

export default function DissectionLab({ lab, completeLab, isCompleted, restart }: LabProps) {
  const run = useLabRun(completeLab, isCompleted);
  const [phase, setPhase] = useState<"brief" | "cut" | "look" | "quiz" | "done">("brief");
  const hint: Record<string, string> = {
    cut: "Gulni tashqaridan ichkariga ajrating: yashil gulkosabarglar, keyin pushti gultojibarglar, soʻng changchilar va oxirida markazdagi urugʻchi.",
    look: "Lupani yoqing, soʻng tugunchakni kesib, urugʻkurtaklarni sanang (6 ta).",
  };
  return (
    <LabShell
      heading="Gulning tuzilishi"
      icon={Flower2}
      steps={MISSIONS}
      current={phase === "brief" || phase === "cut" ? 0 : phase === "look" ? 2 : 3}
      done={phase === "done"}
      run={run}
      hint={hint[phase]}
      onHint={() => run.hint(hint[phase])}
    >
      {phase === "brief" && (
        <Briefing
          title="Gulning ichiga nazar"
          goals={[
            "Pinset yordamida gulni qismlarga ajrating: kosa, toj, changchi, urugʻchi.",
            "Lupa ostida chang donachalarini koʻring.",
            "Tugunchakni kesib, urugʻkurtaklarni sanang.",
          ]}
          safety="Real tajribada pinset va skalpel bilan ehtiyot boʻling, ishdan soʻng qoʻlni yuving."
          onStart={() => setPhase("cut")}
        />
      )}
      {phase === "cut" && <DissectStage run={run} onDone={() => setPhase("look")} />}
      {phase === "look" && <ObserveStage run={run} onDone={() => setPhase("quiz")} />}
      {phase === "quiz" && <Quiz questions={QUIZ} run={run} onDone={() => { run.finish(); setPhase("done"); }} />}
      {phase === "done" && <ResultCard title="Gul tuzilishi: tajriba muvaffaqiyatli!" xp={lab.rewardXp} run={run} learned={LEARNED} onRepeat={restart} />}
    </LabShell>
  );
}
