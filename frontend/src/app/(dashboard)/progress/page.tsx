"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Star, Zap, Clock } from "lucide-react";

export default function ProgressPage() {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/progress`, {
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (res.ok) setProgress(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const xpRequiredForNextLevel = progress?.level * 500 || 500;
  const currentLevelProgress = (progress?.totalXp || 0) % 500;
  const percent = Math.min(100, Math.round((currentLevelProgress / 500) * 100));

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-green-500/10 rounded-2xl">
          <TrendingUp className="w-8 h-8 text-green-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">O'zlashtirish</h1>
          <p className="text-foreground/60 mt-1">Sizning umumiy statistika va natijalaringiz</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass p-6 rounded-3xl border border-border/50 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mb-4">
            <Star className="w-8 h-8 fill-yellow-500" />
          </div>
          <h3 className="text-4xl font-black mb-1">{progress?.totalXp || 0}</h3>
          <p className="text-foreground/60 font-medium">Umumiy XP</p>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-3xl border border-border/50 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-4xl font-black mb-1">{progress?.level || 1}</h3>
          <p className="text-foreground/60 font-medium">Hozirgi Daraja</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-3xl border border-border/50 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 fill-orange-500" />
          </div>
          <h3 className="text-4xl font-black mb-1">0</h3>
          <p className="text-foreground/60 font-medium">Kunlik Seriya (Streak)</p>
        </motion.div>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass p-8 rounded-3xl border border-border/50 shadow-lg">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-xl font-bold">Keyingi darajaga</h3>
            <p className="text-foreground/60 text-sm">Siz {progress?.level + 1}-darajaga chiqish uchun yana {500 - currentLevelProgress} XP yig'ishingiz kerak.</p>
          </div>
          <div className="text-2xl font-black text-red-500">{percent}%</div>
        </div>
        
        <div className="w-full h-6 bg-background rounded-full overflow-hidden border border-border">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-red-600 to-red-400 relative"
          >
            <div className="absolute top-0 right-0 bottom-0 w-full bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-stripe"></div>
          </motion.div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/30 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-red-500"/> Oxirgi faollik</h4>
            <div className="text-foreground/60 text-sm italic">
              {progress?.updatedAt ? new Date(progress.updatedAt).toLocaleString() : "Ma'lumot yo'q"}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

