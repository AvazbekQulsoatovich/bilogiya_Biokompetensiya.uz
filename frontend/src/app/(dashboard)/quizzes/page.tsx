"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Play, Award, Plus, X } from "lucide-react";
import Link from "next/link";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("userRole"));
      setToken(localStorage.getItem("token"));
    }
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/quizzes");
      const data = await res.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Failed to fetch quizzes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/quizzes", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: newTitle,
          questions: [
            { type: 'MULTIPLE_CHOICE', content: 'Yangi savol?', options: JSON.stringify(['A', 'B']), correctAnswer: 'A' }
          ]
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewTitle("");
        fetchQuizzes();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-500/10 rounded-2xl">
            <ClipboardList className="w-8 h-8 text-primary-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Test Topshiriqlari</h1>
            <p className="text-foreground/60 mt-1">Bilimingizni sinab ko'ring va XP ishlang.</p>
          </div>
        </div>

        {userRole === "SUPER_ADMIN" && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary-500/20"
          >
            <Plus className="w-5 h-5" />
            Yangi Test
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border-dashed border-2 border-border/50">
          <ClipboardList className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Hali testlar yo'q</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, index) => (
            <motion.div 
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-3xl border border-border/50 relative overflow-hidden group flex flex-col h-full"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
              
              <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
              <p className="text-foreground/60 text-sm mb-6 flex-grow">
                {quiz._count?.questions || 0} ta savol
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full">
                  <Award className="w-4 h-4" />
                  XP beriladi
                </div>
                
                <Link 
                  href={`/quizzes/${quiz.id}`}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary-500/20 text-sm font-medium"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Boshlash
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-border/50 p-6 rounded-3xl shadow-2xl max-w-md w-full relative"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6">Yangi Test qo'shish</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Test sarlavhasi</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  placeholder="Masalan: Hujayra tuzilishi testi"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 rounded-xl shadow-lg"
              >
                Yaratish
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
