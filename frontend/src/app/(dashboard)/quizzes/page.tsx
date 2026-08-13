"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Play, Award, Plus, X, BookOpen, Layers } from "lucide-react";
import Link from "next/link";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  
  // New state for grade tabs
  const [activeGrade, setActiveGrade] = useState<number>(5);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("userRole"));
      setToken(localStorage.getItem("token"));
      const savedGrade = sessionStorage.getItem("quizzesActiveGrade");
      if (savedGrade) setActiveGrade(Number(savedGrade));
    }
    fetchQuizzes();
  }, []);

  const handleGradeChange = (grade: number) => {
    setActiveGrade(grade);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("quizzesActiveGrade", String(grade));
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`/api/quizzes`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setQuizzes(data);
      } else {
        setQuizzes(data?.quizzes || []);
      }
    } catch (error) {
      console.error("Failed to fetch quizzes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/quizzes`, {
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

  const filteredQuizzes = quizzes.filter(q => {
    const grade = q.lesson?.course?.gradeLevel || 5; // Default to 5 if somehow missing
    return grade === activeGrade;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-[2.5rem] p-8 md:p-10 mb-8 text-white shadow-2xl shadow-orange-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-inner">
            <ClipboardList className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">Test Topshiriqlari</h1>
            <p className="text-white/90 text-lg md:text-xl font-medium max-w-xl">
              Bilimingizni sinab ko'ring va ko'proq ball (XP) yig'ing!
            </p>
          </div>
        </div>

        {userRole === "SUPER_ADMIN" && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="relative z-10 flex items-center justify-center gap-2 bg-white text-orange-600 hover:scale-105 hover:bg-gray-50 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Yangi Test
          </button>
        )}
      </div>

      {/* Grade Tabs */}
      <div className="flex justify-center mb-10">
        <div className="bg-white/50 backdrop-blur-lg p-1.5 rounded-full border border-gray-200/50 shadow-sm inline-flex">
          <button
            onClick={() => handleGradeChange(5)}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm md:text-base transition-all ${
              activeGrade === 5 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25 scale-100' 
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 scale-95'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            5-SINF TESTLARI
          </button>
          <button
            onClick={() => handleGradeChange(6)}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm md:text-base transition-all ${
              activeGrade === 6 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25 scale-100' 
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 scale-95'
            }`}
          >
            <Layers className="w-4 h-4" />
            6-SINF TESTLARI
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="bg-white/50 backdrop-blur-md p-16 text-center rounded-[3rem] border border-gray-200/50 shadow-sm max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-black text-gray-800 mb-3">Hali testlar qo'shilmagan</h3>
          <p className="text-gray-500 text-lg">Tez orada {activeGrade}-sinf uchun testlar yuklanadi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredQuizzes.map((quiz, index) => (
              <motion.div 
                key={quiz.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
                className="group relative bg-white/80 backdrop-blur-xl p-7 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all flex flex-col h-full overflow-hidden"
              >
                {/* Decorative Top Accent */}
                <div className={`absolute top-0 left-0 w-full h-1.5 transition-all group-hover:h-2 bg-orange-400`} />
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-orange-50 text-orange-600`}>
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div className="bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-1.5">
                    <Layers className="w-3 h-3" />
                    {quiz._count?.questions || 0} savol
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] leading-tight">
                  {quiz.title}
                </h3>
                
                <p className="text-gray-500 text-sm mb-6 flex-grow">
                  O'tilgan mavzu bo'yicha test ishlang va bilimingizni tekshiring.
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-yellow-500 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                    <Award className="w-4 h-4 fill-yellow-500" />
                    +200 XP
                  </div>
                  
                  <Link 
                    href={`/quizzes/${quiz.id}`}
                    className={`flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all bg-orange-600 hover:bg-orange-500 shadow-orange-500/30 hover:shadow-orange-500/50`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Boshlash
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full relative"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
              <Plus className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-2">Yangi Test</h2>
            <p className="text-gray-500 mb-6">Tizimga yangi test to'plamini qo'shish.</p>

            <form onSubmit={handleCreate}>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Test sarlavhasi</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
                  placeholder="Masalan: Hujayra tuzilishi testi"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-500/20 transition-all"
              >
                Yaratish va Saqlash
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
