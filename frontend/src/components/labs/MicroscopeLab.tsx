"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FlaskConical, Search, Lightbulb, Droplet, Pipette, Microscope } from "lucide-react";

export default function MicroscopeLab({ lab, steps, completeLab, isCompleted }: { lab: any, steps: any[], completeLab: () => void, isCompleted: boolean }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorItem, setErrorItem] = useState<string | null>(null);

  // Microscope States
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lightOn, setLightOn] = useState(true);
  const [stainAdded, setStainAdded] = useState(false);
  const [readyToView, setReadyToView] = useState(false);

  // Parse steps Json safely
  let requiredTools = ["piyoz", "oyna", "tomizgich", "qoplagich", "mikroskop"];
  try {
    const labConfig = JSON.parse(lab?.stepsJson || "{}");
    if (labConfig.tools) requiredTools = labConfig.tools;
  } catch(e) {}

  const handleItemClick = (itemName: string) => {
    if (readyToView) return;
    
    // Simplistic progression: any valid required tool can advance a step
    if (requiredTools.includes(itemName)) {
      setErrorItem(null);
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setReadyToView(true);
      }
    } else {
      setErrorItem(itemName);
      setTimeout(() => setErrorItem(null), 1000);
    }
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setZoomLevel(val);
    if (val >= 3 && lightOn && (stainAdded || !requiredTools.includes("tomizgich")) && readyToView) {
      completeLab();
    }
  };

  const itemIcons: any = {
    "piyoz": <div className="w-16 h-16 rounded-full bg-purple-100 border-2 border-purple-400 flex items-center justify-center text-3xl shadow-sm hover:scale-110 transition-transform" title="Piyoz">🧅</div>,
    "elodeya": <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center text-3xl shadow-sm hover:scale-110 transition-transform" title="Elodeya">🌿</div>,
    "ildiz": <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-600 flex items-center justify-center text-3xl shadow-sm hover:scale-110 transition-transform" title="Ildiz">🌱</div>,
    "lupa": <div className="w-16 h-16 rounded-full bg-gray-100 border-4 border-gray-400 flex items-center justify-center text-3xl shadow-sm hover:scale-110 transition-transform" title="Lupa">🔍</div>,
    "oyna": <div className="w-24 h-10 bg-blue-50/80 border border-blue-200 rounded-sm shadow-[inset_0_2px_10px_rgba(255,255,255,0.9)] flex items-center justify-center text-xs font-bold text-blue-700 hover:scale-105 transition-transform" title="Predmet oynasi">Oyna</div>,
    "tomizgich": <Pipette className="w-14 h-14 text-orange-500 drop-shadow-md hover:scale-110 transition-transform" title="Tomizgich" />,
    "qoplagich": <div className="w-10 h-10 bg-white/40 border border-gray-400 shadow-sm rotate-12 hover:scale-110 transition-transform" title="Qoplagich oyna" />,
    "mikroskop": <Microscope className="w-24 h-24 text-gray-800 drop-shadow-xl hover:scale-105 transition-transform" title="Mikroskop" />
  };

  const topTools = requiredTools.filter(t => ['oyna', 'mikroskop', 'lupa'].includes(t));
  const bottomTools = requiredTools.filter(t => !topTools.includes(t));

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
                  index === currentStepIndex && !readyToView
                    ? 'bg-blue-50 border-blue-400 shadow-md scale-[1.02]' 
                    : index < currentStepIndex || readyToView
                      ? 'bg-green-50 border-green-200 opacity-80'
                      : 'bg-gray-50 border-gray-100 opacity-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  index < currentStepIndex || readyToView ? 'bg-green-500 text-white shadow-md' : index === currentStepIndex ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStepIndex || readyToView ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <div>
                  <p className={`font-semibold text-sm leading-relaxed ${index === currentStepIndex && !readyToView ? 'text-blue-900' : 'text-gray-700'}`}>
                    {typeof step === 'string' ? step : (step.title || step.instruction)}
                  </p>
                </div>
              </div>
            ))}
            {readyToView && !isCompleted && (
              <div className="flex gap-4 p-5 rounded-2xl border-2 bg-blue-50 border-blue-400 shadow-md scale-[1.02]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 bg-blue-500 text-white shadow-md">
                  <Search className="w-4 h-4" />
                </div>
                <p className="font-semibold text-sm leading-relaxed text-blue-900">
                  Mikroskopdan ko'ring va 300x gacha kattalashtiring.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Lab Zone */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-xl min-h-[700px] relative overflow-hidden flex flex-col">
          {/* Ambient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-green-50/50 pointer-events-none" />
          
          <div className="relative z-10 flex justify-between items-center mb-10 border-b border-gray-100 pb-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
              Interaktiv Stoli
            </h3>
            {isCompleted && (
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">Tajriba Yakunlandi</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative z-10">
            {readyToView ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center w-full max-w-2xl gap-8"
              >
                <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full border-[12px] border-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden bg-black flex items-center justify-center group transition-all duration-300">
                  <motion.div 
                    className={`relative w-full h-full flex items-center justify-center transition-all duration-500 ease-out ${!lightOn ? 'opacity-10' : 'opacity-100'}`}
                    style={{ scale: zoomLevel }}
                  >
                    <div className={`absolute inset-0 transition-colors duration-1000 ${stainAdded ? 'bg-orange-200/40' : 'bg-transparent'}`}></div>
                    
                    {/* Changed SVG based on plant type */}
                    {requiredTools.includes("elodeya") ? (
                      <svg viewBox="0 0 100 100" className="w-[150%] h-[150%] opacity-80">
                         <rect x="20" y="20" width="60" height="40" fill="rgba(34, 197, 94, 0.4)" stroke="rgba(21, 128, 61, 0.8)" strokeWidth="2" />
                         <circle cx="30" cy="30" r="3" fill="#166534" />
                         <circle cx="50" cy="40" r="3" fill="#166534" />
                         <circle cx="70" cy="30" r="3" fill="#166534" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 100 100" className="w-[150%] h-[150%] opacity-80" style={{ filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))' }}>
                        <path d="M 20 20 Q 40 10 60 30 T 40 70 T 10 50 Z" fill={stainAdded ? "rgba(168, 85, 247, 0.4)" : "rgba(200, 200, 200, 0.2)"} stroke={stainAdded ? "rgba(126, 34, 206, 0.8)" : "rgba(150, 150, 150, 0.8)"} strokeWidth="1.5" />
                        <circle cx="35" cy="40" r={stainAdded ? "4" : "1"} fill={stainAdded ? "#581c87" : "transparent"} opacity={stainAdded ? "1" : "0"} className="transition-all duration-1000" />
                        
                        <path d="M 55 25 Q 75 15 90 40 T 70 80 T 45 60 Z" fill={stainAdded ? "rgba(168, 85, 247, 0.3)" : "rgba(200, 200, 200, 0.15)"} stroke={stainAdded ? "rgba(126, 34, 206, 0.7)" : "rgba(150, 150, 150, 0.7)"} strokeWidth="1.5" />
                        <circle cx="70" cy="50" r={stainAdded ? "5" : "1"} fill={stainAdded ? "#581c87" : "transparent"} opacity={stainAdded ? "1" : "0"} className="transition-all duration-1000" />
                        
                        <path d="M 15 60 Q 30 50 45 75 T 25 95 T 5 80 Z" fill={stainAdded ? "rgba(168, 85, 247, 0.35)" : "rgba(200, 200, 200, 0.25)"} stroke={stainAdded ? "rgba(126, 34, 206, 0.9)" : "rgba(150, 150, 150, 0.9)"} strokeWidth="1.5" />
                        <circle cx="25" cy="75" r={stainAdded ? "3.5" : "1"} fill={stainAdded ? "#581c87" : "transparent"} opacity={stainAdded ? "1" : "0"} className="transition-all duration-1000" />
                      </svg>
                    )}
                  </motion.div>
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] pointer-events-none"></div>
                  <div className="absolute w-full h-[1px] bg-black/40 pointer-events-none"></div>
                  <div className="absolute h-full w-[1px] bg-black/40 pointer-events-none"></div>
                </div>

                <div className="w-full bg-gray-50 border border-gray-200 p-6 rounded-3xl shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-6 text-center text-lg">Asbob Boshqaruvi</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center justify-between text-sm font-bold text-gray-600">
                        <span className="flex items-center gap-2"><Search className="w-4 h-4 text-blue-500" /> Kattalashtirish</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{(zoomLevel * 100).toFixed(0)}x</span>
                      </label>
                      <input 
                        type="range" 
                        min="1" 
                        max="4" 
                        step="0.1" 
                        value={zoomLevel} 
                        onChange={handleZoomChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="flex justify-between md:justify-end gap-4">
                      <button 
                        onClick={() => {
                          setLightOn(!lightOn);
                          if (!lightOn && zoomLevel >= 3 && (stainAdded || !requiredTools.includes("tomizgich"))) completeLab();
                        }}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${lightOn ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 'bg-gray-200 text-gray-600'}`}
                      >
                        <Lightbulb className={`w-5 h-5 ${lightOn ? 'text-yellow-500 fill-yellow-200' : ''}`} />
                        Chiroq
                      </button>
                      
                      {requiredTools.includes("tomizgich") && (
                        <button 
                          onClick={() => {
                            setStainAdded(true);
                            if (zoomLevel >= 3 && lightOn) completeLab();
                          }}
                          className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${stainAdded ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                          <Droplet className={`w-5 h-5 ${stainAdded ? 'text-purple-500 fill-purple-200' : 'text-gray-400'}`} />
                          Yod
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="flex-1 w-full flex flex-col items-center justify-center mt-10">
                  <div className="flex flex-wrap justify-center gap-10 mb-24 w-full">
                    {topTools.map(item => (
                      <motion.div 
                        key={item}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleItemClick(item)}
                        className={`cursor-pointer flex flex-col items-center gap-4 ${errorItem === item ? 'animate-shake' : ''}`}
                      >
                        <div className={`p-8 rounded-3xl transition-all duration-300 shadow-md ${
                          errorItem === item 
                            ? 'bg-red-50 border-2 border-red-400 shadow-red-200' 
                            : 'bg-white border border-gray-200 hover:border-blue-400 hover:shadow-blue-100'
                        }`}>
                          {itemIcons[item]}
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wide text-gray-600 bg-gray-100 px-4 py-1.5 rounded-full">{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  {bottomTools.length > 0 && (
                    <div className="w-full max-w-xl mx-auto bg-gray-100 p-8 rounded-[2.5rem] border border-gray-200 flex justify-around items-end shadow-inner relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-500 text-xs font-bold uppercase px-4 py-1 rounded-full tracking-widest">
                        Materiallar
                      </div>
                      
                      {bottomTools.map(item => (
                        <motion.div 
                          key={item}
                          whileHover={{ y: -15, scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleItemClick(item)}
                          className={`cursor-pointer flex flex-col items-center gap-3 relative z-10 ${errorItem === item ? 'animate-shake' : ''}`}
                        >
                          <div className={`relative p-1 ${errorItem === item ? 'after:absolute after:inset-0 after:rounded-full after:border-4 after:border-red-500 after:animate-ping' : ''}`}>
                            {itemIcons[item] || <div className="w-10 h-10 bg-gray-300 rounded-full"/>}
                          </div>
                          <span className="text-xs font-bold uppercase text-gray-500">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
