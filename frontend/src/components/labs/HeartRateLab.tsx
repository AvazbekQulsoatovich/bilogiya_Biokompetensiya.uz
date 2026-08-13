"use client";
import { useState, useEffect } from "react";
import { Activity, Play, Square, CheckCircle2 } from "lucide-react";

export default function HeartRateLab({ completeLab, isCompleted }: any) {
  const [state, setState] = useState("RESTING"); // RESTING, RUNNING, MEASURING
  const [bpm, setBpm] = useState(72);
  const [measuredRest, setMeasuredRest] = useState(0);
  const [measuredRun, setMeasuredRun] = useState(0);

  const startRunning = () => {
    setState("RUNNING");
    setBpm(135);
  };

  const measure = () => {
    if (state === "RESTING") {
      setMeasuredRest(72);
      if (measuredRun > 0) completeLab();
    } else if (state === "RUNNING") {
      setMeasuredRun(135);
      setState("RESTING");
      setBpm(72);
      if (measuredRest > 0) completeLab();
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
      <h2 className="text-2xl font-bold mb-2">Jismoniy Mashq va Yurak Urishi</h2>
      <p className="text-gray-600 mb-8">Tinch holatda va yugurgandan so'ng yurak urish tezligini (Pulsni) o'lchang.</p>
      
      <div className="flex justify-center mb-8 h-48 items-end pb-4 border-b-4 border-gray-200">
        <div className={`transition-all duration-300 ${state === 'RUNNING' ? 'animate-bounce' : ''}`}>
          <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-2 relative">
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-2 h-2 bg-black rounded-full -ml-4 mt-2"></div>
               <div className="w-2 h-2 bg-black rounded-full ml-4 mt-2"></div>
             </div>
          </div>
          <div className="w-24 h-32 bg-blue-500 rounded-t-full"></div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4 mb-8">
        <button onClick={startRunning} disabled={state === "RUNNING"} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50">
           <Play /> Yugurish (30s)
        </button>
        <button onClick={measure} className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
           <Activity /> Pulsni o'lchash
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-4">
         <div className="bg-gray-100 p-4 rounded-xl">
           <div className="text-sm text-gray-500 font-bold mb-1">Tinch holatda:</div>
           <div className="text-2xl font-black text-blue-600">{measuredRest || '--'} <span className="text-sm font-normal">BPM</span></div>
         </div>
         <div className="bg-gray-100 p-4 rounded-xl">
           <div className="text-sm text-gray-500 font-bold mb-1">Mashqdan so'ng:</div>
           <div className="text-2xl font-black text-red-600">{measuredRun || '--'} <span className="text-sm font-normal">BPM</span></div>
         </div>
      </div>
      {isCompleted && (
        <div className="text-green-600 font-bold text-xl flex items-center justify-center gap-2 mt-4">
          <CheckCircle2 /> Xulosa: Mashq qon aylanishini tezlashtiradi!
        </div>
      )}
    </div>
  );
}