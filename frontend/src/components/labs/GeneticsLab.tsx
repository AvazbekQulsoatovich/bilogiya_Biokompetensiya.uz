"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function GeneticsLab({ completeLab, isCompleted }: any) {
  const [parent1, setParent1] = useState("Aa");
  const [parent2, setParent2] = useState("Aa");
  const [calculated, setCalculated] = useState(false);
  
  const getOffspring = (p1: string, p2: string) => {
    return [
      p1[0] + p2[0], p1[0] + p2[1],
      p1[1] + p2[0], p1[1] + p2[1]
    ].map(g => g.split('').sort().join('').replace(/aA/g, 'Aa'));
  };

  const handleCalculate = () => {
    setCalculated(true);
    completeLab();
  };

  const offspring = getOffspring(parent1, parent2);
  const dominantCount = offspring.filter(g => g.includes('A')).length;
  
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-2">Pennet Panjarasi (Mendel Qonuni)</h2>
      <p className="text-gray-600 mb-8">No'xat urug'larining rangi: A - Sariq (dominant), a - Yashil (retsessiv).</p>
      
      <div className="flex gap-8 justify-center mb-8">
        <div>
          <label className="block font-bold mb-2">Ota genotipi:</label>
          <select value={parent1} onChange={e => {setParent1(e.target.value); setCalculated(false);}} className="p-2 border rounded-lg text-lg w-24">
            <option>AA</option><option>Aa</option><option>aa</option>
          </select>
        </div>
        <div>
          <label className="block font-bold mb-2">Ona genotipi:</label>
          <select value={parent2} onChange={e => {setParent2(e.target.value); setCalculated(false);}} className="p-2 border rounded-lg text-lg w-24">
            <option>AA</option><option>Aa</option><option>aa</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-center mb-8">
        <button onClick={handleCalculate} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">Chatishtirish</button>
      </div>

      {calculated && (
        <div className="flex flex-col items-center animate-fade-in">
          <table className="border-collapse border-2 border-gray-800 text-2xl text-center">
            <tbody>
              <tr>
                <td className="p-4 border-2 border-gray-800 bg-gray-100"></td>
                <td className="p-4 border-2 border-gray-800 bg-blue-50 font-bold">{parent2[0]}</td>
                <td className="p-4 border-2 border-gray-800 bg-blue-50 font-bold">{parent2[1]}</td>
              </tr>
              <tr>
                <td className="p-4 border-2 border-gray-800 bg-blue-50 font-bold">{parent1[0]}</td>
                <td className={`p-4 border-2 border-gray-800 font-bold ${offspring[0].includes('A') ? 'bg-yellow-200' : 'bg-green-300'}`}>{offspring[0]}</td>
                <td className={`p-4 border-2 border-gray-800 font-bold ${offspring[1].includes('A') ? 'bg-yellow-200' : 'bg-green-300'}`}>{offspring[1]}</td>
              </tr>
              <tr>
                <td className="p-4 border-2 border-gray-800 bg-blue-50 font-bold">{parent1[1]}</td>
                <td className={`p-4 border-2 border-gray-800 font-bold ${offspring[2].includes('A') ? 'bg-yellow-200' : 'bg-green-300'}`}>{offspring[2]}</td>
                <td className={`p-4 border-2 border-gray-800 font-bold ${offspring[3].includes('A') ? 'bg-yellow-200' : 'bg-green-300'}`}>{offspring[3]}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-6 text-xl">
             Sariq urug'lar: <span className="font-bold text-yellow-600">{dominantCount / 4 * 100}%</span> | 
             Yashil urug'lar: <span className="font-bold text-green-600">{(4 - dominantCount) / 4 * 100}%</span>
          </div>
        </div>
      )}
    </div>
  );
}