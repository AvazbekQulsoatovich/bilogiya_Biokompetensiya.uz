"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Info, MousePointerClick } from "lucide-react";
import { Page, PageHeader } from "@/components/ui";
import {
  PlantCell, AnimalCell, Amoeba, Paramecium, LeafSection,
  PLANT_PARTS, ANIMAL_PARTS, AMOEBA_PARTS, PARAMECIUM_PARTS, LEAF_PARTS,
  type PartDef, type DiagramProps,
} from "@/components/models/diagrams";
import { DnaHelix, DNA_PARTS } from "@/components/models/DnaHelix";

type Model = {
  id: string;
  title: string;
  short: string;
  description: string;
  facts: string;
  parts: PartDef[];
  Diagram: (p: DiagramProps) => React.ReactNode;
};

const MODELS: Model[] = [
  {
    id: "plant-cell",
    title: "Oʻsimlik hujayrasi",
    short: "Devor, vakuola, xloroplast",
    description: "Oʻsimlik hujayrasining oʻziga xos qismlari: qalin hujayra devori, yirik markaziy vakuola va xloroplastlar.",
    facts: "Oʻsimlik hujayralari sellyuloza devori tufayli qattiq, shakli deyarli oʻzgarmaydi. Xloroplastlardagi xlorofill yorugʻlik energiyasini oʻzlashtirib, karbonat angidrid va suvdan organik modda hosil qiladi (fotosintez).",
    parts: PLANT_PARTS,
    Diagram: PlantCell,
  },
  {
    id: "animal-cell",
    title: "Hayvon hujayrasi",
    short: "Membrana, yadro, organoidlar",
    description: "Hayvon hujayrasi tuzilishi: membrana, yadro, mitoxondriya, Golji apparati va lizosomalar.",
    facts: "Hayvon hujayrasida qalin devor ham, xloroplast ham yoʻq. Shu sababli hujayra shaklini oʻzgartira oladi va tayyor organik moddalar bilan oziqlanadi.",
    parts: ANIMAL_PARTS,
    Diagram: AnimalCell,
  },
  {
    id: "amoeba",
    title: "Amyoba (Amoeba proteus)",
    short: "Soxta oyoq, vakuolalar",
    description: "Chuchuk suvda yashaydigan bir hujayrali hayvon. Soxta oyoqlari yordamida harakatlanadi va oziqlanadi.",
    facts: "Amyoba sitoplazmasini bir tomonga oqizib, soxta oyoq hosil qiladi. Oziq zarrasini oʻrab olib, hazm vakuolasi hosil qiladi. Ortiqcha suv qisqaruvchi vakuola orqali chiqariladi.",
    parts: AMOEBA_PARTS,
    Diagram: Amoeba,
  },
  {
    id: "infusoria",
    title: "Infuzoriya-tufelka",
    short: "Kipriklar, ikki yadro",
    description: "Kiprikli bir hujayrali hayvon; tanasi poyabzal tagiga oʻxshaydi.",
    facts: "Tufelka tanasidagi kipriklar tez harakat qilib uni suzdiradi. Unda ikki xil yadro bor: katta (makro) va kichik (mikro). Ortiqcha suv ikki qisqaruvchi vakuola orqali chiqariladi.",
    parts: PARAMECIUM_PARTS,
    Diagram: Paramecium,
  },
  {
    id: "leaf",
    title: "Bargning ichki tuzilishi",
    short: "Toʻqimalar va ogʻizchalar",
    description: "Barg koʻndalang kesimi: epidermis, ustunsimon va gʻovak toʻqima, tomir hamda ogʻizchalar.",
    facts: "Barg yupqa boʻlsa-da, bir necha qavatdan iborat. Fotosintez asosan xloroplastlarga boy ustunsimon toʻqimada boradi, gaz almashinuvi esa pastki epidermisdagi ogʻizchalar orqali kechadi.",
    parts: LEAF_PARTS,
    Diagram: LeafSection,
  },
  {
    id: "dna",
    title: "DNK qoʻsh spirali",
    short: "Aylanuvchi 3D model",
    description: "Irsiy axborotni saqlovchi qoʻsh spiralli molekula. Sichqoncha bilan aylantiring.",
    facts: "Dezoksiribonuklein kislota (DNK) organizmning rivojlanishi va ishlashi uchun zarur genetik koʻrsatmalarni saqlaydi. Axborot azotli asoslarning ketma-ketligida yozilgan.",
    parts: DNA_PARTS,
    Diagram: ({ active }) => <DnaHelix active={active} />,
  },
];

