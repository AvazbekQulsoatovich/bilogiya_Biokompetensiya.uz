"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, FlaskConical, Beaker, Pipette, Microscope, Info, Award, Star, TrendingUp } from "lucide-react";
import confetti from "canvas-confetti";

export default function LabExperimentPage() {
  const params = useParams();
  const router = useRouter();
  
  const [lab, setLab] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorItem, setErrorItem] = useState<string | null>(null);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    fetchLab();
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/progress", {
        headers: { ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
      });
      if (res.ok) setProgress(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLab = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/labs/${params.id}`);
      const data = await res.json();
      if (data) {
        setLab(data);
        setSteps(JSON.parse(data.stepsJson || "[]"));
      }
    } catch (error) {
      console.error("Failed to fetch lab", error);
    } finally {
      setLoading(false);
    }
  };

  const completeLab = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/labs/${params.id}/complete`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({}) 
      });
      if (res.ok) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#f59e0b']
        });
        // Update local progress stat visually
        if (progress) {
          setProgress({ ...progress, totalXp: progress.totalXp + lab.rewardXp });
        }
      }
    } catch (error) {
      console.error("Error completing lab", error);
    }
  };

  const handleItemClick = (itemName: string) => {
    if (isCompleted) return;
    
    const currentStep = steps[currentStepIndex];
    
    // Check if clicked item is the required one for this step
    if (currentStep.item === itemName || currentStep.target === itemName) {
      // Success! Move to next step
      setErrorItem(null);
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setIsCompleted(true);
        completeLab();
      }
    } else {
      // Wrong item
      setErrorItem(itemName);
      setTimeout(() => setErrorItem(null), 1000);
    }
  };

  // Lab Items Icons Map
  const itemIcons: any = {
    "piyoz": <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center text-2xl" title="Piyoz">🧅</div>,
    "oyna": <div className="w-24 h-12 bg-blue-100 border-2 border-blue-300 rounded shadow-inner flex items-center justify-center text-sm font-bold text-blue-800" title="Predmet oynasi">Oyna</div>,
    "tomizgich": <Pipette className="w-12 h-12 text-blue-600" title="Tomizgich (Yod)" />,
    "qoplagich": <div className="w-10 h-10 bg-white/50 border border-gray-300 shadow-sm" title="Qoplagich oyna" />,
    "mikroskop": <Microscope className="w-20 h-20 text-gray-700" title="Mikroskop" />
  };

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lab) return <div className="p-8">Laboratoriya topilmadi.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <button 
        onClick={() => router.push('/labs')}
        className="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Ortga qaytish
      </button>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            {lab.title}
          </h1>
          <p className="text-foreground/70 max-w-2xl">{lab.description}</p>
        </div>
        <div className="flex gap-4 items-center">
          {progress && (
            <div className="glass px-6 py-3 rounded-2xl border border-border/50 text-right hidden md:block">
              <div className="flex items-center justify-end gap-4">
                <div>
                  <p className="text-xs text-foreground/50 uppercase font-bold tracking-wider mb-1">Mening XP</p>
                  <p className="text-xl font-bold flex items-center justify-end gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {progress.totalXp}</p>
                </div>
                <div className="w-px h-8 bg-border/50 mx-2"></div>
                <div>
                  <p className="text-xs text-foreground/50 uppercase font-bold tracking-wider mb-1">Daraja</p>
                  <p className="text-xl font-bold flex items-center justify-end gap-1"><TrendingUp className="w-4 h-4 text-blue-500" /> {progress.level}</p>
                </div>
              </div>
            </div>
          )}
          <div className="glass px-6 py-3 rounded-2xl border border-primary-500/30 bg-primary-500/5 text-center">
            <p className="text-xs uppercase font-bold text-primary-500 tracking-wider mb-1">Mukofot</p>
            <p className="text-2xl font-black text-foreground">+{lab.rewardXp} XP</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Instructions */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-3xl border border-border/50 sticky top-24">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Jarayon
            </h3>
            
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`flex gap-4 p-4 rounded-2xl border transition-all ${
                    index === currentStepIndex && !isCompleted
                      ? 'bg-primary-500/10 border-primary-500/50 shadow-md' 
                      : index < currentStepIndex || isCompleted
                        ? 'bg-green-500/10 border-green-500/30 opacity-70'
                        : 'glass border-border/30 opacity-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    index < currentStepIndex || isCompleted ? 'bg-green-500 text-white' : index === currentStepIndex ? 'bg-primary-500 text-white' : 'bg-foreground/10 text-foreground/50'
                  }`}>
                    {index < currentStepIndex || isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                  </div>
                  <div>
                    <p className={`font-medium ${index === currentStepIndex && !isCompleted ? 'text-primary-700 dark:text-primary-300' : ''}`}>
                      {step.instruction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {isCompleted && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 bg-green-500 text-white p-6 rounded-2xl text-center shadow-xl shadow-green-500/20"
              >
                <Award className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-1">Tajriba Yakunlandi!</h3>
                <p className="text-green-100">Siz {lab.rewardXp} XP ishlab topdingiz.</p>
                <button 
                  onClick={() => router.push('/labs')}
                  className="mt-4 bg-white text-green-600 font-bold px-6 py-2 rounded-xl hover:bg-green-50 transition-colors w-full"
                >
                  Davom etish
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Lab Zone */}
        <div className="lg:col-span-2">
          <div className="glass p-8 rounded-3xl border border-border/50 min-h-[600px] relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500 via-background to-background pointer-events-none" />
            
            <h3 className="text-lg font-semibold mb-8 text-center text-foreground/50 uppercase tracking-widest">
              Tajriba Stoli
            </h3>

            {/* Interactive Area */}
              {isCompleted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="flex flex-col items-center justify-center gap-6 z-20"
                >
                  <div className="relative w-80 h-80 rounded-full border-8 border-black shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden bg-black flex items-center justify-center">
                    <img 
                      src="/onion_cells.png" 
                      alt="Mikroskop ostida piyoz hujayrasi" 
                      className="w-[120%] h-[120%] object-cover opacity-90 mix-blend-screen"
                    />
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] pointer-events-none"></div>
                    <div className="absolute w-full h-[1px] bg-black/30 pointer-events-none"></div>
                    <div className="absolute h-full w-[1px] bg-black/30 pointer-events-none"></div>
                  </div>
                  <div className="text-center bg-background/80 backdrop-blur p-4 rounded-2xl border border-border">
                    <h4 className="font-bold text-xl mb-1 text-primary-500">Piyoz po'sti hujayrasi (Yod bilan bo'yalgan)</h4>
                    <p className="text-sm text-foreground/70">Kattalashtirish: 400x. Hujayra qobig'i va yadrosi aniq ko'rinmoqda.</p>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Target Zone (e.g. Microscope) */}
                  <div className="flex gap-12 items-end">
                    {['oyna', 'mikroskop'].map(item => (
                      <motion.div 
                        key={item}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleItemClick(item)}
                        className={`cursor-pointer flex flex-col items-center gap-3 ${errorItem === item ? 'animate-shake' : ''}`}
                      >
                        <div className={`p-4 rounded-2xl ${errorItem === item ? 'bg-red-500/20 border-red-500' : 'hover:bg-foreground/5'} transition-colors border border-transparent`}>
                          {itemIcons[item]}
                        </div>
                        <span className="text-sm font-medium capitalize text-foreground/70">{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Tools Zone */}
                  <div className="w-full glass p-6 rounded-2xl border border-border/30 flex justify-center gap-8 items-center bg-background/50 backdrop-blur-md mt-auto">
                    {['piyoz', 'tomizgich', 'qoplagich'].map(item => (
                      <motion.div 
                        key={item}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleItemClick(item)}
                        className={`cursor-pointer flex flex-col items-center gap-2 ${errorItem === item ? 'animate-shake' : ''}`}
                      >
                        <div className={`p-3 rounded-xl bg-background shadow-sm border ${errorItem === item ? 'border-red-500' : 'border-border'} hover:border-primary-500 transition-colors`}>
                          {itemIcons[item]}
                        </div>
                        <span className="text-xs font-medium capitalize text-foreground/60">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
