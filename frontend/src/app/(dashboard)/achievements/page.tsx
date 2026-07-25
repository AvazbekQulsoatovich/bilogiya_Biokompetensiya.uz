"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Lock, CheckCircle2 } from "lucide-react";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://biology-backend-vw8k.onrender.com/api/achievements", {
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (res.ok) setAchievements(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-purple-500/10 rounded-2xl">
          <Award className="w-8 h-8 text-purple-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Yutuqlar</h1>
          <p className="text-foreground/60 mt-1">Sizning tizimdagi erishgan nishonlaringiz</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((ach, index) => (
            <motion.div 
              key={ach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`glass p-6 rounded-3xl border relative flex flex-col items-center text-center transition-all ${
                ach.unlocked 
                  ? 'border-purple-500/50 shadow-lg shadow-purple-500/10 bg-purple-500/5' 
                  : 'border-border/50 grayscale opacity-70'
              }`}
            >
              {ach.unlocked ? (
                <div className="absolute top-4 right-4 text-green-500">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="absolute top-4 right-4 text-foreground/30">
                  <Lock className="w-5 h-5" />
                </div>
              )}
              
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                ach.unlocked ? 'bg-gradient-to-tr from-purple-600 to-primary-500 text-white shadow-xl shadow-purple-500/30' : 'bg-background border-4 border-border text-foreground/30'
              }`}>
                <Award className="w-10 h-10" />
              </div>
              
              <h3 className="text-xl font-bold mb-2">{ach.name}</h3>
              <p className="text-sm text-foreground/60 flex-grow">{ach.description}</p>
              
              <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-bold ${
                ach.unlocked ? 'bg-yellow-500/20 text-yellow-500' : 'bg-foreground/10 text-foreground/40'
              }`}>
                +{ach.xpReward} XP
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
