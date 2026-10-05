"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Sprout, Droplets, Thermometer, Wind, Play, Pause, Check, X } from "lucide-react";
import { LabShell, LabProps } from "./LabShell";
import { Briefing, Digit, Quiz, ResultCard, useLabRun, useRaf, sfx, type Q } from "./kit";

const MISSIONS = [
  { title: "Urugʻ tanlash", instruction: "Loviya urugʻlari orasidan 4 ta sogʻlom urugʻni tanlang (yorigʻi, mogʻori yoki burishgani yaroqsiz)." },
  { title: "Sharoit yaratish", instruction: "4 ta idishni sozlang: bittasi nazorat (hamma sharoit bor), qolgan uchtasida faqat BITTA omil yetishmasin." },
  { title: "Natija", instruction: "7 kunlik tajribani tezlashtirib kuzating va urugʻ unib chiqishi uchun nima kerakligini aniqlang." },
];

const QUIZ: Q[] = [
  {
    q: "Nima uchun nazorat idishi kerak?",
    options: ["Idishlar chiroyli koʻrinishi uchun", "Boshqa idishlar bilan solishtirish uchun — barcha sharoit qulay boʻlsa nima boʻlishini koʻrsatadi", "Urugʻlar soni koʻp boʻlishi uchun"],
    answer: 1,
    explain: "Nazorat idishi bilan solishtirgandagina qaysi omil yetishmagani natijaga taʼsir qilganini isbotlash mumkin.",
  },
  {
    q: "Suv ostida (havosiz) turgan urugʻ nima uchun unmadi?",
    options: ["Unga yorugʻlik tushmadi", "Urugʻ nafas olishi uchun kislorod yetmadi", "Suv juda iliq edi"],
    answer: 1,
    explain: "Urugʻ ham tirik organizm: unib chiqishda u kislorod bilan nafas oladi. Suv ostida kislorod yetishmaydi, urugʻ chirib ketadi.",
  },
];

const LEARNED = [
  "Urugʻ unib chiqishi uchun suv, havo (kislorod) va iliqlik kerak.",
  "Toʻgʻri tajribada faqat bitta omil oʻzgartiriladi, qolganlari bir xil qoladi.",
  "Nazorat idishi natijani solishtirish uchun zarur.",
  "Yorugʻlik urugʻning unib chiqishi uchun shart emas — u tuproq ostida unadi.",
];

type Cond = { water: boolean; warm: boolean; air: boolean };
const NAMES = ["A", "B", "C", "D"];

/* ── Urugʻ ── */
type SeedKind = "good" | "cracked" | "moldy" | "shriveled";
function Bean({ kind, size = 56 }: { kind: SeedKind; size?: number }) {
  const fill = kind === "shriveled" ? "#8a6a3a" : kind === "moldy" ? "#9a8d6a" : "#d9a766";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <defs><radialGradient id={`bn-${kind}`} cx=".35" cy=".3" r=".9"><stop offset="0" stopColor="#fff" stopOpacity=".5" /><stop offset="1" stopColor={fill} /></radialGradient></defs>
      <path d={kind === "shriveled" ? "M14 38 C 10 22, 28 12, 42 16 C 56 20, 58 34, 48 44 C 38 54, 18 52, 14 38Z" : "M10 36 C 6 18, 26 8, 42 12 C 58 16, 62 34, 50 46 C 38 58, 14 54, 10 36Z"} fill={`url(#bn-${kind})`} stroke="#8a5a1c" strokeWidth="2" />
      <path d="M24 22 C 30 24, 34 30, 32 38" stroke="#8a5a1c" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7" />
      {kind === "cracked" && <path d="M18 18 L28 30 L22 38 L34 50" stroke="#2a1500" strokeWidth="2.5" fill="none" strokeLinejoin="round" />}
      {kind === "moldy" && [[22, 26], [34, 20], [40, 36], [28, 42], [46, 28]].map(([x, y], i) => (<circle key={i} cx={x} cy={y} r={3.5 + (i % 2)} fill="#cbe0b4" fillOpacity=".85" stroke="#6c8a52" />))}
      {kind === "shriveled" && [0, 1, 2, 3].map((i) => (<path key={i} d={`M${18 + i * 8} 24 q 3 8 -1 16`} stroke="#4c3414" strokeWidth="1.4" fill="none" opacity=".7" />))}
    </svg>
  );
}

