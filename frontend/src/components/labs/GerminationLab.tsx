"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, FlaskConical, Droplets, Sun, Sprout } from "lucide-react";
import confetti from "canvas-confetti";

export default function GerminationLab({ lab, steps, completeLab, isCompleted }: any) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [seedsPlanted, setSeedsPlanted] = useState(false);
  const [watered, setWatered] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  
  const [growthDay, setGrowthDay] = useState(0);

  const handlePlantSeeds = () => {
    setSeedsPlanted(true);
    if (currentStepIndex === 0) setCurrentStepIndex(1);
  };

  const handleWater = () => {
    setWatered(true);
    if (currentStepIndex === 1) setCurrentStepIndex(2);
  };

  const handleLight = () => {
    setLightOn(!lightOn);
  };

  useEffect(() => {
    if (seedsPlanted && watered && lightOn && growthDay < 5) {
      const timer = setTimeout(() => {
        setGrowthDay(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
    
    if (growthDay >= 5 && !isCompleted) {
      completeLab();
    }
  }, [seedsPlanted, watered, lightOn, growthDay, isCompleted, completeLab]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Instructions */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-gray-900">
            <FlaskConical className="w-6 h-6 text-green-500" />
            Unib chiqish tajribasi
          </h3>
          
          <div className="space-y-4">
            {steps.map((step: any, index: number) => (
              <div 
                key={index} 
                className={`flex gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${
                  index === currentStepIndex && !isCompleted
                    ? 'bg-green-50 border-green-400 shadow-md scale-[1.02]' 
                    : index < currentStepIndex || isCompleted
                      ? 'bg-blue-50 border-blue-200 opacity-80'
                      : 'bg-gray-50 border-gray-100 opacity-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  index < currentStepIndex || isCompleted ? 'bg-blue-500 text-white shadow-md' : index === currentStepIndex ? 'bg-green-500 text-white shadow-md' : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStepIndex || isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <div>
                  <p className={`font-semibold text-sm leading-relaxed ${index === currentStepIndex && !isCompleted ? 'text-green-900' : 'text-gray-700'}`}>
                    {step.title || (typeof step === 'string' ? step : step.instruction)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Lab Zone */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-xl min-h-[500px] relative overflow-hidden flex flex-col justify-center items-center">
          <div className={`absolute inset-0 transition-colors duration-1000 ${lightOn ? 'bg-yellow-50' : 'bg-gray-900'} pointer-events-none`} />

          <div className="relative z-10 w-full flex flex-col items-center">
            
            <div className="mb-4">
              <span className={`px-4 py-2 rounded-full font-bold text-sm shadow-sm ${lightOn ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-700 text-gray-300'}`}>
                {growthDay > 0 ? `${growthDay}-kun` : "Tayyorgarlik"}
              </span>
            </div>

            {/* Pot & Plant */}
            <div className="relative w-64 h-64 flex flex-col justify-end items-center mt-10">
              
              {/* The light ray effect */}
              {lightOn && (
                <motion.div initial={{opacity:0}} animate={{opacity:0.3}} className="absolute -top-32 w-48 h-64 bg-gradient-to-b from-yellow-300 to-transparent blur-2xl" />
              )}

              {/* Plant Growth */}
              {seedsPlanted && (
                <div className="relative w-full flex justify-center items-end bottom-0 z-0">
                  <motion.div 
                    className="w-2 bg-green-500 rounded-t-full shadow-sm"
                    initial={{ height: 0 }}
                    animate={{ height: growthDay * 30 }}
                    transition={{ duration: 1 }}
                  />
                  {growthDay >= 3 && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute top-4 -ml-6 w-8 h-4 bg-green-400 rounded-full rotate-45"
                    />
                  )}
                  {growthDay >= 4 && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute top-8 ml-6 w-8 h-4 bg-green-400 rounded-full -rotate-45"
                    />
                  )}
                  {growthDay >= 5 && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-4 w-12 h-6 bg-green-500 rounded-full"
                    />
                  )}
                </div>
              )}

              {/* Pot Base */}
              <div className="w-48 h-20 bg-amber-800 rounded-b-3xl border-t-8 border-amber-900 shadow-xl relative z-10 overflow-hidden">
                <div className={`absolute top-0 w-full h-4 transition-colors duration-1000 ${watered ? 'bg-amber-900/60' : 'bg-transparent'}`} />
                {seedsPlanted && !watered && (
                  <div className="absolute top-2 w-full flex justify-around px-4">
                     <div className="w-3 h-2 bg-yellow-600 rounded-full" />
                     <div className="w-3 h-2 bg-yellow-600 rounded-full" />
                     <div className="w-3 h-2 bg-yellow-600 rounded-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="mt-16 flex flex-wrap justify-center gap-4 relative z-20">
              <button
                onClick={handlePlantSeeds}
                disabled={seedsPlanted}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-sm transition-all ${
                  seedsPlanted ? 'bg-gray-200 text-gray-500 opacity-50' : 'bg-amber-100 text-amber-800 hover:bg-amber-200 hover:scale-105'
                }`}
              >
                <Sprout className="w-5 h-5" /> Urug' qadash
              </button>

              <button
                onClick={handleWater}
                disabled={!seedsPlanted || watered}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-sm transition-all ${
                  !seedsPlanted || watered ? 'bg-gray-200 text-gray-500 opacity-50' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105'
                }`}
              >
                <Droplets className="w-5 h-5" /> Sug'orish
              </button>

              <button
                onClick={handleLight}
                disabled={!watered}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-sm transition-all ${
                  !watered ? 'bg-gray-200 text-gray-500 opacity-50' : lightOn ? 'bg-yellow-500 text-white shadow-yellow-500/50' : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-700'
                }`}
              >
                <Sun className={`w-5 h-5 ${lightOn ? 'animate-spin-slow' : ''}`} /> Yorug'lik
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
