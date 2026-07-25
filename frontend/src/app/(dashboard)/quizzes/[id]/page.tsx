"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Award } from "lucide-react";
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

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`https://biology-backend-vw8k.onrender.com/api/quizzes/${params.id}`);
      const data = await res.json();
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
    
    // Calculate score locally (in a real app, backend calculates this to avoid cheating)
    let score = 0;
    quiz.questions.forEach((q: any) => {
      if (answers[q.id] === q.correctAnswer) score += 10; // 10 XP per correct answer
    });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://biology-backend-vw8k.onrender.com/api/quizzes/${params.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          score,
          timeSpentSeconds: 120,
          answers
        })
      });
      const data = await res.json();
      if (res.ok) {
        setIsSubmitted(true);
        setResult(data);
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

  if (!quiz) return <div className="p-8">Test topilmadi.</div>;

  const q = quiz.questions[currentQuestion];
  const options = q?.options ? JSON.parse(q.options) : [];

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <button 
        onClick={() => router.push('/quizzes')}
        className="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Ortga qaytish
      </button>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-foreground/60">{quiz.questions.length} ta savol</p>
      </div>

      {!isSubmitted ? (
        <div className="glass p-8 rounded-3xl border border-border/50">
          <div className="mb-6 flex justify-between items-center text-sm font-medium text-foreground/60">
            <span>Savol {currentQuestion + 1} / {quiz.questions.length}</span>
            <div className="flex gap-1">
              {quiz.questions.map((_: any, idx: number) => (
                <div key={idx} className={`h-2 w-8 rounded-full ${idx === currentQuestion ? 'bg-primary-500' : idx < currentQuestion ? 'bg-primary-500/30' : 'bg-border'}`} />
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-8">{q?.content}</h2>

          <div className="space-y-4 mb-8">
            {options.map((opt: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(q.id, opt)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                  answers[q.id] === opt 
                    ? 'border-primary-500 bg-primary-500/10 text-primary-700 font-medium' 
                    : 'border-border/50 hover:border-primary-500/50 bg-background/50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 rounded-xl text-foreground/60 hover:text-foreground hover:bg-background/50 disabled:opacity-30 transition-all"
            >
              Oldingi
            </button>
            
            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < quiz.questions.length}
                className="bg-green-600 hover:bg-green-500 text-white px-8 py-2 rounded-xl shadow-lg shadow-green-500/20 font-bold transition-all disabled:opacity-50"
              >
                Yakunlash
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-2 rounded-xl shadow-lg shadow-primary-500/20 font-bold transition-all"
              >
                Keyingi
              </button>
            )}
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-12 rounded-3xl border border-border/50 text-center"
        >
          <Award className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Test Yakunlandi!</h2>
          <p className="text-xl mb-8">
            Siz <span className="font-bold text-primary-500">+{result?.rewardXp} XP</span> ishlab topdingiz!
          </p>
          <button
            onClick={() => router.push('/quizzes')}
            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-500/20"
          >
            Ro'yxatga qaytish
          </button>
        </motion.div>
      )}
    </div>
  );
}
