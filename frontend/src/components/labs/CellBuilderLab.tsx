"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function CellBuilderLab({ completeLab, isCompleted }: any) {
  const [placed, setPlaced] = useState<string[]>([]);
  const required = ["Yadro", "Mitoxondriya", "Xloroplast", "Vakuola"];

  const addOrganelle = (org: string) => {
    if (!placed.includes(org)) {
       const newPlaced = [...placed, org];
       setPlaced(newPlaced);
       if (newPlaced.length === 4) completeLab();
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
      <h2 className="text-2xl font-bold mb-2">O'simlik Hujayrasini Qurish</h2>
      <p className="text-gray-600 mb-8">Kerakli organoidlarni tanlab hujayra ichiga joylashtiring.</p>
      
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        <div className="w-64 h-64 bg-green-100 rounded-3xl border-8 border-green-500 relative shadow-inner">
           {placed.includes("Yadro") && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-purple-500 rounded-full shadow-lg"></div>}
           {placed.includes("Mitoxondriya") && <div className="absolute top-8 left-8 w-12 h-6 bg-orange-500 rounded-full shadow-lg rotate-45"></div>}
           {placed.includes("Xloroplast") && <div className="absolute bottom-8 right-8 w-14 h-8 bg-green-600 rounded-full shadow-lg -rotate-12 flex items-center justify-center"><div className="w-8 h-2 bg-green-800 rounded-full"></div></div>}
           {placed.includes("Vakuola") && <div className="absolute top-1/4 right-4 w-20 h-24 bg-blue-300 rounded-3xl opacity-80 shadow-lg"></div>}
        </div>
        
        <div className="flex flex-col gap-4">
           {required.map(org => (
             <button 
               key={org}
               onClick={() => addOrganelle(org)}
               disabled={placed.includes(org)}
               className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold border-2 border-gray-200 disabled:opacity-30 disabled:bg-green-100 disabled:text-green-800 disabled:border-green-300 transition-all text-left w-48 flex justify-between items-center"
             >
               {org} {placed.includes(org) && <CheckCircle2 className="w-5 h-5" />}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}