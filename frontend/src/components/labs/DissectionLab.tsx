"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function DissectionLab({ completeLab, isCompleted }: any) {
  const [layers, setLayers] = useState([true, true, true]); // Gulkosabarg, Gultojbarg
  
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
      <h2 className="text-2xl font-bold mb-2">Gulning Tuzilishini O'rganish</h2>
      <p className="text-gray-600 mb-8">Skalpel (pichoq) va pinset yordamida gulning qatlamlarini olib tashlab, uning ichki qismlarini (urug'chi va changchi) o'rganing.</p>
      
      <div className="relative w-64 h-80 mx-auto mb-8 bg-blue-50 rounded-[40px] border-4 border-blue-200 overflow-hidden shadow-inner flex flex-col justify-end items-center">
        {/* Organs layer (bottom) - Changchi & Urug'chi */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 gap-0">
           {/* Urug'chi */}
           <div className="w-8 h-24 bg-green-400 rounded-full relative z-10">
              <div className="absolute -top-4 left-0 w-8 h-8 bg-green-500 rounded-full"></div>
           </div>
           {/* Tuguncha */}
           <div className="w-16 h-16 bg-green-600 rounded-full -mt-4 z-10 shadow-md"></div>
           
           {/* Changchilar */}
           <div className="absolute top-1/2 left-12 w-2 h-20 bg-yellow-400 -rotate-45 transform origin-bottom">
             <div className="w-6 h-6 bg-yellow-600 rounded-full absolute -top-4 -left-2"></div>
           </div>
           <div className="absolute top-1/2 right-12 w-2 h-20 bg-yellow-400 rotate-45 transform origin-bottom">
             <div className="w-6 h-6 bg-yellow-600 rounded-full absolute -top-4 -left-2"></div>
           </div>
        </div>

        {/* Petals layer (Gultojbarg) */}
        {layers[1] && (
           <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-48 h-48 bg-red-400/90 rounded-t-full shadow-lg -mt-10"></div>
              <div className="absolute w-32 h-32 bg-pink-500 rounded-full left-4 shadow-lg"></div>
              <div className="absolute w-32 h-32 bg-pink-500 rounded-full right-4 shadow-lg"></div>
           </div>
        )}

        {/* Sepals layer (Gulkosabarg) */}
        {layers[0] && (
           <div className="absolute inset-0 flex justify-center items-end pb-12">
             <div className="w-40 h-24 bg-green-700 rounded-t-full relative z-20 flex justify-center">
                <div className="absolute w-6 h-20 bg-green-800 -bottom-20"></div>
             </div>
           </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
         {layers[0] && <button onClick={() => removeLayer(0)} className="bg-green-800 text-white px-6 py-2 rounded-lg font-bold">Gulkosabargni qirqish (Skalpel)</button>}
         {!layers[0] && layers[1] && <button onClick={() => removeLayer(1)} className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold">Gultojbarglarni olish (Pinset)</button>}
      </div>
      
      {isCompleted && (
        <div className="text-green-600 font-bold text-xl flex items-center justify-center gap-2 mt-8">
          <CheckCircle2 /> Ajoyib! Endi gulning changchisi va urug'chisini to'liq ko'rishingiz mumkin.
        </div>
      )}
    </div>
  );
}