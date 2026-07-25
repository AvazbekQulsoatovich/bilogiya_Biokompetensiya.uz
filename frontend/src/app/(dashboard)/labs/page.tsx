"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Microscope, Play, Award, Beaker } from "lucide-react";

export default function LabsPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/labs");
      const data = await res.json();
      setLabs(data);
    } catch (error) {
      console.error("Failed to fetch labs", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Beaker className="text-primary-500 w-8 h-8" />
            Virtual Laboratoriyalar
          </h1>
          <p className="text-foreground/60 mt-2">Biologik jarayonlarni interaktiv tajribalar orqali o'rganing.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : labs.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border-dashed border-2 border-border/50">
          <Microscope className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Hali tajribalar yo'q</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab, index) => (
            <motion.div 
              key={lab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-3xl border border-border/50 relative overflow-hidden group flex flex-col h-full"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
              
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mb-4 bg-primary-500/10 text-primary-500">
                <Microscope className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold mb-2">{lab.title}</h3>
              <p className="text-foreground/60 text-sm mb-6 flex-grow">{lab.description}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full">
                  <Award className="w-4 h-4" />
                  +{lab.rewardXp} XP
                </div>
                
                <Link 
                  href={`/labs/${lab.id}`}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary-500/20 text-sm font-medium"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Boshlash
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
