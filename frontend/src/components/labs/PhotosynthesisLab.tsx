"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Droplets, CheckCircle2 } from "lucide-react";

export default function PhotosynthesisLab({ lab, steps, completeLab, isCompleted }: any) {
  const [lightDistance, setLightDistance] = useState(50);
  const [bubbles, setBubbles] = useState(0);
  
  useEffect(() => {
    // Closer light (lower distance) = more bubbles
    const bubbleRate = Math.max(1, (100 - lightDistance) / 10);
    const interval = setInterval(() => {
      if(!isCompleted) {
        setBubbles(b => b + Math.floor(bubbleRate));
      }
    }, 1000);
    
    if (bubbles > 100 && !isCompleted) {
       completeLab();
    }
    
    return () => clearInterval(interval);
  }, [lightDistance, bubbles, isCompleted, completeLab]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Sun className="text-yellow-500" /> Fotosintez Tajribasi</h2>
      <p className="text-gray-600 mb-6">Yorug'lik manbaini o'simlikka yaqinlashtirib fotosintez tezligini oshiring (kislorod pufakchalarini 100 taga yetkazing).</p>
      
      <div className="relative h-64 bg-blue-50 rounded-2xl border-4 border-blue-100 mb-6 overflow-hidden flex flex-col items-center justify-end p-4">
        {/* Plant */}
        <div className="w-24 h-32 bg-green-500 rounded-t-full shadow-inner relative z-10"></div>
        {/* Bubbles */}
        <div className="absolute inset-0 z-0">
          {Array.from({length: Math.min(bubbles, 50)}).map((_, i) => (
             <motion.div 
               key={i}
               initial={{y: 200, opacity: 1}}
               animate={{y: -10, opacity: 0}}
               transition={{duration: 2, repeat: Infinity, delay: Math.random() * 2}}
               className="absolute w-3 h-3 bg-white rounded-full opacity-50"
               style={{left: `${20 + Math.random() * 60}%`}}
             />
          ))}
        </div>
        {/* Light */}
        <div 
          className="absolute top-4 transition-all duration-300"
          style={{ right: `${lightDistance}%` }}
        >
          <div className="w-16 h-16 bg-yellow-300 rounded-full shadow-[0_0_50px_rgba(253,224,71,0.8)] flex items-center justify-center">
            <Sun className="text-yellow-600 w-8 h-8" />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">Chiroq masofasi: {lightDistance} sm</label>
        <input 
          type="range" 
          min="10" 
          max="90" 
          value={lightDistance} 
          onChange={(e) => setLightDistance(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
         <div className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Droplets /> Pufakchalar: {bubbles}/100
         </div>
         {isCompleted && (
           <div className="text-green-600 font-bold flex items-center gap-2">
             <CheckCircle2 /> Muvaffaqiyatli!
           </div>
         )}
      </div>
    </div>
  );
}