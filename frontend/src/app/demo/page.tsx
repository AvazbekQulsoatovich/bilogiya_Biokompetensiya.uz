"use client";

import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl border border-border/50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary-500/10 rounded-2xl">
            <PlayCircle className="w-8 h-8 text-primary-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Demo</h1>
            <p className="text-foreground/60 mt-1">Platformaning imkoniyatlari bilan tanishuv.</p>
          </div>
        </div>

        <div className="min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-2xl bg-background/30 gap-4">
          <p className="text-foreground/40 font-medium">Ushbu bo'lim tez orada ishga tushadi...</p>
          <Link href="/" className="bg-primary-600 hover:bg-primary-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary-500/20">
            Bosh sahifaga qaytish
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
