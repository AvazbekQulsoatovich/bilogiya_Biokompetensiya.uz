"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Award, Star, TrendingUp, Microscope } from "lucide-react";
import confetti from "canvas-confetti";
import { Page, Loading, BackButton, EmptyState } from "@/components/ui";

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
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/labs/${params.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 }, colors: ["#0b7a5c", "#3ecf9b", "#e9b44c", "#2b5fb4"] });
        setProgress((p: any) => (p ? { ...p, totalXp: p.totalXp + (lab?.rewardXp || 0) } : p));
      }
    } catch (e) {
      console.error("Tajribani yakunlashda xato", e);
    }
  }, [isCompleted, params.id, lab]);

  if (loading) return <Page><Loading /></Page>;
  if (!lab)
    return (
      <Page narrow>
        <EmptyState icon={Microscope} title="Laboratoriya topilmadi" />
      </Page>
    );

  const common = { lab, steps, completeLab, isCompleted };
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

  return (
    <Page>
      <BackButton onClick={() => router.push("/labs")}>Laboratoriyalar roʻyxatiga qaytish</BackButton>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div className="max-w-3xl">
          <p className="eyebrow mb-2">{lab.gradeLevel}-sinf · Virtual laboratoriya</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight mb-3">{lab.title}</h1>
          <p className="text-muted text-lg">{lab.description}</p>
        </div>
        <div className="flex gap-3 items-stretch shrink-0">
          {progress && (
            <div className="card px-5 py-3 hidden md:flex items-center gap-5">
              <div>
                <p className="eyebrow !text-muted mb-0.5">Mening XP</p>
                <p className="font-display text-xl font-semibold flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-accent fill-accent" /> {progress.totalXp}
                </p>
              </div>
              <div className="w-px h-9 bg-line" />
              <div>
                <p className="eyebrow !text-muted mb-0.5">Daraja</p>
                <p className="font-display text-xl font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-info" /> {progress.level}
                </p>
              </div>
            </div>
          )}
          <div className="card px-5 py-3 bg-brand-soft !border-transparent text-center">
            <p className="eyebrow mb-0.5">Mukofot</p>
            <p className="font-display text-2xl font-semibold text-brand">+{lab.rewardXp || 0} XP</p>
          </div>
        </div>
      </div>

      {renderLab()}

      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-2xl mx-auto rounded-3xl bg-[#0a2a1f] text-white p-8 text-center shadow-[var(--shadow-lg)]"
        >
          <div className="w-14 h-14 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center mx-auto mb-4">
            <Award className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl font-semibold mb-2">Tajriba muvaffaqiyatli yakunlandi!</h2>
          <p className="text-white/75 mb-6">Siz {lab.rewardXp} XP ishlab oldingiz.</p>
          <button onClick={() => router.push("/labs")} className="btn btn-lg !bg-emerald-400 !text-[#04140d] hover:!bg-emerald-300 w-full sm:w-auto">
            Boshqa tajribalar
          </button>
        </motion.div>
      )}
    </Page>
  );
}
