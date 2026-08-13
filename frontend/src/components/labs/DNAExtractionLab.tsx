"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Beaker, CheckCircle2 } from "lucide-react";

export default function DNAExtractionLab({ completeLab, isCompleted }: any) {
  const [step, setStep] = useState(0);
  
  const steps = [
    { name: "Qulupnayni ezish", action: "Ezish", color: "bg-red-500" },
    { name: "Suyuq sovun qo'shish", action: "Sovun quyish", color: "bg-red-400" },
    { name: "Tuz qo'shish", action: "Tuz solish", color: "bg-red-300" },
    { name: "Filtrlash", action: "Filtrdan o'tkazish", color: "bg-pink-300" },
    { name: "Muzli spirt qo'shish", action: "Spirt quyish", color: "bg-pink-200" }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      setStep(s => s + 1);
      completeLab();
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
      <h2 className="text-2xl font-bold mb-2">Qulupnaydan DNK Ajratish</h2>
      <p className="text-gray-600 mb-8">Hujayra membranasini yorib, DNK iplarini ko'rinadigan holatga keltiramiz.</p>
      
      <div className="flex justify-center mb-8">
        <div className="w-48 h-64 border-4 border-b-[12px] border-gray-300 rounded-b-[40px] relative overflow-hidden bg-gray-50 flex items-end">
          <motion.div 
            className="w-full transition-all duration-1000 ease-in-out relative"
            style={{ 
              height: `${(step + 1) * 15}%`,
              backgroundColor: step < steps.length ? (step === 0 ? '#ef4444' : step === 1 ? '#f87171' : step === 2 ? '#fca5a5' : '#fbcfe8') : '#fbcfe8'
            }}
          >
            {step >= 5 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: -20 }}
                transition={{ duration: 2 }}
                className="absolute top-0 left-0 w-full h-1/2 bg-white/40 flex justify-center items-end pb-2"
              >
                 {/* DNA strands visualization */}
                 <div className="flex gap-2">
                   <div className="w-1 h-8 bg-white rounded-full opacity-80 rotate-12"></div>
                   <div className="w-1 h-10 bg-white rounded-full opacity-80 -rotate-12"></div>
                   <div className="w-1 h-6 bg-white rounded-full opacity-80 rotate-45"></div>
                 </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      
      {!isCompleted ? (
        <div className="max-w-md mx-auto">
          <div className="text-xl font-bold mb-4 text-blue-600">{step + 1}. {steps[step]?.name}</div>
          <button 
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold w-full shadow-lg"
          >
            {steps[step]?.action}
          </button>
        </div>
      ) : (
        <div className="text-green-600 font-bold text-2xl flex items-center justify-center gap-2 mt-4">
          <CheckCircle2 className="w-8 h-8" /> DNK muvaffaqiyatli ajratildi!
        </div>
      )}
    </div>
  );
}