"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function FoodWebLab({ completeLab, isCompleted }: any) {
  const [chain, setChain] = useState<string[]>([]);
  const organisms = ["O'simlik", "Hasharot", "Qurbaqa", "Ilon", "Burgut"];

  const addOrganism = (org: string) => {
    if (chain.length < 5 && org === organisms[chain.length]) {
       const newChain = [...chain, org];
       setChain(newChain);
       if (newChain.length === 5) completeLab();
    } else {
       alert("Xato! Oziq zanjiri to'g'ri ketma-ketlikda bo'lishi kerak.");
       setChain([]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
      <h2 className="text-2xl font-bold mb-2">Oziq Zanjiri</h2>
      <p className="text-gray-600 mb-8">Quyidagi organizmlarni bosish orqali to'g'ri oziq zanjirini yarating (Kim kimni yeydi?).</p>
      
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
         {["Ilon", "O'simlik", "Burgut", "Hasharot", "Qurbaqa"].map(org => (
           <button 
             key={org}
             onClick={() => addOrganism(org)}
             disabled={chain.includes(org)}
             className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-6 py-3 rounded-xl font-bold border-2 border-blue-200 disabled:opacity-30"
           >
             {org}
           </button>
         ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl min-h-[120px] flex items-center justify-center gap-2 flex-wrap">
         {chain.length === 0 && <span className="text-gray-400">Zanjir bu yerda shakllanadi...</span>}
         {chain.map((org, index) => (
           <div key={org} className="flex items-center gap-2">
             <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">{org}</div>
             {index < chain.length - 1 && <div className="text-green-500 font-bold">➔</div>}
           </div>
         ))}
      </div>
      
      {isCompleted && (
        <div className="text-green-600 font-bold text-xl flex items-center justify-center gap-2 mt-8">
          <CheckCircle2 /> Tabiatda oziq zanjiri muvaffaqiyatli tuzildi!
        </div>
      )}
    </div>
  );
}