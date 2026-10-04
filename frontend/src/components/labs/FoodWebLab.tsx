"use client";

import { useState } from "react";
import { Network, Undo2, RotateCcw } from "lucide-react";
import { LabShell, LabProps, Note, StageTitle } from "./LabShell";

type Org = { id: string; name: string; emoji: string; level: "producer" | "herbivore" | "carnivore" };

const ORGS: Org[] = [
  { id: "plant", name: "Oʻsimlik (oʻt)", emoji: "🌿", level: "producer" },
  { id: "grasshopper", name: "Chigirtka", emoji: "🦗", level: "herbivore" },
  { id: "rabbit", name: "Quyon", emoji: "🐇", level: "herbivore" },
  { id: "mouse", name: "Sichqon", emoji: "🐁", level: "herbivore" },
  { id: "frog", name: "Qurbaqa", emoji: "🐸", level: "carnivore" },
  { id: "snake", name: "Ilon", emoji: "🐍", level: "carnivore" },
  { id: "wolf", name: "Boʻri", emoji: "🐺", level: "carnivore" },
  { id: "eagle", name: "Burgut", emoji: "🦅", level: "carnivore" },
];

/** kim → kimni yeydi */
const EATS: Record<string, string[]> = {
  grasshopper: ["plant"],
  rabbit: ["plant"],
  mouse: ["plant"],
  frog: ["grasshopper"],
  snake: ["frog", "mouse"],
  wolf: ["rabbit"],
  eagle: ["snake", "rabbit", "mouse"],
};

const LEVEL_NAME = ["Ishlab chiqaruvchi", "1-tartib isteʼmolchi (oʻtxoʻr)", "2-tartib isteʼmolchi", "3-tartib isteʼmolchi", "4-tartib isteʼmolchi"];

const byId = (id: string) => ORGS.find((o) => o.id === id)!;
const hasPredator = (id: string) => Object.values(EATS).some((l) => l.includes(id));

export default function FoodWebLab({ steps, completeLab, isCompleted }: LabProps) {
  const [chain, setChain] = useState<string[]>([]);
  const [msg, setMsg] = useState<{ tone: "info" | "ok" | "err" | "warn"; text: string } | null>(null);

  const last = chain[chain.length - 1];
  const stage = chain.length === 0 ? 0 : chain.length < 3 ? 1 : 2;

  const add = (id: string) => {
    if (isCompleted) return;
    if (chain.length === 0) {
      if (byId(id).level !== "producer") {
        return setMsg({ tone: "err", text: "Oziq zanjiri har doim ishlab chiqaruvchidan, yaʼni yashil oʻsimlikdan boshlanadi." });
      }
      setChain([id]);
      return setMsg({ tone: "info", text: "Yaxshi boshlanish! Endi oʻsimlik bilan oziqlanadigan hayvonni tanlang." });
    }
    if (chain.includes(id)) return;
    if (EATS[id]?.includes(last)) {
      setChain([...chain, id]);
      setMsg(null);
    } else {
      setMsg({
        tone: "err",
        text: `${byId(id).name} ${byId(last).name.toLowerCase()} bilan oziqlanmaydi. Oʻqning yoʻnalishi: kim kimni yeydi — oziq modda va energiya yeyilgan organizmdan yeguvchiga oʻtadi.`,
      });
    }
  };

  const verify = () => {
    if (chain.length < 4) return setMsg({ tone: "warn", text: "Zanjir kamida 4 boʻgʻindan iborat boʻlsin: ishlab chiqaruvchi va kamida uch isteʼmolchi." });
    if (hasPredator(last)) return setMsg({ tone: "warn", text: `${byId(last).name}ni ham yeydigan hayvon bor. Zanjirni davom ettiring.` });
    setMsg({ tone: "ok", text: "Oziq zanjiri toʻgʻri tuzildi! Har bir keyingi boʻgʻinga energiyaning taxminan 10 % igina oʻtishiga eʼtibor bering." });
    completeLab();
  };

  const energy = (i: number) => 10000 / Math.pow(10, i);

  return (
    <LabShell heading="Oziq zanjiri" icon={Network} steps={steps} current={stage} done={isCompleted}>
      <StageTitle sub="Organizmlarni bosib, ekotizimdagi oziq zanjirini tuzing: oʻsimlikdan boshlab, har safar keyingi boʻgʻinni tanlang.">
        Kim kimni yeydi?
      </StageTitle>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {ORGS.map((o) => {
          const used = chain.includes(o.id);
          return (
            <button
              key={o.id}
              onClick={() => add(o.id)}
              disabled={used || isCompleted}
              className={`card text-left p-4 flex items-center gap-3 transition-all ${
                used ? "opacity-40" : "hover:border-brand hover:-translate-y-0.5"
              }`}
            >
              <span className="text-3xl" aria-hidden>{o.emoji}</span>
              <span>
                <span className="font-semibold block leading-tight">{o.name}</span>
                <span className="text-xs text-muted">{o.level === "producer" ? "ishlab chiqaruvchi" : o.level === "herbivore" ? "oʻtxoʻr" : "yirtqich"}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="lab-bench p-5 mb-5 min-h-[11rem]">
        {chain.length === 0 ? (
          <p className="text-muted text-center py-10">Zanjir shu yerda hosil boʻladi…</p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {chain.map((id, i) => (
              <div key={id} className="flex items-center gap-2">
                <div className="rounded-2xl bg-brand text-brand-ink px-4 py-3 text-center min-w-[7rem]">
                  <div className="text-2xl" aria-hidden>{byId(id).emoji}</div>
                  <div className="font-semibold text-sm">{byId(id).name}</div>
                  <div className="text-[0.68rem] opacity-80 mt-0.5">{LEVEL_NAME[i]}</div>
                </div>
                {i < chain.length - 1 && <span className="text-2xl font-bold text-brand" aria-label="yeyiladi">→</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {chain.length >= 2 && (
        <div className="mb-5">
          <p className="eyebrow !text-muted mb-2">Energiya piramidasi (shartli, kJ) — 10 % qoidasi</p>
          <div className="grid gap-1.5">
            {chain.map((id, i) => (
              <div key={id} className="flex items-center gap-3 text-sm">
                <span className="w-28 text-muted truncate">{byId(id).name}</span>
                <div className="h-5 rounded-md bg-accent" style={{ width: `${Math.max(3, 100 / Math.pow(2.6, i))}%` }} />
                <span className="font-mono font-semibold tabular-nums">{energy(i).toLocaleString("uz")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2.5 mb-4">
        <button className="btn btn-primary" onClick={verify} disabled={chain.length === 0 || isCompleted}>Zanjirni tekshirish</button>
        <button className="btn btn-ghost" onClick={() => { setChain(chain.slice(0, -1)); setMsg(null); }} disabled={!chain.length || isCompleted}>
          <Undo2 className="w-4 h-4" /> Oxirgisini olib tashlash
        </button>
        <button className="btn btn-ghost" onClick={() => { setChain([]); setMsg(null); }} disabled={!chain.length || isCompleted}>
          <RotateCcw className="w-4 h-4" /> Boshidan boshlash
        </button>
      </div>

      {msg && <Note tone={msg.tone}>{msg.text}</Note>}
    </LabShell>
  );
}
