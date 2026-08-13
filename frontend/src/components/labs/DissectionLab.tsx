"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function DissectionLab({ completeLab, isCompleted }: any) {
  const [layers, setLayers] = useState([true, true, true]); // Skin, Muscle, Skeleton (hide to see organs)
  
  const removeLayer = (index: number) => {
    const newLayers = [...layers];
    newLayers[index] = false;
    setLayers(newLayers);
    if (!newLayers[0] && !newLayers[1]) {
       completeLab();
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
      <h2 className="text-2xl font-bold mb-2">Virtual Anatomiya</h2>
      <p className="text-gray-600 mb-8">Skalpel yordamida qatlamlarni olib, qurbaqaning ichki a'zolarini o'rganing.</p>
      
      <div className="relative w-64 h-80 mx-auto mb-8 bg-green-50 rounded-[40px] border-4 border-green-200 overflow-hidden shadow-inner">
        {/* Organs layer (bottom) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 gap-2">
           <div className="w-10 h-10 bg-red-600 rounded-full animate-pulse shadow-md"></div>
           <div className="flex gap-4">
             <div className="w-12 h-16 bg-pink-400 rounded-full opacity-80"></div>
             <div className="w-12 h-16 bg-pink-400 rounded-full opacity-80"></div>
           </div>
           <div className="w-16 h-12 bg-orange-700 rounded-full mt-2"></div>
        </div>

        {/* Muscle layer */}
        {layers[1] && (
           <div className="absolute inset-0 bg-red-800/90 p-4">
              <div className="w-full h-full border-[10px] border-red-900 rounded-3xl border-dashed"></div>
           </div>
        )}

        {/* Skin layer */}
        {layers[0] && (
           <div className="absolute inset-0 bg-green-500">
             <div className="absolute top-10 left-10 w-4 h-4 bg-green-700 rounded-full"></div>
             <div className="absolute top-10 right-10 w-4 h-4 bg-green-700 rounded-full"></div>
             <div className="absolute bottom-20 left-16 w-32 h-10 border-b-4 border-green-700 rounded-full"></div>
           </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
         {layers[0] && <button onClick={() => removeLayer(0)} className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold">Terini kesish (Skalpel)</button>}
         {!layers[0] && layers[1] && <button onClick={() => removeLayer(1)} className="bg-red-900 text-white px-6 py-2 rounded-lg font-bold">Muskulni ochish (Qisqich)</button>}
      </div>
      
      {isCompleted && (
        <div className="text-green-600 font-bold text-xl flex items-center justify-center gap-2 mt-8">
          <CheckCircle2 /> Ajoyib! Endi ichki a'zolarni (Yurak, o'pka, jigar) to'liq ko'rishingiz mumkin.
        </div>
      )}
    </div>
  );
}