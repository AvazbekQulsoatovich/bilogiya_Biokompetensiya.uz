"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, FlaskConical, Droplets, Flame, Thermometer } from "lucide-react";

export default function ChemistryLab({ lab, steps, completeLab, isCompleted }: { lab: any, steps: any[], completeLab: () => void, isCompleted: boolean }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [reagentAdded, setReagentAdded] = useState(false);
  const [isHeating, setIsHeating] = useState(false);
  const [temperature, setTemperature] = useState(20);

  const handleAddReagent = () => {
    if (reagentAdded) return;
    setReagentAdded(true);
    
    // Auto advance step
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
    
    checkCompletion(true, temperature);
  };

  const handleHeat = () => {
    if (isHeating) return;
    setIsHeating(true);
    let temp = temperature;
    
    const interval = setInterval(() => {
      temp += 10;
      setTemperature(temp);
      if (temp >= 100) {
        clearInterval(interval);
        setIsHeating(false);
        checkCompletion(reagentAdded, 100);
      }
    }, 500);
    
    // Auto advance step
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const checkCompletion = (added: boolean, temp: number) => {
    if (added && temp >= 100) {
      completeLab();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Instructions */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-gray-900">
            <FlaskConical className="w-6 h-6 text-red-500" />
            Kimyoviy Tajriba
          </h3>
          
          <div className="space-y-4">
            {steps.length > 0 ? steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${
                  index === currentStepIndex && !isCompleted
                    ? 'bg-red-50 border-red-400 shadow-md scale-[1.02]' 
                    : index < currentStepIndex || isCompleted
                      ? 'bg-green-50 border-green-200 opacity-80'
                      : 'bg-gray-50 border-gray-100 opacity-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  index < currentStepIndex || isCompleted ? 'bg-green-500 text-white shadow-md' : index === currentStepIndex ? 'bg-red-500 text-white shadow-md' : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStepIndex || isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <div>
                  <p className={`font-semibold text-sm leading-relaxed ${index === currentStepIndex && !isCompleted ? 'text-red-900' : 'text-gray-700'}`}>
                    {typeof step === 'string' ? step : (step.instruction || step)}
                  </p>
                </div>
              </div>
            )) : (
              <div className="p-4 bg-gray-50 rounded-xl text-gray-500 text-sm">
                1. Reaktiv qo'shing.<br/>
                2. Suyuqlikni qizdiring.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Lab Zone */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-xl min-h-[500px] relative overflow-hidden flex flex-col justify-center items-center">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-white pointer-events-none" />

          {/* Liquid mixing & heating visualization */}
          <div className="relative z-10 flex flex-col items-center">
            
            <div className="relative w-48 h-64 border-4 border-b-8 border-gray-300 rounded-b-3xl rounded-t-xl bg-white/20 backdrop-blur-sm overflow-hidden shadow-inner flex items-end">
              
              {/* Animated Liquid */}
              <motion.div 
                className="w-full relative"
                initial={{ height: "40%", backgroundColor: "#3b82f6" }}
                animate={{ 
                  height: reagentAdded ? "70%" : "40%",
                  backgroundColor: reagentAdded ? (temperature >= 100 ? "#ef4444" : "#a855f7") : "#3b82f6"
                }}
                transition={{ duration: 1.5 }}
              >
                {/* Bubbles if heating */}
                <AnimatePresence>
                  {isHeating && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute bottom-0 w-2 h-2 bg-white/50 rounded-full"
                          initial={{ x: Math.random() * 100, y: 0, scale: 0.5 }}
                          animate={{ y: -200, scale: 1.5, x: Math.random() * 100 }}
                          transition={{ repeat: Infinity, duration: 1 + Math.random(), delay: Math.random() }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Burner */}
            <div className="w-56 h-12 bg-gray-800 rounded-lg mt-2 relative flex justify-center">
              <AnimatePresence>
                {isHeating && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 40 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="absolute -top-10 text-orange-500"
                  >
                    <Flame size={40} className="animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-12 flex gap-6">
              <button
                onClick={handleAddReagent}
                disabled={reagentAdded}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-sm transition-all ${
                  reagentAdded ? 'bg-gray-100 text-gray-400' : 'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:scale-105'
                }`}
              >
                <Droplets className="w-5 h-5" /> Reaktiv Qo'shish
              </button>

              <button
                onClick={handleHeat}
                disabled={isHeating || temperature >= 100}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-sm transition-all ${
                  (isHeating || temperature >= 100) ? 'bg-gray-100 text-gray-400' : 'bg-orange-100 text-orange-700 hover:bg-orange-200 hover:scale-105'
                }`}
              >
                <Thermometer className="w-5 h-5" /> Qizdirish ({temperature}°C)
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
