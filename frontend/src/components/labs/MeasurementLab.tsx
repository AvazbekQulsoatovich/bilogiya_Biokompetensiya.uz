"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, FlaskConical, Ruler, Thermometer, Weight } from "lucide-react";
import confetti from "canvas-confetti";

export default function MeasurementLab({ lab, steps, completeLab, isCompleted }: any) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // States for the interactive tools
  const [scaleWeight, setScaleWeight] = useState(0);
  const [tempValue, setTempValue] = useState(25);
  const [rulerLength, setRulerLength] = useState(0);

  const [toolCompleted, setToolCompleted] = useState([false, false, false]);

  const handleToolComplete = (index: number) => {
    const newCompleted = [...toolCompleted];
    newCompleted[index] = true;
    setToolCompleted(newCompleted);

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeLab();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Instructions */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-gray-900">
            <FlaskConical className="w-6 h-6 text-blue-500" />
            O'lchov Tajribalari
          </h3>
          
          <div className="space-y-4">
            {steps.map((step: any, index: number) => (
              <div 
                key={index} 
                className={`flex gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${
                  index === currentStepIndex && !isCompleted
                    ? 'bg-blue-50 border-blue-400 shadow-md scale-[1.02]' 
                    : index < currentStepIndex || isCompleted
                      ? 'bg-green-50 border-green-200 opacity-80'
                      : 'bg-gray-50 border-gray-100 opacity-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  index < currentStepIndex || isCompleted ? 'bg-green-500 text-white shadow-md' : index === currentStepIndex ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStepIndex || isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <div>
                  <p className={`font-semibold text-sm leading-relaxed ${index === currentStepIndex && !isCompleted ? 'text-blue-900' : 'text-gray-700'}`}>
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
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 pointer-events-none" />

          <div className="relative z-10 w-full flex flex-col items-center">
            
            {/* Step 1: Tarozi */}
            {currentStepIndex === 0 && !isCompleted && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center w-full max-w-sm">
                <Weight className="w-16 h-16 text-indigo-500 mb-6" />
                <h4 className="text-xl font-bold mb-8">Ob'yektni tortish</h4>
                
                <div className="bg-gray-100 p-8 rounded-2xl border-4 border-gray-300 w-full mb-8 shadow-inner flex flex-col items-center">
                  <span className="text-4xl font-mono font-black text-gray-800">{scaleWeight} kg</span>
                </div>
                
                <input 
                  type="range" min="0" max="50" value={scaleWeight} 
                  onChange={(e) => setScaleWeight(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-8"
                />
                
                <button onClick={() => handleToolComplete(0)} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-500">
                  Tasdiqlash
                </button>
              </motion.div>
            )}

            {/* Step 2: Termometr */}
            {currentStepIndex === 1 && !isCompleted && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center w-full max-w-sm">
                <Thermometer className="w-16 h-16 text-red-500 mb-6" />
                <h4 className="text-xl font-bold mb-8">Haroratni aniqlash</h4>
                
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="w-12 h-48 bg-gray-200 rounded-full border-4 border-gray-300 relative overflow-hidden flex items-end p-1">
                    <motion.div 
                      className="w-full bg-red-500 rounded-full transition-all duration-300" 
                      style={{ height: `${tempValue}%` }}
                    />
                  </div>
                  <span className="text-5xl font-mono font-black text-gray-800">{tempValue}°C</span>
                </div>
                
                <input 
                  type="range" min="0" max="100" value={tempValue} 
                  onChange={(e) => setTempValue(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-8"
                />
                
                <button onClick={() => handleToolComplete(1)} className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-500">
                  Tasdiqlash
                </button>
              </motion.div>
            )}

            {/* Step 3: Chizg'ich */}
            {currentStepIndex === 2 && !isCompleted && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center w-full max-w-lg">
                <Ruler className="w-16 h-16 text-green-500 mb-6" />
                <h4 className="text-xl font-bold mb-8">Uzunlikni o'lchash</h4>
                
                <div className="w-full relative h-24 bg-yellow-100 border-b-8 border-yellow-400 mb-12 rounded-t-xl overflow-hidden shadow-inner flex items-end pb-2 px-2">
                  <motion.div 
                    className="h-12 bg-blue-500 rounded-md shadow-md"
                    style={{ width: `${rulerLength}%` }}
                  />
                  <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 text-xs font-bold text-yellow-800">
                     {[...Array(11)].map((_, i) => <span key={i}>{i * 10}</span>)}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full mb-8">
                  <input 
                    type="range" min="0" max="100" value={rulerLength} 
                    onChange={(e) => setRulerLength(Number(e.target.value))}
                    className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-2xl font-mono font-black text-gray-800">{rulerLength} sm</span>
                </div>
                
                <button onClick={() => handleToolComplete(2)} className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-500">
                  Tajribani Yakunlash
                </button>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
