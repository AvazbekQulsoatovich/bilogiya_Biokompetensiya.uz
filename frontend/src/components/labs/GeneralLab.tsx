"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, FlaskConical, Play, Image as ImageIcon } from "lucide-react";

export default function GeneralLab({ lab, steps, completeLab, isCompleted }: { lab: any, steps: any[], completeLab: () => void, isCompleted: boolean }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeLab();
    }
  };

  const currentStep = steps[currentStepIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Instructions */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-gray-900">
            <FlaskConical className="w-6 h-6 text-blue-500" />
            Tajriba Qadamlari
          </h3>
          
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${
                  index === currentStepIndex
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
                  <p className={`font-semibold text-sm leading-relaxed ${index === currentStepIndex ? 'text-blue-900' : 'text-gray-700'}`}>
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
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-xl min-h-[600px] relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-green-50/50 pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center">
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-green-600 mb-2">Ajoyib!</h3>
                  <p className="text-gray-600">Siz ushbu laboratoriya mashg'ulotini muvaffaqiyatli yakunladingiz.</p>
                </motion.div>
              ) : currentStep ? (
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-blue-200">
                     <span className="text-3xl font-black text-blue-500">{currentStepIndex + 1}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentStep.title || "Vazifa"}</h2>
                  <p className="text-lg text-gray-700 mb-10 max-w-lg leading-relaxed">{currentStep.instruction || (typeof currentStep === 'string' ? currentStep : '')}</p>
                  
                  <div className="w-full max-w-sm aspect-video bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-10 overflow-hidden relative shadow-sm">
                    {currentStep.imageUrl ? (
                       <div className="flex flex-col items-center justify-center text-gray-400">
                          <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                          <span className="text-sm font-medium">Bu yerda {currentStep.title} rasmi yoki vizuali bo'lishi kerak</span>
                       </div>
                    ) : (
                       <FlaskConical className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  
                  <button 
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/30 text-lg font-bold w-full max-w-xs justify-center hover:scale-105 active:scale-95"
                  >
                    {currentStepIndex < steps.length - 1 ? (
                      <>Keyingi qadam <Play className="w-5 h-5 fill-current" /></>
                    ) : (
                      <>Tajribani yakunlash <CheckCircle2 className="w-5 h-5" /></>
                    )}
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
