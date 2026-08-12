"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Award, XCircle, Trophy, Home } from "lucide-react";
import confetti from "canvas-confetti";

export default function QuizSolverPage() {
  const params = useParams();
  const router = useRouter();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/quizzes/${params.id}`);
      const data = await res.json();
      
      // Shuffle questions and their options
      if (data && data.questions && Array.isArray(data.questions)) {
        data.questions = data.questions
          .sort(() => Math.random() - 0.5)
          .map((q: any) => {
            const opts = q.options ? JSON.parse(q.options) : [];
            q.parsedOptions = opts.sort(() => Math.random() - 0.5);
            return q;
          });
      }
      
      setQuiz(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    
    // Calculate score locally
    let score = 0;
    let corrects = 0;
    quiz.questions.forEach((q: any) => {
      if (answers[q.id] === q.correctAnswer) {
        score += 10; // 10 XP per correct answer
        corrects++;
      }
    });
    setCorrectCount(corrects);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/quizzes/${params.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          score,
          timeSpentSeconds: 120, // dummy time
          answers
        })
      });
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        console.log("Backend sync skipped:", data);
      }
      
      // Always show results to the user, even if saving progress to backend fails
      setIsSubmitted(true);
      setResult({ ...data, rewardXp: score });
      
      // Fire confetti based on success rate
      const rate = corrects / quiz.questions.length;
      if (rate >= 0.5) {
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 } });
      }
    } catch (error) {
      console.error("Submit error:", error);
      // Fallback: still show results
      setIsSubmitted(true);
      setResult({ rewardXp: score });
      const rate = corrects / quiz.questions.length;
      if (rate >= 0.5) confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 } });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quiz) return <div className="p-8 text-center text-gray-500 font-bold">Test topilmadi.</div>;

  const q = quiz.questions[currentQuestion];
  const options = q?.parsedOptions || [];
  const totalQuestions = quiz.questions.length;
  const progressPercent = ((currentQuestion) / totalQuestions) * 100;
  const resultPercent = isSubmitted ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full min-h-screen">
      <button 
        onClick={() => router.push('/quizzes')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors font-bold bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm"
      >
        <ArrowLeft className="w-5 h-5" /> Testlar ro'yxatiga qaytish
      </button>

      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black mb-3 text-gray-900 tracking-tight">{quiz.title}</h1>
        <p className="text-gray-500 font-medium text-lg">{totalQuestions} ta savol</p>
      </div>

      {!isSubmitted ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-orange-500/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mb-8 flex justify-between items-center text-sm font-bold text-gray-400 mt-2">
            <span className="bg-gray-100 px-3 py-1 rounded-lg">Savol {currentQuestion + 1} / {totalQuestions}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-black mb-10 text-gray-800 leading-tight">
                {q?.content}
              </h2>

              <div className="space-y-4 mb-10">
                {options.map((opt: string, idx: number) => {
                  const isSelected = answers[q.id] === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(q.id, opt)}
                      className={`w-full text-left p-5 md:p-6 rounded-2xl border-2 transition-all font-semibold text-lg flex items-center justify-between ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md shadow-orange-500/10 scale-[1.02]' 
                          : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {opt}
                      {isSelected && <CheckCircle2 className="w-6 h-6 text-orange-500" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-8 border-t border-gray-100">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-2xl text-gray-500 font-bold hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 transition-all"
            >
              Oldingi
            </button>
            
            {currentQuestion === totalQuestions - 1 ? (
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-10 py-3 rounded-2xl shadow-xl shadow-green-500/20 font-black text-lg transition-all hover:scale-105"
              >
                Yakunlash
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(totalQuestions - 1, prev + 1))}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-3 rounded-2xl shadow-xl shadow-orange-500/20 font-black text-lg transition-all hover:scale-105"
              >
                Keyingi
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-gray-100 text-center shadow-2xl shadow-orange-500/10 max-w-2xl mx-auto"
        >
          <div className="relative w-40 h-40 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="10" />
              <circle 
                cx="50" cy="50" r="45" fill="none" 
                stroke={resultPercent >= 70 ? "#10b981" : resultPercent >= 40 ? "#f59e0b" : "#ef4444"} 
                strokeWidth="10" 
                strokeDasharray={`${resultPercent * 2.827} 282.7`} 
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-gray-800">{resultPercent}%</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-black mb-4 text-gray-900">
            {resultPercent >= 80 ? 'Ajoyib Natija!' : resultPercent >= 50 ? 'Yaxshi Natija!' : 'Yana Harakat Qiling!'}
          </h2>
          
          <div className="flex items-center justify-center gap-6 mb-10 text-lg">
            <div className="flex items-center gap-2 font-bold text-green-600 bg-green-50 px-4 py-2 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
              {correctCount} to'g'ri
            </div>
            <div className="flex items-center gap-2 font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl">
              <XCircle className="w-5 h-5" />
              {totalQuestions - correctCount} xato
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-3xl mb-10 border border-yellow-200 shadow-inner">
            <p className="text-yellow-800 font-bold mb-2 uppercase text-sm tracking-widest">Sizning Yutug'ingiz</p>
            <p className="text-3xl font-black text-yellow-600 flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8" />
              +{result?.rewardXp} XP
            </p>
          </div>

          <button
            onClick={() => router.push('/quizzes')}
            className="flex items-center justify-center gap-3 w-full bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-xl shadow-gray-900/20"
          >
            <Home className="w-5 h-5" />
            Bosh Sahifaga Qaytish
          </button>
        </motion.div>
      )}
    </div>
  );
}
