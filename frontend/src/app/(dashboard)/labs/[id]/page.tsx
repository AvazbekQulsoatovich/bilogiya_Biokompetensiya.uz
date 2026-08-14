"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, FlaskConical, Award, Star, TrendingUp } from "lucide-react";
import confetti from "canvas-confetti";

import MicroscopeLab from "@/components/labs/MicroscopeLab";
import ChemistryLab from "@/components/labs/ChemistryLab";
import PhotosynthesisLab from "@/components/labs/PhotosynthesisLab";
import OsmosisLab from "@/components/labs/OsmosisLab";
import FoodWebLab from "@/components/labs/FoodWebLab";
import GeneralLab from "@/components/labs/GeneralLab";
import DissectionLab from "@/components/labs/DissectionLab";
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
    fetchLab();
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/progress`, {
        headers: { ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
      });
      if (res.ok) setProgress(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLab = async () => {
    try {
      const res = await fetch(`/api/labs/${params.id}`);
      const data = await res.json();
      if (data) {
        setLab(data);
        const parsed = JSON.parse(data.stepsJson || "[]");
        if (Array.isArray(parsed)) {
          setSteps(parsed);
        } else {
          setSteps(parsed.instructions || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch lab", error);
    } finally {
      setLoading(false);
    }
  };

  const completeLab = async () => {
    if (isCompleted) return;
    setIsCompleted(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/labs/${params.id}/complete`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({}) 
      });
      if (res.ok) {
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
        });
        if (progress) {
          setProgress({ ...progress, totalXp: progress.totalXp + (lab.rewardXp || 0) });
        }
      }
    } catch (error) {
      console.error("Error completing lab", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lab) return <div className="p-8 text-center text-xl text-gray-500">Laboratoriya topilmadi.</div>;

  const renderLabContent = () => {
    const labType = lab.type || "MICROSCOPE"; 

    switch (labType) {
      case "CHEMISTRY":
        return <ChemistryLab lab={lab} steps={steps} completeLab={completeLab} isCompleted={isCompleted} />;
      case "PHOTOSYNTHESIS":
        return <PhotosynthesisLab lab={lab} steps={steps} completeLab={completeLab} isCompleted={isCompleted} />;
      case "OSMOSIS":
        return <OsmosisLab lab={lab} steps={steps} completeLab={completeLab} isCompleted={isCompleted} />;
      case "FOODWEB":
        return <FoodWebLab lab={lab} steps={steps} completeLab={completeLab} isCompleted={isCompleted} />;
      case "DISSECTION":
        return <DissectionLab lab={lab} steps={steps} completeLab={completeLab} isCompleted={isCompleted} />;
      case "DNA_EXTRACTION":
        return <DNAExtractionLab lab={lab} steps={steps} completeLab={completeLab} isCompleted={isCompleted} />;
      case "GENETICS":
        return <GeneticsLab lab={lab} steps={steps} completeLab={completeLab} isCompleted={isCompleted} />;
      case "HEARTRATE":
        return <HeartRateLab lab={lab} steps={steps} completeLab={completeLab} isCompleted={isCompleted} />;
      case "CELLBUILDER":
        return <CellBuilderLab lab={lab} steps={steps} completeLab={completeLab} isCompleted={isCompleted} />;
      case "GENERAL":
        return <GeneralLab lab={lab} steps={steps} completeLab={completeLab} isCompleted={isCompleted} />;
      case "MICROSCOPE":
      default:
        return <MicroscopeLab lab={lab} steps={steps} completeLab={completeLab} isCompleted={isCompleted} />;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <button 
        onClick={() => router.push('/labs')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors font-medium bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm w-max"
      >
        <ArrowLeft className="w-4 h-4" /> Laboratoriyalar ro'yxatiga qaytish
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
            {lab.title}
          </h1>
          <p className="text-gray-600 max-w-2xl text-lg">{lab.description}</p>
        </div>
        <div className="flex gap-4 items-center">
          {progress && (
            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm text-right hidden md:block">
              <div className="flex items-center justify-end gap-6">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Mening XP</p>
                  <p className="text-xl font-bold flex items-center justify-end gap-1.5"><Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-sm" /> {progress.totalXp}</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Daraja</p>
                  <p className="text-xl font-bold flex items-center justify-end gap-1.5"><TrendingUp className="w-5 h-5 text-blue-500" /> {progress.level}</p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-green-50 px-6 py-4 rounded-2xl border border-green-200 text-center shadow-sm">
            <p className="text-[10px] uppercase font-bold text-green-600 tracking-widest mb-1">Mukofot</p>
            <p className="text-2xl font-black text-green-700">+{lab.rewardXp || 0} XP</p>
          </div>
        </div>
      </div>

      <div className="w-full">
        {renderLabContent()}
      </div>
      
      {isCompleted && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mt-8 max-w-2xl mx-auto bg-gradient-to-br from-green-400 to-green-600 text-white p-8 rounded-3xl text-center shadow-2xl shadow-green-500/30"
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-black mb-2">Ajoyib Natija!</h3>
          <p className="text-green-50 font-medium mb-6">Siz tajribani muvaffaqiyatli yakunladingiz va {lab.rewardXp} XP ishlab topdingiz.</p>
          <button 
            onClick={() => router.push('/labs')}
            className="bg-white text-green-700 font-bold px-8 py-3.5 rounded-full hover:bg-green-50 hover:scale-105 hover:shadow-lg transition-all w-full"
          >
            Boshqa tajribalar
          </button>
        </motion.div>
      )}
    </div>
  );
}
