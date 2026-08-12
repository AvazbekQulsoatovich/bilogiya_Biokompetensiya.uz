"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Play, Award } from "lucide-react";
import Link from "next/link";

export default function CrosswordsPage() {
  const [crosswords, setCrosswords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrosswords();
  }, []);

  const fetchCrosswords = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/crosswords`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCrosswords(data);
      } else {
        setCrosswords(data?.crosswords || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-cyan-500/10 rounded-2xl">
          <LayoutGrid className="w-8 h-8 text-cyan-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Krossvordlar</h1>
          <p className="text-foreground/60 mt-1">Biologik atamalarni topib, xotirangizni mashq qildiring.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !Array.isArray(crosswords) || crosswords.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border-dashed border-2 border-border/50">
          <LayoutGrid className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Hozircha krossvordlar mavjud emas</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Array.isArray(crosswords) ? crosswords : []).map((cw, index) => (
            <motion.div 
              key={cw.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-3xl border border-border/50 relative overflow-hidden flex flex-col h-full group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500" />
              <h3 className="text-xl font-bold mb-2">{cw.title}</h3>
              <p className="text-foreground/60 text-sm mb-6 flex-grow">{cw.description}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full">
                  <Award className="w-4 h-4" />
                  +50 XP
                </div>
                
                <Link 
                  href={`/crosswords/${cw.id}`}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-cyan-500/20 text-sm font-medium"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Yechish
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

