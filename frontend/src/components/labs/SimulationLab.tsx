"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sun, Thermometer, Info } from "lucide-react";

export default function SimulationLab({ lab, steps, completeLab, isCompleted }: { lab: any, steps: any[], completeLab: () => void, isCompleted: boolean }) {
  const [temperature, setTemperature] = useState(25);
  const [lightLevel, setLightLevel] = useState(50);
  const [growth, setGrowth] = useState(1);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Determine growth based on ideal conditions (e.g. temp ~ 25-30, light ~ 80)
    let newGrowth = 1;
    if (temperature > 20 && temperature < 35 && lightLevel > 60) {
      newGrowth = 3;
    } else if (temperature > 15 && temperature < 40 && lightLevel > 30) {
      newGrowth = 2;
    }
    setGrowth(newGrowth);

    // Check completion condition (e.g. max growth reached)
    if (newGrowth === 3 && !isCompleted) {
      setTimeout(() => completeLab(), 1000);
    }
  }, [temperature, lightLevel]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-gray-900">
            <Info className="w-6 h-6 text-green-500" />
            Simulyatsiya
          </h3>
          <p className="text-gray-600 mb-6 text-sm">
            O'simlikning optimal o'sishi uchun harorat va yorug'likni moslang.
          </p>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between text-sm font-bold text-gray-600">
                <span className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-orange-500" /> Harorat</span>
                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">{temperature}°C</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={temperature} 
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between text-sm font-bold text-gray-600">
                <span className="flex items-center gap-2"><Sun className="w-4 h-4 text-yellow-500" /> Yorug'lik</span>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">{lightLevel}%</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={lightLevel} 
                onChange={(e) => setLightLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-xl min-h-[500px] relative overflow-hidden flex flex-col justify-center items-center">
          
          <motion.div 
            className="absolute top-0 right-0 p-8 text-yellow-400"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: lightLevel / 100 }}
          >
            <Sun size={100} />
          </motion.div>

          <div className="relative z-10 flex flex-col items-center justify-end h-64 border-b-8 border-brown-600 w-64 rounded-b-xl">
            {/* Plant Visualization */}
            <motion.div
              className="bg-green-500 rounded-t-full origin-bottom"
              initial={{ height: 40, width: 20 }}
              animate={{ 
                height: growth === 3 ? 180 : growth === 2 ? 100 : 40,
                width: growth === 3 ? 40 : growth === 2 ? 30 : 20,
                backgroundColor: temperature > 40 ? "#854d0e" : temperature < 10 ? "#6ee7b7" : "#22c55e"
              }}
              transition={{ duration: 1 }}
            />
            {growth === 3 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute top-10 left-10 w-10 h-10 bg-green-400 rounded-full rounded-bl-none rotate-45"
              />
            )}
            {growth === 3 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute top-20 right-10 w-8 h-8 bg-green-400 rounded-full rounded-br-none -rotate-45"
              />
            )}
            <div className="w-full h-8 bg-[#8B4513] rounded-t-sm absolute -bottom-8"></div>
          </div>
          
          <div className="mt-16 text-center text-gray-500 font-medium">
            {growth === 1 && "O'simlik sekin o'smoqda"}
            {growth === 2 && "O'simlik normal o'smoqda"}
            {growth === 3 && "O'simlik juda tez o'smoqda! Optimal sharoit!"}
          </div>

        </div>
      </div>
    </div>
  );
}