/* ── Idish animatsiyasi ── */
function Jar({ cond, day, label }: { cond: Cond; day: number; label: string }) {
  const ok = cond.water && cond.warm && cond.air;
  const t = day;
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const swell = ok ? 1 + 0.5 * clamp(t / 1.5) : !cond.air && cond.water && cond.warm ? 1 + 0.35 * clamp(t / 1.5) : cond.water && !cond.warm ? 1 + 0.12 * clamp(t / 2) : 1;
  const rootLen = ok ? clamp((t - 2) / 4.5) * 64 : 0;
  const shootLen = ok ? clamp((t - 3.5) / 3.2) * 68 : 0;
  const leaves = ok ? clamp((t - 6) / 1) : 0;
  const rot = !cond.air && cond.water && cond.warm ? clamp((t - 2.5) / 3) : 0;
  const sy = 150;
  const soilTop = 112;
  const seedCol = rot > 0 ? `rgb(${Math.round(217 - 110 * rot)},${Math.round(167 - 90 * rot)},${Math.round(102 - 50 * rot)})` : cond.water ? "#e0b070" : "#9a7a46";
  return (
    <svg viewBox="0 0 160 230" className="w-full" role="img" aria-label={`${label} idishi, ${Math.floor(day)}-kun`}>
      <defs>
        <linearGradient id={`soil-${label}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={cond.water ? "#4a2f1c" : "#a08358"} /><stop offset="1" stopColor={cond.water ? "#2c1a0e" : "#7a6340"} /></linearGradient>
        <clipPath id={`jar-${label}`}><rect x="22" y="26" width="116" height="172" rx="14" /></clipPath>
      </defs>
      <g clipPath={`url(#jar-${label})`}>
        <rect x="22" y="26" width="116" height="172" fill="rgba(160,210,255,.07)" />
        <rect x="22" y={soilTop} width="116" height={198 - soilTop} fill={`url(#soil-${label})`} />
        {!cond.water && [0, 1, 2, 3].map((i) => (<path key={i} d={`M${34 + i * 28} ${soilTop + 2} l${i % 2 ? 5 : -5} 14 l${i % 2 ? -4 : 4} 12`} stroke="#5a4426" strokeWidth="1.4" fill="none" />))}
        {cond.water && cond.air && [0, 1, 2, 3, 4].map((i) => (<circle key={i} cx={34 + i * 22} cy={soilTop + 12 + (i % 2) * 12} r="2" fill="#8bc7ff" fillOpacity=".55" />))}
        {!cond.air && cond.water && <rect x="22" y="40" width="116" height="158" fill="#4a90e2" fillOpacity=".38" />}
        {!cond.air && cond.water && [0, 1, 2].map((i) => (<circle key={i} cx={40 + i * 40} cy={60 + (i % 2) * 16} r="3" fill="#fff" fillOpacity=".5" />))}
        {!cond.warm && <rect x="22" y="26" width="116" height="172" fill="#9fd8ff" fillOpacity=".12" />}
        {/* ildiz */}
        {rootLen > 0 && (
          <g>
            <path d={`M80 ${sy + 8} q ${-6} ${rootLen * 0.5} ${4} ${rootLen}`} stroke="#fff6e0" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            {[0.3, 0.5, 0.7, 0.9].map((f, i) => (<path key={i} d={`M${80 + (f * 4)} ${sy + 8 + rootLen * f} l${i % 2 ? 9 : -9} ${5}`} stroke="#fff6e0" strokeWidth="1.3" fill="none" strokeLinecap="round" />))}
          </g>
        )}
        {/* urugʻ */}
        <g transform={`translate(80 ${sy}) scale(${swell}) translate(-80 ${-sy})`}>
          <ellipse cx="80" cy={sy} rx="15" ry="10" fill={seedCol} stroke="#7a4d12" strokeWidth="1.6" />
          <path d="M72 148 q 8 -4 14 2" stroke="#7a4d12" strokeWidth="1.4" fill="none" opacity=".7" />
          {!cond.water && <path d="M70 146 q 4 8 0 12 M90 146 q -4 8 0 12" stroke="#4c3414" strokeWidth="1.2" fill="none" opacity=".8" />}
          {rot > 0.2 && [[72, 148], [86, 154], [80, 144], [90, 148]].map(([x, y], i) => (<circle key={i} cx={x} cy={y} r={2 + rot * 1.6} fill="#d7e6c4" fillOpacity={rot} stroke="#6c8a52" strokeWidth=".8" />))}
        </g>
        {/* poya */}
        {shootLen > 0 && (
          <g>
            <path d={`M80 ${sy - 8} C 80 ${sy - shootLen * 0.4}, ${shootLen > 40 ? 80 : 92} ${sy - shootLen * 0.8}, ${shootLen > 40 ? 80 : 92} ${sy - shootLen}`} stroke="#6fe08f" strokeWidth="4" fill="none" strokeLinecap="round" />
            {leaves > 0 && (
              <g transform={`translate(80 ${sy - shootLen}) scale(${leaves})`}>
                <ellipse cx="-13" cy="-2" rx="14" ry="6.5" fill="#4be38a" stroke="#b6ffd0" strokeWidth="1" transform="rotate(-24 -13 -2)" />
                <ellipse cx="13" cy="-4" rx="14" ry="6.5" fill="#2ee6c0" stroke="#b6ffd0" strokeWidth="1" transform="rotate(24 13 -4)" />
              </g>
            )}
          </g>
        )}
      </g>
      <rect x="22" y="26" width="116" height="172" rx="14" fill="none" stroke="rgba(200,235,255,.8)" strokeWidth="2.5" />
      <rect x="26" y="20" width="108" height="10" rx="4" fill="rgba(200,235,255,.25)" stroke="rgba(200,235,255,.7)" strokeWidth="1.5" />
      <text x="80" y="222" textAnchor="middle" fill="#e8f4ff" fontSize="14" fontWeight="800">{label}</text>
    </svg>
  );
}

export default function GerminationLab({ lab, completeLab, isCompleted, restart }: LabProps) {
  const run = useLabRun(completeLab, isCompleted);
  const [phase, setPhase] = useState<"brief" | "seeds" | "setup" | "run" | "quiz" | "done">("brief");
  const seeds = useMemo(() => {
    const kinds: SeedKind[] = ["good", "good", "good", "good", "good", "cracked", "moldy", "shriveled"];
    for (let i = kinds.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]]; }
    return kinds;
  }, []);
  const [picked, setPicked] = useState<number[]>([]);
  const [conds, setConds] = useState<Cond[]>(NAMES.map(() => ({ water: true, warm: true, air: true })));
  const [day, setDay] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [concl, setConcl] = useState<string[]>([]);
  const [concOk, setConcOk] = useState(false);
  const dayRef = useRef(0);
  dayRef.current = day;

  useRaf((dt) => {
    if (!playing) return;
    const n = Math.min(7, dayRef.current + dt * 0.62);
    setDay(n);
    if (n >= 7) setPlaying(false);
  }, playing);

  useEffect(() => {
    if (day >= 7 && phase === "run") run.good("7-kun yakunlandi! Natijalarni solishtiring.");
  }, [day >= 7]); // eslint-disable-line react-hooks/exhaustive-deps

  const pickSeed = (i: number) => {
    if (picked.includes(i)) { setPicked(picked.filter((x) => x !== i)); return; }
    if (seeds[i] !== "good") { run.mistake(seeds[i] === "cracked" ? "Bu urugʻ yorilgan — unmaydi." : seeds[i] === "moldy" ? "Bu urugʻ mogʻor bosgan — yaroqsiz." : "Bu urugʻ burishgan — jonsiz."); return; }
    if (picked.length >= 4) { run.say("info", "4 ta urugʻ yetarli. Keraksizini bosib olib tashlang."); return; }
    sfx("pop");
    const n = [...picked, i];
    setPicked(n);
    if (n.length === 4) run.good("4 ta sogʻlom urugʻ tanlandi!");
  };

  const toggle = (j: number, k: keyof Cond) => { sfx("click"); setConds((c) => c.map((x, i) => (i === j ? { ...x, [k]: !x[k] } : x))); };

  const validate = () => {
    const full = conds.filter((c) => c.water && c.warm && c.air).length;
    const missing = conds.filter((c) => [c.water, c.warm, c.air].filter((v) => !v).length === 1);
    const kinds = new Set(missing.map((c) => (!c.water ? "w" : !c.warm ? "t" : "a")));
    if (full !== 1) return run.mistake(full === 0 ? "Nazorat idishi yoʻq: bitta idishda barcha sharoit (suv, iliqlik, havo) boʻlishi kerak." : "Faqat BITTA nazorat idishi kerak.");
    if (missing.length !== 3 || kinds.size !== 3) return run.mistake("Qolgan 3 idishning har birida faqat BITTA omil yetishmasin (suv / iliqlik / havo) va ular har xil boʻlsin.");
    run.good("Toʻgʻri dizayn! Tajribani boshlaymiz.");
    setPhase("run");
  };

  const status = (c: Cond) => (c.water && c.warm && c.air ? { ok: true, why: "Hamma sharoit bor — unib chiqdi" } : !c.water ? { ok: false, why: "Suv yoʻq — urugʻ shishmadi" } : !c.warm ? { ok: false, why: "Sovuq — jarayon deyarli toʻxtadi" } : { ok: false, why: "Havo (kislorod) yoʻq — urugʻ chirib ketdi" });

  const hint = ["", "Sogʻlom urugʻ silliq, butun va yorqin rangda boʻladi.", "Masalan: A — hammasi bor; B — suvsiz; C — sovuqda; D — suv ostida (havosiz).", "“Kun” slayderi bilan vaqtni oldinga-orqaga surib solishtiring."];
  const mission = phase === "brief" || phase === "seeds" ? 0 : phase === "setup" ? 1 : 2;

  const CHIPS = ["Suv", "Havo (kislorod)", "Iliqlik", "Yorugʻlik", "Tuproq"];
  const submitConcl = () => {
    const good = ["Suv", "Havo (kislorod)", "Iliqlik"];
    const okk = good.every((g) => concl.includes(g)) && concl.length === 3;
    if (okk) { setConcOk(true); run.good("Toʻgʻri xulosa!"); run.note("Urugʻ unishi uchun suv, havo va iliqlik shart."); }
    else run.mistake(concl.includes("Yorugʻlik") || concl.includes("Tuproq") ? "Yorugʻlik va tuproq shart emas — urugʻ ular boʻlmaganda ham (masalan, nam paxtada, qorongʻida) unadi." : "Natijalarni qayta koʻrib chiqing: qaysi idishlarda urugʻ unmadi va nima uchun?");
  };

  return (
    <LabShell
      heading="Urugʻning unib chiqishi"
      icon={Sprout}
      steps={MISSIONS}
      current={phase === "quiz" || phase === "done" ? 3 : mission}
      done={phase === "done"}
      run={run}
      hint={hint[mission + 1]}
      onHint={() => run.hint(hint[mission + 1])}
    >
      {phase === "brief" && (
        <Briefing
          title="Urugʻ qachon hayotga uygʻonadi?"
          goals={[
            "Loviya urugʻlari orasidan sogʻlomlarini tanlang.",
            "Ilmiy tajriba tuzing: bitta nazorat idishi va omillari yetishmaydigan uchta idish.",
            "7 kunlik jarayonni tezlashtirib kuzating va xulosa chiqaring.",
          ]}
          onStart={() => setPhase("seeds")}
        />
      )}

      {phase === "seeds" && (
        <div className="grid gap-6">
          <div className="grid grid-cols-4 @xl:grid-cols-8 gap-3">
            {seeds.map((k, i) => (
              <button key={i} onClick={() => pickSeed(i)} className={`rounded-2xl border p-2 flex flex-col items-center gap-1 transition-all ${picked.includes(i) ? "border-ok bg-ok-soft scale-95" : "border-line bg-black/25 hover:border-brand hover:-translate-y-1"}`} aria-pressed={picked.includes(i)}>
                <Bean kind={k} size={84} />
                <span className="text-[0.7rem] font-bold text-muted">{picked.includes(i) ? "tanlandi ✓" : `#${i + 1}`}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Digit label="Tanlandi" value={`${picked.length}/4`} tone={picked.length === 4 ? "brand" : "accent"} />
            <button className="btn btn-primary btn-lg" disabled={picked.length < 4} onClick={() => setPhase("setup")}>Idishlarni sozlash →</button>
          </div>
        </div>
      )}

      {phase === "setup" && (
        <div className="grid gap-5">
          <div className="grid grid-cols-2 @3xl:grid-cols-4 gap-4">
            {conds.map((c, j) => (
              <div key={j} className="glass p-3 grid gap-3">
                <div className="px-3"><Jar cond={c} day={0} label={NAMES[j]} /></div>
                {([["water", "Suv", Droplets], ["warm", "Iliq (22°C)", Thermometer], ["air", "Havo bor", Wind]] as const).map(([k, l, Icon]) => (
                  <button key={k} onClick={() => toggle(j, k)} className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${c[k] ? "border-ok/40 bg-ok-soft text-ok" : "border-danger/40 bg-danger-soft text-danger"}`} aria-pressed={c[k]}>
                    <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {k === "warm" && !c.warm ? "Sovuq (4°C)" : k === "air" && !c.air ? "Suv ostida" : k === "water" && !c.water ? "Suvsiz" : l}</span>
                    {c[k] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-center"><button className="btn btn-primary btn-lg" onClick={validate}>Tajribani boshlash <Play className="w-4 h-4 fill-current" /></button></div>
        </div>
      )}

      {phase === "run" && (
        <div className="grid gap-5">
          <div className="grid grid-cols-2 @3xl:grid-cols-4 gap-4">
            {conds.map((c, j) => {
              const st = status(c);
              return (
                <div key={j} className="glass p-3">
                  <div className="px-3"><Jar cond={c} day={day} label={NAMES[j]} /></div>
                  {day >= 7 && (
                    <p className={`mt-2 rounded-xl px-3 py-2 text-xs font-semibold leading-snug anim-pop ${st.ok ? "bg-ok-soft text-ok" : "bg-danger-soft text-danger"}`}>{st.ok ? "✓" : "✕"} {st.why}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="glass p-5 grid gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <button className="btn btn-primary" onClick={() => { if (day >= 7) setDay(0); setPlaying((p) => !p); sfx("click"); }}>
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />} {playing ? "Pauza" : day >= 7 ? "Qayta oʻynatish" : "Vaqtni tezlashtirish"}
              </button>
              <Digit label="Kun" value={Math.floor(day)} unit="/ 7" tone="info" />
              <label className="flex-1 min-w-[12rem]">
                <span className="sr-only">Kun</span>
                <input type="range" min={0} max={7} step={0.05} value={day} onChange={(e) => { setPlaying(false); setDay(+e.target.value); }} className="w-full" aria-label="Kun" />
              </label>
            </div>

            {day >= 7 && !concOk && (
              <div className="grid gap-3 anim-pop">
                <p className="font-semibold">Xulosa: urugʻ unib chiqishi uchun nimalar KERAK? (3 tasini tanlang)</p>
                <div className="flex flex-wrap gap-2">
                  {CHIPS.map((c) => (
                    <button key={c} onClick={() => setConcl((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]))} className={`btn btn-sm ${concl.includes(c) ? "btn-primary" : "btn-ghost"}`}>{c}</button>
                  ))}
                </div>
                <div><button className="btn btn-primary" onClick={submitConcl} disabled={concl.length === 0}>Xulosani tekshirish</button></div>
              </div>
            )}
            {concOk && <button className="btn btn-primary btn-lg anim-pop" onClick={() => setPhase("quiz")}>Bilimni tekshirish →</button>}
          </div>
        </div>
      )}

      {phase === "quiz" && <Quiz questions={QUIZ} run={run} onDone={() => { run.finish(); setPhase("done"); }} />}
      {phase === "done" && <ResultCard title="Urugʻ unishi: tajriba muvaffaqiyatli!" xp={lab.rewardXp} run={run} learned={LEARNED} onRepeat={restart} />}
    </LabShell>
  );
}
