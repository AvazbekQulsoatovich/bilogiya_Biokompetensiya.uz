"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, TrendingUp, Microscope, Clock3, Gauge as GaugeIcon } from "lucide-react";
import confetti from "canvas-confetti";
import { Loading, EmptyState } from "@/components/ui";
import { LAB_META, markLabDone } from "@/components/labs/meta";

import MicroscopeLab from "@/components/labs/MicroscopeLab";
import ChemistryLab from "@/components/labs/ChemistryLab";
import PhotosynthesisLab from "@/components/labs/PhotosynthesisLab";
import OsmosisLab from "@/components/labs/OsmosisLab";
import FoodWebLab from "@/components/labs/FoodWebLab";
import GeneralLab from "@/components/labs/GeneralLab";
import DissectionLab from "@/components/labs/DissectionLab";
import MeasurementLab from "@/components/labs/MeasurementLab";
import GerminationLab from "@/components/labs/GerminationLab";
import DNAExtractionLab from "@/components/labs/DNAExtractionLab";
import GeneticsLab from "@/components/labs/GeneticsLab";
import HeartRateLab from "@/components/labs/HeartRateLab";
import CellBuilderLab from "@/components/labs/CellBuilderLab";

export default function LabExperimentPage() {
  const params = useParams();
  const router = useRouter();

  const [lab, setLab] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [round, setRound] = useState(0);
  const rewarded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/labs/${params.id}`);
        const data = await res.json();
        if (data?.id) {
          setLab(data);
          const parsed = JSON.parse(data.stepsJson || "[]");
          setSteps(Array.isArray(parsed) ? parsed : parsed.instructions || []);
        }
      } catch (e) {
        console.error("Laboratoriyani yuklab boʻlmadi", e);
      } finally {
        setLoading(false);
      }
    })();
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/progress`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (res.ok) setProgress(await res.json());
      } catch {}
    })();
  }, [params.id]);

  const completeLab = useCallback(async () => {
    if (isCompleted) return;
    setIsCompleted(true);
    markLabDone(String(params.id));
    confetti({ particleCount: 180, spread: 90, origin: { y: 0.55 }, colors: ["#2ee6c0", "#5ab0ff", "#ffc857", "#a98bff"] });
    // XP faqat birinchi marta so'raladi
    if (rewarded.current) return;
    rewarded.current = true;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/labs/${params.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({}),
      });
      if (res.ok) setProgress((p: any) => (p ? { ...p, totalXp: p.totalXp + (lab?.rewardXp || 0) } : p));
    } catch (e) {
      console.error("Tajribani yakunlashda xato", e);
    }
  }, [isCompleted, params.id, lab]);

  const restart = useCallback(() => {
    setIsCompleted(false);
    setRound((r) => r + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading)
    return (
      <div className="lab-room min-h-[calc(100vh-3.5rem)]"><Loading /></div>
    );
  if (!lab)
    return (
      <div className="lab-room min-h-[calc(100vh-3.5rem)] py-20 px-4">
        <EmptyState icon={Microscope} title="Laboratoriya topilmadi" />
      </div>
    );

  const common = { lab, steps, completeLab, isCompleted, restart };
  const renderLab = () => {
    switch (lab.type || "MICROSCOPE") {
      case "CHEMISTRY": return <ChemistryLab {...common} />;
      case "PHOTOSYNTHESIS": return <PhotosynthesisLab {...common} />;
      case "OSMOSIS": return <OsmosisLab {...common} />;
      case "FOODWEB": return <FoodWebLab {...common} />;
      case "DISSECTION": return <DissectionLab {...common} />;
      case "DNA_EXTRACTION": return <DNAExtractionLab {...common} />;
      case "GENETICS": return <GeneticsLab {...common} />;
      case "HEARTRATE": return <HeartRateLab {...common} />;
      case "CELLBUILDER": return <CellBuilderLab {...common} />;
      case "MEASUREMENT": return <MeasurementLab {...common} />;
      case "GERMINATION": return <GerminationLab {...common} />;
      case "GENERAL": return <GeneralLab {...common} />;
      case "MICROSCOPE":
      default: return <MicroscopeLab {...common} />;
    }
  };

  const meta = LAB_META[lab.type] || LAB_META.MICROSCOPE;
  const [num, ...rest] = String(lab.title).split(": ");
  const title = rest.length ? rest.join(": ") : lab.title;

  return (
    <div className="lab-room min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 lg:px-10 py-6 md:py-8">
        <button type="button" onClick={() => router.push("/labs")} className="btn btn-ghost btn-sm mb-5">
          <ArrowLeft className="w-4 h-4" /> Laboratoriyalar
        </button>

        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="chip chip-brand font-mono">{rest.length ? num : "TAJRIBA"}</span>
              <span className="chip"><Clock3 className="w-3 h-3" /> ~{meta.minutes} daqiqa</span>
              <span className="chip"><GaugeIcon className="w-3 h-3" /> {meta.level}</span>
              <span className="chip">{lab.gradeLevel}-sinf</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.08]">
              <span className="neon-text">{title}</span>
            </h1>
            <p className="text-muted text-base md:text-lg mt-3 max-w-2xl">{lab.description}</p>
          </div>
          <div className="flex gap-3 shrink-0">
            {progress && (
              <div className="glass px-5 py-3 flex items-center gap-5">
                <div>
                  <p className="eyebrow !text-muted !text-[0.6rem] mb-0.5">Mening XP</p>
                  <p className="font-mono text-xl font-bold flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-accent fill-accent" /> {progress.totalXp}
                  </p>
                </div>
                <div className="w-px h-9 bg-line" />
                <div>
                  <p className="eyebrow !text-muted !text-[0.6rem] mb-0.5">Daraja</p>
                  <p className="font-mono text-xl font-bold flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-info" /> {progress.level}
                  </p>
                </div>
              </div>
            )}
            <div className="glass px-5 py-3 text-center !border-accent/30">
              <p className="eyebrow !text-accent !text-[0.6rem] mb-0.5">Mukofot</p>
              <p className="font-mono text-2xl font-bold text-accent">+{lab.rewardXp || 0} XP</p>
            </div>
          </div>
        </header>

        <div key={round}>{renderLab()}</div>
      </div>
    </div>
  );
}
