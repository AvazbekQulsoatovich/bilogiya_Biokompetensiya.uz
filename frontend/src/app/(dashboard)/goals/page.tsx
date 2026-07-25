"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, Circle } from "lucide-react";

export default function GoalsPage() {
  const [goals, setGoals] = useState<{id: number, text: string, completed: boolean}[]>([]);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("userGoals");
    if (saved) {
      setGoals(JSON.parse(saved));
    } else {
      const initial = [
        { id: 1, text: "Bitta krossvord yechish", completed: false },
        { id: 2, text: "Test topshiriqlarida 100 XP yig'ish", completed: false },
        { id: 3, text: "Odam anatomiyasi modelini ko'rish", completed: false }
      ];
      setGoals(initial);
      localStorage.setItem("userGoals", JSON.stringify(initial));
    }
  }, []);

  const saveGoals = (newGoals: any[]) => {
    setGoals(newGoals);
    localStorage.setItem("userGoals", JSON.stringify(newGoals));
  };

  const toggleGoal = (id: number) => {
    const updated = goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
    saveGoals(updated);
  };

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    const updated = [...goals, { id: Date.now(), text: newGoal.trim(), completed: false }];
    saveGoals(updated);
    setNewGoal("");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-red-500/10 rounded-2xl">
          <Target className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Mening Maqsadlarim</h1>
          <p className="text-foreground/60 mt-1">O'quv jarayonini rejalashtiring va unga erishing</p>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl border border-border/50 shadow-lg">
        <form onSubmit={addGoal} className="mb-8 flex gap-4">
          <input 
            type="text" 
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Yangi maqsad qo'shish..."
            className="flex-grow bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
          />
          <button type="submit" className="bg-red-500 hover:bg-red-600 text-white px-6 font-bold rounded-xl transition-colors">
            Qo'shish
          </button>
        </form>

        <div className="space-y-4">
          {goals.map((goal, idx) => (
            <motion.div 
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => toggleGoal(goal.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${goal.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-background/50 border-border hover:border-red-500/50'}`}
            >
              {goal.completed ? (
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
              ) : (
                <Circle className="w-6 h-6 text-foreground/30 shrink-0" />
              )}
              <span className={`text-lg font-medium transition-all ${goal.completed ? 'line-through text-foreground/40' : 'text-foreground/90'}`}>
                {goal.text}
              </span>
            </motion.div>
          ))}
          {goals.length === 0 && (
            <div className="text-center text-foreground/50 py-8">
              Sizda hozircha maqsadlar yo'q
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
