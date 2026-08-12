"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";

export default function GlossaryPage() {
  const [terms, setTerms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/glossary`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTerms(data);
      } else {
        setTerms(data?.terms || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTerms = (Array.isArray(terms) ? terms : []).filter(t => 
    t.term.toLowerCase().includes(search.toLowerCase()) || 
    t.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="bg-rose-500 rounded-[2rem] p-6 md:p-8 mb-8 text-white shadow-lg shadow-rose-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Lug'at</h1>
            <p className="text-white/80 mt-1">Biologik atamalar va ularning izohlari</p>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Atama qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border-2 border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-rose-500 transition-colors"
          />
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-foreground/40" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass p-6 rounded-2xl border border-border/50 hover:border-rose-500/30 transition-colors"
              >
                <h3 className="text-xl font-bold text-rose-500 mb-2">{t.term}</h3>
                <p className="text-foreground/80 leading-relaxed">{t.definition}</p>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center text-foreground/50 border-2 border-dashed border-border/50 rounded-2xl">
              Qidiruv natijasiga mos hech qanday atama topilmadi.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

