"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronRight, ChevronLeft } from "lucide-react";

export default function FactsPage() {
  const [facts, setFacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchFacts();
  }, []);

  const fetchFacts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/facts");
      const data = await res.json();
      setFacts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextFact = () => setCurrentIndex(prev => (prev + 1) % facts.length);
  const prevFact = () => setCurrentIndex(prev => (prev - 1 + facts.length) % facts.length);

  return (
    <div className="p-8 max-w-4xl mx-auto w-full h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <div className="p-3 bg-yellow-500/10 rounded-2xl">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Qiziqarli Faktlar</h1>
          <p className="text-foreground/60 mt-1">Biologiya olamidagi ajoyib faktlar bilan tanishing</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-grow flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex-grow relative flex items-center justify-center">
          <div className="absolute left-0 z-10 hidden md:block">
            <button onClick={prevFact} className="p-4 bg-background/50 hover:bg-primary-500 text-foreground hover:text-white rounded-full shadow-lg backdrop-blur transition-colors">
              <ChevronLeft className="w-8 h-8" />
            </button>
          </div>

          <div className="w-full max-w-2xl relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50, rotateY: 20 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -50, rotateY: -20 }}
                transition={{ duration: 0.5 }}
                className="glass rounded-3xl border border-border/50 shadow-2xl p-12 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-primary" />
                <Lightbulb className="w-16 h-16 text-yellow-500 mx-auto mb-8 opacity-20" />
                
                <h2 className="text-3xl font-black mb-6 text-foreground">{facts[currentIndex]?.title}</h2>
                <p className="text-xl text-foreground/80 leading-relaxed font-medium">
                  {facts[currentIndex]?.content}
                </p>

                <div className="mt-12 flex justify-center gap-2">
                  {facts.map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i === currentIndex ? 'bg-primary-500' : 'bg-foreground/20'}`} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute right-0 z-10 hidden md:block">
            <button onClick={nextFact} className="p-4 bg-background/50 hover:bg-primary-500 text-foreground hover:text-white rounded-full shadow-lg backdrop-blur transition-colors">
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
      
      {/* Mobile controls */}
      {!loading && facts.length > 0 && (
        <div className="md:hidden flex justify-between mt-8 shrink-0">
          <button onClick={prevFact} className="px-6 py-3 bg-background border border-border rounded-xl font-bold">Oldingi</button>
          <button onClick={nextFact} className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold">Keyingi</button>
        </div>
      )}
    </div>
  );
}
