"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronRight, ChevronLeft } from "lucide-react";

export default function FactsPage() {
  const [facts, setFacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacts();
  }, []);

  const fetchFacts = async () => {
    try {
      const res = await fetch(`/api/facts`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setFacts(data);
      } else {
        setFacts(data?.facts || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="bg-amber-500 rounded-[2rem] p-6 md:p-8 mb-8 text-white shadow-lg shadow-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Qiziqarli Faktlar</h1>
            <p className="text-white/80 mt-1">Biologiya olamidagi ajoyib faktlar bilan tanishing</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-grow flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : facts.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-foreground/50 text-center">
          <Lightbulb className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-medium">Hozircha qiziqarli faktlar yo'q.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facts.map((fact, index) => (
            <motion.div 
              key={fact.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 10) * 0.1 }}
              className="glass p-6 rounded-3xl border border-border/50 relative overflow-hidden group flex flex-col h-full hover:shadow-xl hover:shadow-amber-500/10 transition-all"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold flex-1 leading-tight">{fact.title}</h3>
              </div>
              
              <p className="text-foreground/70 text-sm flex-grow whitespace-pre-wrap leading-relaxed font-medium">
                {fact.content}
              </p>
              
              <div className="mt-4 pt-4 border-t border-border/30 flex justify-between items-center text-xs text-foreground/50 font-bold">
                <span>{fact.category === "BOTANY" ? "Botanika" : fact.category === "ZOOLOGY" ? "Zoologiya" : "Umumiy"}</span>
                <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded-md">#{index + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