export default function ModelsPage() {
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [active, setActive] = useState<string | null>(null);
  const model = MODELS.find((m) => m.id === modelId)!;
  const activePart = model.parts.find((p) => p.id === active);
  const pick = (id: string) => setActive((cur) => (id && cur !== id ? id : null));

  return (
    <Page>
      <PageHeader
        icon={Box}
        eyebrow="Amaliyot"
        title="3D modellar"
        subtitle="Biologik obyektlarning tuzilishini interaktiv sxemalarda oʻrganing: istalgan qismni bosing — nomi va vazifasi koʻrinadi."
      />

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1" role="tablist" aria-label="Modellar">
        {MODELS.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={m.id === modelId}
            onClick={() => {
              setModelId(m.id);
              setActive(null);
            }}
            className={`shrink-0 text-left rounded-2xl border px-4 py-3 transition-all ${
              m.id === modelId ? "border-brand bg-brand-soft shadow-[var(--shadow-sm)]" : "border-line bg-surface hover:bg-surface-2"
            }`}
          >
            <span className={`block font-display font-semibold leading-tight ${m.id === modelId ? "text-brand" : ""}`}>{m.title}</span>
            <span className="block text-xs text-muted mt-0.5">{m.short}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={model.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-6 items-start"
        >
          <div className="card p-4 md:p-6">
            <div className="lab-bench p-3 md:p-5">{model.Diagram({ active, onPick: pick })}</div>
            <p className="flex items-center gap-2 text-sm text-muted mt-4">
              <MousePointerClick className="w-4 h-4 shrink-0" />
              {model.id === "dna" ? "Sichqoncha yoki barmoq bilan chapga/oʻngga suring — model aylanadi." : "Rasmdagi qismni yoki oʻngdagi roʻyxatdan nomini tanlang."}
            </p>
          </div>

          <div className="grid gap-4">
            <div className="card p-6">
              <h2 className="font-display text-2xl font-semibold mb-2">{model.title}</h2>
              <p className="text-ink-2 leading-relaxed">{model.description}</p>
            </div>

            <div className="card p-3">
              <p className="eyebrow !text-muted px-3 pt-2 pb-2">Qismlari</p>
              <ul className="grid gap-1">
                {model.parts.map((p) => {
                  const on = active === p.id;
                  return (
                    <li key={p.id}>
                      <button
                        onClick={() => pick(p.id)}
                        aria-pressed={on}
                        className={`w-full text-left rounded-xl px-3 py-2.5 flex items-center gap-3 transition-colors ${
                          on ? "bg-brand-soft" : "hover:bg-surface-2"
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10" style={{ background: p.color }} />
                        <span className={`font-semibold text-[0.93rem] ${on ? "text-brand" : ""}`}>{p.name}</span>
                      </button>
                      {on && <p className="px-3 pb-3 pl-9 text-sm text-ink-2 leading-relaxed">{p.text}</p>}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="card p-6 bg-surface-2/60">
              <p className="inline-flex items-center gap-2 eyebrow mb-2">
                <Info className="w-4 h-4" /> Ilmiy izoh
              </p>
              <p className="text-ink-2 leading-relaxed">{activePart ? activePart.text : model.facts}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Page>
  );
}
