"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, CheckCircle2, Clock } from "lucide-react";

export default function OsmosisLab({ lab, steps, completeLab, isCompleted }: any) {
  const [potato1Weight, setPotato1Weight] = useState(50);
  const [potato2Weight, setPotato2Weight] = useState(50);
  const [timePassed, setTimePassed] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateTime = () => {
    setIsSimulating(true);
    let t = 0;
    const interval = setInterval(() => {
      t += 10;
      setTimePassed(t);
      // Potato 1 in fresh water (gains weight)
      setPotato1Weight(50 + (t / 60) * 5); 
      // Potato 2 in salt water (loses weight)
      setPotato2Weight(50 - (t / 60) * 10);
      
      if (t >= 60) {
        clearInterval(interval);
        setIsSimulating(false);
        completeLab();
      }
    }, 200);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-4">Osmos va Plazmoliz</h2>
      <p className="text-gray-600 mb-6">Kartoshka bo'laklarini chuchuk suvga va sho'r suvga solib, osmos hodisasini (suvning konsentratsiyasi yuqori tomonga o'tishini) kuzatamiz.</p>
      
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Beaker 1 */}
        <div className="flex flex-col items-center">
          <h3 className="font-bold mb-2">Chuchuk Suv (Toza suv)</h3>
          <div className="w-32 h-40 border-4 border-b-[8px] border-gray-300 rounded-b-3xl relative overflow-hidden bg-blue-50/50">
            <div className="absolute bottom-0 w-full h-2/3 bg-blue-300/40"></div>
            <motion.div 
              className="absolute bg-orange-200 rounded-lg border-2 border-orange-400 bottom-4 left-1/2 -translate-x-1/2"
              animate={{ width: 40 + (potato1Weight - 50), height: 30 + (potato1Weight - 50) }}
            />
          </div>
          <div className="mt-4 bg-gray-800 text-green-400 font-mono px-4 py-2 rounded-lg text-2xl font-bold">
            {potato1Weight.toFixed(1)} g
          </div>
        </div>
        
        {/* Beaker 2 */}
        <div className="flex flex-col items-center">
          <h3 className="font-bold mb-2">Sho'r Suv (10% NaCl)</h3>
          <div className="w-32 h-40 border-4 border-b-[8px] border-gray-300 rounded-b-3xl relative overflow-hidden bg-blue-50/50">
            <div className="absolute bottom-0 w-full h-2/3 bg-blue-400/60"></div>
            {/* Salt particles */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]"></div>
            <motion.div 
              className="absolute bg-orange-200 rounded-lg border-2 border-orange-400 bottom-4 left-1/2 -translate-x-1/2"
              animate={{ width: 40 + (potato2Weight - 50), height: 30 + (potato2Weight - 50) }}
            />
          </div>
          <div className="mt-4 bg-gray-800 text-red-400 font-mono px-4 py-2 rounded-lg text-2xl font-bold">
            {potato2Weight.toFixed(1)} g
          </div>
        </div>
      </div>
      
      <div className="flex justify-center items-center gap-6">
        <button 
          onClick={simulateTime}
          disabled={isSimulating || isCompleted}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
        >
          <Clock /> 60 daqiqa vaqtni tezlatish
        </button>
        <div className="text-lg font-bold">
          O'tgan vaqt: {timePassed} daqiqa
        </div>
      </div>
    </div>
  );
}