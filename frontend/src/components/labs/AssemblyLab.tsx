"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Layers } from "lucide-react";

export default function AssemblyLab({ lab, steps, completeLab, isCompleted }: { lab: any, steps: any[], completeLab: () => void, isCompleted: boolean }) {
  const [placedParts, setPlacedParts] = useState<string[]>([]);
  const allParts = ["Yadro", "Mitoxondriya", "Sitoplazma", "Membrana"];

  const handlePlacePart = (part: string) => {
    if (placedParts.includes(part)) return;
    const newParts = [...placedParts, part];
    setPlacedParts(newParts);
    
    if (newParts.length === allParts.length) {
      setTimeout(() => completeLab(), 500);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-gray-900">
            <Layers className="w-6 h-6 text-purple-500" />
            Yig'ish Tajribasi
          </h3>
          <p className="text-gray-600 mb-6 text-sm">
            Hujayra organoidlarini to'g'ri joyiga qo'ying.
          </p>
          
          <div className="flex flex-col gap-4">
            {allParts.map((part) => (
              <button
                key={part}
                onClick={() => handlePlacePart(part)}
                disabled={placedParts.includes(part)}
                className={`p-3 rounded-xl border-2 font-bold text-sm text-left transition-all ${
                  placedParts.includes(part) ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-white border-purple-200 text-purple-700 hover:border-purple-400 hover:shadow-md'
                }`}
              >
                {part} {placedParts.includes(part) && <CheckCircle2 className="inline w-4 h-4 ml-2 text-green-500" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-xl min-h-[500px] relative overflow-hidden flex flex-col justify-center items-center">
          
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Outline */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-gray-300"></div>

            {/* Assembled Parts */}
            {placedParts.includes("Membrana") && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 rounded-full border-8 border-blue-400 bg-blue-50/50" />
            )}
            {placedParts.includes("Sitoplazma") && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-4 rounded-full bg-blue-100/60" />
            )}
            {placedParts.includes("Yadro") && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute w-24 h-24 bg-purple-500 rounded-full shadow-lg" />
            )}
            {placedParts.includes("Mitoxondriya") && (
              <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-16 left-16 w-12 h-6 bg-orange-400 rounded-full shadow-md rotate-45" />
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute bottom-20 right-16 w-10 h-5 bg-orange-400 rounded-full shadow-md -rotate-12" />
              </>
            )}

            {placedParts.length === 0 && (
              <span className="text-gray-400 font-bold uppercase tracking-wider">Bo'sh Hujayra</span>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
