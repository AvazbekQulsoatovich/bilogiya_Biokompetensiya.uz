"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Award } from "lucide-react";
import confetti from "canvas-confetti";

export default function CrosswordSolverPage() {
  const params = useParams();
  const router = useRouter();
  
  const [crossword, setCrossword] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [grid, setGrid] = useState<any[][]>([]);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchCrossword();
  }, []);

  const fetchCrossword = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/crosswords/${params.id}`);
      const data = await res.json();
      setCrossword(data);
      initializeGrid(data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const initializeGrid = (items: any[]) => {
    let maxRow = 0;
    let maxCol = 0;
    
    items.forEach(item => {
      const len = item.word.length;
      if (item.direction === "HORIZONTAL") {
        if (item.col + len > maxCol) maxCol = item.col + len;
        if (item.row > maxRow) maxRow = item.row;
      } else {
        if (item.row + len > maxRow) maxRow = item.row + len;
        if (item.col > maxCol) maxCol = item.col;
      }
    });

    const newGrid = Array(maxRow + 1).fill(null).map(() => Array(maxCol + 1).fill(null));
    
    items.forEach((item, itemIdx) => {
      for (let i = 0; i < item.word.length; i++) {
        const r = item.direction === "HORIZONTAL" ? item.row : item.row + i;
        const c = item.direction === "HORIZONTAL" ? item.col + i : item.col;
        
        if (!newGrid[r][c]) {
          newGrid[r][c] = { letter: item.word[i], words: [], cellId: `${r}-${c}` };
        }
        newGrid[r][c].words.push({ itemIdx, indexInWord: i });
      }
    });

    setGrid(newGrid);
  };

  const handleInputChange = (r: number, c: number, val: string) => {
    const key = `${r}-${c}`;
    setUserInputs(prev => ({ ...prev, [key]: val.toUpperCase() }));
  };

  const checkCompletion = () => {
    let allCorrect = true;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const cell = grid[r][c];
        if (cell) {
          const val = userInputs[`${r}-${c}`];
          if (!val || val !== cell.letter.toUpperCase()) {
            allCorrect = false;
            break;
          }
        }
      }
    }
    
    if (allCorrect && !isCompleted && !isRevealed) {
      setErrorMsg("");
      submitCompletion();
    } else if (!allCorrect) {
      setErrorMsg("Ba'zi harflar noto'g'ri yoki to'ldirilmagan.");
    }
  };

  const revealAnswers = () => {
    const newInputs = { ...userInputs };
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const cell = grid[r][c];
        if (cell) {
          newInputs[`${r}-${c}`] = cell.letter.toUpperCase();
        }
      }
    }
    setUserInputs(newInputs);
    setIsRevealed(true);
    setErrorMsg("Javoblar ochildi. (XP berilmaydi)");
  };

  const submitCompletion = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/crosswords/${params.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        setIsCompleted(true);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!crossword) return <div className="p-8">Krossvord topilmadi.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <button 
        onClick={() => router.push('/crosswords')}
        className="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Ortga qaytish
      </button>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{crossword.title}</h1>
        <p className="text-foreground/60">{crossword.description}</p>
      </div>

      {!isCompleted ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass p-8 rounded-3xl border border-border/50 flex justify-center overflow-x-auto">
            <div className="flex flex-col gap-1">
              {grid.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-1">
                  {row.map((cell, cIdx) => (
                    <div key={`${rIdx}-${cIdx}`} className="w-12 h-12 flex-shrink-0">
                      {cell ? (
                        <div className="relative w-full h-full">
                          {/* Number clue hint */}
                          {(cell.words.some((w:any) => w.indexInWord === 0)) && (
                            <span className="absolute top-0.5 left-1 text-[10px] text-foreground/50 font-bold z-10">
                              {cell.words.find((w:any) => w.indexInWord === 0).itemIdx + 1}
                            </span>
                          )}
                          <input 
                            maxLength={1}
                            value={userInputs[`${rIdx}-${cIdx}`] || ""}
                            onChange={(e) => handleInputChange(rIdx, cIdx, e.target.value)}
                            disabled={isRevealed || isCompleted}
                            className={`w-full h-full text-center text-xl font-bold uppercase bg-background border-2 focus:outline-none rounded-lg transition-colors ${
                              isRevealed ? "text-red-500 border-red-200 bg-red-50" : "text-foreground border-border focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                            }`}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-transparent"></div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1 glass p-6 rounded-3xl border border-border/50 h-fit">
            <h3 className="text-xl font-bold mb-4">Savollar</h3>
            <div className="space-y-4">
              {crossword.items.map((item: any, idx: number) => (
                <div key={item.id} className="p-4 bg-background/50 rounded-xl border border-border/30">
                  <span className="font-bold text-primary-500 mr-2">{idx + 1}.</span>
                  <span className="text-sm font-medium">{item.direction === "HORIZONTAL" ? "(Yotiq)" : "(Tik)"}</span>
                  <p className="mt-2 text-foreground/80">{item.clue}</p>
                </div>
              ))}
            </div>
            
            {errorMsg && (
              <div className={`mt-4 p-3 rounded-xl text-sm font-bold ${isRevealed ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                {errorMsg}
              </div>
            )}
            
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={checkCompletion}
                disabled={isRevealed}
                className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-500/20 transition-all"
              >
                Tekshirish
              </button>
              
              <button
                onClick={revealAnswers}
                disabled={isRevealed}
                className="w-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-bold py-3 rounded-xl transition-all"
              >
                Taslim bo'lish
              </button>
            </div>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-12 rounded-3xl border border-border/50 text-center max-w-2xl mx-auto"
        >
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ajoyib natija!</h2>
          <p className="text-xl mb-8">
            Krossvordni muvaffaqiyatli yakunladingiz va <span className="font-bold text-primary-500">+50 XP</span> oldingiz.
          </p>
          <button
            onClick={() => router.push('/crosswords')}
            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-500/20"
          >
            Ro'yxatga qaytish
          </button>
        </motion.div>
      )}
    </div>
  );
}
